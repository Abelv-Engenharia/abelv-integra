-- Adicionar campos de e-mail e tipo de pagamento na tabela analises_contratuais
ALTER TABLE analises_contratuais
ADD COLUMN IF NOT EXISTS tipo_pagamento text,
ADD COLUMN IF NOT EXISTS email_validacao_financeiro text,
ADD COLUMN IF NOT EXISTS email_validacao_adm text,
ADD COLUMN IF NOT EXISTS email_validacao_super text,
ADD COLUMN IF NOT EXISTS email_validacao_documentacao text,
ADD COLUMN IF NOT EXISTS email_validacao_fotos text,
ADD COLUMN IF NOT EXISTS email_validacao_custos text;

-- Criar tabela de logs de envio de alertas
CREATE TABLE IF NOT EXISTS logs_alertas_validacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analise_id uuid REFERENCES analises_contratuais(id) ON DELETE CASCADE,
  bloco text NOT NULL,
  emails_enviados text NOT NULL,
  status text NOT NULL,
  detalhes jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS para logs
ALTER TABLE logs_alertas_validacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de logs para todos"
  ON logs_alertas_validacao FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de logs para todos"
  ON logs_alertas_validacao FOR INSERT
  WITH CHECK (true);