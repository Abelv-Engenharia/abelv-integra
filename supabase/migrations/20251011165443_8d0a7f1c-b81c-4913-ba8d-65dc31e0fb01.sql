-- Criar políticas RLS para checklists_avaliacao

-- Política para INSERT (criar novos checklists)
CREATE POLICY "Checklists - criar (autenticados)"
ON checklists_avaliacao
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Política para UPDATE (atualizar checklists)
CREATE POLICY "Checklists - atualizar (autenticados)"
ON checklists_avaliacao
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Política para DELETE (excluir checklists)
CREATE POLICY "Checklists - deletar (autenticados)"
ON checklists_avaliacao
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);