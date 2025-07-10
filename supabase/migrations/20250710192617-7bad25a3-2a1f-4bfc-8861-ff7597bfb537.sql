
-- Add cca_id column to funcionarios table
ALTER TABLE public.funcionarios 
ADD COLUMN cca_id integer REFERENCES public.ccas(id);

-- Create index for better performance
CREATE INDEX idx_funcionarios_cca_id ON public.funcionarios(cca_id);
