
export interface Profile {
  id: string;
  nome: string;
  email: string;
  avatar_url?: string;
  cargo?: string;
  departamento?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Perfil {
  id: number;
  nome: string;
  descricao?: string;
  permissoes: {
    desvios: boolean;
    tarefas: boolean;
    admin_hht: boolean;
    relatorios: boolean;
    ocorrencias: boolean;
    admin_perfis: boolean;
    treinamentos: boolean;
    admin_usuarios: boolean;
    hora_seguranca: boolean;
    admin_templates: boolean;
    admin_funcionarios: boolean;
    medidas_disciplinares: boolean;
  };
}

export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Treinamento {
  id: string;
  nome: string;
  carga_horaria?: number;
  validade_dias?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TreinamentoNormativo {
  id: string;
  funcionario_id: string;
  treinamento_id: string;
  tipo: string;
  data_realizacao: string;
  data_validade: string;
  certificado_url?: string;
  status: string;
  arquivado?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExecucaoTreinamento {
  id: string;
  data: string;
  mes: number;
  ano: number;
  cca: string;
  processo_treinamento: string;
  tipo_treinamento: string;
  treinamento_id?: string;
  treinamento_nome?: string;
  carga_horaria: number;
  observacoes?: string;
  lista_presenca_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Tarefa {
  id: string;
  cca: string;
  tipo_cca: string;
  data_cadastro?: string;
  data_conclusao?: string;
  descricao: string;
  responsavel_id?: string;
  anexo?: string;
  status: string;
  iniciada?: boolean;
  configuracao: {
    recorrencia: {
      ativa: boolean;
      frequencia: string;
    };
    criticidade: string;
    requerValidacao: boolean;
    notificarUsuario: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Ocorrencia {
  id: string;
  data: string;
  empresa: string;
  cca: string;
  disciplina: string;
  tipo_ocorrencia: string;
  classificacao_risco: string;
  status: string;
  descricao?: string;
  partes_corpo_afetadas?: string[];
  medidas_tomadas?: string;
  responsavel_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Desvio {
  id: string;
  data: string;
  local: string;
  tipo: string;
  descricao: string;
  acao_imediata?: string;
  classificacao: string;
  status: string;
  responsavel_id?: string;
  prazo?: string;
  imagem_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      perfis: {
        Row: Perfil;
        Insert: Omit<Perfil, 'id'>;
        Update: Partial<Omit<Perfil, 'id'>>;
      };
      funcionarios: {
        Row: Funcionario;
        Insert: Omit<Funcionario, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Funcionario, 'id' | 'created_at' | 'updated_at'>>;
      };
      treinamentos: {
        Row: Treinamento;
        Insert: Omit<Treinamento, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Treinamento, 'id' | 'created_at' | 'updated_at'>>;
      };
      treinamentos_normativos: {
        Row: TreinamentoNormativo;
        Insert: Omit<TreinamentoNormativo, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TreinamentoNormativo, 'id' | 'created_at' | 'updated_at'>>;
      };
      execucao_treinamentos: {
        Row: ExecucaoTreinamento;
        Insert: Omit<ExecucaoTreinamento, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ExecucaoTreinamento, 'id' | 'created_at' | 'updated_at'>>;
      };
      tarefas: {
        Row: Tarefa;
        Insert: Omit<Tarefa, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tarefa, 'id' | 'created_at' | 'updated_at'>>;
      };
      ocorrencias: {
        Row: Ocorrencia;
        Insert: Omit<Ocorrencia, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Ocorrencia, 'id' | 'created_at' | 'updated_at'>>;
      };
      desvios: {
        Row: Desvio;
        Insert: Omit<Desvio, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Desvio, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};
