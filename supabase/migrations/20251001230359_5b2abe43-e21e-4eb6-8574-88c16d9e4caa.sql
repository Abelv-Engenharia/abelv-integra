-- Criar tabela de snapshots de pessoal para preservar dados históricos
CREATE TABLE IF NOT EXISTS public.personnel_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id UUID NOT NULL,
  person_type TEXT NOT NULL CHECK (person_type IN ('funcionario', 'engenheiro', 'supervisor', 'encarregado')),
  nome TEXT NOT NULL,
  funcao TEXT,
  matricula TEXT,
  email TEXT,
  cca_info JSONB, -- {id, codigo, nome}
  empresa_info JSONB, -- {id, nome, cnpj}
  snapshot_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  was_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_personnel_snapshots_original_id ON public.personnel_snapshots(original_id);
CREATE INDEX idx_personnel_snapshots_person_type ON public.personnel_snapshots(person_type);
CREATE INDEX idx_personnel_snapshots_nome ON public.personnel_snapshots(nome);

-- Habilitar RLS
ALTER TABLE public.personnel_snapshots ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários autenticados podem visualizar snapshots"
  ON public.personnel_snapshots FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin podem gerenciar snapshots"
  ON public.personnel_snapshots FOR ALL
  TO authenticated
  USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true);

-- Função para criar snapshot de funcionário
CREATE OR REPLACE FUNCTION public.create_funcionario_snapshot(p_funcionario_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_snapshot_id UUID;
  v_cca_info JSONB;
BEGIN
  -- Buscar informações do CCA
  SELECT jsonb_build_object('id', c.id, 'codigo', c.codigo, 'nome', c.nome)
  INTO v_cca_info
  FROM funcionarios f
  LEFT JOIN ccas c ON c.id = f.cca_id
  WHERE f.id = p_funcionario_id;

  -- Criar snapshot
  INSERT INTO personnel_snapshots (
    original_id, person_type, nome, funcao, matricula, cca_info, was_active
  )
  SELECT 
    f.id,
    'funcionario',
    f.nome,
    f.funcao,
    f.matricula,
    v_cca_info,
    f.ativo
  FROM funcionarios f
  WHERE f.id = p_funcionario_id
  RETURNING id INTO v_snapshot_id;

  RETURN v_snapshot_id;
END;
$$;

-- Função para criar snapshot de engenheiro
CREATE OR REPLACE FUNCTION public.create_engenheiro_snapshot(p_engenheiro_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_snapshot_id UUID;
  v_cca_info JSONB;
BEGIN
  -- Buscar informações dos CCAs (pode ter múltiplos)
  SELECT jsonb_agg(jsonb_build_object('id', c.id, 'codigo', c.codigo, 'nome', c.nome))
  INTO v_cca_info
  FROM engenheiro_ccas ec
  JOIN ccas c ON c.id = ec.cca_id
  WHERE ec.engenheiro_id = p_engenheiro_id;

  -- Criar snapshot
  INSERT INTO personnel_snapshots (
    original_id, person_type, nome, funcao, matricula, email, cca_info, was_active
  )
  SELECT 
    e.id,
    'engenheiro',
    e.nome,
    e.funcao,
    e.matricula,
    e.email,
    COALESCE(v_cca_info, '[]'::jsonb),
    e.ativo
  FROM engenheiros e
  WHERE e.id = p_engenheiro_id
  RETURNING id INTO v_snapshot_id;

  RETURN v_snapshot_id;
END;
$$;

-- Função para criar snapshot de supervisor
CREATE OR REPLACE FUNCTION public.create_supervisor_snapshot(p_supervisor_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_snapshot_id UUID;
  v_cca_info JSONB;
BEGIN
  -- Buscar informações dos CCAs
  SELECT jsonb_agg(jsonb_build_object('id', c.id, 'codigo', c.codigo, 'nome', c.nome))
  INTO v_cca_info
  FROM supervisor_ccas sc
  JOIN ccas c ON c.id = sc.cca_id
  WHERE sc.supervisor_id = p_supervisor_id;

  -- Criar snapshot
  INSERT INTO personnel_snapshots (
    original_id, person_type, nome, funcao, matricula, email, cca_info, was_active
  )
  SELECT 
    s.id,
    'supervisor',
    s.nome,
    s.funcao,
    s.matricula,
    s.email,
    COALESCE(v_cca_info, '[]'::jsonb),
    s.ativo
  FROM supervisores s
  WHERE s.id = p_supervisor_id
  RETURNING id INTO v_snapshot_id;

  RETURN v_snapshot_id;
END;
$$;

-- Função para criar snapshot de encarregado
CREATE OR REPLACE FUNCTION public.create_encarregado_snapshot(p_encarregado_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_snapshot_id UUID;
  v_cca_info JSONB;
BEGIN
  -- Buscar informações dos CCAs
  SELECT jsonb_agg(jsonb_build_object('id', c.id, 'codigo', c.codigo, 'nome', c.nome))
  INTO v_cca_info
  FROM encarregado_ccas ec
  JOIN ccas c ON c.id = ec.cca_id
  WHERE ec.encarregado_id = p_encarregado_id;

  -- Criar snapshot
  INSERT INTO personnel_snapshots (
    original_id, person_type, nome, funcao, matricula, email, cca_info, was_active
  )
  SELECT 
    e.id,
    'encarregado',
    e.nome,
    e.funcao,
    e.matricula,
    e.email,
    COALESCE(v_cca_info, '[]'::jsonb),
    e.ativo
  FROM encarregados e
  WHERE e.id = p_encarregado_id
  RETURNING id INTO v_snapshot_id;

  RETURN v_snapshot_id;
END;
$$;

-- Trigger para criar snapshot automático quando funcionário for alterado/inativado
CREATE OR REPLACE FUNCTION public.auto_snapshot_funcionario()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Se foi inativado ou teve mudança de CCA
  IF (OLD.ativo = true AND NEW.ativo = false) OR (OLD.cca_id IS DISTINCT FROM NEW.cca_id) THEN
    PERFORM create_funcionario_snapshot(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_snapshot_funcionario
  AFTER UPDATE ON public.funcionarios
  FOR EACH ROW
  EXECUTE FUNCTION auto_snapshot_funcionario();

-- Trigger para engenheiros
CREATE OR REPLACE FUNCTION public.auto_snapshot_engenheiro()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (OLD.ativo = true AND NEW.ativo = false) THEN
    PERFORM create_engenheiro_snapshot(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_snapshot_engenheiro
  AFTER UPDATE ON public.engenheiros
  FOR EACH ROW
  EXECUTE FUNCTION auto_snapshot_engenheiro();

-- Trigger para supervisores
CREATE OR REPLACE FUNCTION public.auto_snapshot_supervisor()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (OLD.ativo = true AND NEW.ativo = false) THEN
    PERFORM create_supervisor_snapshot(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_snapshot_supervisor
  AFTER UPDATE ON public.supervisores
  FOR EACH ROW
  EXECUTE FUNCTION auto_snapshot_supervisor();

-- Trigger para encarregados
CREATE OR REPLACE FUNCTION public.auto_snapshot_encarregado()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (OLD.ativo = true AND NEW.ativo = false) THEN
    PERFORM create_encarregado_snapshot(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_snapshot_encarregado
  AFTER UPDATE ON public.encarregados
  FOR EACH ROW
  EXECUTE FUNCTION auto_snapshot_encarregado();

-- Função helper para buscar dados de pessoal (ativo ou snapshot)
CREATE OR REPLACE FUNCTION public.get_personnel_data(
  p_person_id UUID,
  p_person_type TEXT,
  p_prefer_current BOOLEAN DEFAULT true
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_is_active BOOLEAN;
BEGIN
  -- Verificar se pessoa está ativa
  CASE p_person_type
    WHEN 'funcionario' THEN
      SELECT ativo INTO v_is_active FROM funcionarios WHERE id = p_person_id;
    WHEN 'engenheiro' THEN
      SELECT ativo INTO v_is_active FROM engenheiros WHERE id = p_person_id;
    WHEN 'supervisor' THEN
      SELECT ativo INTO v_is_active FROM supervisores WHERE id = p_person_id;
    WHEN 'encarregado' THEN
      SELECT ativo INTO v_is_active FROM encarregados WHERE id = p_person_id;
  END CASE;

  -- Se ativo e preferir dados atuais, buscar da tabela original
  IF v_is_active AND p_prefer_current THEN
    CASE p_person_type
      WHEN 'funcionario' THEN
        SELECT jsonb_build_object(
          'id', f.id,
          'nome', f.nome,
          'funcao', f.funcao,
          'matricula', f.matricula,
          'ativo', f.ativo,
          'cca_info', jsonb_build_object('id', c.id, 'codigo', c.codigo, 'nome', c.nome)
        ) INTO v_result
        FROM funcionarios f
        LEFT JOIN ccas c ON c.id = f.cca_id
        WHERE f.id = p_person_id;
      WHEN 'engenheiro' THEN
        SELECT jsonb_build_object(
          'id', e.id,
          'nome', e.nome,
          'funcao', e.funcao,
          'matricula', e.matricula,
          'email', e.email,
          'ativo', e.ativo
        ) INTO v_result
        FROM engenheiros e
        WHERE e.id = p_person_id;
      WHEN 'supervisor' THEN
        SELECT jsonb_build_object(
          'id', s.id,
          'nome', s.nome,
          'funcao', s.funcao,
          'matricula', s.matricula,
          'email', s.email,
          'ativo', s.ativo
        ) INTO v_result
        FROM supervisores s
        WHERE s.id = p_person_id;
      WHEN 'encarregado' THEN
        SELECT jsonb_build_object(
          'id', e.id,
          'nome', e.nome,
          'funcao', e.funcao,
          'matricula', e.matricula,
          'email', e.email,
          'ativo', e.ativo
        ) INTO v_result
        FROM encarregados e
        WHERE e.id = p_person_id;
    END CASE;
  ELSE
    -- Buscar último snapshot
    SELECT jsonb_build_object(
      'id', original_id,
      'nome', nome,
      'funcao', funcao,
      'matricula', matricula,
      'email', email,
      'ativo', was_active,
      'cca_info', cca_info,
      'is_snapshot', true,
      'snapshot_date', snapshot_date
    ) INTO v_result
    FROM personnel_snapshots
    WHERE original_id = p_person_id AND person_type = p_person_type
    ORDER BY snapshot_date DESC
    LIMIT 1;
  END IF;

  RETURN v_result;
END;
$$;