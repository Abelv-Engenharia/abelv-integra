-- Adicionar campo solicitacao_id na tabela notificacoes
ALTER TABLE notificacoes ADD COLUMN solicitacao_id UUID REFERENCES solicitacoes_servicos(id) ON DELETE CASCADE;

-- Criar índice para melhor performance
CREATE INDEX idx_notificacoes_solicitacao_id ON notificacoes(solicitacao_id);