-- Limpar dados da tabela eap_itens antes de fazer as alterações
TRUNCATE TABLE public.eap_itens CASCADE;

-- Remover a coluna eap_estrutura_id e adicionar cca_id diretamente
ALTER TABLE public.eap_itens DROP COLUMN eap_estrutura_id;
ALTER TABLE public.eap_itens ADD COLUMN cca_id INTEGER NOT NULL REFERENCES public.ccas(id) ON DELETE CASCADE;

-- Adicionar coluna parent_codigo para facilitar a hierarquia
ALTER TABLE public.eap_itens ADD COLUMN parent_codigo TEXT;

-- Recriar índices
DROP INDEX IF EXISTS idx_eap_itens_estrutura;
DROP INDEX IF EXISTS idx_eap_itens_codigo;

CREATE INDEX idx_eap_itens_cca ON public.eap_itens(cca_id) WHERE ativo = true;
CREATE INDEX idx_eap_itens_codigo ON public.eap_itens(cca_id, codigo) WHERE ativo = true;
CREATE INDEX idx_eap_itens_parent_codigo ON public.eap_itens(cca_id, parent_codigo) WHERE ativo = true;

-- Remover unique constraint antigo e criar novo
ALTER TABLE public.eap_itens DROP CONSTRAINT IF EXISTS eap_itens_eap_estrutura_id_codigo_key;
ALTER TABLE public.eap_itens ADD CONSTRAINT eap_itens_cca_codigo_unique UNIQUE(cca_id, codigo);

-- Dropar a tabela eap_estruturas
DROP TABLE IF EXISTS public.eap_estruturas CASCADE;

-- Comentários para documentação
COMMENT ON TABLE public.eap_itens IS 'Armazena itens da EAP (Estrutura Analítica de Projeto) vinculados diretamente ao CCA';
COMMENT ON COLUMN public.eap_itens.cca_id IS 'Referência ao CCA proprietário desta estrutura EAP';
COMMENT ON COLUMN public.eap_itens.parent_codigo IS 'Código do item pai na hierarquia (ex: item 1.1.1 tem parent_codigo 1.1)';