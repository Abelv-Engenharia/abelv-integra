import { supabase } from "@/integrations/supabase/client";

export interface Extintor {
  id: string;
  codigo: string;
  tipo: string;
  capacidade: string;
  fabricante: string;
  data_fabricacao: string;
  data_vencimento: string;
  localizacao: string;
  observacoes: string | null;
  ativo: boolean;
  cca_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface InspecaoExtintor {
  id: string;
  extintor_id: string;
  data_inspecao: string;
  responsavel_id: string;
  status: string;
  tem_nao_conformidade: boolean;
  observacoes: string | null;
  created_at: string;
}

/**
 * Busca todos os extintores filtrados por CCAs permitidas
 */
export async function fetchExtintores(ccaIds?: number[]) {
  let query = supabase
    .from("extintores")
    .select(`
      *,
      ccas (
        id,
        codigo,
        nome
      )
    `)
    .order("created_at", { ascending: false });
  
  if (ccaIds && ccaIds.length > 0) {
    query = query.in("cca_id", ccaIds);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Erro ao buscar extintores:", error);
    throw error;
  }
  
  return data;
}

/**
 * Busca um extintor específico pelo código (para página pública)
 */
export async function fetchExtintorByCodigo(codigo: string) {
  const { data, error } = await supabase
    .from("extintores")
    .select(`
      *,
      ccas (
        id,
        codigo,
        nome
      )
    `)
    .eq("codigo", codigo)
    .eq("ativo", true)
    .maybeSingle();
  
  if (error) {
    console.error("Erro ao buscar extintor:", error);
    throw error;
  }
  
  return data;
}

/**
 * Busca inspeções de um extintor específico
 */
export async function fetchInspecoesByExtintor(extintorId: string) {
  const { data, error } = await supabase
    .from("inspecoes_extintores")
    .select("*")
    .eq("extintor_id", extintorId)
    .order("data_inspecao", { ascending: false });
  
  if (error) {
    console.error("Erro ao buscar inspeções:", error);
    throw error;
  }
  
  return data as InspecaoExtintor[];
}

/**
 * Atualiza um extintor
 */
export async function updateExtintor(
  id: string,
  data: Partial<Extintor>
) {
  const { error } = await supabase
    .from("extintores")
    .update(data)
    .eq("id", id);
  
  if (error) {
    console.error("Erro ao atualizar extintor:", error);
    throw error;
  }
}

/**
 * Exclui um extintor (hard delete)
 */
export async function deleteExtintor(id: string) {
  const { error } = await supabase
    .from("extintores")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Erro ao excluir extintor:", error);
    throw error;
  }
}

/**
 * Busca detalhes completos de uma inspeção (acesso público)
 */
export async function fetchInspecaoPublica(inspecaoId: string) {
  // 1. Buscar a inspeção
  const { data: inspecao, error: inspecaoError } = await supabase
    .from('inspecoes_extintores')
    .select('*')
    .eq('id', inspecaoId)
    .maybeSingle();
  
  if (inspecaoError) {
    console.error('Erro ao buscar inspeção:', inspecaoError);
    throw inspecaoError;
  }
  
  if (!inspecao) {
    return null;
  }

  // 2. Buscar o extintor
  const { data: extintor } = await supabase
    .from('extintores')
    .select('codigo, tipo, capacidade, fabricante, localizacao, data_fabricacao, data_vencimento, cca_id')
    .eq('id', inspecao.extintor_id)
    .maybeSingle();

  // 3. Buscar o CCA se o extintor tiver um
  let cca = null;
  if (extintor?.cca_id) {
    const { data: ccaData } = await supabase
      .from('ccas')
      .select('codigo, nome')
      .eq('id', extintor.cca_id)
      .maybeSingle();
    cca = ccaData;
  }

  // 4. Buscar o checklist
  const { data: checklist } = await supabase
    .from('checklists_avaliacao')
    .select('nome, descricao')
    .eq('id', inspecao.checklist_id)
    .maybeSingle();

  // 5. Buscar o profile do responsável
  const { data: profile } = await supabase
    .from('profiles')
    .select('nome, email')
    .eq('id', inspecao.responsavel_id)
    .maybeSingle();

  // 6. Montar o objeto completo no formato esperado
  return {
    ...inspecao,
    extintores: extintor ? {
      ...extintor,
      ccas: cca
    } : null,
    checklists_avaliacao: checklist,
    profiles: profile
  };
}
