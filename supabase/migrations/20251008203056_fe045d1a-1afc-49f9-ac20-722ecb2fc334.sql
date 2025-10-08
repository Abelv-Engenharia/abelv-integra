-- Políticas RLS para tabela execucao_treinamentos

-- Permitir que usuários autenticados visualizem registros de execução
CREATE POLICY "Usuários autenticados podem visualizar execuções de treinamento"
ON public.execucao_treinamentos
FOR SELECT
TO authenticated
USING (true);

-- Permitir que usuários autenticados insiram registros de execução
CREATE POLICY "Usuários autenticados podem inserir execuções de treinamento"
ON public.execucao_treinamentos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir que usuários autenticados atualizem registros de execução
CREATE POLICY "Usuários autenticados podem atualizar execuções de treinamento"
ON public.execucao_treinamentos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Permitir que usuários autenticados excluam registros de execução
CREATE POLICY "Usuários autenticados podem excluir execuções de treinamento"
ON public.execucao_treinamentos
FOR DELETE
TO authenticated
USING (true);