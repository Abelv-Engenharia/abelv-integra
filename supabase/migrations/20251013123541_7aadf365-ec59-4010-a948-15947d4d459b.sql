-- Garantir que usuários autenticados possam ler subcentros_custos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'subcentros_custos' AND policyname = 'subcentros_custos_select_auth'
  ) THEN
    CREATE POLICY "subcentros_custos_select_auth"
    ON public.subcentros_custos
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;

GRANT SELECT ON TABLE public.subcentros_custos TO authenticated;