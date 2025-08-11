
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DesvioImportData } from "@/types/desviosImport";

export const useDesvioImport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isValidating, setIsValidating] = useState(false);

  const validateImport = async (data: DesvioImportData[]) => {
    setIsValidating(true);
    
    try {
      console.log('Iniciando validação de', data.length, 'registros de desvios');
      console.log('Dados recebidos:', data);

      if (!data || data.length === 0) {
        throw new Error('Nenhum dado foi encontrado no arquivo. Verifique se o arquivo está no formato correto.');
      }

      const valid: DesvioImportData[] = [];
      const invalid: { data: DesvioImportData; errors: string[] }[] = [];
      const duplicates: DesvioImportData[] = [];
      const seenDesvios = new Set<string>();

      // Buscar CCAs válidos
      const { data: ccas, error: ccaError } = await supabase
        .from('ccas')
        .select('codigo, id')
        .eq('ativo', true);

      if (ccaError) {
        console.error('Erro ao buscar CCAs:', ccaError);
        throw new Error(`Erro ao carregar códigos de CCA: ${ccaError.message}`);
      }

      // Criar mapa de códigos CCA (case insensitive)
      const validCcaCodigos = new Map();
      ccas?.forEach(c => {
        const codigoLimpo = c.codigo.toLowerCase().trim();
        validCcaCodigos.set(codigoLimpo, c.codigo);
      });

      console.log('CCAs válidos encontrados:', ccas?.map(c => c.codigo));

      // Validar cada registro
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const errors: string[] = [];

        console.log(`Validando item ${i + 1}:`, item);

        // Verificar se o item não está vazio
        if (!item || Object.keys(item).length === 0) {
          console.log(`Item ${i + 1} está vazio, pulando...`);
          continue;
        }

        // Validar campos obrigatórios
        if (!item.data || typeof item.data !== 'string' || !item.data.trim()) {
          errors.push('Data é obrigatória');
        }
        if (!item.descricao_desvio || typeof item.descricao_desvio !== 'string' || !item.descricao_desvio.trim()) {
          errors.push('Descrição do desvio é obrigatória');
        }
        if (!item.responsavel_inspecao || typeof item.responsavel_inspecao !== 'string' || !item.responsavel_inspecao.trim()) {
          errors.push('Responsável pela inspeção é obrigatório');
        }

        // Validar formato da data
        if (item.data && typeof item.data === 'string') {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(item.data)) {
            errors.push(`Data "${item.data}" deve estar no formato YYYY-MM-DD (ex: 2024-01-15)`);
          } else {
            // Validar se é uma data válida
            const date = new Date(item.data);
            if (isNaN(date.getTime())) {
              errors.push(`Data "${item.data}" não é uma data válida`);
            }
          }
        }

        // Validar CCA se fornecido (case insensitive e trim)
        if (item.cca_codigo && typeof item.cca_codigo === 'string') {
          const ccaCodigoLower = item.cca_codigo.toLowerCase().trim();
          if (!validCcaCodigos.has(ccaCodigoLower)) {
            errors.push(`Código do CCA "${item.cca_codigo}" não encontrado. Códigos válidos: ${Array.from(validCcaCodigos.values()).join(', ')}`);
          } else {
            // Normalizar o código CCA para o valor correto
            item.cca_codigo = validCcaCodigos.get(ccaCodigoLower);
          }
        }

        // Verificar duplicatas no arquivo (baseado em data + descrição)
        const desvioKey = `${item.data}_${item.descricao_desvio}`;
        if (seenDesvios.has(desvioKey)) {
          duplicates.push(item);
          console.log(`Desvio duplicado encontrado no arquivo: ${desvioKey}`);
          continue;
        }
        
        seenDesvios.add(desvioKey);

        if (errors.length > 0) {
          invalid.push({ data: item, errors });
          console.log(`Item ${i + 1} inválido:`, item, 'Erros:', errors);
        } else {
          valid.push(item);
          console.log(`Item ${i + 1} válido:`, item);
        }
      }

      console.log('Resultado da validação:', {
        valid: valid.length,
        invalid: invalid.length,
        duplicates: duplicates.length
      });

      return { valid, invalid, duplicates, updates: [] };
    } catch (error) {
      console.error('Erro detalhado na validação:', error);
      
      let errorMessage = 'Erro ao validar os dados importados.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro na validação",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsValidating(false);
    }
  };

  const importMutation = useMutation({
    mutationFn: async ({ 
      newDesvios, 
      nomeArquivo 
    }: {
      newDesvios: DesvioImportData[];
      nomeArquivo?: string;
    }) => {
      const results = {
        created: 0,
        errors: [] as string[]
      };

      // Obter dados do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      // Buscar CCAs para mapeamento de código para ID
      const { data: ccas, error: ccaError } = await supabase
        .from('ccas')
        .select('codigo, id')
        .eq('ativo', true);

      if (ccaError) throw ccaError;

      const ccaMap = new Map(ccas?.map(c => [c.codigo.toLowerCase().trim(), c.id]) || []);

      // Processar novos desvios
      for (const desvio of newDesvios) {
        try {
          const ccaId = desvio.cca_codigo ? ccaMap.get(desvio.cca_codigo.toLowerCase().trim()) : null;
          
          console.log('Criando desvio:', desvio.descricao_desvio, 'CCA:', desvio.cca_codigo, 'CCA ID:', ccaId);
          
          const { error } = await supabase
            .from('desvios')
            .insert({
              data_desvio: desvio.data,
              hora_desvio: desvio.hora || '00:00',
              local: desvio.responsavel_inspecao,
              cca_id: ccaId,
              descricao_desvio: desvio.descricao_desvio.toUpperCase(),
              status: 'Aberto',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.error('Erro ao criar desvio:', error);
            results.errors.push(`Erro ao criar desvio ${desvio.descricao_desvio}: ${error.message}`);
          } else {
            results.created++;
          }
        } catch (error) {
          console.error('Erro inesperado ao criar desvio:', error);
          results.errors.push(`Erro ao criar desvio ${desvio.descricao_desvio}: ${error}`);
        }
      }

      console.log('Resultado final da importação:', results);

      // Registrar log da importação
      if (user) {
        try {
          const logData = {
            usuario_id: user.id,
            total_registros: newDesvios.length,
            registros_criados: results.created,
            registros_com_erro: results.errors.length,
            status: results.errors.length > 0 ? 'concluida_com_erros' : 'concluida',
            detalhes_erro: results.errors.length > 0 ? results.errors.join('; ') : null,
            nome_arquivo: nomeArquivo,
            tipo_importacao: 'desvios'
          };

          const { error: logError } = await supabase
            .from('logs_importacao')
            .insert(logData);

          if (logError) {
            console.error('Erro ao registrar log de importação:', logError);
          } else {
            console.log('Log de importação registrado com sucesso');
          }
        } catch (error) {
          console.error('Erro ao criar log de importação:', error);
        }
      }

      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['desvios'] });
      queryClient.invalidateQueries({ queryKey: ['logs-importacao-desvios'] });
      
      let message = '';
      if (results.created > 0) {
        message += `${results.created} desvio(s) criado(s). `;
      }
      
      if (results.errors.length > 0) {
        message += `${results.errors.length} erro(s) ocorreram.`;
        console.error('Erros na importação:', results.errors);
      }

      toast({
        title: "Importação concluída",
        description: message,
        variant: results.errors.length > 0 ? "destructive" : "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na importação",
        description: "Erro ao importar desvios.",
        variant: "destructive",
      });
      console.error('Erro na importação:', error);
    }
  });

  const importDesvios = async (
    newDesvios: DesvioImportData[],
    nomeArquivo?: string
  ) => {
    return importMutation.mutateAsync({
      newDesvios,
      nomeArquivo
    });
  };

  return {
    validateImport,
    importDesvios,
    isValidating,
    isImporting: importMutation.isPending
  };
};
