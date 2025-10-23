import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TipoContratoModelo, ContratoEmitidoFull } from "@/types/gestao-pessoas/contratoModelo";

export const useContratosEmitidos = () => {
  return useQuery({
    queryKey: ['contratos-emitidos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratos_emitidos')
        .select(`
          *,
          prestador:prestadores(
            id,
            razao_social,
            cnpj,
            nome_completo
          ),
          modelo:contratos_modelos(
            id,
            nome,
            tipo_contrato
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

interface CreateContratoEmitidoData {
  prestador_id: string;
  tipo_contrato: TipoContratoModelo;
  modelo_id: string | null;
  numero_contrato: string;
  dados_preenchidos: Record<string, any>;
  pdf_url?: string | null;
  pdf_nome?: string | null;
  status?: 'rascunho' | 'confirmado' | 'enviado';
  data_inicio?: string | null;
  data_fim?: string | null;
  observacoes?: string | null;
}

export const useCreateContratoEmitido = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateContratoEmitidoData) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data: contrato, error } = await supabase
        .from('contratos_emitidos')
        .insert({
          ...data,
          created_by: user.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return contrato;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-emitidos'] });
      toast({
        title: "Contrato emitido com sucesso!",
        description: "O contrato foi salvo no sistema.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao emitir contrato",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateContratoEmitido = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ContratoEmitidoFull> & { id: string }) => {
      const { data, error } = await supabase
        .from('contratos_emitidos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-emitidos'] });
      toast({
        title: "Contrato atualizado",
        description: "As alterações foram salvas.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar contrato",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUploadContratoPDF = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, filename }: { file: File; filename: string }) => {
      const { data, error } = await supabase.storage
        .from('contratos-emitidos')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('contratos-emitidos')
        .getPublicUrl(filename);

      return {
        pdf_url: urlData.publicUrl,
        pdf_nome: file.name,
        file_path: data.path,
      };
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao fazer upload do PDF",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
