-- Criar tabela para cadastro de juntas
CREATE TABLE public.juntas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_junta TEXT NOT NULL,
  linha_id UUID REFERENCES public.linhas(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.juntas ENABLE ROW LEVEL SECURITY;

-- Criar política para acesso total
CREATE POLICY "Allow all access to juntas" 
ON public.juntas 
FOR ALL 
USING (true);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_juntas_updated_at
BEFORE UPDATE ON public.juntas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();