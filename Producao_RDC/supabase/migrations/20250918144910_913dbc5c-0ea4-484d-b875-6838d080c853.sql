-- Criar tabela para tipos de infraestrutura elétrica
CREATE TABLE public.tipos_infraestrutura_eletrica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  dimensoes_padrao JSONB DEFAULT '[]'::jsonb,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tipos_infraestrutura_eletrica ENABLE ROW LEVEL SECURITY;

-- Create policy for all access
CREATE POLICY "Allow all access to tipos_infraestrutura_eletrica" 
ON public.tipos_infraestrutura_eletrica 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tipos_infraestrutura_eletrica_updated_at
BEFORE UPDATE ON public.tipos_infraestrutura_eletrica
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns tipos básicos de infraestrutura
INSERT INTO public.tipos_infraestrutura_eletrica (nome, dimensoes_padrao, descricao) VALUES
('Eletrocalha', '["100x50mm", "200x100mm", "300x150mm", "400x200mm", "500x250mm"]', 'Calhas para passagem de cabos elétricos'),
('Suporte', '["50x50mm", "100x100mm", "150x150mm", "200x200mm"]', 'Suportes para fixação de equipamentos'),
('Bandeja', '["300x50mm", "400x75mm", "500x100mm", "600x150mm"]', 'Bandejas para organização de cabos'),
('Caixa de Passagem', '["200x200x100mm", "300x300x150mm", "400x400x200mm", "500x500x250mm"]', 'Caixas para passagem e derivação de circuitos'),
('Conduite', '["1/2\"", "3/4\"", "1\"", "1.1/4\"", "1.1/2\"", "2\"", "2.1/2\"", "3\"", "4\""]', 'Dutos para proteção de fiação'),
('Perfilado', '["38x38mm", "41x41mm", "41x21mm", "41x82mm"]', 'Perfis estruturais para montagem');

-- Migrar dados existentes da tabela infraestrutura_eletrica
-- Primeiro, vamos criar tipos baseados nos nomes únicos existentes
INSERT INTO public.tipos_infraestrutura_eletrica (nome, dimensoes_padrao, descricao)
SELECT DISTINCT 
  nome,
  CASE 
    WHEN dimensao IS NOT NULL AND dimensao != '' THEN 
      jsonb_build_array(dimensao)
    ELSE 
      '[]'::jsonb
  END,
  'Migrado automaticamente'
FROM public.infraestrutura_eletrica 
WHERE nome NOT IN (
  SELECT nome FROM public.tipos_infraestrutura_eletrica
)
AND nome IS NOT NULL 
AND nome != '';

-- Adicionar nova coluna tipo_infraestrutura_id
ALTER TABLE public.infraestrutura_eletrica 
ADD COLUMN tipo_infraestrutura_id UUID REFERENCES public.tipos_infraestrutura_eletrica(id);

-- Migrar dados existentes para usar os novos tipos
UPDATE public.infraestrutura_eletrica 
SET tipo_infraestrutura_id = (
  SELECT t.id 
  FROM public.tipos_infraestrutura_eletrica t 
  WHERE t.nome = infraestrutura_eletrica.nome
  LIMIT 1
)
WHERE nome IS NOT NULL;

-- Remover a coluna nome antiga após migração
ALTER TABLE public.infraestrutura_eletrica DROP COLUMN nome;