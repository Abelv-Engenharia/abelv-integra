-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remover job anterior (se existir)
SELECT cron.unschedule('enviar-relatorio-efetivo-diario')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'enviar-relatorio-efetivo-diario'
);

-- Criar novo job para enviar às 11:30 horário de Brasília (14:30 UTC)
SELECT cron.schedule(
  'enviar-relatorio-efetivo-diario',
  '30 14 * * *', -- 11:30 BRT = 14:30 UTC (fuso -3h)
  $$
  SELECT
    net.http_post(
      url := 'https://jfpfkebrjhgurpohgran.supabase.co/functions/v1/enviar-relatorio-efetivo',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcGZrZWJyamhndXJwb2hncmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTk2OTcsImV4cCI6MjA3NDczNTY5N30.cxlJUx2bIePtOlO8SGfHs80P9wLEg12JO0Vsv76NixE"}'::jsonb,
      body := '{"trigger": "cron", "timestamp": "' || now()::text || '"}'::jsonb
    ) AS request_id;
  $$
);