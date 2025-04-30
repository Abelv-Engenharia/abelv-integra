
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
  try {
    // Verificar se a tabela engenheiros existe
    const { data, error } = await supabase
      .from('engenheiros')
      .select('*')
      .eq('ativo', true);
    
    if (error) {
      console.error('Error fetching Engenheiros:', error);
      // Dados de fallback para desenvolvimento
      return [
        { id: '1', nome: 'Engenheiro João Silva', funcao: 'Engenheiro Civil', matricula: 'ENG001', email: 'joao.silva@empresa.com' },
        { id: '2', nome: 'Engenheira Maria Souza', funcao: 'Engenheira Elétrica', matricula: 'ENG002', email: 'maria.souza@empresa.com' },
        { id: '3', nome: 'Engenheiro Carlos Santos', funcao: 'Engenheiro Mecânico', matricula: 'ENG003', email: 'carlos.santos@empresa.com' }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching Engenheiros:', error);
    // Dados de fallback para desenvolvimento
    return [
      { id: '1', nome: 'Engenheiro João Silva', funcao: 'Engenheiro Civil', matricula: 'ENG001', email: 'joao.silva@empresa.com' },
      { id: '2', nome: 'Engenheira Maria Souza', funcao: 'Engenheira Elétrica', matricula: 'ENG002', email: 'maria.souza@empresa.com' },
      { id: '3', nome: 'Engenheiro Carlos Santos', funcao: 'Engenheiro Mecânico', matricula: 'ENG003', email: 'carlos.santos@empresa.com' }
    ];
  }
};

export const fetchSupervisores = async (): Promise<Supervisor[]> => {
  try {
    // Verificar se a tabela supervisores existe
    const { data, error } = await supabase
      .from('supervisores')
      .select('*')
      .eq('ativo', true);
    
    if (error) {
      console.error('Error fetching Supervisores:', error);
      // Dados de fallback para desenvolvimento
      return [
        { id: '1', nome: 'Supervisor Roberto Alves', funcao: 'Supervisor de Obras', matricula: 'SUP001', email: 'roberto.alves@empresa.com' },
        { id: '2', nome: 'Supervisora Ana Lima', funcao: 'Supervisora de Manutenção', matricula: 'SUP002', email: 'ana.lima@empresa.com' },
        { id: '3', nome: 'Supervisor Paulo Costa', funcao: 'Supervisor de Produção', matricula: 'SUP003', email: 'paulo.costa@empresa.com' }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching Supervisores:', error);
    // Dados de fallback para desenvolvimento
    return [
      { id: '1', nome: 'Supervisor Roberto Alves', funcao: 'Supervisor de Obras', matricula: 'SUP001', email: 'roberto.alves@empresa.com' },
      { id: '2', nome: 'Supervisora Ana Lima', funcao: 'Supervisora de Manutenção', matricula: 'SUP002', email: 'ana.lima@empresa.com' },
      { id: '3', nome: 'Supervisor Paulo Costa', funcao: 'Supervisor de Produção', matricula: 'SUP003', email: 'paulo.costa@empresa.com' }
    ];
  }
};

export const fetchEncarregados = async (): Promise<Encarregado[]> => {
  try {
    // Verificar se a tabela encarregados existe
    const { data, error } = await supabase
      .from('encarregados')
      .select('*')
      .eq('ativo', true);
    
    if (error) {
      console.error('Error fetching Encarregados:', error);
      // Dados de fallback para desenvolvimento
      return [
        { id: '1', nome: 'Encarregado José Oliveira', funcao: 'Encarregado de Equipe', matricula: 'ENC001', email: 'jose.oliveira@empresa.com' },
        { id: '2', nome: 'Encarregada Fernanda Santos', funcao: 'Encarregada de Setor', matricula: 'ENC002', email: 'fernanda.santos@empresa.com' },
        { id: '3', nome: 'Encarregado Marcelo Pereira', funcao: 'Encarregado de Turno', matricula: 'ENC003', email: 'marcelo.pereira@empresa.com' }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching Encarregados:', error);
    // Dados de fallback para desenvolvimento
    return [
      { id: '1', nome: 'Encarregado José Oliveira', funcao: 'Encarregado de Equipe', matricula: 'ENC001', email: 'jose.oliveira@empresa.com' },
      { id: '2', nome: 'Encarregada Fernanda Santos', funcao: 'Encarregada de Setor', matricula: 'ENC002', email: 'fernanda.santos@empresa.com' },
      { id: '3', nome: 'Encarregado Marcelo Pereira', funcao: 'Encarregado de Turno', matricula: 'ENC003', email: 'marcelo.pereira@empresa.com' }
    ];
  }
};

export const fetchFuncionarios = async (): Promise<Funcionario[]> => {
  try {
    // Verificar se a tabela funcionarios existe
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('ativo', true);
    
    if (error) {
      console.error('Error fetching Funcionarios:', error);
      // Dados de fallback para desenvolvimento
      return [
        { id: '1', nome: 'Luiz Ferreira', funcao: 'Operador', matricula: 'FUNC001' },
        { id: '2', nome: 'Mariana Costa', funcao: 'Técnica', matricula: 'FUNC002' },
        { id: '3', nome: 'Pedro Sampaio', funcao: 'Auxiliar', matricula: 'FUNC003' }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching Funcionarios:', error);
    // Dados de fallback para desenvolvimento
    return [
      { id: '1', nome: 'Luiz Ferreira', funcao: 'Operador', matricula: 'FUNC001' },
      { id: '2', nome: 'Mariana Costa', funcao: 'Técnica', matricula: 'FUNC002' },
      { id: '3', nome: 'Pedro Sampaio', funcao: 'Auxiliar', matricula: 'FUNC003' }
    ];
  }
};

export const fetchTiposRegistro = async (): Promise<TipoRegistro[]> => {
  try {
    // Verificar se a tabela tipos_registro existe
    const { data, error } = await supabase
      .from('tipos_registro')
      .select('*')
      .eq('ativo', true);
    
    if (error) {
      console.error('Error fetching Tipos de Registro:', error);
      // Dados de fallback para desenvolvimento
      return [
        { id: 1, codigo: 'TR01', nome: 'Desvio de Segurança', descricao: 'Registro de desvios relacionados à segurança do trabalho' },
        { id: 2, codigo: 'TR02', nome: 'Desvio Operacional', descricao: 'Registro de desvios em procedimentos operacionais' },
        { id: 3, codigo: 'TR03', nome: 'Desvio Ambiental', descricao: 'Registro de desvios com potencial impacto ambiental' },
        { id: 4, codigo: 'TR04', nome: 'Desvio de Qualidade', descricao: 'Registro de desvios relacionados à qualidade dos processos' }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching Tipos de Registro:', error);
    // Dados de fallback para desenvolvimento
    return [
      { id: 1, codigo: 'TR01', nome: 'Desvio de Segurança', descricao: 'Registro de desvios relacionados à segurança do trabalho' },
      { id: 2, codigo: 'TR02', nome: 'Desvio Operacional', descricao: 'Registro de desvios em procedimentos operacionais' },
      { id: 3, codigo: 'TR03', nome: 'Desvio Ambiental', descricao: 'Registro de desvios com potencial impacto ambiental' },
      { id: 4, codigo: 'TR04', nome: 'Desvio de Qualidade', descricao: 'Registro de desvios relacionados à qualidade dos processos' }
    ];
  }
};

export const fetchProcessos = async (): Promise<Processo[]> => {
  try {
    // Verificar se a tabela processos existe
    const { data, error } = await supabase
      .from('processos')
      .select('*')
      .eq('ativo', true);
    
    if (error) {
      console.error('Error fetching Processos:', error);
      // Dados de fallback para desenvolvimento
      return [
        { id: 1, codigo: 'PROC01', nome: 'Produção', descricao: 'Processos produtivos' },
        { id: 2, codigo: 'PROC02', nome: 'Manutenção', descricao: 'Processos de manutenção' },
        { id: 3, codigo: 'PROC03', nome: 'Logística', descricao: 'Processos logísticos' },
        { id: 4, codigo: 'PROC04', nome: 'Administrativo', descricao: 'Processos administrativos' }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching Processos:', error);
    // Dados de fallback para desenvolvimento
    return [
      { id: 1, codigo: 'PROC01', nome: 'Produção', descricao: 'Processos produtivos' },
      { id: 2, codigo: 'PROC02', nome: 'Manutenção', descricao: 'Processos de manutenção' },
      { id: 3, codigo: 'PROC03', nome: 'Logística', descricao: 'Processos logísticos' },
      { id: 4, codigo: 'PROC04', nome: 'Administrativo', descricao: 'Processos administrativos' }
    ];
  }
};

export const fetchEventosIdentificados = async (): Promise<EventoIdentificado[]> => {
  try {
    // Verificar se a tabela eventos_identificados existe
    const { data, error } = await supabase
      .from('eventos_identificados')
      .select('*')
      .eq('ativo', true);
    
    if (error) {
      console.error('Error fetching Eventos Identificados:', error);
      // Dados de fallback para desenvolvimento
      return [
        { id: 1, codigo: 'EV01', nome: 'Falta de EPI', descricao: 'Ausência de equipamento de proteção individual' },
        { id: 2, codigo: 'EV02', nome: 'Procedimento Incorreto', descricao: 'Execução incorreta de procedimento operacional' },
        { id: 3, codigo: 'EV03', nome: 'Falta de Sinalização', descricao: 'Ausência de sinalização de segurança' },
        { id: 4, codigo: 'EV04', nome: 'Equipamento Defeituoso', descricao: 'Equipamento com defeito ou mau funcionamento' }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching Eventos Identificados:', error);
    // Dados de fallback para desenvolvimento
    return [
      { id: 1, codigo: 'EV01', nome: 'Falta de EPI', descricao: 'Ausência de equipamento de proteção individual' },
      { id: 2, codigo: 'EV02', nome: 'Procedimento Incorreto', descricao: 'Execução incorreta de procedimento operacional' },
      { id: 3, codigo: 'EV03', nome: 'Falta de Sinalização', descricao: 'Ausência de sinalização de segurança' },
      { id: 4, codigo: 'EV04', nome: 'Equipamento Defeituoso', descricao: 'Equipamento com defeito ou mau funcionamento' }
    ];
  }
};

export const fetchCausasProvaveis = async (): Promise<CausaProvavel[]> => {
  try {
    // Verificar se a tabela causas_provaveis existe
    const { data, error } = await supabase
      .from('causas_provaveis')
      .select('*')
      .eq('ativo', true);
    
    if (error) {
      console.error('Error fetching Causas Prováveis:', error);
      // Dados de fallback para desenvolvimento
      return [
        { id: 1, codigo: 'CP01', nome: 'Falta de Treinamento', descricao: 'Ausência ou inadequação de treinamento' },
        { id: 2, codigo: 'CP02', nome: 'Falha de Comunicação', descricao: 'Problemas na comunicação entre equipes' },
        { id: 3, codigo: 'CP03', nome: 'Falha de Equipamento', descricao: 'Falhas técnicas em equipamentos ou ferramentas' },
        { id: 4, codigo: 'CP04', nome: 'Condições Inadequadas', descricao: 'Condições ambientais ou de trabalho inadequadas' }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching Causas Prováveis:', error);
    // Dados de fallback para desenvolvimento
    return [
      { id: 1, codigo: 'CP01', nome: 'Falta de Treinamento', descricao: 'Ausência ou inadequação de treinamento' },
      { id: 2, codigo: 'CP02', nome: 'Falha de Comunicação', descricao: 'Problemas na comunicação entre equipes' },
      { id: 3, codigo: 'CP03', nome: 'Falha de Equipamento', descricao: 'Falhas técnicas em equipamentos ou ferramentas' },
      { id: 4, codigo: 'CP04', nome: 'Condições Inadequadas', descricao: 'Condições ambientais ou de trabalho inadequadas' }
    ];
  }
};

export const fetchDisciplinas = async (): Promise<Disciplina[]> => {
  try {
    // Verificar se a tabela disciplinas existe
    const { data, error } = await supabase
      .from('disciplinas')
      .select('*')
      .eq('ativo', true);
    
    if (error) {
      console.error('Error fetching Disciplinas:', error);
      // Dados de fallback para desenvolvimento
      return [
        { id: 1, codigo: 'D01', nome: 'Civil', descricao: 'Engenharia civil e construção' },
        { id: 2, codigo: 'D02', nome: 'Elétrica', descricao: 'Sistemas e instalações elétricas' },
        { id: 3, codigo: 'D03', nome: 'Mecânica', descricao: 'Equipamentos e sistemas mecânicos' },
        { id: 4, codigo: 'D04', nome: 'Instrumentação', descricao: 'Sistemas de controle e automação' },
        { id: 5, codigo: 'D05', nome: 'Segurança', descricao: 'Procedimentos e sistemas de segurança' }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching Disciplinas:', error);
    // Dados de fallback para desenvolvimento
    return [
      { id: 1, codigo: 'D01', nome: 'Civil', descricao: 'Engenharia civil e construção' },
      { id: 2, codigo: 'D02', nome: 'Elétrica', descricao: 'Sistemas e instalações elétricas' },
      { id: 3, codigo: 'D03', nome: 'Mecânica', descricao: 'Equipamentos e sistemas mecânicos' },
      { id: 4, codigo: 'D04', nome: 'Instrumentação', descricao: 'Sistemas de controle e automação' },
      { id: 5, codigo: 'D05', nome: 'Segurança', descricao: 'Procedimentos e sistemas de segurança' }
    ];
  }
};
