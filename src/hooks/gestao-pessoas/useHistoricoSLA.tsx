import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type HistoricoSLADB = Database["public"]["Tables"]["recrutamento_historico_sla"]["Row"];

// Buscar histórico de uma etapa
export function useHistoricoByEtapa(etapaId: string) {
  return useQuery({
    queryKey: ["historico-sla", etapaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recrutamento_historico_sla")
        .select("*")
        .eq("etapa_sla_id", etapaId)
        .order("data_alteracao", { ascending: false });

      if (error) throw error;
      return data as HistoricoSLADB[];
    },
    enabled: !!etapaId,
  });
}

// Criar registro de histórico
export function useCreateHistorico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (historico: Database["public"]["Tables"]["recrutamento_historico_sla"]["Insert"]) => {
      const { data, error } = await supabase
        .from("recrutamento_historico_sla")
        .insert(historico)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["historico-sla", data.etapa_sla_id] });
    },
  });
}
