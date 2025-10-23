-- Criar nova tabela estoque_movimentacoes_entradas_itens
CREATE TABLE IF NOT EXISTS public.estoque_movimentacoes_entradas_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movimentacao_entrada_id UUID NOT NULL,
  item_nfe_id TEXT,
  quantidade NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Migrar dados existentes para a nova tabela
INSERT INTO public.estoque_movimentacoes_entradas_itens (movimentacao_entrada_id, item_nfe_id, quantidade, created_at, updated_at)
SELECT id, item_nfe_id, quantidade, created_at, updated_at
FROM public.estoque_movimentacoes_entradas
WHERE item_nfe_id IS NOT NULL;

-- Adicionar colunas para PDF na tabela estoque_movimentacoes_entradas
ALTER TABLE public.estoque_movimentacoes_entradas
ADD COLUMN pdf_url TEXT,
ADD COLUMN pdf_nome TEXT;

-- Remover colunas item_nfe_id e quantidade da tabela estoque_movimentacoes_entradas
ALTER TABLE public.estoque_movimentacoes_entradas
DROP COLUMN IF EXISTS item_nfe_id,
DROP COLUMN IF EXISTS quantidade;

-- Criar índice para performance
CREATE INDEX idx_estoque_movimentacoes_entradas_itens_movimentacao 
ON public.estoque_movimentacoes_entradas_itens(movimentacao_entrada_id);

-- Habilitar RLS
ALTER TABLE public.estoque_movimentacoes_entradas_itens ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "estoque_movimentacoes_entradas_itens - visualizar (autenticados)"
ON public.estoque_movimentacoes_entradas_itens
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "estoque_movimentacoes_entradas_itens - criar (autenticados)"
ON public.estoque_movimentacoes_entradas_itens
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "estoque_movimentacoes_entradas_itens - atualizar (autenticados)"
ON public.estoque_movimentacoes_entradas_itens
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "estoque_movimentacoes_entradas_itens - deletar (autenticados)"
ON public.estoque_movimentacoes_entradas_itens
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Trigger para updated_at
CREATE TRIGGER update_estoque_movimentacoes_entradas_itens_updated_at
BEFORE UPDATE ON public.estoque_movimentacoes_entradas_itens
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();