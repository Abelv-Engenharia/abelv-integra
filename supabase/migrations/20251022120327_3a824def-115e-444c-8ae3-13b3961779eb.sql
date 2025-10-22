-- Adicionar campo numero_cnh à tabela veiculos_condutores
ALTER TABLE public.veiculos_condutores
ADD COLUMN IF NOT EXISTS numero_cnh VARCHAR(11);

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_veiculos_condutores_numero_cnh ON public.veiculos_condutores(numero_cnh);