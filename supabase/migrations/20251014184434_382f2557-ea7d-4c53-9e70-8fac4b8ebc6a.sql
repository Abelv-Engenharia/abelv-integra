-- Criar tabela para segmentos comerciais
CREATE TABLE public.segmentos_comercial (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL UNIQUE,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.segmentos_comercial ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Segmentos - visualizar (autenticados)"
ON public.segmentos_comercial
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Segmentos - criar (autenticados)"
ON public.segmentos_comercial
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Segmentos - atualizar (autenticados)"
ON public.segmentos_comercial
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Segmentos - deletar (autenticados)"
ON public.segmentos_comercial
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Inserir dados mockados
INSERT INTO public.segmentos_comercial (nome) VALUES
  ('Infraestrutura'),
  ('Químico e Petroquímico'),
  ('Óleo e Gás'),
  ('Siderurgia e Metalurgia'),
  ('Fertilizantes e Cimento'),
  ('Papel e Celulose'),
  ('Mineração'),
  ('Farmacêutica e Cosmético'),
  ('Alimentícia e Bebidas'),
  ('Automobilística'),
  ('Vidro e Borracha'),
  ('Shopping'),
  ('Residencial'),
  ('Galpão'),
  ('Comercial Predial'),
  ('Hospitalar'),
  ('Data Center');

-- Trigger para atualizar updated_at
CREATE TRIGGER update_segmentos_comercial_updated_at
BEFORE UPDATE ON public.segmentos_comercial
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();