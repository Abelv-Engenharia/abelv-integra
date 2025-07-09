
-- Add the ativo column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN ativo boolean DEFAULT true NOT NULL;

-- Update existing profiles to be active by default
UPDATE public.profiles 
SET ativo = true 
WHERE ativo IS NULL;
