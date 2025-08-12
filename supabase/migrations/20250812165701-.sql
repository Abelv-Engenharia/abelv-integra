-- Ajuste de política RLS para permitir leitura de empresas vinculadas a CCAs via tabela de junção
-- Contexto: as empresas estão vinculadas a CCAs através de public.empresa_ccas (many-to-many).
-- A política atual apenas permite quando empresas.cca_id está preenchido, o que bloqueia registros válidos.

-- Garantir que a tabela tenha RLS habilitado (já está, mas deixamos como comentário)
-- ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- Substitui a política de SELECT existente por uma que cobre ambos os casos: coluna direta e via junção empresa_ccas
DROP POLICY IF EXISTS "Usuários podem ver empresas de CCAs permitidas" ON public.empresas;

CREATE POLICY "Usuários podem ver empresas de CCAs permitidas"
ON public.empresas
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    -- admins de funcionários podem ver tudo
    user_can_manage_funcionarios(auth.uid())
    OR (
      -- empresas com coluna direta preenchida e CCA permitido
      empresas.cca_id IS NOT NULL
      AND (get_user_allowed_ccas(auth.uid()) ? (empresas.cca_id)::text)
    )
    OR EXISTS (
      -- empresas vinculadas via tabela de junção empresa_ccas com CCA permitido
      SELECT 1
      FROM public.empresa_ccas ec
      WHERE ec.empresa_id = empresas.id
        AND (get_user_allowed_ccas(auth.uid()) ? (ec.cca_id)::text)
    )
  )
);
