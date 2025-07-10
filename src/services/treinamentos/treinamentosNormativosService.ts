
import { supabase } from "@/integrations/supabase/client";
import { TreinamentoNormativo } from "@/types/treinamentos";

export const treinamentosNormativosService = {
  async fetchAll(): Promise<TreinamentoNormativo[]> {
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .select(`
        *,
        funcionarios!inner(nome),
        lista_treinamentos_normativos!inner(nome)
      `)
      .order('data_realizacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar treinamentos normativos:', error);
      throw error;
    }

    return data?.map(item => ({
      id: item.id,
      funcionario_id: item.funcionario_id,
      treinamento_id: item.treinamento_id,
      treinamentoNome: item.lista_treinamentos_normativos?.nome || '',
      data_realizacao: item.data_realizacao,
      data_validade: item.data_validade,
      certificado_url: item.certificado_url,
      observacoes: item.observacoes || '',
      status: item.status,
      tipo: item.tipo,
      arquivado: item.arquivado || false
    })) || [];
  },

  async getAll(): Promise<TreinamentoNormativo[]> {
    return this.fetchAll();
  },

  async create(data: Partial<TreinamentoNormativo>): Promise<TreinamentoNormativo> {
    const insertData = {
      funcionario_id: data.funcionario_id!,
      treinamento_id: data.treinamento_id!,
      data_realizacao: data.data_realizacao!,
      data_validade: data.data_validade || null,
      certificado_url: data.certificado_url || null,
      observacoes: data.observacoes || null,
      status: data.status || 'VÁLIDO',
      tipo: data.tipo || 'NORMATIVO'
    };

    const { data: result, error } = await supabase
      .from('treinamentos_normativos')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar treinamento normativo:', error);
      throw error;
    }

    return result;
  },

  async update(id: string, updateData: Partial<TreinamentoNormativo>): Promise<TreinamentoNormativo> {
    const dataToUpdate = {
      ...(updateData.funcionario_id && { funcionario_id: updateData.funcionario_id }),
      ...(updateData.treinamento_id && { treinamento_id: updateData.treinamento_id }),
      ...(updateData.data_realizacao && { data_realizacao: updateData.data_realizacao }),
      ...(updateData.data_validade !== undefined && { data_validade: updateData.data_validade }),
      ...(updateData.certificado_url !== undefined && { certificado_url: updateData.certificado_url }),
      ...(updateData.observacoes !== undefined && { observacoes: updateData.observacoes }),
      ...(updateData.status && { status: updateData.status }),
      ...(updateData.tipo && { tipo: updateData.tipo }),
      ...(updateData.arquivado !== undefined && { arquivado: updateData.arquivado })
    };

    const { data: result, error } = await supabase
      .from('treinamentos_normativos')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar treinamento normativo:', error);
      throw error;
    }

    return result;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('treinamentos_normativos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir treinamento normativo:', error);
      throw error;
    }
  },

  async arquivar(id: string, justificativa: string): Promise<void> {
    const { error } = await supabase
      .from('treinamentos_normativos')
      .update({ 
        arquivado: true,
        observacoes: justificativa
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao arquivar treinamento normativo:', error);
      throw error;
    }
  }
};
