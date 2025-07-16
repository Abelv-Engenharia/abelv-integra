
-- Remover cron job antigo se existir
SELECT cron.unschedule('processar-configuracoes-emails');

-- Criar novo cron job para executar a cada 5 minutos
SELECT cron.schedule(
  'processar-configuracoes-emails',
  '*/5 * * * *', -- A cada 5 minutos
  $$
  SELECT public.processar_configuracoes_emails();
  $$
);

-- Adicionar função para verificar status do cron
CREATE OR REPLACE FUNCTION public.verificar_cron_jobs()
 RETURNS TABLE(
   jobid bigint,
   schedule text,
   command text,
   nodename text,
   nodeport integer,
   database text,
   username text,
   active boolean,
   jobname text
 )
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT * FROM cron.job;
$function$;

-- Adicionar função para executar processamento manual (para testes)
CREATE OR REPLACE FUNCTION public.executar_processamento_manual()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  PERFORM public.processar_configuracoes_emails();
  RETURN 'Processamento executado com sucesso em ' || now();
END;
$function$;
