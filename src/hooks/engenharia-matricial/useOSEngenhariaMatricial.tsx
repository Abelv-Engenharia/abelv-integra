import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type OSRow = Database["public"]["Tables"]["os_engenharia_matricial"]["Row"];
type OSInsert = Database["public"]["Tables"]["os_engenharia_matricial"]["Insert"];
type OSUpdate = Database["public"]["Tables"]["os_engenharia_matricial"]["Update"];
type OSStatus = Database["public"]["Enums"]["os_status_enum"];

export type OSEngenhariaMatricial = OSRow & {
  cca?: { codigo: string; nome: string };
  responsavel_em?: { nome: string };
};

export interface CreateOSData {
  cca_id: number;
  disciplina: string;
  disciplinas_envolvidas: string[];
  familia_sao: string;
  descricao: string;
  valor_orcamento: number;
  data_compromissada: string;
  responsavel_em_id: string;
  solicitante_nome: string;
}

export interface UpdateOSData {
  id: string;
  data: OSUpdate;
}

interface OSFilters {
  status?: OSStatus;
  cca_id?: number;
  disciplina?: string;
  solicitante_id?: string;
  responsavel_em_id?: string;
}

// Hook para listar OS com filtros
export const useOSList = (filters?: OSFilters) => {
  return useQuery({
    queryKey: ["os-engenharia-matricial", filters],
    queryFn: async () => {
      let query = supabase
        .from("os_engenharia_matricial")
        .select(`
          *,
          cca:ccas(codigo, nome),
          responsavel_em:profiles!os_engenharia_matricial_responsavel_em_id_fkey(nome)
        `)
        .order("data_abertura", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.cca_id) {
        query = query.eq("cca_id", filters.cca_id);
      }
      if (filters?.disciplina) {
        query = query.eq("disciplina", filters.disciplina);
      }
      if (filters?.solicitante_id) {
        query = query.eq("solicitante_id", filters.solicitante_id);
      }
      if (filters?.responsavel_em_id) {
        query = query.eq("responsavel_em_id", filters.responsavel_em_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar OS:", error);
        throw error;
      }

      return data as OSEngenhariaMatricial[];
    },
    staleTime: 30000, // 30 segundos
  });
};

// Hook para buscar OS por ID
export const useOSById = (id?: string) => {
  return useQuery({
    queryKey: ["os-engenharia-matricial", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("os_engenharia_matricial")
        .select(`
          *,
          cca:ccas(codigo, nome),
          responsavel_em:profiles!os_engenharia_matricial_responsavel_em_id_fkey(nome)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar OS:", error);
        throw error;
      }

      return data as OSEngenhariaMatricial;
    },
    enabled: !!id,
  });
};

// Hook para criar OS
export const useCreateOS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (osData: CreateOSData) => {
      // Buscar ID do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Gerar número da OS
      const { data: numeroData, error: numeroError } = await supabase
        .rpc("gerar_numero_os", { p_cca_id: osData.cca_id });

      if (numeroError) {
        console.error("Erro ao gerar número da OS:", numeroError);
        throw numeroError;
      }

      // Criar OS
      const osInsert: OSInsert = {
        numero: numeroData,
        cca_id: osData.cca_id,
        cliente: "", // Cliente será preenchido futuramente
        disciplina: osData.disciplina,
        disciplinas_envolvidas: osData.disciplinas_envolvidas,
        familia_sao: osData.familia_sao,
        descricao: osData.descricao,
        status: "aberta" as OSStatus,
        valor_orcamento: osData.valor_orcamento,
        hh_planejado: 0,
        hh_adicional: 0,
        valor_hora_hh: 95.00,
        data_compromissada: osData.data_compromissada,
        competencia: "",
        responsavel_obra: "",
        responsavel_em_id: osData.responsavel_em_id,
        sla_status: "no-prazo",
        data_abertura: new Date().toISOString().split("T")[0],
        solicitante_id: user.id,
        solicitante_nome: osData.solicitante_nome,
      };

      const { data, error } = await supabase
        .from("os_engenharia_matricial")
        .insert(osInsert)
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar OS:", error);
        throw error;
      }

      return data as OSEngenhariaMatricial;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["os-engenharia-matricial"] });
      toast.success("OS criada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao criar OS:", error);
      toast.error("Erro ao criar OS: " + error.message);
    },
  });
};

// Hook para atualizar OS
export const useUpdateOS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateOSData) => {
      const { data: updatedData, error } = await supabase
        .from("os_engenharia_matricial")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar OS:", error);
        throw error;
      }

      return updatedData as OSEngenhariaMatricial;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["os-engenharia-matricial"] });
      toast.success("OS atualizada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar OS:", error);
      toast.error("Erro ao atualizar OS: " + error.message);
    },
  });
};

// Hook para deletar OS
export const useDeleteOS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("os_engenharia_matricial")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao deletar OS:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["os-engenharia-matricial"] });
      toast.success("OS deletada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao deletar OS:", error);
      toast.error("Erro ao deletar OS: " + error.message);
    },
  });
};

// Hook para avançar fase da OS
export const useAvancarFaseOS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dadosAdicionais }: { id: string; dadosAdicionais?: any }) => {
      // Buscar OS atual
      const { data: osAtual, error: osError } = await supabase
        .from("os_engenharia_matricial")
        .select("*")
        .eq("id", id)
        .single();

      if (osError) throw osError;

      let novoStatus: OSStatus = osAtual.status;
      const updates: OSUpdate = {};

      // Determinar próximo status
      switch (osAtual.status) {
        case "aberta":
          novoStatus = "em-planejamento";
          break;
        case "em-planejamento":
          novoStatus = "aguardando-aceite";
          if (dadosAdicionais?.planejamento) {
            updates.data_inicio_prevista = dadosAdicionais.planejamento.dataInicioPrevista;
            updates.data_fim_prevista = dadosAdicionais.planejamento.dataFimPrevista;
            updates.hh_planejado = dadosAdicionais.planejamento.hhPlanejado;
            updates.hh_adicional = dadosAdicionais.planejamento.hhAdicional || 0;
            if (typeof dadosAdicionais.planejamento.valorOrcamento === 'number') {
              updates.valor_orcamento = dadosAdicionais.planejamento.valorOrcamento;
            }
          }
          break;
        case "aguardando-aceite":
          novoStatus = "em-execucao";
          break;
        case "em-execucao":
          novoStatus = "aguardando-aceite-fechamento";
          updates.data_conclusao = new Date().toISOString();
          break;
        case "aguardando-aceite-fechamento":
          novoStatus = "concluida";
          break;
      }

      // Atualizar OS
      const updateData: OSUpdate = { status: novoStatus, ...updates };
      const { data, error } = await supabase
        .from("os_engenharia_matricial")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["os-engenharia-matricial"] });
      toast.success("Fase avançada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao avançar fase:", error);
      toast.error("Erro ao avançar fase: " + error.message);
    },
  });
};

// Hook para finalizar OS
export const useFinalizarOS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      valorEngenharia,
      valorSuprimentos,
      dataConclusao,
      justificativaEngenharia,
    }: {
      id: string;
      valorEngenharia: string;
      valorSuprimentos: string;
      dataConclusao?: string;
      justificativaEngenharia?: string;
    }) => {
      // Buscar OS atual
      const { data: osAtual } = await supabase
        .from("os_engenharia_matricial")
        .select("*")
        .eq("id", id)
        .single();

      if (!osAtual) throw new Error("OS não encontrada");

      const dataFinal = dataConclusao ? new Date(dataConclusao).toISOString() : new Date().toISOString();
      const dataConclusaoObj = new Date(dataFinal);
      const mes = String(dataConclusaoObj.getMonth() + 1).padStart(2, "0");
      const ano = dataConclusaoObj.getFullYear();
      const competenciaFinal = `${mes}/${ano}`;

      const valorEngenhariaNum = parseFloat(valorEngenharia) || 0;
      const valorSuprimentosNum = parseFloat(valorSuprimentos) || 0;
      const percentualSaving = osAtual.valor_orcamento > 0
        ? ((osAtual.valor_orcamento - valorSuprimentosNum) / osAtual.valor_orcamento) * 100
        : 0;

      const { data, error } = await supabase
        .from("os_engenharia_matricial")
        .update({
          status: "aguardando-aceite-fechamento",
          data_conclusao: dataFinal,
          data_entrega_real: dataFinal,
          valor_sao: osAtual.valor_orcamento,
          valor_engenharia: valorEngenhariaNum,
          valor_suprimentos: valorSuprimentosNum,
          justificativa_engenharia: justificativaEngenharia || null,
          valor_final: valorSuprimentosNum,
          percentual_saving: percentualSaving,
          competencia: competenciaFinal,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["os-engenharia-matricial"] });
      toast.success("OS finalizada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao finalizar OS:", error);
      toast.error("Erro ao finalizar OS: " + error.message);
    },
  });
};
