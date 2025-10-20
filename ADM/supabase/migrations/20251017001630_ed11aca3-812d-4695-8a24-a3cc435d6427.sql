-- Criar tabela medicoes_alimentacao
CREATE TABLE IF NOT EXISTS medicoes_alimentacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_medicao TEXT NOT NULL,
  fornecedor TEXT NOT NULL,
  cnpj TEXT,
  cca TEXT NOT NULL,
  periodo TEXT NOT NULL,
  data_emissao DATE,
  prazo_pagamento DATE,
  valor_total NUMERIC NOT NULL DEFAULT 0,
  itens JSONB NOT NULL DEFAULT '[]'::jsonb,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  anexo_nf_url TEXT,
  anexo_nf_nome TEXT,
  anexo_xml_url TEXT,
  anexo_xml_nome TEXT,
  dados_nf JSONB,
  dados_sienge JSONB,
  titulo_sienge TEXT,
  numero_titulo TEXT,
  situacao_sienge TEXT,
  status_integracao TEXT NOT NULL DEFAULT 'pendente_nf',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE medicoes_alimentacao ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Permitir leitura de medições de alimentação para todos"
  ON medicoes_alimentacao FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de medições de alimentação para todos"
  ON medicoes_alimentacao FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de medições de alimentação para todos"
  ON medicoes_alimentacao FOR UPDATE
  USING (true);

CREATE POLICY "Permitir exclusão de medições de alimentação para todos"
  ON medicoes_alimentacao FOR DELETE
  USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_medicoes_alimentacao_updated_at
  BEFORE UPDATE ON medicoes_alimentacao
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();