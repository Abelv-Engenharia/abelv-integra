-- Criar tabela de contratos de alojamento
CREATE TABLE IF NOT EXISTS public.contratos_alojamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  
  -- Dados da Localização
  logradouro TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  municipio TEXT NOT NULL,
  uf TEXT NOT NULL,
  cep TEXT NOT NULL,
  
  -- Características do Alojamento
  qtde_quartos INTEGER NOT NULL,
  lotacao_maxima INTEGER NOT NULL,
  lotacao_atual INTEGER NOT NULL DEFAULT 0,
  distancia_obra NUMERIC NOT NULL DEFAULT 0,
  tipo_imovel TEXT NOT NULL,
  inicio_locacao DATE NOT NULL,
  fim_locacao DATE NOT NULL,
  
  -- Valores do Contrato
  valor_caucao NUMERIC NOT NULL,
  valor_aluguel NUMERIC NOT NULL,
  
  -- Dados Contratuais
  vigencia_contrato INTEGER NOT NULL,
  data_assinatura DATE NOT NULL,
  multa_contratual NUMERIC NOT NULL DEFAULT 0,
  observacoes TEXT,
  
  -- Garantia
  tipo_garantia TEXT NOT NULL DEFAULT 'nenhum',
  valor_garantia NUMERIC,
  data_pagamento_garantia DATE,
  
  -- Proprietário
  proprietario TEXT NOT NULL,
  cpf_cnpj_proprietario TEXT NOT NULL,
  tipo_proprietario TEXT NOT NULL,
  
  -- Dados Bancários
  favorecido TEXT NOT NULL,
  cpf_cnpj_favorecido TEXT NOT NULL,
  tipo_chave_pix TEXT,
  forma_pagamento TEXT NOT NULL,
  banco TEXT NOT NULL,
  agencia TEXT NOT NULL,
  operacao TEXT,
  conta_corrente TEXT NOT NULL,
  
  -- Arquivo e Status
  arquivo_pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.contratos_alojamento ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para todos
CREATE POLICY "Permitir leitura de contratos para todos"
ON public.contratos_alojamento
FOR SELECT
USING (true);

-- Política para permitir inserção para todos
CREATE POLICY "Permitir inserção de contratos para todos"
ON public.contratos_alojamento
FOR INSERT
WITH CHECK (true);

-- Política para permitir atualização para todos
CREATE POLICY "Permitir atualização de contratos para todos"
ON public.contratos_alojamento
FOR UPDATE
USING (true);

-- Política para permitir exclusão para todos
CREATE POLICY "Permitir exclusão de contratos para todos"
ON public.contratos_alojamento
FOR DELETE
USING (true);

-- Criar índices
CREATE INDEX idx_contratos_codigo ON public.contratos_alojamento(codigo);
CREATE INDEX idx_contratos_status ON public.contratos_alojamento(status);
CREATE INDEX idx_contratos_proprietario ON public.contratos_alojamento(proprietario);
CREATE INDEX idx_contratos_vigencia ON public.contratos_alojamento(inicio_locacao, fim_locacao);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_contratos_alojamento_updated_at
  BEFORE UPDATE ON public.contratos_alojamento
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();