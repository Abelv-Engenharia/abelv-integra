import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Candidato, OrigemCandidato, EtapaProcesso, StatusCandidato } from "@/types/gestao-pessoas/candidato";

// Tipo do banco de dados - usar Database Row type
import { Database } from "@/integrations/supabase/types";
type CandidatoDB = Database["public"]["Tables"]["recrutamento_candidatos"]["Row"];

// Converter do banco para o frontend
function converterCandidatoDB(candidato: CandidatoDB): Candidato {
  return {
    id: candidato.id,
    nomeCompleto: candidato.nome_completo,
    cargoVagaPretendida: candidato.cargo_vaga_pretendida,
    unidadeObra: candidato.cca_nome || candidato.cca_codigo || "", // CCA como unidade
    origemCandidato: candidato.origem_candidato as OrigemCandidato,
    dataCadastro: new Date(candidato.data_cadastro),
    telefone: candidato.telefone,
    email: candidato.email,
    cidadeEstado: candidato.cidade_estado,
    dataEntrevista: candidato.data_entrevista ? new Date(candidato.data_entrevista) : undefined,
    etapaProcesso: candidato.etapa_processo as EtapaProcesso,
    responsavelEtapa: candidato.responsavel_etapa,
    feedbackGestorRH: candidato.feedback_gestor_rh || undefined,
    motivoNaoContratacao: candidato.motivo_nao_contratacao || undefined,
    statusCandidato: candidato.status_candidato as StatusCandidato,
    dataUltimaAtualizacao: new Date(candidato.data_ultima_atualizacao),
    possibilidadeReaproveitamento: candidato.possibilidade_reaproveitamento || false,
    observacoesGerais: candidato.observacoes_gerais || undefined,
    curriculo: candidato.curriculo_url || undefined,
    faixaSalarial: candidato.faixa_salarial || undefined,
  };
}

// Buscar todos os candidatos ativos
export function useCandidatos() {
  return useQuery({
    queryKey: ["candidatos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recrutamento_candidatos")
        .select("*")
        .eq("ativo", true)
        .order("data_cadastro", { ascending: false });

      if (error) throw error;
      return (data as CandidatoDB[]).map(converterCandidatoDB);
    },
  });
}

// Buscar candidato por ID
export function useCandidatoById(id: string) {
  return useQuery({
    queryKey: ["candidato", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recrutamento_candidatos")
        .select("*")
        .eq("id", id)
        .eq("ativo", true)
        .single();

      if (error) throw error;
      return converterCandidatoDB(data as CandidatoDB);
    },
    enabled: !!id,
  });
}

// Criar novo candidato
export function useCreateCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidato: Partial<Candidato>) => {
      const candidatoDB: Database["public"]["Tables"]["recrutamento_candidatos"]["Insert"] = {
        nome_completo: candidato.nomeCompleto!,
        cargo_vaga_pretendida: candidato.cargoVagaPretendida!,
        origem_candidato: candidato.origemCandidato!,
        telefone: candidato.telefone!,
        email: candidato.email!,
        cidade_estado: candidato.cidadeEstado!,
        data_entrevista: candidato.dataEntrevista?.toISOString(),
        etapa_processo: candidato.etapaProcesso || EtapaProcesso.TRIAGEM_CURRICULAR,
        responsavel_etapa: candidato.responsavelEtapa || "RH",
        feedback_gestor_rh: candidato.feedbackGestorRH,
        motivo_nao_contratacao: candidato.motivoNaoContratacao,
        status_candidato: candidato.statusCandidato || StatusCandidato.DISPONIVEL,
        possibilidade_reaproveitamento: candidato.possibilidadeReaproveitamento ?? true,
        observacoes_gerais: candidato.observacoesGerais,
        curriculo_url: candidato.curriculo,
        faixa_salarial: candidato.faixaSalarial,
      };

      const { data, error } = await supabase
        .from("recrutamento_candidatos")
        .insert(candidatoDB)
        .select()
        .single();

      if (error) throw error;
      return converterCandidatoDB(data as CandidatoDB);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      toast({
        title: "Candidato cadastrado",
        description: "Candidato adicionado ao banco de talentos com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao cadastrar candidato",
        description: "Não foi possível cadastrar o candidato.",
        variant: "destructive",
      });
    },
  });
}

// Atualizar candidato
export function useUpdateCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, candidato }: { id: string; candidato: Partial<Candidato> }) => {
      const candidatoDB: Database["public"]["Tables"]["recrutamento_candidatos"]["Update"] = {};

      if (candidato.nomeCompleto) candidatoDB.nome_completo = candidato.nomeCompleto;
      if (candidato.cargoVagaPretendida) candidatoDB.cargo_vaga_pretendida = candidato.cargoVagaPretendida;
      if (candidato.origemCandidato) candidatoDB.origem_candidato = candidato.origemCandidato;
      if (candidato.telefone) candidatoDB.telefone = candidato.telefone;
      if (candidato.email) candidatoDB.email = candidato.email;
      if (candidato.cidadeEstado) candidatoDB.cidade_estado = candidato.cidadeEstado;
      if (candidato.dataEntrevista !== undefined) candidatoDB.data_entrevista = candidato.dataEntrevista?.toISOString() || null;
      if (candidato.etapaProcesso) candidatoDB.etapa_processo = candidato.etapaProcesso;
      if (candidato.responsavelEtapa) candidatoDB.responsavel_etapa = candidato.responsavelEtapa;
      if (candidato.feedbackGestorRH !== undefined) candidatoDB.feedback_gestor_rh = candidato.feedbackGestorRH || null;
      if (candidato.motivoNaoContratacao !== undefined) candidatoDB.motivo_nao_contratacao = candidato.motivoNaoContratacao || null;
      if (candidato.statusCandidato) candidatoDB.status_candidato = candidato.statusCandidato;
      if (candidato.possibilidadeReaproveitamento !== undefined) candidatoDB.possibilidade_reaproveitamento = candidato.possibilidadeReaproveitamento;
      if (candidato.observacoesGerais !== undefined) candidatoDB.observacoes_gerais = candidato.observacoesGerais || null;
      if (candidato.faixaSalarial !== undefined) candidatoDB.faixa_salarial = candidato.faixaSalarial || null;

      const { data, error } = await supabase
        .from("recrutamento_candidatos")
        .update(candidatoDB)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return converterCandidatoDB(data as CandidatoDB);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      toast({
        title: "Candidato atualizado",
        description: "Dados do candidato atualizados com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar candidato",
        description: "Não foi possível atualizar os dados do candidato.",
        variant: "destructive",
      });
    },
  });
}

// Deletar candidato (soft delete)
export function useDeleteCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recrutamento_candidatos")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      toast({
        title: "Candidato removido",
        description: "Candidato removido do banco de talentos.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao remover candidato",
        description: "Não foi possível remover o candidato.",
        variant: "destructive",
      });
    },
  });
}
