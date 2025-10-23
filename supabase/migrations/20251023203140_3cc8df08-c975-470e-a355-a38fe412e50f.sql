-- Adicionar políticas RLS para INSERT, UPDATE e DELETE em configuracoes_emails

-- Política para criar configurações de email (usuários autenticados)
CREATE POLICY "Configurações emails - criar (autenticados)"
ON configuracoes_emails
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Política para atualizar configurações de email (usuários autenticados)
CREATE POLICY "Configurações emails - atualizar (autenticados)"
ON configuracoes_emails
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Política para deletar configurações de email (usuários autenticados)
CREATE POLICY "Configurações emails - deletar (autenticados)"
ON configuracoes_emails
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);