import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EstoqueMovimentacaoEntrada {
  id: string;
  cca_id: number;
  almoxarifado_id: string;
  id_credor?: string;
  numero?: string;
  id_empresa?: number;
  id_documento?: string;
  pdf_url?: string;
  pdf_nome?: string;
  emissao?: string;
  movimento?: string;
  created_at: string;
  updated_at: string;
  ccas?: {
    codigo: string;
    nome: string;
  };
  almoxarifados?: {
    nome: string;
  };
  credores?: {
    razao: string;
    cnpj_cpf: string;
  };
  empresas_sienge?: {
    name: string;
  };
  tipo_documentos?: {
    codigo: string;
    descricao: string;
  };
}

export function useEstoqueMovimentacoesEntradas(ccaId?: number) {
  return useQuery({
    queryKey: ["estoque-movimentacoes-entradas", ccaId],
    queryFn: async () => {
      let query = supabase
        .from("estoque_movimentacoes_entradas")
        .select(`
          *,
          ccas (codigo, nome),
          almoxarifados (nome)
        `)
        .order("created_at", { ascending: false });

      if (ccaId) {
        query = query.eq("cca_id", ccaId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as any;
    },
  });
}
