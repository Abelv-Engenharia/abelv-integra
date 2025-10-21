import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type EtapaSLADB = Database["public"]["Tables"]["recrutamento_etapas_sla"]["Row"];

// Buscar etapas SLA de uma vaga
export function useEtapasSLAByVaga(vagaId: string) {
  return useQuery({
    queryKey: ["etapas-sla", vagaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recrutamento_etapas_sla")
        .select("*")
        .eq("vaga_id", vagaId)
        .order("ordem", { ascending: true });

      if (error) throw error;
      return data as EtapaSLADB[];
    },
    enabled: !!vagaId,
  });
}

// Buscar todas as etapas SLA
export function useTodasEtapasSLA() {
  return useQuery({
    queryKey: ["etapas-sla"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recrutamento_etapas_sla")
        .select(`
          *,
          vaga:recrutamento_vagas(
            numero_vaga,
            cargo,
            area,
            status,
            prioridade
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Criar etapa SLA
export function useCreateEtapaSLA() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (etapa: Database["public"]["Tables"]["recrutamento_etapas_sla"]["Insert"]) => {
      const { data, error } = await supabase
        .from("recrutamento_etapas_sla")
        .insert(etapa)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["etapas-sla", data.vaga_id] });
      queryClient.invalidateQueries({ queryKey: ["etapas-sla"] });
    },
  });
}

// Atualizar etapa SLA
export function useUpdateEtapaSLA() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      vagaId,
      updates,
    }: {
      id: string;
      vagaId: string;
      updates: Database["public"]["Tables"]["recrutamento_etapas_sla"]["Update"];
    }) => {
      const { data, error } = await supabase
        .from("recrutamento_etapas_sla")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["etapas-sla", variables.vagaId] });
      queryClient.invalidateQueries({ queryKey: ["etapas-sla"] });
      toast({
        title: "Etapa atualizada",
        description: "Status da etapa SLA atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar etapa",
        description: "Não foi possível atualizar a etapa SLA.",
        variant: "destructive",
      });
    },
  });
}
