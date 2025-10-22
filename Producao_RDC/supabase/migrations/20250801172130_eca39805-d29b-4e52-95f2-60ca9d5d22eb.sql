-- Criar tabela para parâmetros de tubulação
CREATE TABLE public.parametros_tubulacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_material TEXT NOT NULL, -- 'CARBONO' ou 'INOX304'
  atividade TEXT NOT NULL, -- 'TUB_AC' ou 'TUB_AI304'
  valor_base NUMERIC NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tipo_material, atividade)
);

-- Enable RLS
ALTER TABLE public.parametros_tubulacao ENABLE ROW LEVEL SECURITY;

-- Create policy for full access
CREATE POLICY "Allow all access to parametros_tubulacao" 
ON public.parametros_tubulacao 
FOR ALL 
USING (true);

-- Add trigger for timestamps
CREATE TRIGGER update_parametros_tubulacao_updated_at
BEFORE UPDATE ON public.parametros_tubulacao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial values
INSERT INTO public.parametros_tubulacao (tipo_material, atividade, valor_base, descricao) VALUES
('CARBONO', 'TUB_AC', 1.8, 'Valor base para tubulação de aço carbono'),
('INOX304', 'TUB_AI304', 2.3, 'Valor base para tubulação de aço inox 304');