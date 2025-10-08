-- Corrigir função de validação e políticas de usuario_perfis que usavam operador JSON em array de texto

-- 1) Função: validate_role_assignment
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Impedir o próprio usuário de alterar seus papéis
  IF auth.uid() = NEW.usuario_id THEN
    RAISE EXCEPTION 'Users cannot modify their own roles';
  END IF;
  
  -- Permitir apenas administradores de usuários
  IF NOT ('admin_usuarios' = ANY(public.get_user_permissions(auth.uid()))) THEN
    RAISE EXCEPTION 'Only administrators can assign roles';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 2) Políticas: usuario_perfis
DROP POLICY IF EXISTS "admin_usuarios pode gerenciar associações" ON public.usuario_perfis;
DROP POLICY IF EXISTS "usuario_perfis_all_using_admin_usuarios" ON public.usuario_perfis;
DROP POLICY IF EXISTS "usuario_perfis_insert_admin_usuarios" ON public.usuario_perfis;
DROP POLICY IF EXISTS "usuario_perfis_select_admin_usuarios" ON public.usuario_perfis;
DROP POLICY IF EXISTS "usuario_perfis_update_admin_usuarios" ON public.usuario_perfis;
DROP POLICY IF EXISTS "usuario_perfis_delete_admin_usuarios" ON public.usuario_perfis;

-- Select
CREATE POLICY "usuario_perfis_select_admin_usuarios"
ON public.usuario_perfis FOR SELECT
USING ('admin_usuarios' = ANY(public.get_user_permissions(auth.uid())));

-- Insert
CREATE POLICY "usuario_perfis_insert_admin_usuarios"
ON public.usuario_perfis FOR INSERT
WITH CHECK ('admin_usuarios' = ANY(public.get_user_permissions(auth.uid())));

-- Update
CREATE POLICY "usuario_perfis_update_admin_usuarios"
ON public.usuario_perfis FOR UPDATE
USING ('admin_usuarios' = ANY(public.get_user_permissions(auth.uid())))
WITH CHECK ('admin_usuarios' = ANY(public.get_user_permissions(auth.uid())));

-- Delete
CREATE POLICY "usuario_perfis_delete_admin_usuarios"
ON public.usuario_perfis FOR DELETE
USING ('admin_usuarios' = ANY(public.get_user_permissions(auth.uid())));