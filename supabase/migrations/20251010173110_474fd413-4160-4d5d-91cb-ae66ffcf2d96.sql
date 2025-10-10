-- Criar políticas RLS para encarregado_ccas
-- Permitir admin inserir associações de CCAs
CREATE POLICY "Admin podem inserir encarregado_ccas"
ON encarregado_ccas FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Permitir admin atualizar associações de CCAs
CREATE POLICY "Admin podem atualizar encarregado_ccas"
ON encarregado_ccas FOR UPDATE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- Permitir admin deletar associações de CCAs
CREATE POLICY "Admin podem deletar encarregado_ccas"
ON encarregado_ccas FOR DELETE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()));