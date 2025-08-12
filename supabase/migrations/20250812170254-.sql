-- Corrigir política para lidar com ccas_permitidas contendo números e strings
DROP POLICY IF EXISTS "Usuários podem ver empresas de CCAs permitidas" ON public.empresas;

CREATE POLICY "Usuários podem ver empresas de CCAs permitidas"
ON public.empresas
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    user_can_manage_funcionarios(auth.uid())
    OR EXISTS (
      -- empresas com coluna direta e CCA permitido (compatível com str/num)
      SELECT 1
      FROM jsonb_array_elements_text(get_user_allowed_ccas(auth.uid())) AS j(val)
      WHERE empresas.cca_id IS NOT NULL AND j.val = (empresas.cca_id)::text
    )
    OR EXISTS (
      -- empresas vinculadas via empresa_ccas e CCA permitido (compatível com str/num)
      SELECT 1
      FROM public.empresa_ccas ec,
           LATERAL jsonb_array_elements_text(get_user_allowed_ccas(auth.uid())) AS j(val)
      WHERE ec.empresa_id = empresas.id
        AND j.val = (ec.cca_id)::text
    )
  )
);
