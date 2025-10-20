-- Habilita RLS e cria políticas abertas (alinhadas às demais tabelas do app)
-- Motivo: requisições atuais usam a chave anônima (sem auth), e o insert falha com RLS 401

-- 1) Garantir que a tabela tenha RLS habilitado
ALTER TABLE public.validacao_admissao ENABLE ROW LEVEL SECURITY;

-- 2) Criar políticas permissivas (se já existirem outras, estas somam via OR)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'validacao_admissao' AND policyname = 'validacao_admissao_select_all'
  ) THEN
    CREATE POLICY "validacao_admissao_select_all"
    ON public.validacao_admissao
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'validacao_admissao' AND policyname = 'validacao_admissao_insert_all'
  ) THEN
    CREATE POLICY "validacao_admissao_insert_all"
    ON public.validacao_admissao
    FOR INSERT
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'validacao_admissao' AND policyname = 'validacao_admissao_update_all'
  ) THEN
    CREATE POLICY "validacao_admissao_update_all"
    ON public.validacao_admissao
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'validacao_admissao' AND policyname = 'validacao_admissao_delete_all'
  ) THEN
    CREATE POLICY "validacao_admissao_delete_all"
    ON public.validacao_admissao
    FOR DELETE
    USING (true);
  END IF;
END$$;