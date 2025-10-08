-- Adicionar políticas RLS para gerenciar unidades_medidas

-- Política de inserção para usuários autenticados
CREATE POLICY "Usuários autenticados podem inserir unidades medidas"
ON public.unidades_medidas
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Política de atualização para usuários autenticados
CREATE POLICY "Usuários autenticados podem atualizar unidades medidas"
ON public.unidades_medidas
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Política de exclusão para usuários autenticados
CREATE POLICY "Usuários autenticados podem deletar unidades medidas"
ON public.unidades_medidas
FOR DELETE
USING (auth.uid() IS NOT NULL);