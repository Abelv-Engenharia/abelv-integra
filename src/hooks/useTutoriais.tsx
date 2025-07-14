import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Tutorial {
  id: string;
  titulo: string;
  descricao?: string;
  video_url: string;
  categoria: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  usuario_id: string;
}

export interface CreateTutorialData {
  titulo: string;
  descricao?: string;
  video_file: File;
  categoria: string;
}

export const useTutoriais = () => {
  return useQuery({
    queryKey: ["tutoriais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tutoriais")
        .select("*")
        .eq("ativo", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar tutoriais:", error);
        throw error;
      }

      return data as Tutorial[];
    },
  });
};

export const useCreateTutorial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTutorialData) => {
      // 1. Upload do arquivo de vídeo
      const fileExt = data.video_file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("tutoriais")
        .upload(filePath, data.video_file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Obter URL pública do vídeo
      const { data: publicUrlData } = supabase.storage
        .from("tutoriais")
        .getPublicUrl(filePath);

      // 3. Inserir registro no banco
      const { data: tutorial, error } = await supabase
        .from("tutoriais")
        .insert([
          {
            titulo: data.titulo,
            descricao: data.descricao,
            video_url: publicUrlData.publicUrl,
            categoria: data.categoria,
            usuario_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return tutorial;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutoriais"] });
      toast.success("Tutorial criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar tutorial:", error);
      toast.error("Erro ao criar tutorial. Tente novamente.");
    },
  });
};

export const useDeleteTutorial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tutoriais")
        .update({ ativo: false })
        .eq("id", id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutoriais"] });
      toast.success("Tutorial removido com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao remover tutorial:", error);
      toast.error("Erro ao remover tutorial. Tente novamente.");
    },
  });
};