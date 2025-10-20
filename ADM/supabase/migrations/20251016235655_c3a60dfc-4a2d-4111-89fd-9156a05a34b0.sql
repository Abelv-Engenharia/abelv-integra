-- Criar tabela de fornecedores de transporte
CREATE TABLE IF NOT EXISTS fornecedores_transporte (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  endereco TEXT,
  contato TEXT,
  telefone TEXT,
  email TEXT,
  tipos_transporte TEXT[] DEFAULT ARRAY[]::TEXT[],
  capacidade INTEGER,
  valor_base NUMERIC(10,2),
  contrato TEXT,
  vigencia_inicio DATE,
  vigencia_fim DATE,
  ccas TEXT[] DEFAULT ARRAY[]::TEXT[],
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criar tabela de destinatários de alertas de transporte
CREATE TABLE IF NOT EXISTS destinatarios_transporte (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  cca_codigo TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criar tabela de alertas de medição de transporte
CREATE TABLE IF NOT EXISTS alertas_medicao_transporte (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cca_codigo TEXT NOT NULL,
  mes_referencia TEXT NOT NULL,
  ano_referencia INTEGER NOT NULL,
  data_referencia DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  data_envio TIMESTAMPTZ,
  destinatarios TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cca_codigo, mes_referencia, ano_referencia)
);

-- Adicionar coluna para anexo de nota fiscal na tabela de medições
ALTER TABLE medicoes_transporte 
ADD COLUMN IF NOT EXISTS anexo_xml_url TEXT,
ADD COLUMN IF NOT EXISTS anexo_xml_nome TEXT,
ADD COLUMN IF NOT EXISTS dados_nf JSONB;

-- Habilitar RLS
ALTER TABLE fornecedores_transporte ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinatarios_transporte ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_medicao_transporte ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para fornecedores_transporte
CREATE POLICY "Permitir leitura de fornecedores para todos"
ON fornecedores_transporte FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Permitir inserção de fornecedores para todos"
ON fornecedores_transporte FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir atualização de fornecedores para todos"
ON fornecedores_transporte FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Permitir exclusão de fornecedores para todos"
ON fornecedores_transporte FOR DELETE TO authenticated
USING (true);

-- Políticas RLS para destinatarios_transporte
CREATE POLICY "Permitir leitura de destinatários para todos"
ON destinatarios_transporte FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Permitir inserção de destinatários para todos"
ON destinatarios_transporte FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir atualização de destinatários para todos"
ON destinatarios_transporte FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Permitir exclusão de destinatários para todos"
ON destinatarios_transporte FOR DELETE TO authenticated
USING (true);

-- Políticas RLS para alertas_medicao_transporte
CREATE POLICY "Permitir leitura de alertas para todos"
ON alertas_medicao_transporte FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Permitir inserção de alertas para todos"
ON alertas_medicao_transporte FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir atualização de alertas para todos"
ON alertas_medicao_transporte FOR UPDATE TO authenticated
USING (true);

-- Triggers para updated_at
CREATE TRIGGER update_fornecedores_transporte_updated_at
BEFORE UPDATE ON fornecedores_transporte
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinatarios_transporte_updated_at
BEFORE UPDATE ON destinatarios_transporte
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alertas_medicao_transporte_updated_at
BEFORE UPDATE ON alertas_medicao_transporte
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();