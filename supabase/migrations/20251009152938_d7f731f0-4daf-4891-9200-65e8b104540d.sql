-- Ajustar políticas RLS para subcentros_custos
-- Permitir usuários autenticados gerenciarem subcentros

DROP POLICY IF EXISTS "Subcentros - criar (admin)" ON public.subcentros_custos;
DROP POLICY IF EXISTS "Subcentros - atualizar (admin)" ON public.subcentros_custos;
DROP POLICY IF EXISTS "Subcentros - deletar (admin)" ON public.subcentros_custos;

-- Políticas mais permissivas para usuários autenticados
CREATE POLICY "Subcentros - criar (autenticados)"
  ON public.subcentros_custos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Subcentros - atualizar (autenticados)"
  ON public.subcentros_custos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Subcentros - deletar (autenticados)"
  ON public.subcentros_custos
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);