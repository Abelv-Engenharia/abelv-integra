
import { supabase } from "@/integrations/supabase/client";

// Interfaces para os tipos de dados
export interface CCA {
  id: number;
  tipo: string;
  nome: string;
  codigo: string;
  ativo: boolean;
}

export interface Empresa {
  id: number;
  cnpj: string;
  nome: string;
  ativo: boolean;
}

export interface BaseLegalOpcao {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
}

export interface Engenheiro {
  id: string;
  nome: string;
  funcao: string;
  matricula: string | null;
  email: string | null;
  ativo: boolean;
}

export interface Supervisor {
  id: string;
  nome: string;
  funcao: string;
  matricula: string | null;
  email: string | null;
  ativo: boolean;
}

export interface Encarregado {
  id: string;
  nome: string;
  funcao: string;
  matricula: string | null;
  email: string | null;
  ativo: boolean;
}

export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  ativo: boolean;
}

export interface TipoRegistro {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
}

export interface Processo {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
}

export interface EventoIdentificado {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
}

export interface CausaProvavel {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
}

export interface Disciplina {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
}

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

export const fetchCCAs = async (): Promise<CCA[]> => {
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

export const fetchEmpresas = async (): Promise<Empresa[]> => {
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

export const fetchBaseLegalOpcoes = async (): Promise<BaseLegalOpcao[]> => {
  try {
    const { data, error } = await supabase
      .from('base_legal_opcoes')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar opções de base legal:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar opções de base legal:', error);
    return [];
  }
};

export const fetchEngenheiros = async (): Promise<Engenheiro[]> => {
  try {
    const { data, error } = await supabase
      .from('engenheiros')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar engenheiros:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar engenheiros:', error);
    return [];
  }
};

export const fetchSupervisores = async (): Promise<Supervisor[]> => {
  try {
    const { data, error } = await supabase
      .from('supervisores')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar supervisores:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar supervisores:', error);
    return [];
  }
};

export const fetchEncarregados = async (): Promise<Encarregado[]> => {
  try {
    const { data, error } = await supabase
      .from('encarregados')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar encarregados:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar encarregados:', error);
    return [];
  }
};

export const fetchFuncionarios = async (): Promise<Funcionario[]> => {
  try {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar funcionários:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar funcionários:', error);
    return [];
  }
};

export const fetchTiposRegistro = async (): Promise<TipoRegistro[]> => {
  try {
    const { data, error } = await supabase
      .from('tipos_registro')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar tipos de registro:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar tipos de registro:', error);
    return [];
  }
};

export const fetchProcessos = async (): Promise<Processo[]> => {
  try {
    const { data, error } = await supabase
      .from('processos')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar processos:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar processos:', error);
    return [];
  }
};

export const fetchEventosIdentificados = async (): Promise<EventoIdentificado[]> => {
  try {
    const { data, error } = await supabase
      .from('eventos_identificados')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar eventos identificados:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar eventos identificados:', error);
    return [];
  }
};

export const fetchCausasProvaveis = async (): Promise<CausaProvavel[]> => {
  try {
    const { data, error } = await supabase
      .from('causas_provaveis')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar causas prováveis:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar causas prováveis:', error);
    return [];
  }
};

export const fetchDisciplinas = async (): Promise<Disciplina[]> => {
  try {
    const { data, error } = await supabase
      .from('disciplinas')
      .select('*')
      .eq('ativo', true);
      
    if (error) {
      console.error('Erro ao buscar disciplinas:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar disciplinas:', error);
    return [];
  }
};
