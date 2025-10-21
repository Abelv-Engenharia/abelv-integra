-- Adicionar coluna para número sequencial da solicitação
ALTER TABLE solicitacoes_servicos
ADD COLUMN numero_solicitacao INTEGER;

-- Criar sequência para gerar números automaticamente
CREATE SEQUENCE IF NOT EXISTS solicitacoes_numero_seq START 1;

-- Criar função para gerar o próximo número
CREATE OR REPLACE FUNCTION gerar_numero_solicitacao()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_solicitacao IS NULL THEN
    NEW.numero_solicitacao := nextval('solicitacoes_numero_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para preencher automaticamente antes de inserir
DROP TRIGGER IF EXISTS trigger_gerar_numero_solicitacao ON solicitacoes_servicos;
CREATE TRIGGER trigger_gerar_numero_solicitacao
  BEFORE INSERT ON solicitacoes_servicos
  FOR EACH ROW
  EXECUTE FUNCTION gerar_numero_solicitacao();

-- Atualizar registros existentes com números sequenciais
UPDATE solicitacoes_servicos
SET numero_solicitacao = row_number
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_number
  FROM solicitacoes_servicos
) sub
WHERE solicitacoes_servicos.id = sub.id;

-- Atualizar a sequência para começar após o último número usado
SELECT setval('solicitacoes_numero_seq', COALESCE((SELECT MAX(numero_solicitacao) FROM solicitacoes_servicos), 0) + 1, false);