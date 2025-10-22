-- Adicionar novos campos à tabela cabos_eletrica
ALTER TABLE cabos_eletrica 
ADD COLUMN IF NOT EXISTS disciplina text NOT NULL DEFAULT 'Elétrica',
ADD COLUMN IF NOT EXISTS area_id uuid REFERENCES areas_projeto(id),
ADD COLUMN IF NOT EXISTS sub_area text,
ADD COLUMN IF NOT EXISTS circuito text,
ADD COLUMN IF NOT EXISTS ponto_origem text,
ADD COLUMN IF NOT EXISTS ponto_destino text;

-- Remover campos antigos que não serão mais utilizados
ALTER TABLE cabos_eletrica 
DROP COLUMN IF EXISTS desenho_id,
DROP COLUMN IF EXISTS descricao;

-- Comentários para documentação
COMMENT ON COLUMN cabos_eletrica.disciplina IS 'Disciplina do cabo (ex: Elétrica, Instrumentação)';
COMMENT ON COLUMN cabos_eletrica.area_id IS 'Referência para a área do projeto';
COMMENT ON COLUMN cabos_eletrica.sub_area IS 'Sub-área específica dentro da área';
COMMENT ON COLUMN cabos_eletrica.circuito IS 'Identificador do circuito';
COMMENT ON COLUMN cabos_eletrica.ponto_origem IS 'Ponto de origem do cabo (DE)';
COMMENT ON COLUMN cabos_eletrica.ponto_destino IS 'Ponto de destino do cabo (PARA)';
COMMENT ON COLUMN cabos_eletrica.dimensao IS 'Bitola do cabo';
COMMENT ON COLUMN cabos_eletrica.tipo_cabo IS 'Tipo de cabo (ex: PP, PVC, XLPE)';