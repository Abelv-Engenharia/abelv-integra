
-- Create many-to-many relationship table for funcionarios and ccas
CREATE TABLE public.funcionario_ccas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id uuid NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  cca_id integer NOT NULL REFERENCES public.ccas(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(funcionario_id, cca_id)
);

-- Enable RLS on the new table
ALTER TABLE public.funcionario_ccas ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for funcionario_ccas
CREATE POLICY "Permitir acesso a funcionario_ccas" 
ON public.funcionario_ccas 
FOR ALL 
USING (true);

-- Remove the old cca_id column from funcionarios table
ALTER TABLE public.funcionarios DROP COLUMN IF EXISTS cca_id;

-- Add index for better performance
CREATE INDEX idx_funcionario_ccas_funcionario_id ON public.funcionario_ccas(funcionario_id);
CREATE INDEX idx_funcionario_ccas_cca_id ON public.funcionario_ccas(cca_id);
