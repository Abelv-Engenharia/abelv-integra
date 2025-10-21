import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ControleFérias, StatusFerias } from "@/types/gestao-pessoas/ferias";

interface FiltrosFerias {
  status?: StatusFerias;
  periodoInicial?: Date;
  periodoFinal?: Date;
  prestadorId?: string;
  ccaId?: number;
  ativo?: boolean;
}

export function useFerias() {
  return useQuery({
    queryKey: ["prestadores-ferias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prestadores_ferias")
        .select("*")
        .eq("ativo", true)
        .order("datainicioferias", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapFeriasFromDB);
    },
  });
}

export function useFeriasFiltradas(filtros: FiltrosFerias) {
  return useQuery({
    queryKey: ["prestadores-ferias-filtradas", filtros],
    queryFn: async () => {
      let query = supabase
        .from("prestadores_ferias")
        .select("*")
        .eq("ativo", filtros.ativo ?? true);

      if (filtros.status) {
        query = query.eq("status", filtros.status);
      }

      if (filtros.periodoInicial) {
        query = query.gte("datainicioferias", filtros.periodoInicial.toISOString());
      }

      if (filtros.periodoFinal) {
        query = query.lte("datainicioferias", filtros.periodoFinal.toISOString());
      }

      if (filtros.prestadorId) {
        query = query.eq("prestador_pj_id", filtros.prestadorId);
      }

      if (filtros.ccaId) {
        query = query.eq("cca_id", filtros.ccaId);
      }

      const { data, error } = await query.order("datainicioferias", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapFeriasFromDB);
    },
  });
}

export function useFeriasById(id: string | undefined) {
  return useQuery({
    queryKey: ["prestador-ferias", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("prestadores_ferias")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return mapFeriasFromDB(data);
    },
    enabled: !!id,
  });
}

export function useFeriasByPrestador(prestadorId: string | undefined) {
  return useQuery({
    queryKey: ["prestador-ferias-list", prestadorId],
    queryFn: async () => {
      if (!prestadorId) return [];

      const { data, error } = await supabase
        .from("prestadores_ferias")
        .select("*")
        .eq("prestador_pj_id", prestadorId)
        .eq("ativo", true)
        .order("datainicioferias", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapFeriasFromDB);
    },
    enabled: !!prestadorId,
  });
}

export function useCreateFerias() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ferias: Omit<ControleFérias, "id" | "dataCriacao" | "dataUltimaAtualizacao" | "historicoStatus">) => {
      const { data, error } = await supabase
        .from("prestadores_ferias")
        .insert([mapFeriasToDB(ferias)])
        .select()
        .single();

      if (error) throw error;

      return mapFeriasFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-ferias"] });
      toast.success("Solicitação de férias criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar férias: ${error.message}`);
    },
  });
}

export function useUpdateFerias() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...ferias }: Partial<ControleFérias> & { id: string }) => {
      const { data, error } = await supabase
        .from("prestadores_ferias")
        .update(mapFeriasToDB(ferias))
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapFeriasFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-ferias"] });
      toast.success("Férias atualizadas com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar férias: ${error.message}`);
    },
  });
}

export function useAprovarFerias() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, aprovadoPor }: { id: string; aprovadoPor: string }) => {
      const { data, error } = await supabase
        .from("prestadores_ferias")
        .update({
          status: StatusFerias.APROVADO,
          aprovadopor: aprovadoPor,
          dataaprovacao: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapFeriasFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-ferias"] });
      toast.success("Férias aprovadas com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao aprovar férias: ${error.message}`);
    },
  });
}

export function useReprovarFerias() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, justificativa }: { id: string; justificativa: string }) => {
      const { data, error } = await supabase
        .from("prestadores_ferias")
        .update({
          status: StatusFerias.REPROVADO,
          justificativareprovacao: justificativa,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapFeriasFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-ferias"] });
      toast.success("Férias reprovadas!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao reprovar férias: ${error.message}`);
    },
  });
}

export function useDeleteFerias() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prestadores_ferias")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-ferias"] });
      toast.success("Férias desativadas com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao desativar férias: ${error.message}`);
    },
  });
}

function mapFeriasFromDB(data: any): ControleFérias {
  return {
    id: data.id,
    nomePrestador: data.nomeprestador,
    empresa: data.empresa,
    funcaoCargo: data.funcaocargo,
    obraLocalAtuacao: data.cca_nome || "",
    dataInicioFerias: new Date(data.datainicioferias),
    periodoAquisitivo: data.periodoaquisitivo,
    diasFerias: data.diasferias,
    responsavelRegistro: data.responsavelregistro,
    responsavelDireto: data.responsaveldireto,
    observacoes: data.observacoes,
    anexos: data.anexos || [],
    status: data.status,
    justificativaReprovacao: data.justificativareprovacao,
    dataAprovacao: data.dataaprovacao ? new Date(data.dataaprovacao) : undefined,
    dataCriacao: new Date(data.created_at),
    dataUltimaAtualizacao: new Date(data.updated_at),
    historicoStatus: [],
  };
}

function mapFeriasToDB(data: any): any {
  return {
    nomeprestador: data.nomePrestador,
    funcaocargo: data.funcaoCargo,
    empresa: data.empresa,
    datainicioferias: data.dataInicioFerias instanceof Date ? data.dataInicioFerias.toISOString() : data.dataInicioFerias,
    diasferias: data.diasFerias,
    periodoaquisitivo: data.periodoAquisitivo,
    responsaveldireto: data.responsavelDireto,
    responsavelregistro: data.responsavelRegistro,
    status: data.status || StatusFerias.SOLICITADO,
    aprovadopor: data.aprovadoPor,
    dataaprovacao: data.dataAprovacao instanceof Date ? data.dataAprovacao.toISOString() : data.dataAprovacao,
    justificativareprovacao: data.justificativaReprovacao,
    anexos: data.anexos,
    observacoes: data.observacoes,
    cca_id: data.ccaId,
    cca_codigo: data.ccaCodigo,
    cca_nome: data.obraLocalAtuacao,
    prestador_pj_id: data.prestadorId,
    contrato_id: data.contratoId,
    ativo: data.ativo ?? true,
  };
}
