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
      console.log('Iniciando validação de', data.length, 'registros');
      console.log('Dados recebidos:', data);

      if (!data || data.length === 0) {
        throw new Error('Nenhum dado foi encontrado no arquivo. Verifique se o arquivo está no formato correto.');
      }

      const valid: FuncionarioImportData[] = [];
      const invalid: { data: FuncionarioImportData; errors: string[] }[] = [];
      const duplicates: FuncionarioImportData[] = [];
      const updates: FuncionarioImportData[] = [];
      const seenMatriculas = new Set<string>();

      // Buscar funcionários existentes por matrícula
      const matriculas = data.filter(d => d.matricula).map(d => d.matricula);
      console.log('Matrículas para verificar:', matriculas);
      
      let existingMatriculas = new Set<string>();
      if (matriculas.length > 0) {
        const { data: existingFuncionarios, error } = await supabase
          .from('funcionarios')
          .select('matricula')
          .in('matricula', matriculas);

        if (error) {
          console.error('Erro ao buscar funcionários existentes:', error);
          throw new Error(`Erro ao verificar funcionários existentes: ${error.message}`);
        }

        existingMatriculas = new Set(existingFuncionarios?.map(f => f.matricula) || []);
        console.log('Matrículas existentes encontradas:', Array.from(existingMatriculas));
      }

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
        if (!item.nome || typeof item.nome !== 'string' || !item.nome.trim()) {
          errors.push('Nome é obrigatório');
        }
        if (!item.funcao || typeof item.funcao !== 'string' || !item.funcao.trim()) {
          errors.push('Função é obrigatória');
        }
        if (!item.matricula || typeof item.matricula !== 'string' || !item.matricula.trim()) {
          errors.push('Matrícula é obrigatória');
        }

        // Validar formato do CPF (opcional)
        if (item.cpf && typeof item.cpf === 'string') {
          const cpfLimpo = item.cpf.replace(/\D/g, '');
          
          if (cpfLimpo.length !== 11) {
            errors.push('CPF deve conter 11 dígitos');
          } else {
            // Se não tem formatação, adicionar
            if (!item.cpf.includes('.') && !item.cpf.includes('-')) {
              item.cpf = `${cpfLimpo.slice(0,3)}.${cpfLimpo.slice(3,6)}.${cpfLimpo.slice(6,9)}-${cpfLimpo.slice(9,11)}`;
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

        // Validar data de admissão se fornecida
        if (item.data_admissao) {
          if (typeof item.data_admissao === 'string') {
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(item.data_admissao)) {
              errors.push(`Data de admissão "${item.data_admissao}" deve estar no formato DD/MM/AAAA (ex: 15/01/2024)`);
            } else {
              // Validar se é uma data válida (converter DD/MM/AAAA para Date)
              const [day, month, year] = item.data_admissao.split('/');
              const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              if (isNaN(date.getTime()) || 
                  date.getDate() !== parseInt(day) || 
                  date.getMonth() !== parseInt(month) - 1 || 
                  date.getFullYear() !== parseInt(year)) {
                errors.push(`Data de admissão "${item.data_admissao}" não é uma data válida`);
              }
            }
          } else {
            errors.push(`Data de admissão deve ser uma string no formato DD/MM/AAAA`);
          }
        }

        // Verificar duplicatas no arquivo (por matrícula)
        if (item.matricula && seenMatriculas.has(item.matricula)) {
          duplicates.push(item);
          console.log(`Matrícula duplicada encontrada no arquivo: ${item.matricula}`);
          continue;
        }
        
        if (item.matricula) {
          seenMatriculas.add(item.matricula);
        }

        if (errors.length > 0) {
          invalid.push({ data: item, errors });
          console.log(`Item ${i + 1} inválido:`, item, 'Erros:', errors);
        } else if (item.matricula && existingMatriculas.has(item.matricula)) {
          updates.push(item);
          console.log(`Item ${i + 1} para atualização:`, item);
        } else {
          valid.push(item);
          console.log(`Item ${i + 1} válido:`, item);
        }
      }

      console.log('Resultado da validação:', {
        valid: valid.length,
        invalid: invalid.length,
        duplicates: duplicates.length,
        updates: updates.length
      });

      return { valid, invalid, duplicates, updates };
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
      newFuncionarios, 
      updateFuncionarios,
      nomeArquivo 
    }: {
      newFuncionarios: FuncionarioImportData[];
      updateFuncionarios: FuncionarioImportData[];
      nomeArquivo?: string;
    }) => {
      const results = {
        created: 0,
        updated: 0,
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
      console.log('Mapa de CCAs para atualização:', Array.from(ccaMap.entries()));

      // Processar novos funcionários
      for (const funcionario of newFuncionarios) {
        try {
          const ccaId = funcionario.cca_codigo ? ccaMap.get(funcionario.cca_codigo.toLowerCase().trim()) : null;
          
          console.log('Criando funcionário:', funcionario.nome, 'CCA:', funcionario.cca_codigo, 'CCA ID:', ccaId);
          
          // Converter data DD/MM/AAAA para YYYY-MM-DD se necessário
          let dataAdmissaoFormatada = null;
          if (funcionario.data_admissao) {
            const [day, month, year] = funcionario.data_admissao.split('/');
            dataAdmissaoFormatada = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
          
          const { error } = await supabase
            .from('funcionarios')
            .insert({
              nome: funcionario.nome,
              funcao: funcionario.funcao,
              matricula: funcionario.matricula,
              cpf: funcionario.cpf || null,
              cca_id: ccaId,
              data_admissao: dataAdmissaoFormatada,
              ativo: funcionario.ativo !== undefined ? funcionario.ativo : true
            });

          if (error) {
            console.error('Erro ao criar funcionário:', error);
            results.errors.push(`Erro ao criar ${funcionario.nome}: ${error.message}`);
          } else {
            results.created++;
          }
        } catch (error) {
          console.error('Erro inesperado ao criar funcionário:', error);
          results.errors.push(`Erro ao criar ${funcionario.nome}: ${error}`);
        }
      }

      // Processar atualizações
      for (const funcionario of updateFuncionarios) {
        try {
          const ccaId = funcionario.cca_codigo ? ccaMap.get(funcionario.cca_codigo.toLowerCase().trim()) : null;
          
          console.log('Atualizando funcionário:', funcionario.nome, 'Matrícula:', funcionario.matricula, 'CCA:', funcionario.cca_codigo, 'CCA ID:', ccaId);
          
          // Converter data DD/MM/AAAA para YYYY-MM-DD se necessário
          let dataAdmissaoFormatada = null;
          if (funcionario.data_admissao) {
            const [day, month, year] = funcionario.data_admissao.split('/');
            dataAdmissaoFormatada = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
          
          const updateData: any = {
            nome: funcionario.nome,
            funcao: funcionario.funcao,
            data_admissao: dataAdmissaoFormatada,
            ativo: funcionario.ativo !== undefined ? funcionario.ativo : true
          };

          // Adicionar CPF se fornecido
          if (funcionario.cpf) {
            updateData.cpf = funcionario.cpf;
          }

          // Só adicionar cca_id se houver código CCA válido
          if (funcionario.cca_codigo && ccaId) {
            updateData.cca_id = ccaId;
          }

          const { error, data: updateResult } = await supabase
            .from('funcionarios')
            .update(updateData)
            .eq('matricula', funcionario.matricula)
            .select();

          if (error) {
            console.error('Erro ao atualizar funcionário:', error);
            results.errors.push(`Erro ao atualizar ${funcionario.nome}: ${error.message}`);
          } else if (updateResult && updateResult.length > 0) {
            console.log('Funcionário atualizado com sucesso:', updateResult[0]);
            results.updated++;
          } else {
            console.warn('Nenhum funcionário foi atualizado para matrícula:', funcionario.matricula);
            results.errors.push(`Funcionário ${funcionario.nome} com matrícula ${funcionario.matricula} não foi encontrado para atualização`);
          }
        } catch (error) {
          console.error('Erro inesperado ao atualizar funcionário:', error);
          results.errors.push(`Erro ao atualizar ${funcionario.nome}: ${error}`);
        }
      }

      console.log('Resultado final da importação:', results);

      // Registrar log da importação
      if (user) {
        try {
          const logData = {
            usuario_id: user.id,
            total_registros: newFuncionarios.length + updateFuncionarios.length,
            registros_criados: results.created,
            registros_atualizados: results.updated,
            registros_com_erro: results.errors.length,
            status: results.errors.length > 0 ? 'concluida_com_erros' : 'concluida',
            detalhes_erro: results.errors.length > 0 ? results.errors.join('; ') : null,
            nome_arquivo: nomeArquivo
          };

          const { error: logError } = await supabase
            .from('logs_importacao_funcionarios')
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
      queryClient.invalidateQueries({ queryKey: ['admin-funcionarios'] });
      queryClient.invalidateQueries({ queryKey: ['logs-importacao-funcionarios'] });
      
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
    updateFuncionarios: FuncionarioImportData[],
    nomeArquivo?: string
  ) => {
    return importMutation.mutateAsync({
      newFuncionarios,
      updateFuncionarios,
      nomeArquivo
    });
  };

  return {
    validateImport,
    importFuncionarios,
    isValidating,
    isImporting: importMutation.isPending
  };
};
