
export type Profile = {
  id: string;
  nome: string;
  email: string;
  avatar_url?: string;
  cargo?: string;
  departamento?: string;
  created_at: string;
  updated_at: string;
}

export type Permissoes = {
  desvios: boolean;
  treinamentos: boolean;
  ocorrencias: boolean;
  tarefas: boolean;
  relatorios: boolean;
  hora_seguranca: boolean;
  medidas_disciplinares: boolean;
  admin_usuarios: boolean;
  admin_perfis: boolean;
  admin_funcionarios: boolean;
  admin_hht: boolean;
  admin_templates: boolean;
}

export type Perfil = {
  id: number;
  nome: string;
  descricao: string | null;
  permissoes: Permissoes;
}

export type UsuarioPerfil = {
  id: string;
  usuario_id: string;
  perfil_id: number;
}

export type Funcionario = {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type Treinamento = {
  id: string;
  nome: string;
  carga_horaria?: number;
  validade_dias?: number;
  created_at: string;
  updated_at: string;
}

export type TreinamentoNormativo = {
  id: string;
  funcionario_id: string;
  treinamento_id: string;
  tipo: 'Formação' | 'Reciclagem';
  data_realizacao: string;
  data_validade: string;
  certificado_url?: string;
  status: 'Válido' | 'Próximo ao vencimento' | 'Vencido';
  arquivado: boolean;
  created_at: string;
  updated_at: string;
}

export type ExecucaoTreinamento = {
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
  created_at: string;
  updated_at: string;
}

export type Tarefa = {
  id: string;
  cca: string;
  tipo_cca: 'linha-inteira' | 'parcial' | 'equipamento' | 'especifica';
  data_cadastro: string;
  data_conclusao?: string;
  descricao: string;
  responsavel_id?: string;
  anexo?: string;
  status: 'programada' | 'concluida' | 'em-andamento' | 'pendente';
  iniciada: boolean;
  configuracao: {
    recorrencia: {
      ativa: boolean;
      frequencia: string;
    };
    criticidade: string;
    requerValidacao: boolean;
    notificarUsuario: boolean;
  };
  created_at: string;
  updated_at: string;
}

export type Ocorrencia = {
  id: string;
  data: string;
  empresa: string;
  cca: string;
  disciplina: string;
  tipo_ocorrencia: string;
  classificacao_risco: 'TRIVIAL' | 'TOLERÁVEL' | 'MODERADO' | 'SUBSTANCIAL' | 'INTOLERÁVEL';
  status: 'Em tratativa' | 'Concluído';
  descricao?: string;
  partes_corpo_afetadas?: string[];
  medidas_tomadas?: string;
  responsavel_id?: string;
  created_at: string;
  updated_at: string;
}

export type Desvio = {
  id: string;
  data: string;
  local: string;
  tipo: string;
  descricao: string;
  acao_imediata?: string;
  classificacao: 'Baixo' | 'Médio' | 'Alto' | 'Muito Alto';
  status: 'Aberto' | 'Em andamento' | 'Resolvido' | 'Cancelado';
  responsavel_id?: string;
  prazo?: string;
  imagem_url?: string;
  created_at: string;
  updated_at: string;
}

export type Database = {
  profiles: Profile;
  perfis: Perfil;
  usuario_perfis: UsuarioPerfil;
  funcionarios: Funcionario;
  treinamentos: Treinamento;
  treinamentos_normativos: TreinamentoNormativo;
  execucao_treinamentos: ExecucaoTreinamento;
  tarefas: Tarefa;
  ocorrencias: Ocorrencia;
  desvios: Desvio;
}
