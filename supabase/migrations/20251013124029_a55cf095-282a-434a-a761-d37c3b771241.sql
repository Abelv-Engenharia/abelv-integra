-- Permitir que usuários autenticados possam atualizar NFEs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'nfe_compra' AND policyname = 'nfe_compra_update_auth'
  ) THEN
    CREATE POLICY "nfe_compra_update_auth"
    ON public.nfe_compra
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Permitir inserir itens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'nfe_compra_itens' AND policyname = 'nfe_compra_itens_insert_auth'
  ) THEN
    CREATE POLICY "nfe_compra_itens_insert_auth"
    ON public.nfe_compra_itens
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
  END IF;
END $$;

-- Permitir atualizar itens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'nfe_compra_itens' AND policyname = 'nfe_compra_itens_update_auth'
  ) THEN
    CREATE POLICY "nfe_compra_itens_update_auth"
    ON public.nfe_compra_itens
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Permitir deletar itens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'nfe_compra_itens' AND policyname = 'nfe_compra_itens_delete_auth'
  ) THEN
    CREATE POLICY "nfe_compra_itens_delete_auth"
    ON public.nfe_compra_itens
    FOR DELETE
    TO authenticated
    USING (true);
  END IF;
END $$;

-- Garantir permissões de CRUD
GRANT INSERT, UPDATE, DELETE ON TABLE public.nfe_compra TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.nfe_compra_itens TO authenticated;