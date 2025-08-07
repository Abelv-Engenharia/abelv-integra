
-- First, let's ensure the profiles table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Now let's ensure the foreign key constraint exists on logs_importacao_funcionarios
-- First, remove any existing constraint that might be malformed
ALTER TABLE public.logs_importacao_funcionarios DROP CONSTRAINT IF EXISTS logs_importacao_funcionarios_usuario_id_fkey;

-- Add the correct foreign key constraint
ALTER TABLE public.logs_importacao_funcionarios 
ADD CONSTRAINT logs_importacao_funcionarios_usuario_id_fkey 
FOREIGN KEY (usuario_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Create a function to populate existing profiles if they don't exist
CREATE OR REPLACE FUNCTION populate_missing_profiles()
RETURNS void AS $$
BEGIN
  -- Insert profiles for any auth users that don't have a profile yet
  INSERT INTO public.profiles (id, nome, email)
  SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'nome', au.raw_user_meta_data->>'name', ''),
    au.email
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.id = au.id
  WHERE p.id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to populate missing profiles
SELECT populate_missing_profiles();

-- Create or update the trigger function for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, just return NEW
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
