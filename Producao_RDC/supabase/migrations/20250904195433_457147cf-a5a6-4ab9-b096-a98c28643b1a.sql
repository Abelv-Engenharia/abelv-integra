-- Remove the overly permissive policies from all tables
DROP POLICY IF EXISTS "Allow all access to encarregados" ON public.encarregados;
DROP POLICY IF EXISTS "Allow all access to relatorios_mecanica" ON public.relatorios_mecanica;
DROP POLICY IF EXISTS "Allow all access to relatorios_atividades" ON public.relatorios_atividades;

-- Create secure RLS policies for encarregados table that require authentication
CREATE POLICY "authenticated_users_can_read_encarregados" 
ON public.encarregados 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "authenticated_users_can_insert_encarregados" 
ON public.encarregados 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_update_encarregados" 
ON public.encarregados 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_delete_encarregados" 
ON public.encarregados 
FOR DELETE 
TO authenticated 
USING (true);

-- Create secure RLS policies for relatorios_mecanica table
CREATE POLICY "authenticated_users_can_read_relatorios_mecanica" 
ON public.relatorios_mecanica 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "authenticated_users_can_insert_relatorios_mecanica" 
ON public.relatorios_mecanica 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_update_relatorios_mecanica" 
ON public.relatorios_mecanica 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_delete_relatorios_mecanica" 
ON public.relatorios_mecanica 
FOR DELETE 
TO authenticated 
USING (true);

-- Create secure RLS policies for relatorios_atividades table
CREATE POLICY "authenticated_users_can_read_relatorios_atividades" 
ON public.relatorios_atividades 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "authenticated_users_can_insert_relatorios_atividades" 
ON public.relatorios_atividades 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_update_relatorios_atividades" 
ON public.relatorios_atividades 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_delete_relatorios_atividades" 
ON public.relatorios_atividades 
FOR DELETE 
TO authenticated 
USING (true);