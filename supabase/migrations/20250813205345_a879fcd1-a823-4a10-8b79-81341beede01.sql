-- Corrigir política RLS para inserção de encarregados
-- Remover política existente e criar políticas específicas para cada operação

-- Remover política genérica atual
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