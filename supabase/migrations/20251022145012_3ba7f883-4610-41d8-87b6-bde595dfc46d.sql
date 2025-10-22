-- Adicionar nova coluna cca_id com referência para ccas
ALTER TABLE public.veiculos_pedagogios_estacionamentos 
ADD COLUMN IF NOT EXISTS cca_id INTEGER REFERENCES public.ccas(id) ON DELETE SET NULL;

-- Adicionar coluna veiculo_id como UUID para referenciar veículos
ALTER TABLE public.veiculos_pedagogios_estacionamentos
ADD COLUMN IF NOT EXISTS veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL;

-- Adicionar coluna condutor_id como UUID
ALTER TABLE public.veiculos_pedagogios_estacionamentos
ADD COLUMN IF NOT EXISTS condutor_id UUID;

-- Adicionar coluna condutor_nome
ALTER TABLE public.veiculos_pedagogios_estacionamentos
ADD COLUMN IF NOT EXISTS condutor_nome TEXT;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_veiculos_pedagogios_cca ON public.veiculos_pedagogios_estacionamentos(cca_id);
CREATE INDEX IF NOT EXISTS idx_veiculos_pedagogios_veiculo ON public.veiculos_pedagogios_estacionamentos(veiculo_id);

-- Remover coluna antiga cca (texto) se existir
ALTER TABLE public.veiculos_pedagogios_estacionamentos 
DROP COLUMN IF EXISTS cca;