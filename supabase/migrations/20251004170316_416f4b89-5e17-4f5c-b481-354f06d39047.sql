-- Atualizar função get_user_allowed_ccas para suportar ambos os sistemas
CREATE OR REPLACE FUNCTION public.get_user_allowed_ccas(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  allowed_ccas jsonb;
BEGIN
  -- 1. Tentar buscar do sistema NOVO (usuario_perfis + perfis)
  SELECT p.ccas_permitidas
  INTO allowed_ccas
  FROM public.usuario_perfis up
  JOIN public.perfis p ON up.perfil_id = p.id
  WHERE up.usuario_id = user_id_param
  LIMIT 1;
  
  -- 2. Se não encontrou, buscar do sistema ANTIGO (profiles.ccas_permitidas)
  IF allowed_ccas IS NULL THEN
    SELECT pr.ccas_permitidas
    INTO allowed_ccas
    FROM public.profiles pr
    WHERE pr.id = user_id_param;
  END IF;
  
  -- 3. Retornar CCAs encontrados ou array vazio
  RETURN COALESCE(allowed_ccas, '[]'::jsonb);
END;
$$;