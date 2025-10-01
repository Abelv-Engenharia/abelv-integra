-- Script de migração para criar snapshots iniciais de todos os registros existentes
-- Este script deve ser executado uma única vez após a criação da estrutura

-- Criar snapshots de todos os funcionários
INSERT INTO public.personnel_snapshots (
  original_id,
  person_type,
  nome,
  funcao,
  matricula,
  cca_info,
  was_active
)
SELECT 
  f.id,
  'funcionario',
  f.nome,
  f.funcao,
  f.matricula,
  jsonb_build_object('id', c.id, 'codigo', c.codigo, 'nome', c.nome),
  f.ativo
FROM funcionarios f
LEFT JOIN ccas c ON c.id = f.cca_id
ON CONFLICT DO NOTHING;

-- Criar snapshots de todos os engenheiros
INSERT INTO public.personnel_snapshots (
  original_id,
  person_type,
  nome,
  funcao,
  matricula,
  email,
  cca_info,
  was_active
)
SELECT 
  e.id,
  'engenheiro',
  e.nome,
  e.funcao,
  e.matricula,
  e.email,
  COALESCE(
    (
      SELECT jsonb_agg(jsonb_build_object('id', c.id, 'codigo', c.codigo, 'nome', c.nome))
      FROM engenheiro_ccas ec
      JOIN ccas c ON c.id = ec.cca_id
      WHERE ec.engenheiro_id = e.id
    ),
    '[]'::jsonb
  ),
  e.ativo
FROM engenheiros e
ON CONFLICT DO NOTHING;

-- Criar snapshots de todos os supervisores
INSERT INTO public.personnel_snapshots (
  original_id,
  person_type,
  nome,
  funcao,
  matricula,
  email,
  cca_info,
  was_active
)
SELECT 
  s.id,
  'supervisor',
  s.nome,
  s.funcao,
  s.matricula,
  s.email,
  COALESCE(
    (
      SELECT jsonb_agg(jsonb_build_object('id', c.id, 'codigo', c.codigo, 'nome', c.nome))
      FROM supervisor_ccas sc
      JOIN ccas c ON c.id = sc.cca_id
      WHERE sc.supervisor_id = s.id
    ),
    '[]'::jsonb
  ),
  s.ativo
FROM supervisores s
ON CONFLICT DO NOTHING;

-- Criar snapshots de todos os encarregados
INSERT INTO public.personnel_snapshots (
  original_id,
  person_type,
  nome,
  funcao,
  matricula,
  email,
  cca_info,
  was_active
)
SELECT 
  e.id,
  'encarregado',
  e.nome,
  e.funcao,
  e.matricula,
  e.email,
  COALESCE(
    (
      SELECT jsonb_agg(jsonb_build_object('id', c.id, 'codigo', c.codigo, 'nome', c.nome))
      FROM encarregado_ccas ec
      JOIN ccas c ON c.id = ec.cca_id
      WHERE ec.encarregado_id = e.id
    ),
    '[]'::jsonb
  ),
  e.ativo
FROM encarregados e
ON CONFLICT DO NOTHING;