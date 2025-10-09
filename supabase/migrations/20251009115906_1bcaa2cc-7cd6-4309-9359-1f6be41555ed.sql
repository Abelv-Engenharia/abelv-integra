-- Adicionar políticas RLS para a tabela empresas
-- Permitir SELECT para usuários autenticados
CREATE POLICY "Empresas - ler (autenticados)"
ON public.empresas
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Permitir INSERT para administradores
CREATE POLICY "Empresas - criar (admin)"
ON public.empresas
FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Permitir UPDATE para administradores
CREATE POLICY "Empresas - atualizar (admin)"
ON public.empresas
FOR UPDATE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Permitir DELETE para administradores
CREATE POLICY "Empresas - deletar (admin)"
ON public.empresas
FOR DELETE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()));

-- Adicionar políticas RLS para a tabela empresa_ccas
-- Permitir gerenciamento completo para administradores
CREATE POLICY "empresa_ccas - gerenciar (admin)"
ON public.empresa_ccas
FOR ALL
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));