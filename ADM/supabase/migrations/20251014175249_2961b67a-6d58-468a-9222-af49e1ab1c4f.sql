-- Criar tabela colaboradores_efetivo para centralizar dados de colaboradores
CREATE TABLE colaboradores_efetivo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  validacao_admissao_id uuid REFERENCES validacao_admissao(id),
  empresa text NOT NULL,
  nome text NOT NULL,
  cpf text NOT NULL,
  funcao text NOT NULL,
  disciplina text NOT NULL,
  classificacao text NOT NULL DEFAULT 'MO - DIRETA',
  cca_codigo text,
  cca_nome text,
  tipo_colaborador text NOT NULL, -- 'abelv', 'terceiro'
  status text NOT NULL DEFAULT 'ativo', -- 'ativo', 'inativo', 'desligado'
  data_admissao date,
  data_inclusao timestamp with time zone DEFAULT now(),
  sienge_funcional_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(validacao_admissao_id)
);

-- Índices para melhor performance
CREATE INDEX idx_colaboradores_efetivo_cca ON colaboradores_efetivo(cca_codigo);
CREATE INDEX idx_colaboradores_efetivo_status ON colaboradores_efetivo(status);
CREATE INDEX idx_colaboradores_efetivo_tipo ON colaboradores_efetivo(tipo_colaborador);
CREATE INDEX idx_colaboradores_efetivo_cpf ON colaboradores_efetivo(cpf);

-- RLS Policies
ALTER TABLE colaboradores_efetivo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de colaboradores para todos"
  ON colaboradores_efetivo FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de colaboradores para todos"
  ON colaboradores_efetivo FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de colaboradores para todos"
  ON colaboradores_efetivo FOR UPDATE
  USING (true);

CREATE POLICY "Permitir exclusão de colaboradores para todos"
  ON colaboradores_efetivo FOR DELETE
  USING (true);

-- Criar tabela controle_diario para registros diários de status
CREATE TABLE controle_diario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colaborador_id uuid REFERENCES colaboradores_efetivo(id) ON DELETE CASCADE,
  data date NOT NULL,
  status text NOT NULL, -- 'PR', 'NE', 'FT', 'CO', 'AT', etc.
  observacao text,
  cca_codigo text,
  competencia text, -- formato: YYYY-MM
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(colaborador_id, data)
);

-- Índices
CREATE INDEX idx_controle_diario_colaborador ON controle_diario(colaborador_id);
CREATE INDEX idx_controle_diario_data ON controle_diario(data);
CREATE INDEX idx_controle_diario_competencia ON controle_diario(competencia);

-- RLS Policies
ALTER TABLE controle_diario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de controle diário para todos"
  ON controle_diario FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de controle diário para todos"
  ON controle_diario FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de controle diário para todos"
  ON controle_diario FOR UPDATE
  USING (true);

CREATE POLICY "Permitir exclusão de controle diário para todos"
  ON controle_diario FOR DELETE
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_colaboradores_efetivo_updated_at
  BEFORE UPDATE ON colaboradores_efetivo
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_controle_diario_updated_at
  BEFORE UPDATE ON controle_diario
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para sincronização automática quando colaborador for admitido
CREATE OR REPLACE FUNCTION sync_colaborador_efetivo()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_colaborador_efetivo
  AFTER UPDATE ON validacao_admissao
  FOR EACH ROW
  EXECUTE FUNCTION sync_colaborador_efetivo();