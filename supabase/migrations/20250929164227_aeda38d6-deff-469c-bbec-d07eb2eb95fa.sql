-- Corrigir função para incluir SET search_path para segurança
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
$$ LANGUAGE plpgsql SET search_path = public;