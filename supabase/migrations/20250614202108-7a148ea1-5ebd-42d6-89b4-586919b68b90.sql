
-- Função trigger para emitir evento NOTIFY ao excluir execução de treinamento
CREATE OR REPLACE FUNCTION public.notify_execucao_deleted()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove trigger antigo se houver
DROP TRIGGER IF EXISTS trg_notify_execucao_deleted ON public.execucao_treinamentos;

-- Cria trigger AFTER DELETE
CREATE TRIGGER trg_notify_execucao_deleted
AFTER DELETE ON public.execucao_treinamentos
FOR EACH ROW
EXECUTE FUNCTION public.notify_execucao_deleted();
