import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Vaga, StatusVaga, StatusAprovacao, PrioridadeVaga, TipoContrato, MotivoAbertura, EtapaProcesso } from "@/types/gestao-pessoas/vaga";
import { Database } from "@/integrations/supabase/types";

// Usar Database Row type
type VagaDB = Database["public"]["Tables"]["recrutamento_vagas"]["Row"];

// Converter do banco para o frontend
function converterVagaDB(vaga: VagaDB): Vaga {
  return {
    id: vaga.id,
    numeroVaga: vaga.numero_vaga,
    cargo: vaga.cargo,
    area: vaga.area,
    setor: vaga.setor || undefined,
    tipoContrato: vaga.tipo_contrato as TipoContrato,
    jornadaTrabalho: vaga.jornada_trabalho,
    faixaSalarial: vaga.faixa_salarial || undefined,
    formacaoMinima: vaga.formacao_minima || undefined,
    experienciaDesejada: vaga.experiencia_desejada || undefined,
    hardSkills: vaga.hard_skills || [],
    softSkills: vaga.soft_skills || [],
    beneficios: vaga.beneficios || undefined,
    motivoAbertura: vaga.motivo_abertura as MotivoAbertura,
    status: vaga.status as StatusVaga,
    statusAprovacao: vaga.status_aprovacao as StatusAprovacao,
    prioridade: vaga.prioridade as PrioridadeVaga,
    gestor: vaga.gestor_responsavel,
    aprovador: vaga.aprovador || undefined,
    dataAprovacao: vaga.data_aprovacao ? new Date(vaga.data_aprovacao) : undefined,
    prazoMobilizacao: vaga.prazo_mobilizacao ? new Date(vaga.prazo_mobilizacao) : undefined,
    etapaAtual: vaga.etapa_atual as EtapaProcesso | undefined,
    observacoes: vaga.observacoes || undefined,
    candidatos: [] // Será preenchido por useVagasCandidatos
  };
}

// Buscar todas as vagas ativas
export function useVagas() {
  return useQuery({
    queryKey: ["vagas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recrutamento_vagas")
        .select("*")
        .eq("ativo", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(converterVagaDB);
    },
  });
}

// Buscar vaga por ID
export function useVagaById(id: string) {
  return useQuery({
    queryKey: ["vaga", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recrutamento_vagas")
        .select("*")
        .eq("id", id)
        .eq("ativo", true)
        .single();

      if (error) throw error;
      return converterVagaDB(data);
    },
    enabled: !!id,
  });
}

// Criar nova vaga
export function useCreateVaga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vaga: Partial<Vaga>) => {
      const vagaDB: Database["public"]["Tables"]["recrutamento_vagas"]["Insert"] = {
        numero_vaga: vaga.numeroVaga!,
        cargo: vaga.cargo!,
        area: vaga.area!,
        setor: vaga.setor!,
        cca_codigo: "000", // Valor padrão, ajustar conforme necessário
        cca_id: 1, // Valor padrão, ajustar conforme necessário
        cca_nome: "Padrão", // Valor padrão, ajustar conforme necessário
        tipo_contrato: vaga.tipoContrato!,
        jornada_trabalho: vaga.jornadaTrabalho!,
        faixa_salarial: vaga.faixaSalarial!,
        formacao_minima: vaga.formacaoMinima!,
        experiencia_desejada: vaga.experienciaDesejada!,
        hard_skills: vaga.hardSkills || [],
        soft_skills: vaga.softSkills || [],
        beneficios: vaga.beneficios,
        motivo_abertura: vaga.motivoAbertura!,
        local_trabalho: "", // Valor padrão
        prazo_mobilizacao: vaga.prazoMobilizacao?.toISOString()!,
        status: vaga.status || StatusVaga.SOLICITACAO_ABERTA,
        status_aprovacao: vaga.statusAprovacao || StatusAprovacao.PENDENTE,
        prioridade: vaga.prioridade || PrioridadeVaga.MEDIA,
        gestor_responsavel: vaga.gestor!,
        aprovador: vaga.aprovador!,
        etapa_atual: vaga.etapaAtual,
        observacoes: vaga.observacoes,
      };

      const { data, error } = await supabase
        .from("recrutamento_vagas")
        .insert(vagaDB)
        .select()
        .single();

      if (error) throw error;
      return converterVagaDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      toast({
        title: "Vaga criada",
        description: "A vaga foi criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar vaga",
        description: "Não foi possível criar a vaga.",
        variant: "destructive",
      });
    },
  });
}

// Atualizar vaga
export function useUpdateVaga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, vaga }: { id: string; vaga: Partial<Vaga> }) => {
      const vagaDB: Database["public"]["Tables"]["recrutamento_vagas"]["Update"] = {};
      
      if (vaga.numeroVaga) vagaDB.numero_vaga = vaga.numeroVaga;
      if (vaga.cargo) vagaDB.cargo = vaga.cargo;
      if (vaga.area) vagaDB.area = vaga.area;
      if (vaga.setor !== undefined) vagaDB.setor = vaga.setor;
      if (vaga.tipoContrato) vagaDB.tipo_contrato = vaga.tipoContrato;
      if (vaga.jornadaTrabalho) vagaDB.jornada_trabalho = vaga.jornadaTrabalho;
      if (vaga.faixaSalarial !== undefined) vagaDB.faixa_salarial = vaga.faixaSalarial;
      if (vaga.hardSkills) vagaDB.hard_skills = vaga.hardSkills;
      if (vaga.softSkills) vagaDB.soft_skills = vaga.softSkills;
      if (vaga.status) vagaDB.status = vaga.status;
      if (vaga.statusAprovacao) vagaDB.status_aprovacao = vaga.statusAprovacao;
      if (vaga.prioridade) vagaDB.prioridade = vaga.prioridade;
      if (vaga.etapaAtual !== undefined) vagaDB.etapa_atual = vaga.etapaAtual;

      const { data, error } = await supabase
        .from("recrutamento_vagas")
        .update(vagaDB)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return converterVagaDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      toast({
        title: "Vaga atualizada",
        description: "A vaga foi atualizada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar vaga",
        description: "Não foi possível atualizar a vaga.",
        variant: "destructive",
      });
    },
  });
}

// Deletar vaga (soft delete)
export function useDeleteVaga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recrutamento_vagas")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      toast({
        title: "Vaga removida",
        description: "A vaga foi removida com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao remover vaga",
        description: "Não foi possível remover a vaga.",
        variant: "destructive",
      });
    },
  });
}
