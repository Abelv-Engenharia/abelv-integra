
import { supabase } from "@/integrations/supabase/client";

export interface CCA {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
}

export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
}

export interface BaseLegalOpcao {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
}

export interface Engenheiro {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  email: string;
}

export interface Supervisor {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  email: string;
}

export interface Encarregado {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  email: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
}

export interface TipoRegistro {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
}

export interface Processo {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
}

export interface EventoIdentificado {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
}

export interface CausaProvavel {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
}

export interface Disciplina {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
}

export const fetchCCAs = async (): Promise<CCA[]> => {
  const { data, error } = await supabase
    .from('ccas')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching CCAs:', error);
    return [];
  }
  
  return data || [];
};

export const fetchEmpresas = async (): Promise<Empresa[]> => {
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Empresas:', error);
    return [];
  }
  
  return data || [];
};

export const fetchBaseLegalOpcoes = async (): Promise<BaseLegalOpcao[]> => {
  const { data, error } = await supabase
    .from('base_legal_opcoes')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Base Legal options:', error);
    return [];
  }
  
  return data || [];
};

export const fetchEngenheiros = async (): Promise<Engenheiro[]> => {
  const { data, error } = await supabase
    .from('engenheiros')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Engenheiros:', error);
    return [];
  }
  
  return data || [];
};

export const fetchSupervisores = async (): Promise<Supervisor[]> => {
  const { data, error } = await supabase
    .from('supervisores')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Supervisores:', error);
    return [];
  }
  
  return data || [];
};

export const fetchEncarregados = async (): Promise<Encarregado[]> => {
  const { data, error } = await supabase
    .from('encarregados')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Encarregados:', error);
    return [];
  }
  
  return data || [];
};

export const fetchFuncionarios = async (): Promise<Funcionario[]> => {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Funcionarios:', error);
    return [];
  }
  
  return data || [];
};

export const fetchTiposRegistro = async (): Promise<TipoRegistro[]> => {
  const { data, error } = await supabase
    .from('tipos_registro')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Tipos de Registro:', error);
    return [];
  }
  
  return data || [];
};

export const fetchProcessos = async (): Promise<Processo[]> => {
  const { data, error } = await supabase
    .from('processos')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Processos:', error);
    return [];
  }
  
  return data || [];
};

export const fetchEventosIdentificados = async (): Promise<EventoIdentificado[]> => {
  const { data, error } = await supabase
    .from('eventos_identificados')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Eventos Identificados:', error);
    return [];
  }
  
  return data || [];
};

export const fetchCausasProvaveis = async (): Promise<CausaProvavel[]> => {
  const { data, error } = await supabase
    .from('causas_provaveis')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Causas Prováveis:', error);
    return [];
  }
  
  return data || [];
};

export const fetchDisciplinas = async (): Promise<Disciplina[]> => {
  const { data, error } = await supabase
    .from('disciplinas')
    .select('*')
    .eq('ativo', true);
  
  if (error) {
    console.error('Error fetching Disciplinas:', error);
    return [];
  }
  
  return data || [];
};
