import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ChecklistFotoMetadata {
  posicao: number;
  posicao_nome: string;
  arquivo_nome: string;
  arquivo_path: string;
  arquivo_tamanho: number;
}

export interface VeiculoChecklistInsert {
  data_checklist: string; // YYYY-MM-DD
  placa: string;
  veiculo_id?: string | null;
  marca_modelo: string;
  condutor_nome: string;
  condutor_id?: string | null;
  tipo_operacao: "Retirada" | "Devolução";
  nivel_combustivel?: string | null;
  hodometro?: number | null;
  observacoes?: string | null;
  observacoes_detalhadas?: string | null;
  status: "Concluído" | "Pendente";
  data_limite?: string | null;
  tentativas_cobranca?: number;
  fotos_metadata?: any;
}

export interface VeiculoChecklist extends VeiculoChecklistInsert {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export function useVeiculosChecklists() {
  const queryClient = useQueryClient();

  // Listar checklists
  const { data: checklists, isLoading } = useQuery({
    queryKey: ["veiculos-checklists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("veiculos_checklists")
        .select("*")
        .order("data_checklist", { ascending: false });

      if (error) throw error;
      return data as VeiculoChecklist[];
    },
  });

  // Criar checklist com upload de fotos
  const criarChecklist = useMutation({
    mutationFn: async ({
      checklist,
      fotos,
    }: {
      checklist: VeiculoChecklistInsert;
      fotos: { [posicao: number]: File[] };
    }) => {
      // 1. Upload das fotos para Supabase Storage
      const fotosMetadata: ChecklistFotoMetadata[] = [];
      const checklistId = crypto.randomUUID();

      for (const [posicao, arquivos] of Object.entries(fotos)) {
        for (const arquivo of arquivos) {
          const timestamp = Date.now();
          const fileName = `${checklistId}/${posicao}/${timestamp}_${arquivo.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from("veiculos-checklists-fotos")
            .upload(fileName, arquivo, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw new Error(`Erro ao fazer upload da foto: ${uploadError.message}`);
          }

          fotosMetadata.push({
            posicao: parseInt(posicao),
            posicao_nome: arquivo.name.split(".")[0],
            arquivo_nome: arquivo.name,
            arquivo_path: fileName,
            arquivo_tamanho: arquivo.size,
          });
        }
      }

      // 2. Inserir checklist no banco com metadata das fotos
      const { data, error } = await supabase
        .from("veiculos_checklists")
        .insert([{
          id: checklistId,
          ...checklist,
          fotos_metadata: fotosMetadata as any,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["veiculos-checklists"] });
      toast({
        title: "Checklist criado!",
        description: "O checklist foi salvo com sucesso no banco de dados.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar checklist",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Obter URL da foto
  const obterUrlFoto = async (path: string): Promise<string | null> => {
    const { data } = await supabase.storage
      .from("veiculos-checklists-fotos")
      .createSignedUrl(path, 3600); // 1 hora

    return data?.signedUrl || null;
  };

  // Atualizar status
  const atualizarStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "Concluído" | "Pendente";
    }) => {
      const { data, error } = await supabase
        .from("veiculos_checklists")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["veiculos-checklists"] });
      toast({
        title: "Status atualizado",
        description: "O status do checklist foi atualizado.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    checklists,
    isLoading,
    criarChecklist: criarChecklist.mutate,
    isCreating: criarChecklist.isPending,
    atualizarStatus: atualizarStatus.mutate,
    obterUrlFoto,
  };
}
