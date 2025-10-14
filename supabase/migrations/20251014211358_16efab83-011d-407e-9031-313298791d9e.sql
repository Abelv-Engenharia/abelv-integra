-- Criar tabela para propostas comerciais
CREATE TABLE public.propostas_comerciais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pc VARCHAR(5) NOT NULL,
  data_saida_proposta DATE NOT NULL,
  orcamento_duplicado VARCHAR(3) NOT NULL CHECK (orcamento_duplicado IN ('Sim', 'Não')),
  segmento_id UUID NOT NULL REFERENCES public.segmentos_comercial(id),
  cliente TEXT NOT NULL,
  obra TEXT NOT NULL,
  vendedor_id UUID NOT NULL REFERENCES public.vendedores_comercial(id),
  numero_revisao INTEGER NOT NULL DEFAULT 1,
  valor_venda NUMERIC(15, 2) NOT NULL DEFAULT 0,
  margem_percentual NUMERIC(5, 2) NOT NULL DEFAULT 0,
  margem_valor NUMERIC(15, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.propostas_comerciais ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Propostas - visualizar (autenticados)"
  ON public.propostas_comerciais
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Propostas - criar (autenticados)"
  ON public.propostas_comerciais
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Propostas - atualizar (autenticados)"
  ON public.propostas_comerciais
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Propostas - deletar (autenticados)"
  ON public.propostas_comerciais
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Trigger para updated_at
CREATE TRIGGER update_propostas_comerciais_updated_at
  BEFORE UPDATE ON public.propostas_comerciais
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para created_by
CREATE TRIGGER set_propostas_comerciais_created_by
  BEFORE INSERT ON public.propostas_comerciais
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

-- Trigger para updated_by
CREATE TRIGGER set_propostas_comerciais_updated_by
  BEFORE UPDATE ON public.propostas_comerciais
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_by();

-- Índices para performance
CREATE INDEX idx_propostas_pc ON public.propostas_comerciais(pc);
CREATE INDEX idx_propostas_segmento ON public.propostas_comerciais(segmento_id);
CREATE INDEX idx_propostas_vendedor ON public.propostas_comerciais(vendedor_id);
CREATE INDEX idx_propostas_status ON public.propostas_comerciais(status);