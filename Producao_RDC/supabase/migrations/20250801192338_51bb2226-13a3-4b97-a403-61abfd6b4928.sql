-- Criar função para calcular soma total de DN
CREATE OR REPLACE FUNCTION public.calculate_total_dn()
RETURNS TABLE(total_dn NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT COALESCE(SUM(juntas."DN"), 0) AS total_dn
  FROM public.juntas
  WHERE juntas."DN" IS NOT NULL;
END;
$function$;