-- Adicionar política RLS para permitir que usuários excluam suas próprias inspeções
DROP POLICY IF EXISTS "Usuários podem excluir suas inspeções" ON public.inspecoes_sms;

CREATE POLICY "Usuários podem excluir suas inspeções"
ON public.inspecoes_sms 
FOR DELETE 
USING (auth.uid() = responsavel_id);