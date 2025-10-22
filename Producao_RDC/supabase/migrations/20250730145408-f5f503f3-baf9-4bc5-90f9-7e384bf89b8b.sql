-- Função para sincronizar dados entre status_juntas e relatorios_atividades
CREATE OR REPLACE FUNCTION public.sync_status_juntas_to_relatorios()
RETURNS TRIGGER AS $$
BEGIN
  -- Se for INSERT ou UPDATE em status_juntas
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Atualizar ou inserir dados correspondentes em relatorios_atividades
    -- Verifica se já existe um registro para essa atividade
    IF NEW.relatorio_atividade_id IS NOT NULL THEN
      -- Atualiza o registro existente em relatorios_atividades
      UPDATE public.relatorios_atividades 
      SET 
        atividade = NEW.atividade,
        updated_at = now()
      WHERE id = NEW.relatorio_atividade_id;
      
      -- Se não encontrou o registro, cria um novo
      IF NOT FOUND THEN
        INSERT INTO public.relatorios_atividades (
          id,
          relatorio_id,
          atividade,
          juntas_ids,
          horas_informadas,
          total_pessoas_equipe,
          horas_totais,
          detalhes_equipe,
          created_at,
          updated_at
        ) VALUES (
          NEW.relatorio_atividade_id,
          gen_random_uuid(), -- Temporário, será definido pelo contexto
          NEW.atividade,
          ARRAY[NEW.junta_id],
          0, -- Valor padrão
          1, -- Valor padrão
          0, -- Valor padrão
          '{}', -- JSON vazio
          now(),
          now()
        );
      END IF;
    END IF;
    
    RETURN NEW;
  END IF;
  
  -- Se for DELETE em status_juntas
  IF TG_OP = 'DELETE' THEN
    -- Remove referência da junta no array juntas_ids
    UPDATE public.relatorios_atividades 
    SET 
      juntas_ids = array_remove(juntas_ids, OLD.junta_id),
      updated_at = now()
    WHERE id = OLD.relatorio_atividade_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para sincronização automática
CREATE TRIGGER trigger_sync_status_juntas
  AFTER INSERT OR UPDATE OR DELETE ON public.status_juntas
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_status_juntas_to_relatorios();

-- Função para re-sincronização manual completa
CREATE OR REPLACE FUNCTION public.manual_sync_all_status_juntas()
RETURNS TEXT AS $$
DECLARE
  sync_count INTEGER := 0;
  status_record RECORD;
BEGIN
  -- Atualiza todos os registros de relatorios_atividades baseado em status_juntas
  FOR status_record IN 
    SELECT DISTINCT ON (relatorio_atividade_id) 
      relatorio_atividade_id, 
      atividade,
      array_agg(junta_id) as junta_ids
    FROM public.status_juntas 
    WHERE relatorio_atividade_id IS NOT NULL
    GROUP BY relatorio_atividade_id, atividade
  LOOP
    -- Atualiza o registro correspondente
    UPDATE public.relatorios_atividades 
    SET 
      atividade = status_record.atividade,
      juntas_ids = status_record.junta_ids,
      updated_at = now()
    WHERE id = status_record.relatorio_atividade_id;
    
    IF FOUND THEN
      sync_count := sync_count + 1;
    END IF;
  END LOOP;
  
  RETURN 'Sincronização completa finalizada. ' || sync_count || ' registros atualizados.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar status da sincronização
CREATE OR REPLACE FUNCTION public.check_sync_status()
RETURNS TABLE (
  status_juntas_count BIGINT,
  relatorios_atividades_count BIGINT,
  orphaned_status_count BIGINT,
  last_sync_check TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.status_juntas),
    (SELECT COUNT(*) FROM public.relatorios_atividades),
    (SELECT COUNT(*) FROM public.status_juntas sj 
     WHERE sj.relatorio_atividade_id IS NOT NULL 
     AND NOT EXISTS (
       SELECT 1 FROM public.relatorios_atividades ra 
       WHERE ra.id = sj.relatorio_atividade_id
     )),
    now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;