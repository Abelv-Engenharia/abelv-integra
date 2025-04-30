
import { supabase } from "@/integrations/supabase/client";

export const fetchDesvios = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Erro ao buscar desvios:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar desvios:', error);
    return [];
  }
};

export const fetchCCAs = async () => {
  try {
    const { data, error } = await supabase
      .from('ccas')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar CCAs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar CCAs:', error);
    return [];
  }
};

export const fetchEmpresas = async () => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar empresas:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar empresas:', error);
    return [];
  }
};
