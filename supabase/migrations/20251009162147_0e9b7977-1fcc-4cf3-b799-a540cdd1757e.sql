-- Adicionar políticas RLS para gerenciamento de CCAs
-- Permitir usuários autenticados criarem, atualizarem e deletarem CCAs

CREATE POLICY "CCAs - criar (autenticados)"
  ON public.ccas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "CCAs - atualizar (autenticados)"
  ON public.ccas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "CCAs - deletar (autenticados)"
  ON public.ccas
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);