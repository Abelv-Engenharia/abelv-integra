import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContratoModelo, TipoContratoModelo } from "@/types/gestao-pessoas/contratoModelo";
import { toast } from "sonner";

export const useModelosContratos = () => {
  return useQuery({
    queryKey: ['contratos-modelos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratos_modelos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContratoModelo[];
    },
  });
};

export const useModelosPorTipo = (tipo: TipoContratoModelo | undefined) => {
  return useQuery({
    queryKey: ['contratos-modelos-tipo', tipo],
    queryFn: async () => {
      if (!tipo) return [];
      
      const { data, error } = await supabase
        .from('contratos_modelos')
        .select('*')
        .eq('tipo_contrato', tipo)
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContratoModelo[];
    },
    enabled: !!tipo,
  });
};

export const useCreateModelo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (modelo: Omit<ContratoModelo, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('contratos_modelos')
        .insert(modelo)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-modelos'] });
      toast.success('Modelo criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar modelo:', error);
      toast.error('Erro ao criar modelo');
    },
  });
};

export const useUpdateModelo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ContratoModelo> }) => {
      const { data, error } = await supabase
        .from('contratos_modelos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-modelos'] });
      toast.success('Modelo atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar modelo:', error);
      toast.error('Erro ao atualizar modelo');
    },
  });
};

export const useDeleteModelo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contratos_modelos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-modelos'] });
      toast.success('Modelo excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir modelo:', error);
      toast.error('Erro ao excluir modelo');
    },
  });
};

export const useUploadModelo = () => {
  return useMutation({
    mutationFn: async ({ file, modeloId }: { file: File; modeloId?: string }) => {
      const fileName = `${modeloId || Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('contratos-modelos')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('contratos-modelos')
        .getPublicUrl(fileName);
      
      return {
        url: urlData.publicUrl,
        nome: file.name,
        path: fileName,
      };
    },
    onError: (error) => {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload do arquivo');
    },
  });
};

export const useGetFileUrl = () => {
  return useMutation({
    mutationFn: async (filePath: string) => {
      const { data } = await supabase.storage
        .from('contratos-modelos')
        .createSignedUrl(filePath, 3600); // 1 hora
      
      return data?.signedUrl || '';
    },
  });
};
