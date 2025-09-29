-- Criar função para atualizar automaticamente a coluna situacao
CREATE OR REPLACE FUNCTION update_situacao_desvios()
RETURNS TRIGGER AS $$
BEGIN
  -- Regra 1: TRATADO ou CONCLUÍDO -> CONCLUÍDO
  IF NEW.status IN ('TRATADO', 'CONCLUÍDO') THEN
    NEW.situacao := 'CONCLUÍDO';
  
  -- Regra 2 e 3: EM TRATATIVA -> EM ANDAMENTO ou PENDENTE
  ELSIF NEW.status = 'EM TRATATIVA' THEN
    IF NEW.prazo_conclusao IS NOT NULL AND NEW.prazo_conclusao > CURRENT_DATE THEN
      NEW.situacao := 'EM ANDAMENTO';
    ELSE
      NEW.situacao := 'PENDENTE';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para executar antes de INSERT ou UPDATE
CREATE TRIGGER trigger_update_situacao_desvios
  BEFORE INSERT OR UPDATE ON desvios_completos
  FOR EACH ROW
  EXECUTE FUNCTION update_situacao_desvios();

-- Atualizar todos os dados existentes baseado nas regras
UPDATE desvios_completos 
SET situacao = CASE 
  WHEN status IN ('TRATADO', 'CONCLUÍDO') THEN 'CONCLUÍDO'
  WHEN status = 'EM TRATATIVA' AND prazo_conclusao > CURRENT_DATE THEN 'EM ANDAMENTO'
  WHEN status = 'EM TRATATIVA' AND (prazo_conclusao IS NULL OR prazo_conclusao <= CURRENT_DATE) THEN 'PENDENTE'
  ELSE situacao
END
WHERE status IN ('TRATADO', 'CONCLUÍDO', 'EM TRATATIVA');