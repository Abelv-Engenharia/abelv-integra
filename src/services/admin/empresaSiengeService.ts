import { supabase } from "@/integrations/supabase/client";

export interface EmpresaSienge {
  id: string;
  id_sienge: number;
  name: string;
  tradeName?: string;
  cnpj?: string;
  created_at: string;
}

export interface CreateEmpresaSiengeInput {
  id_sienge: number;
  name: string;
  tradeName?: string;
  cnpj?: string;
}

export interface UpdateEmpresaSiengeInput {
  id_sienge?: number;
  name?: string;
  tradeName?: string;
  cnpj?: string;
}

export const empresaSiengeService = {
  async getAll(): Promise<EmpresaSienge[]> {
    const { data, error } = await supabase
      .from('empresas_sienge')
      .select('*')
      .order('id_sienge', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(input: CreateEmpresaSiengeInput): Promise<EmpresaSienge> {
    const { data, error } = await supabase
      .from('empresas_sienge')
      .insert({
        id_sienge: input.id_sienge,
        name: input.name.trim(),
        tradeName: input.tradeName?.trim() || null,
        cnpj: input.cnpj?.trim() || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, input: UpdateEmpresaSiengeInput): Promise<EmpresaSienge> {
    const updateData: any = {};
    if (input.id_sienge !== undefined) updateData.id_sienge = input.id_sienge;
    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.tradeName !== undefined) updateData.tradeName = input.tradeName?.trim() || null;
    if (input.cnpj !== undefined) updateData.cnpj = input.cnpj?.trim() || null;

    const { data, error } = await supabase
      .from('empresas_sienge')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('empresas_sienge')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
