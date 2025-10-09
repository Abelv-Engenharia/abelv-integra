-- Permitir INSERT para usuários autenticados
CREATE POLICY "Desvios - criar (autenticados)"
ON public.desvios_completos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Permitir UPDATE para usuários autenticados
CREATE POLICY "Desvios - atualizar (autenticados)"
ON public.desvios_completos
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Permitir DELETE para usuários autenticados
CREATE POLICY "Desvios - deletar (autenticados)"
ON public.desvios_completos
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);