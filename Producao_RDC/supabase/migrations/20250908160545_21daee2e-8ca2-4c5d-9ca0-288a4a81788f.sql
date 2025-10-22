-- Remove authentication requirements from all tables
-- Update user_profiles policies to allow public access
DROP POLICY IF EXISTS "users_can_read_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.user_profiles;

CREATE POLICY "Allow all access to user_profiles" 
ON public.user_profiles 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Update encarregados policies to allow public access
DROP POLICY IF EXISTS "authenticated_users_can_delete_encarregados" ON public.encarregados;
DROP POLICY IF EXISTS "authenticated_users_can_insert_encarregados" ON public.encarregados;
DROP POLICY IF EXISTS "authenticated_users_can_read_encarregados" ON public.encarregados;
DROP POLICY IF EXISTS "authenticated_users_can_update_encarregados" ON public.encarregados;

CREATE POLICY "Allow all access to encarregados" 
ON public.encarregados 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Update relatorios_atividades policies to allow public access
DROP POLICY IF EXISTS "authenticated_users_can_delete_relatorios_atividades" ON public.relatorios_atividades;
DROP POLICY IF EXISTS "authenticated_users_can_insert_relatorios_atividades" ON public.relatorios_atividades;
DROP POLICY IF EXISTS "authenticated_users_can_read_relatorios_atividades" ON public.relatorios_atividades;
DROP POLICY IF EXISTS "authenticated_users_can_update_relatorios_atividades" ON public.relatorios_atividades;

CREATE POLICY "Allow all access to relatorios_atividades" 
ON public.relatorios_atividades 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Update relatorios_mecanica policies to allow public access (if needed)
DROP POLICY IF EXISTS "authenticated_users_can_delete_relatorios_mecanica" ON public.relatorios_mecanica;
DROP POLICY IF EXISTS "authenticated_users_can_insert_relatorios_mecanica" ON public.relatorios_mecanica;
DROP POLICY IF EXISTS "authenticated_users_can_read_relatorios_mecanica" ON public.relatorios_mecanica;
DROP POLICY IF EXISTS "authenticated_users_can_update_relatorios_mecanica" ON public.relatorios_mecanica;