import { supabase } from '@/integrations/supabase/client';

export interface Almoxarifado {
  id: string;
  cca_id: number;
  nome: string;
  endereco: string | null;
  interno_cliente: boolean;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export const almoxarifadoService = {
  async getByCCA(ccaId: number): Promise<Almoxarifado[]> {
    const { data, error } = await supabase
      .from('almoxarifados')
      .select('*')
      .eq('cca_id', ccaId)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async create(almoxarifado: Omit<Almoxarifado, 'id' | 'created_at' | 'updated_at'>): Promise<Almoxarifado> {
    const { data, error } = await supabase
      .from('almoxarifados')
      .insert(almoxarifado)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, almoxarifado: Partial<Omit<Almoxarifado, 'id' | 'created_at' | 'updated_at'>>): Promise<Almoxarifado> {
    const { data, error } = await supabase
      .from('almoxarifados')
      .update(almoxarifado)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('almoxarifados')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleAtivo(id: string, ativo: boolean): Promise<Almoxarifado> {
    return this.update(id, { ativo });
  }
};
