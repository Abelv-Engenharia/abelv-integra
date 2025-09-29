-- Corrigir a função replace_in_jsonb_array para incluir search_path
CREATE OR REPLACE FUNCTION replace_in_jsonb_array(arr jsonb, old_val text, new_val text)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(
      CASE 
        WHEN elem::text = to_jsonb(old_val)::text THEN to_jsonb(new_val)
        ELSE elem
      END
    )
    FROM jsonb_array_elements(arr) AS elem
  );
END;
$$;