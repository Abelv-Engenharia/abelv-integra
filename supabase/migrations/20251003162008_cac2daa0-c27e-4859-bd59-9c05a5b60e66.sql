-- Corrigir políticas RLS da tabela execucao_treinamentos
-- As políticas devem verificar a permissão 'treinamentos_execucao' ao invés de 'treinamentos'

-- Remover políticas antigas
DROP POLICY IF EXISTS "Usuários podem inserir execuções de treinamento" ON public.execucao_treinamentos;
DROP POLICY IF EXISTS "Usuários podem atualizar execuções de treinamento" ON public.execucao_treinamentos;
DROP POLICY IF EXISTS "Usuários podem excluir execuções de treinamento" ON public.execucao_treinamentos;

-- Criar novas políticas com a permissão correta
CREATE POLICY "Usuários podem inserir execuções de treinamento"
ON public.execucao_treinamentos
FOR INSERT
TO authenticated
WITH CHECK (
  (get_user_permissions(auth.uid()) ->> 'treinamentos_execucao')::boolean = true
);

CREATE POLICY "Usuários podem atualizar execuções de treinamento"
ON public.execucao_treinamentos
FOR UPDATE
TO authenticated
USING (
  (get_user_permissions(auth.uid()) ->> 'treinamentos_execucao')::boolean = true
)
WITH CHECK (
  (get_user_permissions(auth.uid()) ->> 'treinamentos_execucao')::boolean = true
);

CREATE POLICY "Usuários podem excluir execuções de treinamento"
ON public.execucao_treinamentos
FOR DELETE
TO authenticated
USING (
  (get_user_permissions(auth.uid()) ->> 'treinamentos_execucao')::boolean = true
);