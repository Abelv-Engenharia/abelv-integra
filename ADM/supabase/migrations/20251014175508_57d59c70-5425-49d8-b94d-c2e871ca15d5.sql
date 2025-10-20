-- Corrigir search_path da função sync_colaborador_efetivo
CREATE OR REPLACE FUNCTION sync_colaborador_efetivo()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_disciplina text;
  v_tipo_colaborador text;
BEGIN
  -- Quando sienge_funcional_id for preenchido e enviado = true, criar entrada em colaboradores_efetivo
  IF NEW.sienge_funcional_id IS NOT NULL 
     AND NEW.enviado = true 
     AND (OLD.sienge_funcional_id IS NULL OR OLD.enviado = false) THEN
    
    -- Mapear disciplina baseada na função
    v_disciplina := CASE 
      WHEN NEW.funcao ILIKE '%engenheiro%' THEN 'civil'
      WHEN NEW.funcao ILIKE '%técnico%' THEN 'elétrica'
      WHEN NEW.funcao ILIKE '%pedreiro%' THEN 'civil'
      WHEN NEW.funcao ILIKE '%eletricista%' THEN 'elétrica'
      WHEN NEW.funcao ILIKE '%coordenador%' THEN 'mecânica'
      WHEN NEW.funcao ILIKE '%encarregado%' THEN 'civil'
      WHEN NEW.funcao ILIKE '%ajudante%' THEN 'civil'
      WHEN NEW.funcao ILIKE '%montador%' THEN 'container'
      WHEN NEW.funcao ILIKE '%operador%' THEN 'operadores'
      WHEN NEW.funcao ILIKE '%encanador%' THEN 'isolamento'
      ELSE 'civil'
    END;
    
    -- Determinar tipo de colaborador (assumindo ABELV por padrão)
    v_tipo_colaborador := 'abelv';
    
    INSERT INTO colaboradores_efetivo (
      validacao_admissao_id,
      empresa,
      nome,
      cpf,
      funcao,
      disciplina,
      classificacao,
      cca_codigo,
      cca_nome,
      tipo_colaborador,
      data_admissao,
      sienge_funcional_id,
      status
    ) VALUES (
      NEW.id,
      'ABELV',
      NEW.nome_completo,
      NEW.cpf,
      NEW.funcao,
      v_disciplina,
      'MO - DIRETA',
      NEW.cca_codigo,
      NEW.cca_nome,
      v_tipo_colaborador,
      NEW.data_admissao,
      NEW.sienge_funcional_id,
      'ativo'
    )
    ON CONFLICT (validacao_admissao_id) DO UPDATE
    SET 
      sienge_funcional_id = EXCLUDED.sienge_funcional_id,
      status = 'ativo',
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;