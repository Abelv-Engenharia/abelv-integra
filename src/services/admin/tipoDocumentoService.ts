import { supabase } from "@/integrations/supabase/client";

export interface TipoDocumento {
  id: string;
  codigo: string;
  descricao: string;
  created_at: string;
}

export interface CreateTipoDocumentoInput {
  codigo: string;
  descricao: string;
}

export interface UpdateTipoDocumentoInput {
  codigo?: string;
  descricao?: string;
}

export const tipoDocumentoService = {
  async getAll(): Promise<TipoDocumento[]> {
    const { data, error } = await supabase
      .from('tipos_documentos')
      .select('*')
      .order('codigo', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(input: CreateTipoDocumentoInput): Promise<TipoDocumento> {
    const { data, error } = await supabase
      .from('tipos_documentos')
      .insert({
        codigo: input.codigo.trim(),
        descricao: input.descricao.trim(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, input: UpdateTipoDocumentoInput): Promise<TipoDocumento> {
    const updateData: any = {};
    if (input.codigo !== undefined) updateData.codigo = input.codigo.trim();
    if (input.descricao !== undefined) updateData.descricao = input.descricao.trim();

    const { data, error } = await supabase
      .from('tipos_documentos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tipos_documentos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
