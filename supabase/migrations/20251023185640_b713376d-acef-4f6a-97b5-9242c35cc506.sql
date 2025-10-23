-- Criar tabela para movimentações de saída (requisições)
CREATE TABLE public.estoque_movimentacoes_saidas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero SERIAL NOT NULL,
  cca_id INTEGER NOT NULL REFERENCES public.ccas(id),
  requisitante TEXT NOT NULL,
  data_movimento DATE NOT NULL,
  almoxarifado_id UUID NOT NULL REFERENCES public.almoxarifados(id),
  apropriacao_id UUID REFERENCES public.eap_itens(id),
  observacao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para itens das movimentações de saída
CREATE TABLE public.estoque_movimentacoes_saidas_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movimentacao_saida_id UUID NOT NULL REFERENCES public.estoque_movimentacoes_saidas(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  unidade TEXT,
  quantidade NUMERIC NOT NULL,
  unitario NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_estoque_movimentacoes_saidas_cca ON public.estoque_movimentacoes_saidas(cca_id);
CREATE INDEX idx_estoque_movimentacoes_saidas_almoxarifado ON public.estoque_movimentacoes_saidas(almoxarifado_id);
CREATE INDEX idx_estoque_movimentacoes_saidas_data ON public.estoque_movimentacoes_saidas(data_movimento);
CREATE INDEX idx_estoque_movimentacoes_saidas_itens_movimentacao ON public.estoque_movimentacoes_saidas_itens(movimentacao_saida_id);

-- Habilitar RLS
ALTER TABLE public.estoque_movimentacoes_saidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque_movimentacoes_saidas_itens ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para estoque_movimentacoes_saidas
CREATE POLICY "Saídas - visualizar (autenticados)"
ON public.estoque_movimentacoes_saidas
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Saídas - criar (autenticados)"
ON public.estoque_movimentacoes_saidas
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Saídas - atualizar (autenticados)"
ON public.estoque_movimentacoes_saidas
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Saídas - deletar (autenticados)"
ON public.estoque_movimentacoes_saidas
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Políticas RLS para estoque_movimentacoes_saidas_itens
CREATE POLICY "Itens saídas - visualizar (autenticados)"
ON public.estoque_movimentacoes_saidas_itens
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Itens saídas - criar (autenticados)"
ON public.estoque_movimentacoes_saidas_itens
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Itens saídas - atualizar (autenticados)"
ON public.estoque_movimentacoes_saidas_itens
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Itens saídas - deletar (autenticados)"
ON public.estoque_movimentacoes_saidas_itens
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_estoque_movimentacoes_saidas_updated_at
  BEFORE UPDATE ON public.estoque_movimentacoes_saidas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_estoque_movimentacoes_saidas_itens_updated_at
  BEFORE UPDATE ON public.estoque_movimentacoes_saidas_itens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();