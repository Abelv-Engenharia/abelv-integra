-- Criar sequência para números de RNC
CREATE SEQUENCE IF NOT EXISTS public.rnc_numero_seq START WITH 1 INCREMENT BY 1;

-- Criar função para gerar número da RNC automaticamente
CREATE OR REPLACE FUNCTION public.gerar_numero_rnc()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $function$
BEGIN
  IF NEW.numero IS NULL OR NEW.numero = '' THEN
    NEW.numero := LPAD(nextval('rnc_numero_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$function$;

-- Criar trigger para executar a função antes de inserir
DROP TRIGGER IF EXISTS trigger_gerar_numero_rnc ON public.rncs;
CREATE TRIGGER trigger_gerar_numero_rnc
  BEFORE INSERT ON public.rncs
  FOR EACH ROW
  EXECUTE FUNCTION public.gerar_numero_rnc();