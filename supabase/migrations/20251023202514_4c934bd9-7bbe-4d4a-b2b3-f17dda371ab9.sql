-- Adicionar coluna webhook_url à tabela configuracoes_emails
ALTER TABLE configuracoes_emails 
ADD COLUMN webhook_url TEXT;

-- Criar tabela para logs de webhook
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuracao_id UUID REFERENCES configuracoes_emails(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  payload JSONB NOT NULL,
  status_code INTEGER,
  response_body TEXT,
  sucesso BOOLEAN DEFAULT false,
  erro_mensagem TEXT,
  enviado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índice para melhor performance
CREATE INDEX idx_webhook_logs_configuracao_id ON webhook_logs(configuracao_id);
CREATE INDEX idx_webhook_logs_enviado_em ON webhook_logs(enviado_em DESC);

-- Habilitar RLS
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para webhook_logs (todos autenticados podem ler)
CREATE POLICY "Usuários autenticados podem visualizar logs de webhook"
  ON webhook_logs FOR SELECT
  TO authenticated
  USING (true);

-- Apenas sistema pode inserir logs
CREATE POLICY "Sistema pode inserir logs de webhook"
  ON webhook_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);