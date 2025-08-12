-- Secure public.profiles access to prevent public exposure of personal data
-- 1) Ensure table exists and enable Row Level Security
DO $$ BEGIN
  IF to_regclass('public.profiles') IS NULL THEN
    RAISE EXCEPTION 'Table public.profiles does not exist';
  END IF;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2) Drop ALL existing policies on profiles to avoid permissive OR conditions
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT polname FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.polname);
  END LOOP;
END $$;

-- 3) Create strict policies using get_user_permissions for admin checks
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() IS NOT NULL AND auth.uid() = id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true))
WITH CHECK (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

-- Users can insert their own profile (helps when not using trigger)
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Admins can insert profiles
CREATE POLICY "Admins can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

-- Only admins can delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

-- 4) Optional hardening: ensure no residual privileges for anon role
REVOKE ALL ON public.profiles FROM anon;