-- Habilitar extensões necessárias para cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remover job anterior se existir
SELECT cron.unschedule('send-email-webhook-hourly')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'send-email-webhook-hourly'
);

-- Criar job para enviar webhooks a cada hora
SELECT cron.schedule(
  'send-email-webhook-hourly',
  '0 * * * *', -- A cada hora no minuto 0
  $$
  SELECT
    net.http_post(
      url := 'https://xexgdtlctyuycohzhmuu.supabase.co/functions/v1/send-email-webhook',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGdkdGxjdHl1eWNvaHpobXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzY0NTMsImV4cCI6MjA2MTQ1MjQ1M30.hbqL05Y8UMfVaOa4nbDQNClCfjk_yRg_dtoL09_yGyo"}'::jsonb,
      body := '{"trigger": "cron", "timestamp": "' || now()::text || '"}'::jsonb
    ) AS request_id;
  $$
);