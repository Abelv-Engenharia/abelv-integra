import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NotaFiscal } from "@/types/gestao-pessoas/nf";

interface FiltrosNotasFiscais {
  status?: string;
  statusAprovacao?: string;
  periodoInicial?: string;
  periodoFinal?: string;
  prestadorId?: string;
  ccaId?: number;
  ativo?: boolean;
}

export function useNotasFiscais() {
  return useQuery({
    queryKey: ["prestadores-notas-fiscais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prestadores_notas_fiscais")
        .select("*")
        .eq("ativo", true)
        .order("dataemissao", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapNotaFiscalFromDB);
    },
  });
}

export function useNotasFiscaisFiltradas(filtros: FiltrosNotasFiscais) {
  return useQuery({
    queryKey: ["prestadores-notas-fiscais-filtradas", filtros],
    queryFn: async () => {
      let query = supabase
        .from("prestadores_notas_fiscais")
        .select("*")
        .eq("ativo", filtros.ativo ?? true);

      if (filtros.status) {
        query = query.eq("status", filtros.status);
      }

      if (filtros.statusAprovacao) {
        query = query.eq("statusaprovacao", filtros.statusAprovacao);
      }

      if (filtros.periodoInicial) {
        query = query.gte("periodocontabil", filtros.periodoInicial);
      }

      if (filtros.periodoFinal) {
        query = query.lte("periodocontabil", filtros.periodoFinal);
      }

      if (filtros.prestadorId) {
        query = query.eq("prestador_pj_id", filtros.prestadorId);
      }

      if (filtros.ccaId) {
        query = query.eq("cca_id", filtros.ccaId);
      }

      const { data, error } = await query.order("dataemissao", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapNotaFiscalFromDB);
    },
  });
}

export function useNotaFiscalById(id: string | undefined) {
  return useQuery({
    queryKey: ["prestador-nota-fiscal", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("prestadores_notas_fiscais")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return mapNotaFiscalFromDB(data);
    },
    enabled: !!id,
  });
}

export function useNotasFiscaisByPrestador(prestadorId: string | undefined) {
  return useQuery({
    queryKey: ["prestador-notas-fiscais", prestadorId],
    queryFn: async () => {
      if (!prestadorId) return [];

      const { data, error } = await supabase
        .from("prestadores_notas_fiscais")
        .select("*")
        .eq("prestador_pj_id", prestadorId)
        .eq("ativo", true)
        .order("dataemissao", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapNotaFiscalFromDB);
    },
    enabled: !!prestadorId,
  });
}

export function useCreateNotaFiscal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notaFiscal: Omit<NotaFiscal, "id" | "criadoem">) => {
      const { data, error } = await supabase
        .from("prestadores_notas_fiscais")
        .insert([mapNotaFiscalToDB(notaFiscal)])
        .select()
        .single();

      if (error) throw error;

      return mapNotaFiscalFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-notas-fiscais"] });
      toast.success("Nota fiscal criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar nota fiscal: ${error.message}`);
    },
  });
}

export function useUpdateNotaFiscal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...notaFiscal }: Partial<NotaFiscal> & { id: string }) => {
      const { data, error } = await supabase
        .from("prestadores_notas_fiscais")
        .update(mapNotaFiscalToDB(notaFiscal))
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapNotaFiscalFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-notas-fiscais"] });
      toast.success("Nota fiscal atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar nota fiscal: ${error.message}`);
    },
  });
}

export function useAprovarNotaFiscal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, aprovadoPor }: { id: string; aprovadoPor: string }) => {
      const { data, error } = await supabase
        .from("prestadores_notas_fiscais")
        .update({
          statusaprovacao: "Aprovado",
          aprovadopor: aprovadoPor,
          dataaprovacao: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapNotaFiscalFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-notas-fiscais"] });
      toast.success("Nota fiscal aprovada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao aprovar nota fiscal: ${error.message}`);
    },
  });
}

export function useReprovarNotaFiscal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, motivo }: { id: string; motivo: string }) => {
      const { data, error } = await supabase
        .from("prestadores_notas_fiscais")
        .update({
          statusaprovacao: "Reprovado",
          observacoesaprovacao: motivo,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapNotaFiscalFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-notas-fiscais"] });
      toast.success("Nota fiscal reprovada!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao reprovar nota fiscal: ${error.message}`);
    },
  });
}

export function useDeleteNotaFiscal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prestadores_notas_fiscais")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-notas-fiscais"] });
      toast.success("Nota fiscal desativada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao desativar nota fiscal: ${error.message}`);
    },
  });
}

function mapNotaFiscalFromDB(data: any): NotaFiscal {
  console.log('Mapeando NF:', {
    id: data.id,
    cca_codigo: data.cca_codigo,
    cca_nome: data.cca_nome,
    cca_resultado: data.cca_codigo && data.cca_nome ? `${data.cca_codigo} - ${data.cca_nome}` : (data.cca_nome || "")
  });
  
  return {
    id: data.id,
    numero: data.numero,
    nomeempresa: data.nomeempresa,
    nomerepresentante: data.nomerepresentante,
    periodocontabil: data.periodocontabil,
    cca: data.cca_codigo && data.cca_nome ? `${data.cca_codigo} - ${data.cca_nome}` : (data.cca_nome || ""),
    dataemissao: data.dataemissao,
    descricaoservico: data.descricaoservico,
    valor: data.valor,
    arquivo: null,
    arquivonome: data.arquivo_nome,
    arquivourl: data.arquivo_url,
    tipodocumento: data.tipodocumento,
    empresadestino: data.empresadestino,
    numerocredor: data.numerocredor,
    datavencimento: data.datavencimento,
    planofinanceiro: data.planofinanceiro,
    statusaprovacao: data.statusaprovacao,
    observacoesaprovacao: data.observacoesaprovacao,
    status: data.status,
    dataenviosienge: data.dataenviosienge,
    mensagemerro: data.mensagemerro,
    criadoem: data.created_at,
    atualizadoem: data.updated_at,
    aprovadopor: data.aprovadopor,
    dataaprovacao: data.dataaprovacao,
  };
}

function mapNotaFiscalToDB(data: any): any {
  return {
    numero: data.numero,
    nomeempresa: data.nomeempresa,
    nomerepresentante: data.nomerepresentante,
    periodocontabil: data.periodocontabil,
    dataemissao: data.dataemissao,
    datavencimento: data.datavencimento,
    descricaoservico: data.descricaoservico,
    valor: data.valor,
    status: data.status,
    statusaprovacao: data.statusaprovacao,
    aprovadopor: data.aprovadopor,
    dataaprovacao: data.dataaprovacao,
    observacoesaprovacao: data.observacoesaprovacao,
    arquivo_url: data.arquivoUrl,
    arquivo_nome: data.arquivonome,
    cca_id: data.ccaId,
    cca_codigo: data.ccaCodigo,
    cca_nome: data.cca,
    prestador_pj_id: data.prestadorId,
    contrato_id: data.contratoId,
    demonstrativo_id: data.demonstrativoId,
    tipodocumento: data.tipodocumento,
    empresadestino: data.empresadestino,
    numerocredor: data.numerocredor,
    planofinanceiro: data.planofinanceiro,
    dataenviosienge: data.dataenviosienge,
    mensagemerro: data.mensagemerro,
    ativo: data.ativo ?? true,
  };
}
