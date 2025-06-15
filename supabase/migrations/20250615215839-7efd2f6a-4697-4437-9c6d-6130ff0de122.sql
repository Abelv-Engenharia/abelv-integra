
-- Corrige search_path na função set_updated_at_execucao_hsa

CREATE OR REPLACE FUNCTION public.set_updated_at_execucao_hsa()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
