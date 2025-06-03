
import { supabase } from '@/integrations/supabase/client';

export interface CCA {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export const ccaService = {
  async getAll(): Promise<CCA[]> {
    try {
      const { data, error } = await supabase
        .from('ccas')
        .select('*')
        .order('nome');

      if (error) {
        console.error("Erro ao buscar CCAs:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Exceção ao buscar CCAs:", error);
      return [];
    }
  },

  async create(cca: Omit<CCA, 'id' | 'created_at' | 'updated_at'>): Promise<CCA | null> {
    try {
      const { data, error } = await supabase
        .from('ccas')
        .insert(cca)
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar CCA:", error);
        return null;
      }

      return data as CCA;
    } catch (error) {
      console.error("Exceção ao criar CCA:", error);
      return null;
    }
  },

  async update(id: number, cca: Partial<Omit<CCA, 'id' | 'created_at' | 'updated_at'>>): Promise<CCA | null> {
    try {
      const { data, error } = await supabase
        .from('ccas')
        .update(cca)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar CCA:", error);
        return null;
      }

      return data as CCA;
    } catch (error) {
      console.error("Exceção ao atualizar CCA:", error);
      return null;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ccas')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error("Erro ao inativar CCA:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao inativar CCA:", error);
      return false;
    }
  },

  async activate(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ccas')
        .update({ ativo: true })
        .eq('id', id);

      if (error) {
        console.error("Erro ao ativar CCA:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao ativar CCA:", error);
      return false;
    }
  }
};
