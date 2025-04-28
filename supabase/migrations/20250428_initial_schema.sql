
-- Create tables for user management
CREATE TABLE perfis (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  permissoes JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  cargo TEXT,
  departamento TEXT,
  perfil_id INTEGER REFERENCES perfis(id),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for funcionarios
CREATE TABLE funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  funcao TEXT NOT NULL,
  matricula TEXT UNIQUE NOT NULL,
  foto TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for treinamentos
CREATE TABLE treinamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  carga_horaria INTEGER,
  validade_dias INTEGER,
  tipo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for treinamentos_normativos
CREATE TABLE treinamentos_normativos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funcionario_id UUID REFERENCES funcionarios(id) NOT NULL,
  treinamento_id UUID REFERENCES treinamentos(id) NOT NULL,
  tipo TEXT NOT NULL,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_realizacao TIMESTAMP WITH TIME ZONE NOT NULL,
  data_validade TIMESTAMP WITH TIME ZONE NOT NULL,
  certificado_url TEXT,
  status TEXT NOT NULL,
  arquivado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for execucao_treinamentos
CREATE TABLE execucao_treinamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data TIMESTAMP WITH TIME ZONE NOT NULL,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  cca TEXT NOT NULL,
  processo_treinamento TEXT NOT NULL,
  tipo_treinamento TEXT NOT NULL,
  treinamento_id UUID REFERENCES treinamentos(id),
  treinamento_nome TEXT,
  carga_horaria INTEGER NOT NULL,
  observacoes TEXT,
  lista_presenca_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tables for desvios management
CREATE TABLE desvios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  local TEXT NOT NULL,
  data_ocorrencia TIMESTAMP WITH TIME ZONE NOT NULL,
  data_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tipo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  nivel_risco TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  responsavel_id UUID REFERENCES usuarios(id),
  registrado_por UUID REFERENCES usuarios(id) NOT NULL,
  empresa TEXT,
  cca TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for desvios_acoes
CREATE TABLE desvios_acoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  desvio_id UUID REFERENCES desvios(id) NOT NULL,
  descricao TEXT NOT NULL,
  responsavel_id UUID REFERENCES usuarios(id),
  prazo TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'Pendente',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for desvios_anexos
CREATE TABLE desvios_anexos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  desvio_id UUID REFERENCES desvios(id) NOT NULL,
  url TEXT NOT NULL,
  nome_arquivo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tables for ocorrencias management
CREATE TABLE ocorrencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data_ocorrencia TIMESTAMP WITH TIME ZONE NOT NULL,
  local TEXT NOT NULL,
  tipo TEXT NOT NULL,
  classificacao_risco TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Aberta',
  empresa TEXT,
  envolvidos TEXT,
  registrado_por UUID REFERENCES usuarios(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for ocorrencias_acoes
CREATE TABLE ocorrencias_acoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ocorrencia_id UUID REFERENCES ocorrencias(id) NOT NULL,
  descricao TEXT NOT NULL,
  responsavel_id UUID REFERENCES usuarios(id),
  prazo TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'Pendente',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for ocorrencias_anexos
CREATE TABLE ocorrencias_anexos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ocorrencia_id UUID REFERENCES ocorrencias(id) NOT NULL,
  url TEXT NOT NULL,
  nome_arquivo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tables for tarefas
CREATE TABLE tarefas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  cca TEXT NOT NULL,
  tipo_cca TEXT NOT NULL,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_prevista TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  responsavel_id UUID REFERENCES usuarios(id),
  anexo_url TEXT,
  status TEXT NOT NULL DEFAULT 'programada',
  iniciada BOOLEAN DEFAULT FALSE,
  criticidade TEXT NOT NULL,
  requer_validacao BOOLEAN DEFAULT FALSE,
  notificar_usuario BOOLEAN DEFAULT FALSE,
  recorrencia_ativa BOOLEAN DEFAULT FALSE,
  recorrencia_frequencia TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for inspecoes
CREATE TABLE inspecoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_programada TIMESTAMP WITH TIME ZONE,
  data_realizacao TIMESTAMP WITH TIME ZONE,
  local TEXT NOT NULL,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Programada',
  responsavel_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for registro_hht
CREATE TABLE registro_hht (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  setor TEXT NOT NULL,
  observacoes TEXT,
  registrado_por UUID REFERENCES usuarios(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for opções/enumerações
CREATE TABLE opcoes (
  id SERIAL PRIMARY KEY,
  tipo TEXT NOT NULL,
  valor TEXT NOT NULL,
  label TEXT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  ordem INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create some initial data
INSERT INTO opcoes (tipo, valor, label, ordem) VALUES
  ('cca', 'Produção', 'Produção', 1),
  ('cca', 'Manutenção', 'Manutenção', 2),
  ('cca', 'Administrativo', 'Administrativo', 3),
  ('cca', 'Logística', 'Logística', 4),
  ('cca', 'Qualidade', 'Qualidade', 5),
  ('cca', 'Segurança', 'Segurança', 6),
  ('cca', 'Meio Ambiente', 'Meio Ambiente', 7),
  ('cca', 'RH', 'RH', 8),
  ('processo_treinamento', 'Normativo', 'Normativo', 1),
  ('processo_treinamento', 'Técnico', 'Técnico', 2),
  ('processo_treinamento', 'Comportamental', 'Comportamental', 3),
  ('processo_treinamento', 'Integração', 'Integração', 4),
  ('processo_treinamento', 'Desenvolvimento', 'Desenvolvimento', 5),
  ('tipo_treinamento', 'Interno', 'Interno', 1),
  ('tipo_treinamento', 'Externo', 'Externo', 2),
  ('tipo_treinamento', 'EAD', 'EAD', 3),
  ('tipo_treinamento', 'Híbrido', 'Híbrido', 4);

-- Create initial admin profile
INSERT INTO perfis (nome, descricao, permissoes) VALUES 
  ('Administrador', 'Acesso completo ao sistema', '{"desvios":true,"treinamentos":true,"hora_seguranca":true,"ocorrencias":true,"medidas_disciplinares":true,"tarefas":true,"relatorios":true,"admin_usuarios":true,"admin_perfis":true,"admin_funcionarios":true,"admin_hht":true,"admin_templates":true}');

