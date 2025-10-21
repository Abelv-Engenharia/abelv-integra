import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TipoContrato, ContratoEmitido } from "@/types/gestao-pessoas/contrato";

interface FiltrosContratos {
  status?: string;
  tipo?: TipoContrato;
  prestadorId?: string;
  empresa?: string;
  ccaId?: number;
  ativo?: boolean;
}

export function useContratos() {
  return useQuery({
    queryKey: ["prestadores-contratos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prestadores_contratos")
        .select("*")
        .eq("ativo", true)
        .order("dataemissao", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapContratoFromDB);
    },
  });
}

export function useContratosFiltrados(filtros: FiltrosContratos) {
  return useQuery({
    queryKey: ["prestadores-contratos-filtrados", filtros],
    queryFn: async () => {
      let query = supabase
        .from("prestadores_contratos")
        .select("*")
        .eq("ativo", filtros.ativo ?? true);

      if (filtros.status) {
        query = query.eq("status", filtros.status);
      }

      if (filtros.tipo) {
        query = query.eq("tipo", filtros.tipo);
      }

      if (filtros.prestadorId) {
        query = query.eq("prestador_pj_id", filtros.prestadorId);
      }

      if (filtros.empresa) {
        query = query.ilike("empresa", `%${filtros.empresa}%`);
      }

      if (filtros.ccaId) {
        query = query.eq("cca_id", filtros.ccaId);
      }

      const { data, error } = await query.order("dataemissao", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapContratoFromDB);
    },
  });
}

export function useContratoById(id: string | undefined) {
  return useQuery({
    queryKey: ["prestador-contrato", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("prestadores_contratos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return mapContratoFromDB(data);
    },
    enabled: !!id,
  });
}

export function useContratosByPrestador(prestadorId: string | undefined) {
  return useQuery({
    queryKey: ["prestador-contratos", prestadorId],
    queryFn: async () => {
      if (!prestadorId) return [];

      const { data, error } = await supabase
        .from("prestadores_contratos")
        .select("*")
        .eq("prestador_pj_id", prestadorId)
        .eq("ativo", true)
        .order("dataemissao", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapContratoFromDB);
    },
    enabled: !!prestadorId,
  });
}

export function useCreateContrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contrato: Omit<ContratoEmitido, "id">) => {
      const { data, error } = await supabase
        .from("prestadores_contratos")
        .insert([mapContratoToDB(contrato)])
        .select()
        .single();

      if (error) throw error;

      return mapContratoFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-contratos"] });
      toast.success("Contrato criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar contrato: ${error.message}`);
    },
  });
}

export function useUpdateContrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...contrato }: Partial<ContratoEmitido> & { id: string }) => {
      const { data, error } = await supabase
        .from("prestadores_contratos")
        .update(mapContratoToDB(contrato))
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapContratoFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-contratos"] });
      toast.success("Contrato atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar contrato: ${error.message}`);
    },
  });
}

export function useDeleteContrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prestadores_contratos")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-contratos"] });
      toast.success("Contrato desativado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao desativar contrato: ${error.message}`);
    },
  });
}

function mapContratoFromDB(data: any): ContratoEmitido {
  return {
    id: data.id,
    numero: data.numero,
    tipo: data.tipo,
    prestador: data.prestador_nome,
    cpf: data.prestador_cpf,
    cnpj: data.prestador_cnpj,
    servico: data.servico,
    valor: data.valor,
    dataemissao: data.dataemissao,
    datainicio: data.datainicio,
    datafim: data.datafim,
    status: data.status,
    empresa: data.empresa,
    obra: data.cca_nome || "",
  };
}

function mapContratoToDB(data: any): any {
  return {
    numero: data.numero,
    tipo: data.tipo,
    prestador_pj_id: data.prestadorId,
    prestador_nome: data.prestador,
    prestador_cpf: data.cpf,
    prestador_cnpj: data.cnpj,
    servico: data.servico,
    valor: data.valor,
    dataemissao: data.dataemissao,
    datainicio: data.datainicio,
    datafim: data.datafim,
    status: data.status,
    empresa: data.empresa,
    cca_id: data.ccaId,
    cca_codigo: data.ccaCodigo,
    cca_nome: data.obra,
    contrato_url: data.contratoUrl,
    contrato_nome: data.contratoNome,
    observacoes: data.observacoes,
    ativo: data.ativo ?? true,
  };
}
