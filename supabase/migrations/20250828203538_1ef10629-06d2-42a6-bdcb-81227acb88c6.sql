-- Corrigir função com search_path
CREATE OR REPLACE FUNCTION public.set_created_by_on_tarefas_anexos()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;