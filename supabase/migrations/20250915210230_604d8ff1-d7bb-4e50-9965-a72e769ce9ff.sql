-- Corrigir vulnerabilidade de segurança: Adicionar SET search_path às funções SECURITY DEFINER
-- Isso previne ataques de manipulação de search_path

-- 1. Função materialize_gse_to_funcionarios
CREATE OR REPLACE FUNCTION public.materialize_gse_to_funcionarios(p_gse_id uuid DEFAULT NULL::uuid, p_funcionario_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  v_result jsonb := '[]'::jsonb;
  v_funcionario record;
  v_gse record;
  v_consolidado jsonb;
  v_hash text;
  v_existing_hash text;
BEGIN
  -- Se GSE específico, processa todos os funcionários vinculados
  IF p_gse_id IS NOT NULL THEN
    FOR v_funcionario IN
      SELECT DISTINCT f.id, f.nome, f.cpf, f.matricula
      FROM public.funcionarios f
      JOIN public.gse_groups_funcoes gf ON f.id = gf.funcao_id
      WHERE gf.gse_id = p_gse_id
        AND gf.vigencia_inicio <= CURRENT_DATE
        AND (gf.vigencia_fim IS NULL OR gf.vigencia_fim >= CURRENT_DATE)
    LOOP
      -- Consolidar dados do GSE para o funcionário
      SELECT jsonb_build_object(
        'funcionario_id', v_funcionario.id,
        'gse_id', p_gse_id,
        'agentes', (
          SELECT jsonb_agg(jsonb_build_object(
            'agente_tabela24', ga.agente_tabela24,
            'fonte_geradora', ga.fonte_geradora,
            'intensidade_dose', ga.intensidade_dose,
            'unidade', ga.unidade,
            'tecnica_avaliacao', ga.tecnica_avaliacao,
            'jornada_exposicao', ga.jornada_exposicao,
            'limite_tolerancia', ga.limite_tolerancia,
            'classificacao_risco', ga.classificacao_risco
          ))
          FROM public.gse_groups_agentes ga
          WHERE ga.gse_id = p_gse_id
        ),
        'epis', (
          SELECT jsonb_agg(jsonb_build_object(
            'descricao', ge.descricao,
            'ca_numero', ge.ca_numero,
            'ca_validade', ge.ca_validade,
            'uso_adequado', ge.uso_adequado,
            'treinamento', ge.treinamento,
            'higienizacao', ge.higienizacao,
            'eficacia', ge.eficacia
          ))
          FROM public.gse_groups_epi ge
          WHERE ge.gse_id = p_gse_id
        ),
        'epcs', (
          SELECT jsonb_agg(jsonb_build_object(
            'descricao', gc.descricao,
            'eficacia', gc.eficacia
          ))
          FROM public.gse_groups_epc gc
          WHERE gc.gse_id = p_gse_id
        )
      ) INTO v_consolidado;
      
      -- Aplicar overrides se existirem
      IF EXISTS (
        SELECT 1 FROM public.gse_overrides_colab
        WHERE funcionario_id = v_funcionario.id
          AND vigencia_inicio <= CURRENT_DATE
          AND (vigencia_fim IS NULL OR vigencia_fim >= CURRENT_DATE)
      ) THEN
        -- TODO: Aplicar lógica de override no v_consolidado
        NULL;
      END IF;
      
      -- Calcular hash do consolidado
      v_hash := encode(sha256(v_consolidado::text::bytea), 'hex');
      
      -- Verificar se já existe materialização com o mesmo hash
      SELECT snapshot_hash INTO v_existing_hash
      FROM public.gse_materialized_map
      WHERE funcionario_id = v_funcionario.id
        AND gse_id = p_gse_id
        AND vigencia_fim IS NULL
      LIMIT 1;
      
      -- Se o hash mudou, criar nova versão
      IF v_existing_hash IS NULL OR v_existing_hash != v_hash THEN
        -- Encerrar versão anterior se existir
        IF v_existing_hash IS NOT NULL THEN
          UPDATE public.gse_materialized_map
          SET vigencia_fim = CURRENT_DATE - INTERVAL '1 day'
          WHERE funcionario_id = v_funcionario.id
            AND gse_id = p_gse_id
            AND vigencia_fim IS NULL;
        END IF;
        
        -- Inserir nova versão
        INSERT INTO public.gse_materialized_map (
          funcionario_id, gse_id, vigencia_inicio, snapshot_hash, consolidado_json
        ) VALUES (
          v_funcionario.id, p_gse_id, CURRENT_DATE, v_hash, v_consolidado
        );
      END IF;
      
      v_result := v_result || jsonb_build_object(
        'funcionario_id', v_funcionario.id,
        'funcionario_nome', v_funcionario.nome,
        'hash', v_hash,
        'mudou', (v_existing_hash IS NULL OR v_existing_hash != v_hash)
      );
    END LOOP;
  END IF;
  
  RETURN v_result;
END;
$function$;

-- 2. Função verificar_alertas_diarios
CREATE OR REPLACE FUNCTION public.verificar_alertas_diarios()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  v_data_ontem date := CURRENT_DATE - INTERVAL '1 day';
  v_dia_atual integer := EXTRACT(DAY FROM CURRENT_DATE);
BEGIN
  -- Limpar alertas antigos resolvidos (mais de 30 dias)
  DELETE FROM public.alertas_esocial 
  WHERE status = 'RESOLVIDO' 
  AND resolvido_em < CURRENT_DATE - INTERVAL '30 days';
  
  -- 1. CATs (S-2210) do dia anterior sem envio
  INSERT INTO public.alertas_esocial (
    tipo_alerta, evento, evento_id, empresa_id, cca_id, 
    funcionario_id, funcionario_nome, descricao, data_referencia
  )
  SELECT 
    'CAT_PENDENTE',
    'S2210',
    s.id,
    s.empresa_id,
    s.cca_id,
    s.funcionario_id,
    s.nome_trabalhador,
    'CAT de ' || s.nome_trabalhador || ' do dia ' || TO_CHAR(s.data_acidente, 'DD/MM/YYYY') || ' pendente de envio',
    s.data_acidente
  FROM public.esocial_s2210_cat s
  WHERE s.data_acidente = v_data_ontem
    AND (s.status_envio IS NULL OR s.status_envio IN ('RASCUNHO', 'ERRO'))
    AND NOT EXISTS (
      SELECT 1 FROM public.alertas_esocial a 
      WHERE a.evento_id = s.id 
      AND a.tipo_alerta = 'CAT_PENDENTE'
      AND a.status = 'PENDENTE'
    );
  
  -- 2. S-2220 não enviados com prazo até dia 15
  IF v_dia_atual >= 10 AND v_dia_atual <= 15 THEN
    INSERT INTO public.alertas_esocial (
      tipo_alerta, evento, evento_id, empresa_id, cca_id,
      funcionario_id, funcionario_nome, descricao, data_referencia, prazo_envio
    )
    SELECT 
      'S2220_PRAZO',
      'S2220',
      s.id,
      s.empresa_id,
      s.cca_id,
      s.funcionario_id,
      s.nome_trabalhador,
      'Exame de ' || s.nome_trabalhador || ' com prazo de envio até ' || TO_CHAR(s.prazo_envio, 'DD/MM/YYYY'),
      s.data_exame,
      s.prazo_envio
    FROM public.esocial_s2220_exames s
    WHERE s.prazo_envio <= CURRENT_DATE + INTERVAL '5 days'
      AND (s.status_envio IS NULL OR s.status_envio IN ('RASCUNHO', 'ERRO'))
      AND NOT EXISTS (
        SELECT 1 FROM public.alertas_esocial a 
        WHERE a.evento_id = s.id 
        AND a.tipo_alerta = 'S2220_PRAZO'
        AND a.status = 'PENDENTE'
      );
  END IF;
  
  -- 3. Mudanças de exposição sem novo S-2240 até dia 15
  IF v_dia_atual >= 10 AND v_dia_atual <= 15 THEN
    INSERT INTO public.alertas_esocial (
      tipo_alerta, evento, evento_id, empresa_id, cca_id,
      funcionario_id, funcionario_nome, descricao, data_referencia
    )
    SELECT DISTINCT
      'S2240_EXPOSICAO',
      'S2240',
      s.id,
      s.empresa_id,
      s.cca_id,
      s.funcionario_id,
      s.nome_trabalhador,
      'Exposição de ' || s.nome_trabalhador || ' requer atualização do S-2240',
      s.data_inicio_exposicao
    FROM public.esocial_s2240_exposicoes s
    WHERE s.ativo = true
      AND s.data_fim_exposicao IS NOT NULL
      AND s.data_fim_exposicao >= CURRENT_DATE - INTERVAL '30 days'
      AND NOT EXISTS (
        SELECT 1 FROM public.esocial_s2240_exposicoes s2
        WHERE s2.funcionario_id = s.funcionario_id
        AND s2.data_inicio_exposicao > s.data_fim_exposicao
        AND s2.ativo = true
      )
      AND NOT EXISTS (
        SELECT 1 FROM public.alertas_esocial a 
        WHERE a.funcionario_id = s.funcionario_id
        AND a.tipo_alerta = 'S2240_EXPOSICAO'
        AND a.status = 'PENDENTE'
        AND a.created_at >= CURRENT_DATE - INTERVAL '30 days'
      );
  END IF;
END;
$function$;

-- 3. Função processar_configuracoes_emails
CREATE OR REPLACE FUNCTION public.processar_configuracoes_emails()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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
  current_weekday := EXTRACT(DOW FROM now());
  current_day := EXTRACT(DAY FROM now());
  current_hour := EXTRACT(HOUR FROM now());
  
  FOR config_record IN 
    SELECT * FROM public.configuracoes_emails 
    WHERE ativo = true 
    AND EXTRACT(HOUR FROM hora_envio) = current_hour
  LOOP
    should_send := false;
    CASE config_record.periodicidade
      WHEN 'diario' THEN
        should_send := true;
      WHEN 'semanal' THEN
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
        should_send := (current_day = 1 OR current_day = 15);
      WHEN 'mensal' THEN
        should_send := (current_day = 1);
    END CASE;
    
    IF should_send THEN
      corpo_final := config_record.mensagem;
      IF config_record.tipo_relatorio IS NOT NULL THEN
        corpo_final := corpo_final || '<br><br><h3>Relatório Automático</h3>';
        corpo_final := corpo_final || '<p>Relatório de ' || config_record.tipo_relatorio || ' dos últimos ' || COALESCE(config_record.periodo_dias, 30) || ' dias';
        IF config_record.cca_id IS NOT NULL THEN
          corpo_final := corpo_final || ' para o CCA selecionado';
        END IF;
        corpo_final := corpo_final || ' será anexado automaticamente.</p>';
      END IF;
      
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