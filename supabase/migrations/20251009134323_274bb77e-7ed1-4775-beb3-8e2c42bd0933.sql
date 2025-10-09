-- Criar política de SELECT para usuários autenticados visualizarem funcionários
CREATE POLICY "Funcionários - visualizar (autenticados)"
ON public.funcionarios
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);