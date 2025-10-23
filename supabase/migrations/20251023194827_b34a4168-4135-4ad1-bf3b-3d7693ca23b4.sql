-- Criar função para verificar permissão de medidas disciplinares
CREATE OR REPLACE FUNCTION public.user_can_manage_medidas_disciplinares(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  has_permission boolean := false;
BEGIN
  SELECT (p.permissoes->>'medidas_disciplinares')::boolean
  INTO has_permission
  FROM public.usuario_perfis up
  JOIN public.perfis p ON up.perfil_id = p.id
  WHERE up.usuario_id = user_id_param
  LIMIT 1;
  
  RETURN COALESCE(has_permission, false);
END;
$$;

-- Drop políticas antigas
DROP POLICY IF EXISTS "Medidas disciplinares - criar (admin)" ON medidas_disciplinares;
DROP POLICY IF EXISTS "Medidas disciplinares - atualizar (admin)" ON medidas_disciplinares;
DROP POLICY IF EXISTS "Medidas disciplinares - deletar (admin)" ON medidas_disciplinares;

-- Criar novas políticas com a função correta
CREATE POLICY "Medidas disciplinares - criar"
ON medidas_disciplinares
FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_medidas_disciplinares(auth.uid()));

CREATE POLICY "Medidas disciplinares - atualizar"
ON medidas_disciplinares
FOR UPDATE
TO authenticated
USING (user_can_manage_medidas_disciplinares(auth.uid()))
WITH CHECK (user_can_manage_medidas_disciplinares(auth.uid()));

CREATE POLICY "Medidas disciplinares - deletar"
ON medidas_disciplinares
FOR DELETE
TO authenticated
USING (user_can_manage_medidas_disciplinares(auth.uid()));