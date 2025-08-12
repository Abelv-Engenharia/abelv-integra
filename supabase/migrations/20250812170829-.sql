-- Ajustar política de funcionários para normalizar tipos (string/number) em ccas_permitidas
DROP POLICY IF EXISTS "Funcionários - ver por CCAs permitidas" ON public.funcionarios;

CREATE POLICY "Funcionários - ver por CCAs permitidas"
ON public.funcionarios
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)
    OR EXISTS (
      SELECT 1
      FROM LATERAL jsonb_array_elements_text(get_user_allowed_ccas(auth.uid())) AS j(val)
      WHERE j.val = (funcionarios.cca_id)::text
    )
  )
);
