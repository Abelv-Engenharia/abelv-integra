-- Criar tabela para checklists de avaliação
CREATE TABLE public.checklists_avaliacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  campos_cabecalho JSONB DEFAULT '[]'::jsonb,
  itens_avaliacao JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.checklists_avaliacao ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Checklists - ler (autenticados)" 
ON public.checklists_avaliacao 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Checklists - inserir (admin_funcionarios)" 
ON public.checklists_avaliacao 
FOR INSERT 
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true);

CREATE POLICY "Checklists - atualizar (admin_funcionarios)" 
ON public.checklists_avaliacao 
FOR UPDATE 
USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true)
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true);

CREATE POLICY "Checklists - excluir (admin_funcionarios)" 
ON public.checklists_avaliacao 
FOR DELETE 
USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_checklists_avaliacao_updated_at
BEFORE UPDATE ON public.checklists_avaliacao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();