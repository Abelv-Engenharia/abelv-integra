import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ControlePassivos, StatusPassivo } from "@/types/gestao-pessoas/passivos";

interface FiltrosPassivos {
  status?: StatusPassivo;
  prestadorId?: string;
  ccaId?: number;
  empresa?: string;
  ativo?: boolean;
}

export function usePassivos() {
  return useQuery({
    queryKey: ["prestadores-passivos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prestadores_passivos")
        .select("*")
        .eq("ativo", true)
        .order("datacorte", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapPassivoFromDB);
    },
  });
}

export function usePassivosFiltrados(filtros: FiltrosPassivos) {
  return useQuery({
    queryKey: ["prestadores-passivos-filtrados", filtros],
    queryFn: async () => {
      let query = supabase
        .from("prestadores_passivos")
        .select("*")
        .eq("ativo", filtros.ativo ?? true);

      if (filtros.status) {
        query = query.eq("status", filtros.status);
      }

      if (filtros.prestadorId) {
        query = query.eq("prestador_pj_id", filtros.prestadorId);
      }

      if (filtros.ccaId) {
        query = query.eq("cca_id", filtros.ccaId);
      }

      if (filtros.empresa) {
        query = query.ilike("empresa", `%${filtros.empresa}%`);
      }

      const { data, error } = await query.order("datacorte", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapPassivoFromDB);
    },
  });
}

export function usePassivoById(id: string | undefined) {
  return useQuery({
    queryKey: ["prestador-passivo", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("prestadores_passivos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return mapPassivoFromDB(data);
    },
    enabled: !!id,
  });
}

export function usePassivosByPrestador(prestadorId: string | undefined) {
  return useQuery({
    queryKey: ["prestador-passivos-list", prestadorId],
    queryFn: async () => {
      if (!prestadorId) return [];

      const { data, error } = await supabase
        .from("prestadores_passivos")
        .select("*")
        .eq("prestador_pj_id", prestadorId)
        .eq("ativo", true)
        .order("datacorte", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapPassivoFromDB);
    },
    enabled: !!prestadorId,
  });
}

export function useCreatePassivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (passivo: Omit<ControlePassivos, "id" | "datacriacao" | "dataatualizacao" | "historico">) => {
      const { data, error } = await supabase
        .from("prestadores_passivos")
        .insert([mapPassivoToDB(passivo)])
        .select()
        .single();

      if (error) throw error;

      return mapPassivoFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-passivos"] });
      toast.success("Passivo criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar passivo: ${error.message}`);
    },
  });
}

export function useUpdatePassivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...passivo }: Partial<ControlePassivos> & { id: string }) => {
      const { data, error } = await supabase
        .from("prestadores_passivos")
        .update(mapPassivoToDB(passivo))
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapPassivoFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-passivos"] });
      toast.success("Passivo atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar passivo: ${error.message}`);
    },
  });
}

export function useQuitarPassivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("prestadores_passivos")
        .update({ status: "quitado" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapPassivoFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-passivos"] });
      toast.success("Passivo quitado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao quitar passivo: ${error.message}`);
    },
  });
}

export function useDeletePassivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prestadores_passivos")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-passivos"] });
      toast.success("Passivo desativado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao desativar passivo: ${error.message}`);
    },
  });
}

function mapPassivoFromDB(data: any): ControlePassivos {
  return {
    id: data.id,
    prestadorid: data.prestador_pj_id,
    nomeprestador: data.nomeprestador,
    empresa: data.empresa,
    cargo: data.cargo,
    salariobase: data.salariobase,
    dataadmissao: new Date(data.dataadmissao),
    datacorte: new Date(data.datacorte),
    saldoferias: data.saldoferias,
    decimoterceiro: data.decimoterceiro,
    avisopravio: data.avisopravio,
    total: data.total,
    status: data.status,
    observacoes: data.observacoes,
    datacriacao: new Date(data.created_at),
    dataatualizacao: new Date(data.updated_at),
  };
}

function mapPassivoToDB(data: any): any {
  return {
    prestador_pj_id: data.prestadorid,
    nomeprestador: data.nomeprestador,
    empresa: data.empresa,
    cargo: data.cargo,
    salariobase: data.salariobase,
    dataadmissao: data.dataadmissao instanceof Date ? data.dataadmissao.toISOString() : data.dataadmissao,
    datacorte: data.datacorte instanceof Date ? data.datacorte.toISOString() : data.datacorte,
    saldoferias: data.saldoferias,
    decimoterceiro: data.decimoterceiro,
    avisopravio: data.avisopravio,
    total: data.total,
    status: data.status || "pendente",
    observacoes: data.observacoes,
    cca_id: data.ccaId,
    cca_codigo: data.ccaCodigo,
    cca_nome: data.ccaNome,
    contrato_id: data.contratoId,
    ativo: data.ativo ?? true,
  };
}
