-- Correção de segurança: Adicionar search_path à função validar_status_cnh

CREATE OR REPLACE FUNCTION public.validar_status_cnh()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.validade_cnh < CURRENT_DATE THEN
    NEW.status_cnh := 'vencida';
  ELSIF NEW.validade_cnh <= CURRENT_DATE + INTERVAL '30 days' AND NEW.status_cnh = 'ativa' THEN
    -- Mantém como ativa mas sinaliza que está vencendo
    NEW.status_cnh := 'ativa';
  END IF;
  RETURN NEW;
END;
$$;