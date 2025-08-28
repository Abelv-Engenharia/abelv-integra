-- Corrigir políticas RLS para tarefas_anexos
DROP POLICY IF EXISTS "Usuários podem inserir anexos em tarefas" ON public.tarefas_anexos;
DROP POLICY IF EXISTS "Usuários podem atualizar anexos próprios" ON public.tarefas_anexos;
DROP POLICY IF EXISTS "Usuários podem excluir anexos próprios" ON public.tarefas_anexos;

-- Recriar políticas mais permissivas e funcionais
CREATE POLICY "Usuários autenticados podem inserir anexos" 
ON public.tarefas_anexos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem atualizar próprios anexos" 
ON public.tarefas_anexos 
FOR UPDATE 
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Usuários podem excluir próprios anexos" 
ON public.tarefas_anexos 
FOR DELETE 
USING (auth.uid() = created_by);

-- Adicionar trigger para definir automaticamente o created_by
CREATE OR REPLACE FUNCTION public.set_created_by_on_tarefas_anexos()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_set_created_by_tarefas_anexos
  BEFORE INSERT ON public.tarefas_anexos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by_on_tarefas_anexos();