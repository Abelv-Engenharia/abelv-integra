import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type VagaCandidatoDB = {
  id: string;
  vaga_id: string;
  candidato_id: string;
  status: string;
  data_aplicacao: string;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
};

// Buscar candidatos de uma vaga
export function useCandidatosByVaga(vagaId: string) {
  return useQuery({
    queryKey: ["vagas-candidatos", vagaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recrutamento_vagas_candidatos")
        .select(`
          *,
          candidato:recrutamento_candidatos(*)
        `)
        .eq("vaga_id", vagaId);

      if (error) throw error;
      return data;
    },
    enabled: !!vagaId,
  });
}

// Vincular candidato à vaga
export function useVincularCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vagaId,
      candidatoId,
      status,
      observacoes,
    }: {
      vagaId: string;
      candidatoId: string;
      status: string;
      observacoes?: string;
    }) => {
      const { data, error } = await supabase
        .from("recrutamento_vagas_candidatos")
        .insert({
          vaga_id: vagaId,
          candidato_id: candidatoId,
          status,
          observacoes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vagas-candidatos", variables.vagaId] });
      toast({
        title: "Candidato vinculado",
        description: "Candidato vinculado à vaga com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao vincular candidato",
        description: "Não foi possível vincular o candidato à vaga.",
        variant: "destructive",
      });
    },
  });
}

// Desvincular candidato da vaga
export function useDesvincularCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vagaId, candidatoId }: { vagaId: string; candidatoId: string }) => {
      const { error } = await supabase
        .from("recrutamento_vagas_candidatos")
        .delete()
        .eq("vaga_id", vagaId)
        .eq("candidato_id", candidatoId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vagas-candidatos", variables.vagaId] });
      toast({
        title: "Candidato desvinculado",
        description: "Candidato desvinculado da vaga com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao desvincular candidato",
        description: "Não foi possível desvincular o candidato da vaga.",
        variant: "destructive",
      });
    },
  });
}

// Atualizar status do candidato na vaga
export function useAtualizarStatusCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vagaId,
      candidatoId,
      status,
      observacoes,
    }: {
      vagaId: string;
      candidatoId: string;
      status: string;
      observacoes?: string;
    }) => {
      const { data, error } = await supabase
        .from("recrutamento_vagas_candidatos")
        .update({ status, observacoes })
        .eq("vaga_id", vagaId)
        .eq("candidato_id", candidatoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vagas-candidatos", variables.vagaId] });
      toast({
        title: "Status atualizado",
        description: "Status do candidato atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do candidato.",
        variant: "destructive",
      });
    },
  });
}
