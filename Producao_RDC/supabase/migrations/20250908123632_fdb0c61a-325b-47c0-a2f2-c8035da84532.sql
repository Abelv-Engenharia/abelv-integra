-- Remove the restrictive RLS policies for encarregados
DROP POLICY IF EXISTS "authorized_users_can_read_encarregados" ON public.encarregados;
DROP POLICY IF EXISTS "managers_can_insert_encarregados" ON public.encarregados;
DROP POLICY IF EXISTS "managers_can_update_encarregados" ON public.encarregados;
DROP POLICY IF EXISTS "managers_can_delete_encarregados" ON public.encarregados;

-- Create simple policies that allow all authenticated users to access encarregados
CREATE POLICY "authenticated_users_can_read_encarregados" 
ON public.encarregados 
FOR SELECT 
USING (true);

CREATE POLICY "authenticated_users_can_insert_encarregados" 
ON public.encarregados 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_update_encarregados" 
ON public.encarregados 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_delete_encarregados" 
ON public.encarregados 
FOR DELETE 
USING (true);

-- Remove the permission check functions as they're no longer needed
DROP FUNCTION IF EXISTS public.has_employee_access();
DROP FUNCTION IF EXISTS public.can_manage_employees();

-- Keep the user_profiles table but remove the permission-related columns
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS can_view_employee_contacts,
DROP COLUMN IF EXISTS can_manage_employees;

-- Simplify the user_profiles RLS policies to just allow users to manage their own profiles
DROP POLICY IF EXISTS "admins_can_manage_all_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "admins_can_read_all_profiles" ON public.user_profiles;