-- Atualizar função user_can_manage_solicitacoes para incluir permissões específicas de Gestão de Pessoas
CREATE OR REPLACE FUNCTION public.user_can_manage_solicitacoes(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_perms TEXT[];
BEGIN
  -- Admin sistema tem acesso total
  IF public.has_role(user_id_param, 'admin_sistema') THEN
    RETURN true;
  END IF;
  
  -- Obter permissões do usuário
  user_perms := get_user_permissions(user_id_param);
  
  -- Verificar permissão global (wildcard)
  IF '*'::text = ANY(user_perms) THEN
    RETURN true;
  END IF;
  
  -- Verificar permissão legada
  IF 'solicitacoes_gestao'::text = ANY(user_perms) THEN
    RETURN true;
  END IF;
  
  -- Verificar permissões específicas de gestão de solicitações
  IF 'gestao_pessoas_solicitacoes_visualizar'::text = ANY(user_perms) THEN
    RETURN true;
  END IF;
  
  IF 'gestao_pessoas_solicitacoes_editar'::text = ANY(user_perms) THEN
    RETURN true;
  END IF;
  
  IF 'gestao_pessoas_solicitacoes_aprovar'::text = ANY(user_perms) THEN
    RETURN true;
  END IF;
  
  IF 'gestao_pessoas_solicitacoes_pagina_controle'::text = ANY(user_perms) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;