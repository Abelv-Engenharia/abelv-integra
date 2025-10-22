-- Criar tabela para cadastro de linhas
CREATE TABLE public.linhas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_linha TEXT NOT NULL,
  fluido_id UUID REFERENCES public.fluidos(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.linhas ENABLE ROW LEVEL SECURITY;

-- Criar política para acesso total
CREATE POLICY "Allow all access to linhas" 
ON public.linhas 
FOR ALL 
USING (true);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_linhas_updated_at
BEFORE UPDATE ON public.linhas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();