-- Adicionar campos para controle de aprovação em dois níveis (Gestor e RH)
ALTER TABLE prestadores_ferias
ADD COLUMN aprovadopor_gestor_id UUID REFERENCES auth.users(id),
ADD COLUMN aprovadopor_gestor TEXT,
ADD COLUMN dataaprovacao_gestor TIMESTAMPTZ,
ADD COLUMN observacoes_aprovacao_gestor TEXT,
ADD COLUMN aprovadopor_rh_id UUID REFERENCES auth.users(id),
ADD COLUMN aprovadopor_rh TEXT,
ADD COLUMN dataaprovacao_rh TIMESTAMPTZ,
ADD COLUMN observacoes_aprovacao_rh TEXT;