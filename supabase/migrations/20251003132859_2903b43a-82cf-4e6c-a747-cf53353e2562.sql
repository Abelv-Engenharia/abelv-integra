-- Atualizar get_user_permissions para suportar sistema novo E antigo
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_permissions jsonb;
BEGIN
  -- 1. Tentar buscar do sistema NOVO (usuario_perfis + perfis)
  SELECT p.permissoes
  INTO user_permissions
  FROM public.usuario_perfis up
  JOIN public.perfis p ON up.perfil_id = p.id
  WHERE up.usuario_id = user_id_param
  LIMIT 1;
  
  -- 2. Se não encontrou no sistema novo, buscar do sistema ANTIGO (profiles.permissoes_customizadas)
  IF user_permissions IS NULL THEN
    SELECT pr.permissoes_customizadas
    INTO user_permissions
    FROM public.profiles pr
    WHERE pr.id = user_id_param;
  END IF;
  
  -- 3. Retornar permissões encontradas ou objeto vazio
  RETURN COALESCE(user_permissions, '{}'::jsonb);
END;
$function$;