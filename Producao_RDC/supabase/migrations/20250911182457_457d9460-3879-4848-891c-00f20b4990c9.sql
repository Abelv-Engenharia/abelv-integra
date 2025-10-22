-- Adicionar coluna equipe na tabela encarregados
ALTER TABLE public.encarregados 
ADD COLUMN equipe JSONB DEFAULT '[]'::jsonb;

-- Adicionar comentário para documentar a estrutura da coluna
COMMENT ON COLUMN public.encarregados.equipe IS 'Array de objetos contendo função e quantidade: [{"funcao": "Soldador", "quantidade": 2}]';