-- Renomear coluna descricao para localizacao na tabela ccas
ALTER TABLE public.ccas RENAME COLUMN descricao TO localizacao;

-- Adicionar comentário para documentação
COMMENT ON COLUMN public.ccas.localizacao IS 'Localização física do Centro de Custo';