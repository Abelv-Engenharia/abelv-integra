-- Permitir que usuários autenticados vejam funcionários dos CCAs aos quais têm acesso
-- Mantém regras existentes (admins e supervisores), adicionando filtro por CCAs permitidas

-- Criar/atualizar política de SELECT na tabela funcionarios
DROP POLICY IF EXISTS "Usuários autenticados podem ver encarregados" ON public.funcionarios; -- safety: remove nomes incorretos se existirem
DROP POLICY IF EXISTS "Supervisores podem ver funcionários atribuídos" ON public.funcionarios;
DROP POLICY IF EXISTS "Funcionários - ver por CCAs permitidas" ON public.funcionarios;

-- Recria política de supervisores conforme docs existentes
CREATE POLICY "Supervisores podem ver funcionários atribuídos"
ON public.funcionarios
FOR SELECT
USING (
  user_is_supervisor_of(auth.uid(), id) OR ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)
);

-- Nova política: ver funcionários por CCAs permitidas
CREATE POLICY "Funcionários - ver por CCAs permitidas"
ON public.funcionarios
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)
    OR (get_user_allowed_ccas(auth.uid()) ? (funcionarios.cca_id)::text)
  )
);
