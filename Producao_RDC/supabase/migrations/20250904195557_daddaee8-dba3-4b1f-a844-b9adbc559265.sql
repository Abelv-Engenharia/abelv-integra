-- Create user roles enum for better access control
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'user');

-- Create user profiles table to manage user roles and permissions
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  department TEXT,
  can_view_employee_contacts BOOLEAN DEFAULT FALSE,
  can_manage_employees BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user permissions
CREATE OR REPLACE FUNCTION public.has_employee_access()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND (role IN ('admin', 'manager') OR can_view_employee_contacts = true)
  );
$$;

-- Create function to check if user can manage employees
CREATE OR REPLACE FUNCTION public.can_manage_employees()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'admin' OR can_manage_employees = true)
  );
$$;

-- Drop existing permissive policies for encarregados
DROP POLICY IF EXISTS "authenticated_users_can_read_encarregados" ON public.encarregados;
DROP POLICY IF EXISTS "authenticated_users_can_insert_encarregados" ON public.encarregados;
DROP POLICY IF EXISTS "authenticated_users_can_update_encarregados" ON public.encarregados;
DROP POLICY IF EXISTS "authenticated_users_can_delete_encarregados" ON public.encarregados;

-- Create restrictive RLS policies for encarregados based on permissions
CREATE POLICY "authorized_users_can_read_encarregados" 
ON public.encarregados 
FOR SELECT 
TO authenticated 
USING (public.has_employee_access());

CREATE POLICY "managers_can_insert_encarregados" 
ON public.encarregados 
FOR INSERT 
TO authenticated 
WITH CHECK (public.can_manage_employees());

CREATE POLICY "managers_can_update_encarregados" 
ON public.encarregados 
FOR UPDATE 
TO authenticated 
USING (public.can_manage_employees()) 
WITH CHECK (public.can_manage_employees());

CREATE POLICY "managers_can_delete_encarregados" 
ON public.encarregados 
FOR DELETE 
TO authenticated 
USING (public.can_manage_employees());

-- Create RLS policies for user_profiles
CREATE POLICY "users_can_read_own_profile" 
ON public.user_profiles 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "admins_can_read_all_profiles" 
ON public.user_profiles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "users_can_update_own_profile" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_can_manage_all_profiles" 
ON public.user_profiles 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_profiles_updated_at();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, role, can_view_employee_contacts, can_manage_employees)
  VALUES (NEW.id, 'user', false, false);
  RETURN NEW;
END;
$$;

-- Create trigger for automatic user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();