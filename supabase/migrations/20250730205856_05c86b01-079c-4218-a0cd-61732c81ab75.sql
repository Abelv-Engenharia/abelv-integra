-- Corrigir função para ter search_path definido
CREATE OR REPLACE FUNCTION update_classificacao_ocorrencia_codigo()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;