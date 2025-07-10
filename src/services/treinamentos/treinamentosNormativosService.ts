
import { supabase } from '@/integrations/supabase/client';
import { TreinamentoNormativo } from '@/types/treinamentos';

export async function fetchTreinamentosNormativos(): Promise<TreinamentoNormativo[]> {
  try {
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .select(`
        *,
        lista_treinamentos_normativos(nome)
      `)
      .eq('arquivado', false)
      .order('data_validade', { ascending: true });

    if (error) throw error;

    return (data || []).map(item => ({
      ...item,
      tipo: item.tipo as 'Formação' | 'Reciclagem',
      treinamentoNome: item.lista_treinamentos_normativos?.nome || ''
    }));
  } catch (error) {
    console.error('Erro ao buscar treinamentos normativos:', error);
    return [];
  }
}

export async function fetchTreinamentoNormativoById(id: string): Promise<TreinamentoNormativo | null> {
  try {
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      tipo: data.tipo as 'Formação' | 'Reciclagem'
    };
  } catch (error) {
    console.error('Erro ao buscar treinamento normativo:', error);
    return null;
  }
}
