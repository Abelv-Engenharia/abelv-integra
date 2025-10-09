import { supabase } from '@/integrations/supabase/client';

export interface SubcentroCusto {
  id: string;
  cca_id: number;
  id_sienge: number;
  faturamento: 'Abelv' | 'FATD';
  empresa_sienge_id: string;
  created_at: string;
  updated_at: string;
  // Dados da empresa (join)
  empresa_sienge?: {
    id: string;
    id_sienge: number;
    name: string;
  };
}

export interface CreateSubcentroCustoInput {
  cca_id: number;
  id_sienge: number;
  faturamento: 'Abelv' | 'FATD';
  empresa_sienge_id: string;
}

export interface UpdateSubcentroCustoInput {
  id_sienge?: number;
  faturamento?: 'Abelv' | 'FATD';
  empresa_sienge_id?: string;
}

export const subcentroCustoService = {
  // Buscar todos os subcentros de um CCA específico
  async getByCCAId(ccaId: number): Promise<SubcentroCusto[]> {
    const { data, error } = await supabase
      .from('subcentros_custos')
      .select(`
        *,
        empresa_sienge:empresas_sienge(id, id_sienge, name)
      `)
      .eq('cca_id', ccaId)
      .order('id_sienge', { ascending: true });
    
    if (error) throw error;
    return (data || []) as SubcentroCusto[];
  },

  // Criar novo subcentro
  async create(input: CreateSubcentroCustoInput): Promise<SubcentroCusto> {
    const { data, error } = await supabase
      .from('subcentros_custos')
      .insert(input)
      .select(`
        *,
        empresa_sienge:empresas_sienge(id, id_sienge, name)
      `)
      .single();
    
    if (error) throw error;
    return data as SubcentroCusto;
  },

  // Atualizar subcentro
  async update(id: string, input: UpdateSubcentroCustoInput): Promise<SubcentroCusto> {
    const { data, error } = await supabase
      .from('subcentros_custos')
      .update(input)
      .eq('id', id)
      .select(`
        *,
        empresa_sienge:empresas_sienge(id, id_sienge, name)
      `)
      .single();
    
    if (error) throw error;
    return data as SubcentroCusto;
  },

  // Deletar subcentro
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('subcentros_custos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
