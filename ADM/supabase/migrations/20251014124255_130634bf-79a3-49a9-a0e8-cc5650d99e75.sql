-- Criar tabela principal de validação de admissão
CREATE TABLE validacao_admissao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Flags de conclusão por aba
  dados_ok BOOLEAN DEFAULT FALSE,
  admissao_ok BOOLEAN DEFAULT FALSE,
  ajuda_ok BOOLEAN DEFAULT FALSE,
  aso_ok BOOLEAN DEFAULT FALSE,
  
  -- Aba 1: Dados Colaborador (Nydhus)
  cpf TEXT NOT NULL UNIQUE,
  nome_completo TEXT NOT NULL,
  nome_social TEXT,
  data_nascimento DATE,
  sexo TEXT CHECK (sexo IN ('M', 'F', 'Outro')),
  estado_civil TEXT CHECK (estado_civil IN ('Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União Estável')),
  raca TEXT,
  nacionalidade TEXT,
  naturalidade_cidade TEXT,
  naturalidade_uf TEXT,
  grau_instrucao TEXT,
  curso TEXT,
  nome_mae TEXT,
  nome_pai TEXT,
  tipo_sanguineo TEXT,
  chave_pix TEXT,
  
  -- Endereço
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  uf TEXT,
  
  -- Contatos
  celular TEXT,
  email_principal TEXT,
  
  -- Documentos
  rg TEXT,
  ctps TEXT,
  pis TEXT,
  titulo_eleitor TEXT,
  cnh TEXT,
  
  -- IDs de integração
  nydhus_pessoa_id TEXT,
  nydhus_sync_at TIMESTAMP WITH TIME ZONE,
  
  -- Aba 2: Admissão
  cca_codigo TEXT,
  cca_nome TEXT,
  funcao TEXT,
  cbo TEXT,
  regime TEXT CHECK (regime IN ('Hora', 'Mês')),
  valor_hora NUMERIC(10,2),
  salario_mensal NUMERIC(10,2),
  salario_projetado NUMERIC(10,2),
  jornada TEXT,
  data_admissao DATE,
  observacoes_dp TEXT,
  
  -- IDs de integração Sienge
  sienge_pessoa_id TEXT,
  sienge_funcional_id TEXT,
  sienge_sync_at TIMESTAMP WITH TIME ZONE,
  
  -- Aba 3: Ajuda de Custo
  havera_ajuda BOOLEAN DEFAULT FALSE,
  valor_dia_ajuda NUMERIC(10,2),
  tipo_ajuda TEXT CHECK (tipo_ajuda IN ('Proporcional', 'Fixa')),
  regra_ajuda TEXT,
  regra_dias INTEGER,
  somar_dias_uteis BOOLEAN DEFAULT TRUE,
  calendario_feriados JSONB,
  periodo_inicio DATE,
  periodo_fim DATE,
  dias_calculados INTEGER,
  total_ajuda NUMERIC(10,2),
  planilha_xlsx_url TEXT,
  
  -- Aba 4: ASO
  aso_liberado BOOLEAN DEFAULT FALSE,
  aso_pdf_url TEXT,
  aso_upload_at TIMESTAMP WITH TIME ZONE,
  
  -- Aba 5: Envio DP
  enviado BOOLEAN DEFAULT FALSE,
  destinatarios_para TEXT[],
  destinatarios_cc TEXT[],
  data_envio TIMESTAMP WITH TIME ZONE,
  usuario_envio TEXT,
  
  -- Constraints
  CONSTRAINT validacao_admissao_cpf_valid CHECK (LENGTH(cpf) = 11),
  CONSTRAINT validacao_admissao_email_valid CHECK (email_principal ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- RLS
ALTER TABLE validacao_admissao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura para todos" ON validacao_admissao FOR SELECT USING (true);
CREATE POLICY "Permitir inserção para todos" ON validacao_admissao FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para todos" ON validacao_admissao FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão para todos" ON validacao_admissao FOR DELETE USING (true);

-- Trigger de updated_at
CREATE TRIGGER update_validacao_admissao_updated_at
  BEFORE UPDATE ON validacao_admissao
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tabela de log de envio
CREATE TABLE log_envio_dp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validacao_id UUID REFERENCES validacao_admissao(id) ON DELETE CASCADE,
  data_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario_nome TEXT NOT NULL,
  destinatarios_para TEXT[],
  destinatarios_cc TEXT[],
  assunto TEXT,
  anexos JSONB,
  status TEXT DEFAULT 'enviado' CHECK (status IN ('enviado', 'erro')),
  mensagem_erro TEXT
);

ALTER TABLE log_envio_dp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura para todos" ON log_envio_dp FOR SELECT USING (true);
CREATE POLICY "Permitir inserção para todos" ON log_envio_dp FOR INSERT WITH CHECK (true);

-- Criar bucket de storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('validacao-admissao', 'validacao-admissao', true)
ON CONFLICT (id) DO NOTHING;

-- RLS para storage
CREATE POLICY "Permitir upload para todos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'validacao-admissao');

CREATE POLICY "Permitir leitura para todos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'validacao-admissao');