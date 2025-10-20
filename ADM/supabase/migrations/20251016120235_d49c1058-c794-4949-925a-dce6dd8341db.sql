-- ============================================
-- ATUALIZAÇÃO DE SEGURANÇA: POLÍTICAS RLS
-- ============================================

-- Remover políticas permissivas e adicionar autenticação requerida

-- TABELA: caucoes
DROP POLICY IF EXISTS "Permitir leitura de cauções para todos" ON caucoes;
DROP POLICY IF EXISTS "Permitir inserção de cauções para todos" ON caucoes;
DROP POLICY IF EXISTS "Permitir atualização de cauções para todos" ON caucoes;
DROP POLICY IF EXISTS "Permitir exclusão de cauções para todos" ON caucoes;

CREATE POLICY "Usuários autenticados podem visualizar cauções"
ON caucoes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir cauções"
ON caucoes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar cauções"
ON caucoes FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Apenas admins podem deletar cauções"
ON caucoes FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- TABELA: contratos_alojamento
DROP POLICY IF EXISTS "Permitir leitura de contratos para todos" ON contratos_alojamento;
DROP POLICY IF EXISTS "Permitir inserção de contratos para todos" ON contratos_alojamento;
DROP POLICY IF EXISTS "Permitir atualização de contratos para todos" ON contratos_alojamento;
DROP POLICY IF EXISTS "Permitir exclusão de contratos para todos" ON contratos_alojamento;

CREATE POLICY "Usuários autenticados podem visualizar contratos"
ON contratos_alojamento FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir contratos"
ON contratos_alojamento FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar contratos"
ON contratos_alojamento FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Apenas admins podem deletar contratos"
ON contratos_alojamento FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- TABELA: fornecedores_alojamento
DROP POLICY IF EXISTS "Permitir leitura de fornecedores para todos" ON fornecedores_alojamento;
DROP POLICY IF EXISTS "Permitir inserção de fornecedores para todos" ON fornecedores_alojamento;
DROP POLICY IF EXISTS "Permitir atualização de fornecedores para todos" ON fornecedores_alojamento;
DROP POLICY IF EXISTS "Permitir exclusão de fornecedores para todos" ON fornecedores_alojamento;

CREATE POLICY "Usuários autenticados podem visualizar fornecedores"
ON fornecedores_alojamento FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir fornecedores"
ON fornecedores_alojamento FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar fornecedores"
ON fornecedores_alojamento FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Apenas admins podem deletar fornecedores"
ON fornecedores_alojamento FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- TABELA: medicoes_aluguel
DROP POLICY IF EXISTS "Permitir leitura de medicoes_aluguel para todos" ON medicoes_aluguel;
DROP POLICY IF EXISTS "Permitir inserção de medicoes_aluguel para todos" ON medicoes_aluguel;
DROP POLICY IF EXISTS "Permitir atualização de medicoes_aluguel para todos" ON medicoes_aluguel;
DROP POLICY IF EXISTS "Permitir exclusão de medicoes_aluguel para todos" ON medicoes_aluguel;

CREATE POLICY "Usuários autenticados podem visualizar medições"
ON medicoes_aluguel FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir medições"
ON medicoes_aluguel FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar medições"
ON medicoes_aluguel FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Apenas admins podem deletar medições"
ON medicoes_aluguel FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- TABELA: validacao_admissao
DROP POLICY IF EXISTS "Permitir leitura para todos" ON validacao_admissao;
DROP POLICY IF EXISTS "Permitir inserção para todos" ON validacao_admissao;
DROP POLICY IF EXISTS "Permitir atualização para todos" ON validacao_admissao;
DROP POLICY IF EXISTS "Permitir exclusão para todos" ON validacao_admissao;

CREATE POLICY "Usuários autenticados podem visualizar validações"
ON validacao_admissao FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir validações"
ON validacao_admissao FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar validações"
ON validacao_admissao FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Apenas admins podem deletar validações"
ON validacao_admissao FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- TABELA: log_envio_dp
DROP POLICY IF EXISTS "Permitir leitura para todos" ON log_envio_dp;
DROP POLICY IF EXISTS "Permitir inserção para todos" ON log_envio_dp;

CREATE POLICY "Usuários autenticados podem visualizar logs"
ON log_envio_dp FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir logs"
ON log_envio_dp FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- PROTEÇÃO DE STORAGE
-- ============================================

-- Tornar todos os buckets privados
UPDATE storage.buckets 
SET public = false 
WHERE id IN (
  'contratos-alojamento',
  'caucoes',
  'hospedagem-anexos',
  'analises-contratuais',
  'validacao-admissao'
);

-- Remover políticas antigas de storage (se existirem)
DROP POLICY IF EXISTS "Permitir leitura pública de contratos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload público de contratos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir leitura pública de cauções" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload público de cauções" ON storage.objects;

-- Políticas RLS para Storage - contratos-alojamento
CREATE POLICY "Usuários autenticados podem fazer upload em contratos-alojamento"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'contratos-alojamento');

CREATE POLICY "Usuários autenticados podem visualizar contratos-alojamento"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'contratos-alojamento');

CREATE POLICY "Usuários autenticados podem atualizar contratos-alojamento"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'contratos-alojamento');

CREATE POLICY "Usuários autenticados podem deletar contratos-alojamento"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'contratos-alojamento');

-- Políticas RLS para Storage - caucoes
CREATE POLICY "Usuários autenticados podem fazer upload em caucoes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'caucoes');

CREATE POLICY "Usuários autenticados podem visualizar caucoes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'caucoes');

CREATE POLICY "Usuários autenticados podem atualizar caucoes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'caucoes');

CREATE POLICY "Usuários autenticados podem deletar caucoes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'caucoes');

-- Políticas RLS para Storage - validacao-admissao
CREATE POLICY "Usuários autenticados podem fazer upload em validacao-admissao"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'validacao-admissao');

CREATE POLICY "Usuários autenticados podem visualizar validacao-admissao"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'validacao-admissao');

CREATE POLICY "Usuários autenticados podem atualizar validacao-admissao"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'validacao-admissao');

CREATE POLICY "Usuários autenticados podem deletar validacao-admissao"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'validacao-admissao');

-- Políticas RLS para Storage - hospedagem-anexos
CREATE POLICY "Usuários autenticados podem fazer upload em hospedagem-anexos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hospedagem-anexos');

CREATE POLICY "Usuários autenticados podem visualizar hospedagem-anexos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'hospedagem-anexos');

CREATE POLICY "Usuários autenticados podem atualizar hospedagem-anexos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'hospedagem-anexos');

CREATE POLICY "Usuários autenticados podem deletar hospedagem-anexos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hospedagem-anexos');

-- Políticas RLS para Storage - analises-contratuais
CREATE POLICY "Usuários autenticados podem fazer upload em analises-contratuais"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'analises-contratuais');

CREATE POLICY "Usuários autenticados podem visualizar analises-contratuais"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'analises-contratuais');

CREATE POLICY "Usuários autenticados podem atualizar analises-contratuais"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'analises-contratuais');

CREATE POLICY "Usuários autenticados podem deletar analises-contratuais"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'analises-contratuais');