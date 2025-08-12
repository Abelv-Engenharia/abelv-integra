-- Secure public.profiles access to prevent public exposure of personal data (fixed policy drop)
DO $$ BEGIN
  IF to_regclass('public.profiles') IS NULL THEN
    RAISE EXCEPTION 'Table public.profiles does not exist';
  END IF;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies safely using catalog name policyname
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.policyname);
  END LOOP;
END $$;

-- Create strict policies
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() IS NOT NULL AND auth.uid() = id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true))
WITH CHECK (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);

CREATE POLICY "Admins can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

REVOKE ALL ON public.profiles FROM anon;