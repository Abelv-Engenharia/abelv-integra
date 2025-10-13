-- Garantir RLS habilitado e liberar leitura para usuários autenticados
ALTER TABLE public.nfe_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfe_compra_itens ENABLE ROW LEVEL SECURITY;

-- Política de SELECT para nfe_compra
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'nfe_compra' AND policyname = 'nfe_compra_select_auth'
  ) THEN
    CREATE POLICY "nfe_compra_select_auth"
    ON public.nfe_compra
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;

-- Política de SELECT para nfe_compra_itens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'nfe_compra_itens' AND policyname = 'nfe_compra_itens_select_auth'
  ) THEN
    CREATE POLICY "nfe_compra_itens_select_auth"
    ON public.nfe_compra_itens
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;