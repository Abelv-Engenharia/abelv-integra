-- Adicionar novos campos para workflow e emails de alerta
ALTER TABLE analises_contratuais
ADD COLUMN IF NOT EXISTS bloco_atual text DEFAULT 'cadastro',
ADD COLUMN IF NOT EXISTS email_validacao_adm text,
ADD COLUMN IF NOT EXISTS email_validacao_financeiro text,
ADD COLUMN IF NOT EXISTS email_validacao_documentacao text,
ADD COLUMN IF NOT EXISTS email_assinatura text DEFAULT 'isabela.grecco@abelv.com.br',
ADD COLUMN IF NOT EXISTS data_assinatura date;

-- Garantir que campos de observação existam
ALTER TABLE analises_contratuais
ADD COLUMN IF NOT EXISTS observacao_adm text,
ADD COLUMN IF NOT EXISTS observacao_financeiro text,
ADD COLUMN IF NOT EXISTS observacao_super text;

-- Criar índice para bloco_atual para melhorar performance
CREATE INDEX IF NOT EXISTS idx_analises_bloco_atual ON analises_contratuais(bloco_atual);

-- Comentários para documentação
COMMENT ON COLUMN analises_contratuais.bloco_atual IS 'Workflow: cadastro | validacao_adm | validacao_financeiro | validacao_documentacao | validacao_superintendencia | aguardando_assinatura | concluido';
COMMENT ON COLUMN analises_contratuais.email_validacao_adm IS 'Email para alertas da validação ADM Matricial (dados do imóvel)';
COMMENT ON COLUMN analises_contratuais.email_validacao_financeiro IS 'Email para alertas da validação Financeira';
COMMENT ON COLUMN analises_contratuais.email_validacao_documentacao IS 'Email para alertas da validação de Documentação (mesmo que ADM)';
COMMENT ON COLUMN analises_contratuais.email_assinatura IS 'Email para envio final de assinatura (padrão: Isabela Grecco)';