-- Criar tabela de snapshot mensal de funcionários
CREATE TABLE IF NOT EXISTS public.funcionarios_mensal_snapshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ano INTEGER NOT NULL,
  mes INTEGER NOT NULL,
  cca_id INTEGER REFERENCES public.ccas(id) ON DELETE CASCADE,
  total_funcionarios INTEGER NOT NULL DEFAULT 0,
  funcionarios_ativos INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ano, mes, cca_id)
);

-- Habilitar RLS
ALTER TABLE public.funcionarios_mensal_snapshot ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários autenticados podem visualizar snapshots"
  ON public.funcionarios_mensal_snapshot
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin pode gerenciar snapshots"
  ON public.funcionarios_mensal_snapshot
  FOR ALL
  USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true)
  WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_funcionarios_snapshot_ano_mes ON public.funcionarios_mensal_snapshot(ano, mes);
CREATE INDEX IF NOT EXISTS idx_funcionarios_snapshot_cca ON public.funcionarios_mensal_snapshot(cca_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_funcionarios_snapshot_updated_at
  BEFORE UPDATE ON public.funcionarios_mensal_snapshot
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Popular dados históricos dos últimos 12 meses (baseado em funcionários ativos hoje)
INSERT INTO public.funcionarios_mensal_snapshot (ano, mes, cca_id, total_funcionarios, funcionarios_ativos)
SELECT 
  EXTRACT(YEAR FROM data_mes)::INTEGER as ano,
  EXTRACT(MONTH FROM data_mes)::INTEGER as mes,
  f.cca_id,
  COUNT(*)::INTEGER as total_funcionarios,
  COUNT(*) FILTER (WHERE f.ativo = true)::INTEGER as funcionarios_ativos
FROM 
  generate_series(
    date_trunc('month', CURRENT_DATE - INTERVAL '12 months'),
    date_trunc('month', CURRENT_DATE),
    '1 month'::interval
  ) as data_mes
CROSS JOIN public.funcionarios f
WHERE f.cca_id IS NOT NULL
GROUP BY EXTRACT(YEAR FROM data_mes), EXTRACT(MONTH FROM data_mes), f.cca_id
ON CONFLICT (ano, mes, cca_id) DO NOTHING;