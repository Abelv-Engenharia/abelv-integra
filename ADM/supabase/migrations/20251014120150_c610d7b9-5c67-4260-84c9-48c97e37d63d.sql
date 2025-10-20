-- Corrigir função para incluir search_path
CREATE OR REPLACE FUNCTION obter_proximo_numero_alojamento(p_cca_codigo text, p_tipo_alojamento text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_proximo_numero integer;
BEGIN
  -- Buscar o maior número de alojamento para o CCA e tipo especificados
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(numero_contrato FROM '[0-9]+$') AS integer
    )
  ), 0) + 1
  INTO v_proximo_numero
  FROM analises_contratuais
  WHERE cca_codigo = p_cca_codigo
    AND tipo_alojamento = p_tipo_alojamento
    AND numero_contrato ~ (p_tipo_alojamento || ' ALOJAMENTO [0-9]+$');
  
  RETURN v_proximo_numero;
END;
$$;