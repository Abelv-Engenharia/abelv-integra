-- Criar tabela de subcentros de custos
CREATE TABLE public.subcentros_custos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cca_id integer NOT NULL REFERENCES public.ccas(id) ON DELETE CASCADE,
  id_sienge integer NOT NULL,
  faturamento text NOT NULL CHECK (faturamento IN ('Abelv', 'FATD')),
  empresa_sienge_id uuid NOT NULL REFERENCES public.empresas_sienge(id) ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraint para evitar duplicação de id_sienge no mesmo CCA
  UNIQUE(cca_id, id_sienge)
);

-- Índices para melhor performance
CREATE INDEX idx_subcentros_custos_cca_id ON public.subcentros_custos(cca_id);
CREATE INDEX idx_subcentros_custos_empresa_sienge_id ON public.subcentros_custos(empresa_sienge_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_subcentros_custos_updated_at
  BEFORE UPDATE ON public.subcentros_custos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.subcentros_custos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Subcentros - visualizar (autenticados)"
  ON public.subcentros_custos
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Subcentros - criar (admin)"
  ON public.subcentros_custos
  FOR INSERT
  TO authenticated
  WITH CHECK (user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Subcentros - atualizar (admin)"
  ON public.subcentros_custos
  FOR UPDATE
  TO authenticated
  USING (user_can_manage_funcionarios(auth.uid()))
  WITH CHECK (user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Subcentros - deletar (admin)"
  ON public.subcentros_custos
  FOR DELETE
  TO authenticated
  USING (user_can_manage_funcionarios(auth.uid()));