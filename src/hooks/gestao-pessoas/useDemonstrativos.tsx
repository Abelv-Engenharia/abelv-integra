import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DemonstrativoPrestador } from "@/types/gestao-pessoas/dashboard-prestadores";

interface FiltrosDemonstrativos {
  mesInicial?: string;
  mesFinal?: string;
  prestadorId?: string;
  ccaId?: number;
  empresa?: string;
  ativo?: boolean;
}

export function useDemonstrativos() {
  return useQuery({
    queryKey: ["prestadores-demonstrativos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prestadores_demonstrativos")
        .select("*")
        .eq("ativo", true)
        .order("mes", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapDemonstrativoFromDB);
    },
  });
}

export function useDemonstrativosFiltrados(filtros: FiltrosDemonstrativos) {
  return useQuery({
    queryKey: ["prestadores-demonstrativos-filtrados", filtros],
    queryFn: async () => {
      let query = supabase
        .from("prestadores_demonstrativos")
        .select("*")
        .eq("ativo", filtros.ativo ?? true);

      if (filtros.mesInicial) {
        query = query.gte("mes", filtros.mesInicial);
      }

      if (filtros.mesFinal) {
        query = query.lte("mes", filtros.mesFinal);
      }

      if (filtros.prestadorId) {
        query = query.eq("prestador_pj_id", filtros.prestadorId);
      }

      if (filtros.ccaId) {
        query = query.eq("cca_id", filtros.ccaId);
      }

      if (filtros.empresa) {
        query = query.ilike("nomeempresa", `%${filtros.empresa}%`);
      }

      const { data, error } = await query.order("mes", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapDemonstrativoFromDB);
    },
  });
}

export function useDemonstrativoById(id: string | undefined) {
  return useQuery({
    queryKey: ["prestador-demonstrativo", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("prestadores_demonstrativos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return mapDemonstrativoFromDB(data);
    },
    enabled: !!id,
  });
}

export function useDemonstrativosByPrestador(prestadorId: string | undefined) {
  return useQuery({
    queryKey: ["prestador-demonstrativos", prestadorId],
    queryFn: async () => {
      if (!prestadorId) return [];

      const { data, error } = await supabase
        .from("prestadores_demonstrativos")
        .select("*")
        .eq("prestador_pj_id", prestadorId)
        .eq("ativo", true)
        .order("mes", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapDemonstrativoFromDB);
    },
    enabled: !!prestadorId,
  });
}

export function useCreateDemonstrativo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (demonstrativo: Omit<DemonstrativoPrestador, "id">) => {
      const { data, error } = await supabase
        .from("prestadores_demonstrativos")
        .insert([mapDemonstrativoToDB(demonstrativo)])
        .select()
        .single();

      if (error) throw error;

      return mapDemonstrativoFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-demonstrativos"] });
      toast.success("Demonstrativo criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar demonstrativo: ${error.message}`);
    },
  });
}

export function useUpdateDemonstrativo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...demonstrativo }: Partial<DemonstrativoPrestador> & { id: string }) => {
      const { data, error } = await supabase
        .from("prestadores_demonstrativos")
        .update(mapDemonstrativoToDB(demonstrativo))
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapDemonstrativoFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-demonstrativos"] });
      toast.success("Demonstrativo atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar demonstrativo: ${error.message}`);
    },
  });
}

export function useDeleteDemonstrativo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prestadores_demonstrativos")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-demonstrativos"] });
      toast.success("Demonstrativo desativado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao desativar demonstrativo: ${error.message}`);
    },
  });
}

function mapDemonstrativoFromDB(data: any): DemonstrativoPrestador {
  return {
    id: data.id,
    codigo: data.codigo,
    nome: data.nome,
    obra: data.cca_nome || "",
    funcao: data.funcao,
    nomeempresa: data.nomeempresa,
    cpf: data.cpf,
    datanascimento: data.datanascimento,
    admissao: data.admissao,
    salario: data.salario,
    premiacaonexa: data.premiacaonexa,
    ajudacustoobra: data.ajudacustoobra,
    multasdescontos: data.multasdescontos,
    ajudaaluguel: data.ajudaaluguel,
    descontoconvenio: data.descontoconvenio,
    reembolsoconvenio: data.reembolsoconvenio,
    descontoabelvrun: data.descontoabelvrun,
    valornf: data.valornf,
    mes: data.mes,
    valorliquido: data.valorliquido,
  };
}

function mapDemonstrativoToDB(data: any): any {
  return {
    codigo: data.codigo,
    nome: data.nome,
    cpf: data.cpf,
    funcao: data.funcao,
    admissao: data.admissao,
    datanascimento: data.datanascimento,
    mes: data.mes,
    salario: data.salario,
    premiacaonexa: data.premiacaonexa,
    ajudacustoobra: data.ajudacustoobra,
    ajudaaluguel: data.ajudaaluguel,
    reembolsoconvenio: data.reembolsoconvenio,
    descontoconvenio: data.descontoconvenio,
    multasdescontos: data.multasdescontos,
    descontoabelvrun: data.descontoabelvrun,
    valornf: data.valornf,
    valorliquido: data.valorliquido,
    nomeempresa: data.nomeempresa,
    cca_id: data.ccaId,
    cca_codigo: data.ccaCodigo,
    cca_nome: data.obra,
    prestador_pj_id: data.prestadorId,
    contrato_id: data.contratoId,
    observacoes: data.observacoes,
    ativo: data.ativo ?? true,
  };
}
