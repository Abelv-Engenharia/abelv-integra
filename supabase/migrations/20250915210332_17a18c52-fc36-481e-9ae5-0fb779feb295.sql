-- Continuar correção de vulnerabilidades SECURITY DEFINER - Parte 2
-- Adicionar SET search_path às funções restantes

-- Atualizar as funções que já existem e precisam do SET search_path
-- Essas são funções críticas de segurança e auditoria

-- 1. Não alterar funções que já têm search_path correto
-- Verificar quais ainda precisam ser atualizadas

-- Corrigir função notify_execucao_deleted (se ainda não tiver search_path)
CREATE OR REPLACE FUNCTION public.notify_execucao_deleted()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  url text;
BEGIN
  -- Pega a url do arquivo que deve ser excluído (se houver)
  url := OLD.lista_presenca_url;
  -- Só notifica se houver url de lista
  IF url IS NOT NULL THEN
    -- Emite evento que será consumido pelo Edge Function via replication (listen/notify)
    PERFORM
      pg_notify('execucao_lista_deleted', url);
  END IF;
  RETURN OLD;
END;
$function$;

-- Corrigir set_created_by_on_tarefas_anexos
CREATE OR REPLACE FUNCTION public.set_created_by_on_tarefas_anexos()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$function$;

-- Corrigir update_classificacao_ocorrencia_codigo  
CREATE OR REPLACE FUNCTION public.update_classificacao_ocorrencia_codigo()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Se classificacao_ocorrencia foi definida, buscar o código correspondente
  IF NEW.classificacao_ocorrencia IS NOT NULL AND NEW.classificacao_ocorrencia != '' THEN
    SELECT codigo INTO NEW.classificacao_ocorrencia_codigo
    FROM public.classificacoes_ocorrencia
    WHERE nome = NEW.classificacao_ocorrencia AND ativo = true
    LIMIT 1;
  ELSE
    NEW.classificacao_ocorrencia_codigo := NULL;
  END IF;
  
  RETURN NEW;
END;
$function$;