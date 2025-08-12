
-- ========================================
-- CRITICAL SECURITY FIXES - PRIORITY 1
-- ========================================

-- 1. Fix Critical Privilege Escalation in usuario_perfis table
-- Remove overly permissive policy and replace with secure admin-only policies
DROP POLICY IF EXISTS "Permitir para usuários autenticados" ON public.usuario_perfis;

-- Only admins can manage user role assignments
CREATE POLICY "Admin podem gerenciar associações usuario_perfis" 
ON public.usuario_perfis 
FOR ALL 
USING (((get_user_permissions(auth.uid()) ->> 'admin_usuarios'::text))::boolean = true)
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_usuarios'::text))::boolean = true);

-- Users can only view their own role assignment (for UI purposes)
CREATE POLICY "Usuários podem ver próprio perfil" 
ON public.usuario_perfis 
FOR SELECT 
USING (auth.uid() = usuario_id);

-- 2. Secure profiles table - restrict to own profile + admin access
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem visualizar perfis" ON public.profiles;

-- Users can view and update only their own profile
CREATE POLICY "Usuários podem ver próprio perfil" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id OR ((get_user_permissions(auth.uid()) ->> 'admin_usuarios'::text))::boolean = true);

CREATE POLICY "Usuários podem atualizar próprio perfil" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can insert new profiles
CREATE POLICY "Admin podem criar perfis" 
ON public.profiles 
FOR INSERT 
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_usuarios'::text))::boolean = true);

-- Admins can delete profiles
CREATE POLICY "Admin podem excluir perfis" 
ON public.profiles 
FOR DELETE 
USING (((get_user_permissions(auth.uid()) ->> 'admin_usuarios'::text))::boolean = true);

-- 3. Strengthen funcionarios table policies to prevent unauthorized PII access
DROP POLICY IF EXISTS "Usuários podem visualizar funcionários de CCAs permitidas" ON public.funcionarios;

-- More restrictive policy for viewing employee data
CREATE POLICY "Usuários podem ver funcionários de CCAs permitidas" 
ON public.funcionarios 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    user_can_manage_funcionarios(auth.uid()) OR 
    (cca_id IS NOT NULL AND get_user_allowed_ccas(auth.uid()) ? (cca_id)::text)
  )
);

-- 4. Restrict empresas table to need-to-know basis
DROP POLICY IF EXISTS "Permitir acesso a usuário autenticado" ON public.empresas;
DROP POLICY IF EXISTS "Permitir todas operações em empresas" ON public.empresas;

-- Only users with proper permissions can access company data
CREATE POLICY "Admin podem gerenciar empresas" 
ON public.empresas 
FOR ALL 
USING (((get_user_permissions(auth.uid()) ->> 'admin_empresas'::text))::boolean = true OR user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Usuários podem ver empresas de CCAs permitidas" 
ON public.empresas 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    user_can_manage_funcionarios(auth.uid()) OR
    (cca_id IS NOT NULL AND get_user_allowed_ccas(auth.uid()) ? (cca_id)::text)
  )
);

-- 5. Limit staff directory access (encarregados, engenheiros)
DROP POLICY IF EXISTS "Permitir acesso" ON public.encarregados;

CREATE POLICY "Usuários autenticados podem ver encarregados" 
ON public.encarregados 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin podem gerenciar encarregados" 
ON public.encarregados 
FOR ALL 
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

DROP POLICY IF EXISTS "Permitir acesso" ON public.engenheiros;
DROP POLICY IF EXISTS "Permitir todas operações em engenheiros" ON public.engenheiros;

CREATE POLICY "Usuários autenticados podem ver engenheiros" 
ON public.engenheiros 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin podem gerenciar engenheiros" 
ON public.engenheiros 
FOR ALL 
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- ========================================
-- PRIORITY 2: DATABASE FUNCTION SECURITY
-- ========================================

-- Secure all database functions with proper search_path
-- Update existing functions to include security measures

CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_permissions jsonb;
BEGIN
  SELECT p.permissoes
  INTO user_permissions
  FROM public.usuario_perfis up
  JOIN public.perfis p ON up.perfil_id = p.id
  WHERE up.usuario_id = user_id_param
  LIMIT 1;
  
  RETURN COALESCE(user_permissions, '{}'::jsonb);
END;
$function$;

CREATE OR REPLACE FUNCTION public.user_can_manage_funcionarios(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  has_permission boolean := false;
BEGIN
  SELECT (p.permissoes->>'admin_funcionarios')::boolean
  INTO has_permission
  FROM public.usuario_perfis up
  JOIN public.perfis p ON up.perfil_id = p.id
  WHERE up.usuario_id = user_id_param
  LIMIT 1;
  
  RETURN COALESCE(has_permission, false);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_allowed_ccas(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  allowed_ccas jsonb;
BEGIN
  SELECT p.ccas_permitidas
  INTO allowed_ccas
  FROM public.usuario_perfis up
  JOIN public.perfis p ON up.perfil_id = p.id
  WHERE up.usuario_id = user_id_param
  LIMIT 1;
  
  RETURN COALESCE(allowed_ccas, '[]'::jsonb);
END;
$function$;

-- Add function to audit role changes
CREATE OR REPLACE FUNCTION public.audit_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log role changes for security monitoring
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    details,
    timestamp
  ) VALUES (
    auth.uid(),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'role_assigned'
      WHEN TG_OP = 'UPDATE' THEN 'role_updated'
      WHEN TG_OP = 'DELETE' THEN 'role_removed'
    END,
    'usuario_perfis',
    COALESCE(NEW.usuario_id::text, OLD.usuario_id::text),
    jsonb_build_object(
      'old_perfil_id', OLD.perfil_id,
      'new_perfil_id', NEW.perfil_id,
      'target_user_id', COALESCE(NEW.usuario_id, OLD.usuario_id)
    ),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger for role change auditing
DROP TRIGGER IF EXISTS audit_usuario_perfis_changes ON public.usuario_perfis;
CREATE TRIGGER audit_usuario_perfis_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.usuario_perfis
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

-- Add function to validate role assignments
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Prevent users from assigning roles to themselves
  IF auth.uid() = NEW.usuario_id THEN
    RAISE EXCEPTION 'Users cannot modify their own roles';
  END IF;
  
  -- Only allow admin users to assign roles
  IF NOT ((get_user_permissions(auth.uid()) ->> 'admin_usuarios'::text))::boolean THEN
    RAISE EXCEPTION 'Only administrators can assign roles';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for role assignment validation
DROP TRIGGER IF EXISTS validate_role_assignment_trigger ON public.usuario_perfis;
CREATE TRIGGER validate_role_assignment_trigger
  BEFORE INSERT OR UPDATE ON public.usuario_perfis
  FOR EACH ROW EXECUTE FUNCTION public.validate_role_assignment();
