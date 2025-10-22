-- Primeiro, removemos todas as políticas existentes na tabela relatorios_mecanica
DROP POLICY IF EXISTS "Allow all access to relatorios_mecanica" ON public.relatorios_mecanica;

-- Agora criamos uma política que permite acesso completo para qualquer usuário
CREATE POLICY "Public access to relatorios_mecanica" 
ON public.relatorios_mecanica 
FOR ALL 
TO public
USING (true)
WITH CHECK (true);