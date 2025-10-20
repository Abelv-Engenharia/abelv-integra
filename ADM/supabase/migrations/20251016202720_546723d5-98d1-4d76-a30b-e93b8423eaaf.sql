-- Remover políticas restritivas atuais de INSERT
DROP POLICY IF EXISTS "Usuários autenticados podem inserir validações" ON validacao_admissao;

-- Criar política que permite INSERT público (anônimo e autenticado)
CREATE POLICY "Permitir inserção pública de validações"
ON validacao_admissao
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Atualizar política de SELECT para autenticados
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar validações" ON validacao_admissao;
CREATE POLICY "Permitir leitura para autenticados"
ON validacao_admissao
FOR SELECT
TO authenticated
USING (true);

-- Atualizar política de UPDATE para autenticados
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar validações" ON validacao_admissao;
CREATE POLICY "Permitir atualização para autenticados"
ON validacao_admissao
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);