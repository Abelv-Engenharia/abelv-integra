-- Corrigir função para comparar apenas a hora (não minutos e segundos)
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
  should_send BOOLEAN;
  destinatario TEXT;
  anexos_json JSONB;
  relatorio_html TEXT;
  corpo_final TEXT;
BEGIN
  current_weekday := EXTRACT(DOW FROM now()); -- 0=Sunday, 1=Monday, etc.
  current_day := EXTRACT(DAY FROM now());
  current_hour := EXTRACT(HOUR FROM now());
  
  -- Loop through active email configurations
  FOR config_record IN 
    SELECT * FROM public.configuracoes_emails 
    WHERE ativo = true 
    AND EXTRACT(HOUR FROM hora_envio) = current_hour
  LOOP
    should_send := false;
    
    -- Check if it's time to send based on periodicidade
    CASE config_record.periodicidade
      WHEN 'diario' THEN
        should_send := true;
      WHEN 'semanal' THEN
        -- Check if today matches the configured dia_semana
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
        -- Send on 1st and 15th of each month
        should_send := (current_day = 1 OR current_day = 15);
      WHEN 'mensal' THEN
        -- Send on the 1st of each month
        should_send := (current_day = 1);
    END CASE;
    
    -- If it's time to send, create email records
    IF should_send THEN
      -- Prepare message body (start with base message)
      corpo_final := config_record.mensagem;
      
      -- Add automatic report if configured
      IF config_record.tipo_relatorio IS NOT NULL THEN
        -- Note: In a real implementation, you would call the generate-report edge function here
        -- For now, we'll add a placeholder for the report
        corpo_final := corpo_final || '<br><br><h3>Relatório Automático</h3>';
        corpo_final := corpo_final || '<p>Relatório de ' || config_record.tipo_relatorio || ' dos últimos ' || COALESCE(config_record.periodo_dias, 30) || ' dias';
        
        -- Add CCA filter info if configured
        IF config_record.cca_id IS NOT NULL THEN
          corpo_final := corpo_final || ' para o CCA selecionado';
        END IF;
        
        corpo_final := corpo_final || ' será anexado automaticamente.</p>';
      END IF;
      
      -- Prepare attachments JSON
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
      
      -- Insert one email record for each destinatario
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
      END LOOP;
    END IF;
  END LOOP;
END;
$function$;