
-- Corrigir função de processamento de emails para melhor compatibilidade
CREATE OR REPLACE FUNCTION public.processar_configuracoes_emails()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  config_record RECORD;
  current_weekday INTEGER;
  current_day INTEGER;
  current_hour INTEGER;
  current_minute INTEGER;
  config_hour INTEGER;
  config_minute INTEGER;
  should_send BOOLEAN;
  destinatario TEXT;
  anexos_json JSONB;
  relatorio_html TEXT;
  corpo_final TEXT;
BEGIN
  -- Obter informações de tempo atual
  current_weekday := EXTRACT(DOW FROM now() AT TIME ZONE 'America/Sao_Paulo'); -- 0=Sunday, 1=Monday, etc.
  current_day := EXTRACT(DAY FROM now() AT TIME ZONE 'America/Sao_Paulo');
  current_hour := EXTRACT(HOUR FROM now() AT TIME ZONE 'America/Sao_Paulo');
  current_minute := EXTRACT(MINUTE FROM now() AT TIME ZONE 'America/Sao_Paulo');
  
  -- Log para debug
  RAISE NOTICE 'Processando emails - Hora atual: %:%, Dia: %, Weekday: %', current_hour, current_minute, current_day, current_weekday;
  
  -- Loop através das configurações ativas
  FOR config_record IN 
    SELECT * FROM public.configuracoes_emails 
    WHERE ativo = true 
  LOOP
    -- Extrair hora e minuto da configuração
    config_hour := EXTRACT(HOUR FROM config_record.hora_envio);
    config_minute := EXTRACT(MINUTE FROM config_record.hora_envio);
    
    -- Verificar se é o horário correto (com margem de 5 minutos)
    IF current_hour = config_hour AND ABS(current_minute - config_minute) <= 5 THEN
      should_send := false;
      
      -- Verificar baseado na periodicidade
      CASE config_record.periodicidade
        WHEN 'diario' THEN
          should_send := true;
        WHEN 'semanal' THEN
          -- Verificar se hoje é o dia da semana configurado
          should_send := (
            (config_record.dia_semana = 'domingo' AND current_weekday = 0) OR
            (config_record.dia_semana = 'segunda' AND current_weekday = 1) OR
            (config_record.dia_semana = 'terca' AND current_weekday = 2) OR
            (config_record.dia_semana = 'quarta' AND current_weekday = 3) OR
            (config_record.dia_semana = 'quinta' AND current_weekday = 4) OR
            (config_record.dia_semana = 'sexta' AND current_weekday = 5) OR
            (config_record.dia_semana = 'sabado' AND current_weekday = 6)
          );
        WHEN 'quinzenal' THEN
          -- Enviar nos dias 1 e 15 de cada mês
          should_send := (current_day = 1 OR current_day = 15);
        WHEN 'mensal' THEN
          -- Enviar no primeiro dia do mês
          should_send := (current_day = 1);
      END CASE;
      
      -- Log para debug
      RAISE NOTICE 'Configuração ID %, Assunto: %, Should send: %', config_record.id, config_record.assunto, should_send;
      
      -- Se deve enviar, criar registros de email
      IF should_send THEN
        -- Verificar se já não foi enviado hoje para evitar duplicatas
        IF NOT EXISTS (
          SELECT 1 FROM public.emails_pendentes 
          WHERE assunto = config_record.assunto 
          AND DATE(criado_em AT TIME ZONE 'America/Sao_Paulo') = CURRENT_DATE
        ) THEN
          -- Preparar corpo da mensagem
          corpo_final := config_record.mensagem;
          
          -- Adicionar relatório automático se configurado
          IF config_record.tipo_relatorio IS NOT NULL THEN
            corpo_final := corpo_final || '<br><br><h3>Relatório Automático</h3>';
            corpo_final := corpo_final || '<p>Relatório de ' || config_record.tipo_relatorio || ' dos últimos ' || COALESCE(config_record.periodo_dias, 30) || ' dias';
            
            -- Adicionar informação do CCA se configurado
            IF config_record.cca_id IS NOT NULL THEN
              corpo_final := corpo_final || ' para o CCA selecionado';
            END IF;
            
            corpo_final := corpo_final || ' será anexado automaticamente.</p>';
          END IF;
          
          -- Preparar anexos JSON
          IF config_record.anexo_url IS NOT NULL THEN
            anexos_json := jsonb_build_array(
              jsonb_build_object(
                'nome_arquivo', split_part(config_record.anexo_url, '/', array_length(string_to_array(config_record.anexo_url, '/'), 1)),
                'url', config_record.anexo_url
              )
            );
          ELSE
            anexos_json := '[]'::jsonb;
          END IF;
          
          -- Inserir um registro de email para cada destinatário
          FOREACH destinatario IN ARRAY config_record.destinatarios
          LOOP
            INSERT INTO public.emails_pendentes (
              destinatario,
              assunto,
              corpo,
              anexos,
              enviado,
              tentativas,
              criado_em,
              updated_at
            ) VALUES (
              destinatario,
              config_record.assunto,
              corpo_final,
              anexos_json,
              false,
              0,
              now(),
              now()
            );
            
            RAISE NOTICE 'Email adicionado para: %', destinatario;
          END LOOP;
        ELSE
          RAISE NOTICE 'Email já enviado hoje para configuração: %', config_record.assunto;
        END IF;
      END IF;
    END IF;
  END LOOP;
END;
$function$;
