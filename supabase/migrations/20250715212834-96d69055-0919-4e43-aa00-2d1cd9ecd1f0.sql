-- Habilitar extensões necessárias para cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Criar cron job para processar configurações de emails a cada hora
SELECT cron.schedule(
  'processar-configuracoes-emails',
  '0 * * * *', -- A cada hora no minuto 0
  $$
  SELECT public.processar_configuracoes_emails();
  $$
);