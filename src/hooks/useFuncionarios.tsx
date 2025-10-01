
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Funcionario, CCA } from "@/types/funcionarios";

export const useFuncionarios = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar funcionários (incluindo inativos para preservar dados históricos)
  const { data: funcionarios = [], isLoading: loadingFuncionarios } = useQuery({
    queryKey: ['admin-funcionarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funcionarios')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          cpf,
          foto,
          ativo,
          cca_id,
          ccas:cca_id(id, codigo, nome),
          updated_at,
          data_admissao
        `)
        .order('ativo', { ascending: false })
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Buscar CCAs
  const { data: ccas = [] } = useQuery({
    queryKey: ['ccas-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('codigo');
      if (error) throw error;
      return data || [];
    }
  });

  // Upload de foto para o storage
  const uploadFoto = async (file: File, funcionarioId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${funcionarioId}.${fileExt}`;
      const filePath = `funcionarios/${fileName}`;
      console.log('[uploadFoto] Uploading file to', filePath);

      const { error: uploadError } = await supabase.storage
        .from('funcionarios-fotos')
        .upload(filePath, file, { 
          upsert: true
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      // Não salvar URL pública por segurança - retornar apenas path
      return filePath;
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      return null;
    }
  };

  // Mutation para criar/editar funcionário
  const createFuncionarioMutation = useMutation({
    mutationFn: async ({ 
      funcionario, 
      editingFuncionario, 
      photoFile, 
      photoRemoved 
    }: {
      funcionario: { nome: string; funcao: string; matricula: string; cpf?: string; cca_id: string; data_admissao?: string | null };
      editingFuncionario?: Funcionario | null;
      photoFile?: File | null;
      photoRemoved?: boolean;
    }) => {
      const ccaId = funcionario.cca_id === "none" ? null : parseInt(funcionario.cca_id);

      // Preparar campo data_admissao corretamente (null ou string ISO yyyy-mm-dd)
      let dataAdmissao: string | null = null;
      if (funcionario.data_admissao) {
        dataAdmissao = funcionario.data_admissao || null;
      }

      if (editingFuncionario) {
        let fotoUrl = editingFuncionario.foto;

        if (photoRemoved) {
          fotoUrl = null;
        } else if (photoFile) {
          const uploadedPath = await uploadFoto(photoFile, editingFuncionario.id);
          if (uploadedPath) {
            fotoUrl = uploadedPath;
          }
        }
        
        console.log('[Editar] id:', editingFuncionario.id, 'nome:', funcionario.nome, 'fotoUrl:', fotoUrl, 'data_admissao:', dataAdmissao);

        const { error: updateError } = await supabase
          .from('funcionarios')
          .update({ 
            nome: funcionario.nome, 
            funcao: funcionario.funcao,
            matricula: funcionario.matricula,
            cpf: funcionario.cpf || null,
            cca_id: ccaId,
            foto: fotoUrl,
            data_admissao: dataAdmissao
          })
          .eq('id', editingFuncionario.id);
        
        if (updateError) {
          console.error('Erro ao atualizar funcionário:', updateError);
          throw updateError;
        }
      } else {
        const { data: novoFuncionario, error: createError } = await supabase
          .from('funcionarios')
          .insert({ 
            nome: funcionario.nome, 
            funcao: funcionario.funcao,
            matricula: funcionario.matricula,
            cpf: funcionario.cpf || null,
            cca_id: ccaId,
            data_admissao: dataAdmissao
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Erro ao criar funcionário:', createError);
          throw createError;
        }

        if (photoFile && novoFuncionario) {
          const uploadedPath = await uploadFoto(photoFile, novoFuncionario.id);
          if (uploadedPath) {
            const { error: updatePhotoError } = await supabase
              .from('funcionarios')
              .update({ foto: uploadedPath })
              .eq('id', novoFuncionario.id);
            
            if (updatePhotoError) {
              console.error('Erro ao atualizar path da foto:', updatePhotoError);
            }
          }
        }
      }
    },
    onSuccess: (_, { editingFuncionario }) => {
      // Forçar refetch
      queryClient.invalidateQueries({ queryKey: ['admin-funcionarios'] });
      queryClient.refetchQueries({ queryKey: ['admin-funcionarios'] });
      toast({
        title: "Sucesso",
        description: editingFuncionario ? "Funcionário atualizado com sucesso!" : "Funcionário criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao salvar funcionário",
        variant: "destructive",
      });
      console.error('Erro:', error);
    }
  });

  // Mutation para deletar funcionário
  const deleteFuncionarioMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('funcionarios')
        .update({ ativo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-funcionarios'] });
      toast({
        title: "Sucesso",
        description: "Funcionário desativado com sucesso!",
      });
    }
  });

  return {
    funcionarios,
    ccas,
    loadingFuncionarios,
    createFuncionarioMutation,
    deleteFuncionarioMutation
  };
};
