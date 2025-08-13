-- Corrigir política RLS para inserção de encarregados
-- A política atual só permite INSERT para usuários que podem gerenciar funcionários
-- mas precisa verificar se a função user_can_manage_funcionarios está funcionando corretamente

-- Vamos verificar a política atual primeiro e então atualizá-la
DROP POLICY IF EXISTS "Admin podem gerenciar encarregados" ON public.encarregados;

-- Criar política mais específica para INSERT
CREATE POLICY "Admin podem inserir encarregados" 
ON public.encarregados 
FOR INSERT 
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Criar política para UPDATE
CREATE POLICY "Admin podem atualizar encarregados" 
ON public.encarregados 
FOR UPDATE 
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Criar política para DELETE  
CREATE POLICY "Admin podem excluir encarregados" 
ON public.encarregados 
FOR DELETE 
USING (user_can_manage_funcionarios(auth.uid()));

-- Manter a política SELECT existente
CREATE POLICY "Usuários autenticados podem ver encarregados" 
ON public.encarregados 
FOR SELECT 
USING (auth.uid() IS NOT NULL);