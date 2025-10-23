-- Criar tabela para registro de entradas de materiais nos almoxarifados
CREATE TABLE public.estoque_movimentacoes_entradas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cca_id integer NOT NULL REFERENCES public.ccas(id),
  almoxarifado_id uuid NOT NULL REFERENCES public.almoxarifados(id),
  item_nfe_id uuid REFERENCES public.nfe_compra_itens(id),
  quantidade numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.estoque_movimentacoes_entradas ENABLE ROW LEVEL SECURITY;

-- Criar políticas para acesso
CREATE POLICY "Movimentações entradas - visualizar (autenticados)" 
ON public.estoque_movimentacoes_entradas 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Movimentações entradas - criar (autenticados)" 
ON public.estoque_movimentacoes_entradas 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Movimentações entradas - atualizar (autenticados)" 
ON public.estoque_movimentacoes_entradas 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Movimentações entradas - deletar (autenticados)" 
ON public.estoque_movimentacoes_entradas 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_estoque_movimentacoes_entradas_updated_at
BEFORE UPDATE ON public.estoque_movimentacoes_entradas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para performance
CREATE INDEX idx_estoque_movimentacoes_entradas_cca ON public.estoque_movimentacoes_entradas(cca_id);
CREATE INDEX idx_estoque_movimentacoes_entradas_almoxarifado ON public.estoque_movimentacoes_entradas(almoxarifado_id);
CREATE INDEX idx_estoque_movimentacoes_entradas_item_nfe ON public.estoque_movimentacoes_entradas(item_nfe_id);