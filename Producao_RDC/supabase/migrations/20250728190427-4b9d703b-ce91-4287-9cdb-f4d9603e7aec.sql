-- Criar tabela para cadastro de fluidos
CREATE TABLE public.fluidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.fluidos ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso total
CREATE POLICY "Allow all access to fluidos" 
ON public.fluidos 
FOR ALL 
USING (true);

-- Criar função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualização automática de timestamps
CREATE TRIGGER update_fluidos_updated_at
  BEFORE UPDATE ON public.fluidos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns fluidos de exemplo
INSERT INTO public.fluidos (nome, descricao) VALUES 
('Água', 'Água potável ou industrial'),
('Vapor', 'Vapor de água para aquecimento'),
('Óleo Hidráulico', 'Óleo para sistemas hidráulicos'),
('Gás Natural', 'Gás natural combustível'),
('Ar Comprimido', 'Ar pressurizado para pneumática'),
('Óleo Lubrificante', 'Óleo para lubrificação de equipamentos'),
('Combustível Diesel', 'Diesel para motores'),
('Álcool', 'Álcool etílico ou metílico');