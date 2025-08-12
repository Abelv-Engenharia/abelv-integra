
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExecucaoTreinamentoImportData } from "@/types/treinamentosExecucaoImport";

interface ValidatedExecucaoRow {
  data: string; // yyyy-MM-dd
  mes: number;
  ano: number;
  cca_id: number;
  cca: string;
  processo_treinamento: string;
  tipo_treinamento: string;
  carga_horaria: number;
  efetivo_mod: number;
  efetivo_moi: number;
  observacoes?: string | null;
}

export const useExecucaoTreinamentosImport = () => {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    valid: ValidatedExecucaoRow[];
    invalid: { data: ExecucaoTreinamentoImportData; errors: string[] }[];
  }>({ valid: [], invalid: [] });

  const normalizeDate = (value?: string | null) => {
    if (!value) return null;
    // Expecting yyyy-MM-dd. If in dd/MM/yyyy, try to convert
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      const [_, d, mo, y] = m;
      return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    // Fallback try Date parsing
    const dt = new Date(value);
    if (!isNaN(dt.getTime())) {
      const y = dt.getFullYear();
      const mo = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      return `${y}-${mo}-${d}`;
    }
    return null;
  };

  const validateImport = async (rows: ExecucaoTreinamentoImportData[]) => {
    setIsValidating(true);
    try {
      const invalid: { data: ExecucaoTreinamentoImportData; errors: string[] }[] = [];

      // Fetch CCAs by codigo (unique set)
      const codes = Array.from(new Set(rows.map(r => (r.cca_codigo || '').trim()).filter(Boolean)));
      const { data: ccas, error: ccasError } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .in('codigo', codes);

      if (ccasError) throw ccasError;
      const mapByCodigo = new Map((ccas || []).map(c => [c.codigo, c] as const));

      const valid: ValidatedExecucaoRow[] = [];
      for (const r of rows) {
        const errs: string[] = [];

        const dateStr = normalizeDate(r.data || null);
        if (!dateStr) errs.push('Data inválida ou ausente');

        const ccaCodigo = (r.cca_codigo || '').trim();
        const cca = ccaCodigo ? mapByCodigo.get(ccaCodigo) : null;
        if (!cca) errs.push('CCA (código) não encontrado');

        const processo = (r.processo_treinamento || '').trim();
        if (!processo) errs.push('Processo de treinamento é obrigatório');

        const tipo = (r.tipo_treinamento || '').trim();
        if (!tipo) errs.push('Tipo de treinamento é obrigatório');

        const carga = Number(r.carga_horaria);
        if (!Number.isFinite(carga) || carga <= 0) errs.push('Carga horária inválida');

        const efetMod = Number(r.efetivo_mod || 0);
        const efetMoi = Number(r.efetivo_moi || 0);

        if (errs.length) {
          invalid.push({ data: r, errors: errs });
          continue;
        }

        const dt = new Date((dateStr as string) + 'T00:00:00');
        valid.push({
          data: dateStr as string,
          mes: dt.getMonth() + 1,
          ano: dt.getFullYear(),
          cca_id: cca!.id,
          cca: `${cca!.codigo} - ${cca!.nome}`,
          processo_treinamento: processo,
          tipo_treinamento: tipo,
          carga_horaria: carga,
          efetivo_mod: efetMod,
          efetivo_moi: efetMoi,
          observacoes: (r.observacoes || '').trim() || null,
        });
      }

      const result = { valid, invalid };
      setValidationResults(result);
      return result;
    } catch (e: any) {
      console.error('Erro na validação da importação:', e);
      toast({ title: 'Erro na validação', description: e.message || 'Falha ao validar dados', variant: 'destructive' });
      const empty = { valid: [], invalid: [] } as { valid: ValidatedExecucaoRow[]; invalid: { data: ExecucaoTreinamentoImportData; errors: string[] }[] };
      setValidationResults(empty);
      return empty;
    } finally {
      setIsValidating(false);
    }
  };

  const importExecucoes = async () => {
    if (validationResults.valid.length === 0) {
      toast({ title: 'Nada para importar', description: 'Nenhuma linha válida encontrada.' });
      return { success: false } as const;
    }
    setIsImporting(true);
    try {
      const payload = validationResults.valid.map(v => ({
        data: v.data,
        mes: v.mes,
        ano: v.ano,
        cca_id: v.cca_id,
        cca: v.cca,
        processo_treinamento: v.processo_treinamento,
        tipo_treinamento: v.tipo_treinamento,
        carga_horaria: v.carga_horaria,
        efetivo_mod: v.efetivo_mod,
        efetivo_moi: v.efetivo_moi,
        observacoes: v.observacoes,
      }));

      const { error } = await supabase.from('execucao_treinamentos').insert(payload);
      if (error) throw error;

      toast({ title: 'Importação concluída', description: `${payload.length} registros importados com sucesso.` });
      return { success: true } as const;
    } catch (e: any) {
      console.error('Erro ao importar execuções de treinamentos:', e);
      toast({ title: 'Erro na importação', description: e.message || 'Falha ao importar dados', variant: 'destructive' });
      return { success: false } as const;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isValidating,
    isImporting,
    validationResults,
    validateImport,
    importExecucoes,
  };
};
