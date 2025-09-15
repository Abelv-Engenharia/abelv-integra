-- Proteger dados pessoais na tabela funcionarios: remover acesso público e restringir por autenticação e CCA/permissões

-- 1) Garantir RLS habilitado e forçado
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios FORCE ROW LEVEL SECURITY;

-- 2) Remover políticas SELECT que estavam atribuídas ao papel "public" (acesso indevido)
DROP POLICY IF EXISTS "Funcionários - ver por CCAs permitidas" ON public.funcionarios;
DROP POLICY IF EXISTS "Supervisores podem ver funcionários atribuídos" ON public.funcionarios;

-- 3) Criar política SELECT restrita apenas a usuários autenticados
CREATE POLICY "funcionarios_select_autenticado"
ON public.funcionarios
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    -- Admin com permissão de funcionários
    user_can_manage_funcionarios(auth.uid())
    OR
    -- CCA permitido ao usuário
    EXISTS (
      SELECT 1
      FROM LATERAL jsonb_array_elements_text(get_user_allowed_ccas(auth.uid())) AS j(val)
      WHERE funcionarios.cca_id IS NOT NULL AND j.val = funcionarios.cca_id::text
    )
    OR
    -- Supervisor do funcionário
    user_is_supervisor_of(auth.uid(), funcionarios.id)
  )
);

-- 4) Manter política de gestão (ALL) já existente para admin (não alterada)
--    Garante INSERT/UPDATE/DELETE para administradores

-- 5) Registrar auditoria da alteração de segurança
INSERT INTO public.audit_logs (user_id, action, table_name, details, timestamp)
VALUES (
  auth.uid(),
  'security_policy_update',
  'funcionarios',
  jsonb_build_object(
    'description', 'Removido acesso público e restringido SELECT a usuários autenticados com permissão/CCA/supervisão',
    'policies_removed', jsonb_build_array('Funcionários - ver por CCAs permitidas', 'Supervisores podem ver funcionários atribuídos'),
    'policies_added', jsonb_build_array('funcionarios_select_autenticado')
  ),
  now()
);