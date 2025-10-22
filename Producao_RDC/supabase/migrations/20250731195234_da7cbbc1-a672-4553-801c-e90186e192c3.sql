-- Alterar a unidade padrão de diâmetros de juntas de 'mm' para 'pol'
ALTER TABLE public.diametros_juntas 
ALTER COLUMN unidade_medida SET DEFAULT 'pol';