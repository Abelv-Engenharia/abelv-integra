-- Adicionar campo cca_id nas tabelas de encarregados
ALTER TABLE public.encarregados 
ADD COLUMN cca_id uuid REFERENCES public.ccas(id);

ALTER TABLE public.encarregados_eletrica 
ADD COLUMN cca_id uuid REFERENCES public.ccas(id);

-- Criar índices para melhorar performance
CREATE INDEX idx_encarregados_cca_id ON public.encarregados(cca_id);
CREATE INDEX idx_encarregados_eletrica_cca_id ON public.encarregados_eletrica(cca_id);