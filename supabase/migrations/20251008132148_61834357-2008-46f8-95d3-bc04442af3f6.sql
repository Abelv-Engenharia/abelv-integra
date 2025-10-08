-- Ajustar autorização para admin_sistema nas políticas e trigger de usuario_perfis

-- 1) Atualiza função de validação para aceitar admin_sistema
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  -- Impedir o próprio usuário de alterar seus papéis
  IF auth.uid() = NEW.usuario_id THEN
    RAISE EXCEPTION 'Users cannot modify their own roles';
  END IF;

  -- Permitir admin_sistema OU admin_usuarios
  IF NOT (
    public.has_role(auth.uid(), 'admin_sistema')
    OR '*' = ANY(public.get_user_permissions(auth.uid()))
    OR 'admin_usuarios' = ANY(public.get_user_permissions(auth.uid()))
  ) THEN
    RAISE EXCEPTION 'Only administrators can assign roles';
  END IF;

  RETURN NEW;
end;
$function$;

-- 2) Recria políticas da tabela usuario_perfis aceitando admin_sistema
DROP POLICY IF EXISTS "usuario_perfis_select_admin_usuarios" ON public.usuario_perfis;
DROP POLICY IF EXISTS "usuario_perfis_insert_admin_usuarios" ON public.usuario_perfis;
DROP POLICY IF EXISTS "usuario_perfis_update_admin_usuarios" ON public.usuario_perfis;
DROP POLICY IF EXISTS "usuario_perfis_delete_admin_usuarios" ON public.usuario_perfis;

CREATE POLICY "usuario_perfis_select_admin"
ON public.usuario_perfis FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(public.get_user_permissions(auth.uid()))
  OR 'admin_usuarios' = ANY(public.get_user_permissions(auth.uid()))
);

CREATE POLICY "usuario_perfis_insert_admin"
ON public.usuario_perfis FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(public.get_user_permissions(auth.uid()))
  OR 'admin_usuarios' = ANY(public.get_user_permissions(auth.uid()))
);

CREATE POLICY "usuario_perfis_update_admin"
ON public.usuario_perfis FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(public.get_user_permissions(auth.uid()))
  OR 'admin_usuarios' = ANY(public.get_user_permissions(auth.uid()))
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(public.get_user_permissions(auth.uid()))
  OR 'admin_usuarios' = ANY(public.get_user_permissions(auth.uid()))
);

CREATE POLICY "usuario_perfis_delete_admin"
ON public.usuario_perfis FOR DELETE
USING (
  public.has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(public.get_user_permissions(auth.uid()))
  OR 'admin_usuarios' = ANY(public.get_user_permissions(auth.uid()))
);