import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HSAImportData } from "@/types/hsaImport";

interface ValidatedHSARow {
  data: string; // yyyy-MM-dd
  mes: number;
  ano: number;
  cca_id: number;
  responsavel_inspecao: string;
  funcao?: string;
  inspecao_programada?: string;
  status: string;
  desvios_identificados: number;
  observacao?: string;
  relatorio_url?: string;
}

export const useHSAImport = () => {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    valid: ValidatedHSARow[];
    invalid: { data: HSAImportData; errors: string[] }[];
  }>({ valid: [], invalid: [] });

  const normalizeDate = (value?: string | null) => {
    if (!value) return null;
    
    try {
      // Tentar diferentes formatos de data
      const dateStr = String(value).trim();
      let date: Date;
      
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else if (dateStr.includes('-')) {
        date = new Date(dateStr);
      } else {
        return null;
      }
      
      if (isNaN(date.getTime())) return null;
      
      return date.toISOString().split('T')[0]; // yyyy-MM-dd
    } catch {
      return null;
    }
  };

  const validateImport = async (rows: HSAImportData[]) => {
    setIsValidating(true);
    try {
      const invalid: { data: HSAImportData; errors: string[] }[] = [];
      const valid: ValidatedHSARow[] = [];

      // Fetch CCAs by codigo (unique set)
      const codes = Array.from(new Set(rows.map(r => (r.cca_codigo || '').trim()).filter(Boolean)));
      const { data: ccas, error: ccasError } = await supabase
        .from('ccas')
        .select('id, codigo')
        .in('codigo', codes);

      if (ccasError) throw ccasError;

      const ccaMap = new Map(ccas?.map(c => [c.codigo, c.id]) || []);

      for (const row of rows) {
        const errors: string[] = [];
        
        // Validar data
        const normalizedDate = normalizeDate(row.data);
        if (!normalizedDate) {
          errors.push('Data é obrigatória e deve estar no formato válido');
        }

        // Validar CCA
        const ccaCode = (row.cca_codigo || '').trim();
        if (!ccaCode) {
          errors.push('Código CCA é obrigatório');
        } else if (!ccaMap.has(ccaCode)) {
          errors.push(`CCA com código '${ccaCode}' não encontrada`);
        }

        // Validar responsável
        if (!row.responsavel_inspecao?.trim()) {
          errors.push('Responsável pela inspeção é obrigatório');
        }

        // Validar status
        const validStatuses = ['Realizada', 'Não Realizada', 'Não Programada'];
        if (!row.status?.trim()) {
          errors.push('Status é obrigatório');
        } else if (!validStatuses.includes(row.status.trim())) {
          errors.push(`Status deve ser: ${validStatuses.join(', ')}`);
        }

        if (errors.length > 0) {
          invalid.push({ data: row, errors });
        } else {
          const date = new Date(normalizedDate!);
          valid.push({
            data: normalizedDate!,
            mes: date.getMonth() + 1,
            ano: date.getFullYear(),
            cca_id: ccaMap.get(ccaCode)!,
            responsavel_inspecao: row.responsavel_inspecao!.trim(),
            funcao: row.funcao?.trim(),
            inspecao_programada: row.inspecao_programada?.trim(),
            status: row.status!.trim(),
            desvios_identificados: row.desvios_identificados || 0,
            observacao: row.observacao?.trim(),
            relatorio_url: row.relatorio_url?.trim(),
          });
        }
      }

      const result = { valid, invalid };
      setValidationResults(result);
      
      toast({
        title: 'Validação concluída',
        description: `${valid.length} registros válidos, ${invalid.length} com erro`,
      });
      
      return result;
    } catch (e: any) {
      console.error('Erro na validação da importação:', e);
      toast({ title: 'Erro na validação', description: e.message || 'Falha ao validar dados', variant: 'destructive' });
      const empty = { valid: [], invalid: [] } as { valid: ValidatedHSARow[]; invalid: { data: HSAImportData; errors: string[] }[] };
      setValidationResults(empty);
      return empty;
    } finally {
      setIsValidating(false);
    }
  };

  const importHSA = async () => {
    if (validationResults.valid.length === 0) {
      toast({ title: 'Nenhum registro válido para importar', variant: 'destructive' });
      return;
    }

    setIsImporting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error('Usuário não autenticado');

      // Inserir registros HSA
      const { error: insertError } = await supabase
        .from('execucao_hsa')
        .insert(validationResults.valid.map(row => ({
          data: row.data,
          mes: row.mes,
          ano: row.ano,
          cca_id: row.cca_id,
          responsavel_inspecao: row.responsavel_inspecao,
          funcao: row.funcao,
          inspecao_programada: row.inspecao_programada,
          status: row.status,
          desvios_identificados: row.desvios_identificados,
          observacao: row.observacao,
          relatorio_url: row.relatorio_url,
        })));

      if (insertError) throw insertError;

      // Log da importação
      await supabase
        .from('logs_importacao_hsa')
        .insert({
          usuario_id: userData.user.id,
          total_registros: validationResults.valid.length + validationResults.invalid.length,
          registros_criados: validationResults.valid.length,
          registros_atualizados: 0,
          registros_com_erro: validationResults.invalid.length,
          status: 'concluida',
          detalhes_erro: validationResults.invalid.length > 0 
            ? `${validationResults.invalid.length} registros com erro` 
            : null,
        });

      toast({
        title: 'Importação concluída',
        description: `${validationResults.valid.length} registros HSA importados com sucesso`,
      });

      // Limpar resultados
      setValidationResults({ valid: [], invalid: [] });

    } catch (error: any) {
      console.error('Erro na importação:', error);
      toast({
        title: 'Erro na importação',
        description: error.message || 'Falha ao importar dados',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isValidating,
    isImporting,
    validationResults,
    validateImport,
    importHSA,
  };
};