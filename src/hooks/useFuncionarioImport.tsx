
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FuncionarioImportData } from "@/types/funcionarios";

export const useFuncionarioImport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isValidating, setIsValidating] = useState(false);

  const validateImport = async (data: FuncionarioImportData[]) => {
    setIsValidating(true);
    
    try {
      const valid: FuncionarioImportData[] = [];
      const invalid: { data: FuncionarioImportData; errors: string[] }[] = [];
      const duplicates: FuncionarioImportData[] = [];
      const updates: FuncionarioImportData[] = [];
      const seenCpfs = new Set<string>();

      // Buscar funcionários existentes por CPF
      const cpfs = data.filter(d => d.cpf).map(d => d.cpf);
      const { data: existingFuncionarios, error } = await supabase
        .from('funcionarios')
        .select('cpf')
        .in('cpf', cpfs);

      if (error) {
        console.error('Erro ao buscar funcionários existentes:', error);
        throw error;
      }

      const existingCpfs = new Set(existingFuncionarios?.map(f => f.cpf) || []);

      // Buscar CCAs válidos
      const { data: ccas, error: ccaError } = await supabase
        .from('ccas')
        .select('codigo, id')
        .eq('ativo', true);

      if (ccaError) {
        console.error('Erro ao buscar CCAs:', ccaError);
        throw ccaError;
      }

      const validCcaCodigos = new Set(ccas?.map(c => c.codigo) || []);

      // Validar cada registro
      for (const item of data) {
        const errors: string[] = [];

        // Validar campos obrigatórios
        if (!item.nome?.trim()) errors.push('Nome é obrigatório');
        if (!item.funcao?.trim()) errors.push('Função é obrigatória');
        if (!item.matricula?.trim()) errors.push('Matrícula é obrigatória');
        if (!item.cpf?.trim()) errors.push('CPF é obrigatório');

        // Validar formato do CPF
        if (item.cpf) {
          const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
          if (!cpfRegex.test(item.cpf)) {
            errors.push('CPF deve estar no formato XXX.XXX.XXX-XX');
          }
        }

        // Validar CCA se fornecido
        if (item.cca_codigo && !validCcaCodigos.has(item.cca_codigo)) {
          errors.push('Código do CCA inválido');
        }

        // Validar data de admissão se fornecida
        if (item.data_admissao) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(item.data_admissao)) {
            errors.push('Data de admissão deve estar no formato YYYY-MM-DD');
          }
        }

        // Verificar duplicatas no arquivo
        if (item.cpf && seenCpfs.has(item.cpf)) {
          duplicates.push(item);
          continue;
        }
        
        if (item.cpf) {
          seenCpfs.add(item.cpf);
        }

        if (errors.length > 0) {
          invalid.push({ data: item, errors });
        } else if (item.cpf && existingCpfs.has(item.cpf)) {
          updates.push(item);
        } else {
          valid.push(item);
        }
      }

      return { valid, invalid, duplicates, updates };
    } catch (error) {
      toast({
        title: "Erro na validação",
        description: "Erro ao validar os dados importados.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsValidating(false);
    }
  };

  const importMutation = useMutation({
    mutationFn: async ({ 
      newFuncionarios, 
      updateFuncionarios 
    }: {
      newFuncionarios: FuncionarioImportData[];
      updateFuncionarios: FuncionarioImportData[];
    }) => {
      const results = {
        created: 0,
        updated: 0,
        errors: [] as string[]
      };

      // Buscar CCAs para mapeamento de código para ID
      const { data: ccas, error: ccaError } = await supabase
        .from('ccas')
        .select('codigo, id')
        .eq('ativo', true);

      if (ccaError) throw ccaError;

      const ccaMap = new Map(ccas?.map(c => [c.codigo, c.id]) || []);

      // Processar novos funcionários
      for (const funcionario of newFuncionarios) {
        try {
          const ccaId = funcionario.cca_codigo ? ccaMap.get(funcionario.cca_codigo) : null;
          
          const { error } = await supabase
            .from('funcionarios')
            .insert({
              nome: funcionario.nome,
              funcao: funcionario.funcao,
              matricula: funcionario.matricula,
              cpf: funcionario.cpf,
              cca_id: ccaId,
              data_admissao: funcionario.data_admissao || null,
              ativo: true
            });

          if (error) {
            results.errors.push(`Erro ao criar ${funcionario.nome}: ${error.message}`);
          } else {
            results.created++;
          }
        } catch (error) {
          results.errors.push(`Erro ao criar ${funcionario.nome}: ${error}`);
        }
      }

      // Processar atualizações
      for (const funcionario of updateFuncionarios) {
        try {
          const ccaId = funcionario.cca_codigo ? ccaMap.get(funcionario.cca_codigo) : null;
          
          const { error } = await supabase
            .from('funcionarios')
            .update({
              nome: funcionario.nome,
              funcao: funcionario.funcao,
              matricula: funcionario.matricula,
              cca_id: ccaId,
              data_admissao: funcionario.data_admissao || null
            })
            .eq('cpf', funcionario.cpf);

          if (error) {
            results.errors.push(`Erro ao atualizar ${funcionario.nome}: ${error.message}`);
          } else {
            results.updated++;
          }
        } catch (error) {
          results.errors.push(`Erro ao atualizar ${funcionario.nome}: ${error}`);
        }
      }

      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['admin-funcionarios'] });
      
      let message = '';
      if (results.created > 0) {
        message += `${results.created} funcionário(s) criado(s). `;
      }
      if (results.updated > 0) {
        message += `${results.updated} funcionário(s) atualizado(s). `;
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
        description: "Erro ao importar funcionários.",
        variant: "destructive",
      });
      console.error('Erro na importação:', error);
    }
  });

  const importFuncionarios = async (
    newFuncionarios: FuncionarioImportData[],
    updateFuncionarios: FuncionarioImportData[]
  ) => {
    return importMutation.mutateAsync({
      newFuncionarios,
      updateFuncionarios
    });
  };

  return {
    validateImport,
    importFuncionarios,
    isValidating,
    isImporting: importMutation.isPending
  };
};
