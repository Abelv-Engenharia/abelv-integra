-- Adicionar colunas para relatórios automáticos na tabela configuracoes_emails
ALTER TABLE public.configuracoes_emails 
ADD COLUMN IF NOT EXISTS tipo_relatorio TEXT,
ADD COLUMN IF NOT EXISTS periodo_dias INTEGER DEFAULT 30;

-- Adicionar comentários nas colunas
COMMENT ON COLUMN public.configuracoes_emails.tipo_relatorio IS 'Tipo de relatório a ser anexado automaticamente';
COMMENT ON COLUMN public.configuracoes_emails.periodo_dias IS 'Número de dias anteriores à data de envio para filtrar os dados do relatório';