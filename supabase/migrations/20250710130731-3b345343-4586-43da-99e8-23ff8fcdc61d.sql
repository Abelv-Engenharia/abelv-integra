
-- Criar tabela de relacionamento entre encarregados e CCAs
CREATE TABLE public.encarregado_ccas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  encarregado_id uuid NOT NULL REFERENCES public.encarregados(id) ON DELETE CASCADE,
  cca_id integer NOT NULL REFERENCES public.ccas(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(encarregado_id, cca_id)
);

-- Habilitar RLS na nova tabela
ALTER TABLE public.encarregado_ccas ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso
CREATE POLICY "Permitir acesso a encarregado_ccas" 
ON public.encarregado_ccas 
FOR ALL 
USING (true);

-- Migrar dados existentes da coluna cca_id para a nova tabela
INSERT INTO public.encarregado_ccas (encarregado_id, cca_id)
SELECT id, cca_id 
FROM public.encarregados 
WHERE cca_id IS NOT NULL;

-- Remover a coluna cca_id da tabela encarregados (opcional, mas recomendado)
ALTER TABLE public.encarregados DROP COLUMN cca_id;
