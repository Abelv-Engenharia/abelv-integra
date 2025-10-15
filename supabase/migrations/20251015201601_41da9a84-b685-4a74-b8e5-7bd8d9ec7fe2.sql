-- Criar tabela para consolidações de propostas contempladas
CREATE TABLE public.consolidacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposta_id UUID NOT NULL REFERENCES public.propostas_comerciais(id) ON DELETE CASCADE,
  data_assinatura_contrato_real DATE NOT NULL,
  data_termino_contrato_prevista DATE NOT NULL,
  data_entrega_orcamento_executivo_prevista DATE NOT NULL,
  data_entrega_orcamento_executivo_real DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(proposta_id)
);

-- Habilitar RLS
ALTER TABLE public.consolidacoes ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Consolidações - visualizar (autenticados)"
ON public.consolidacoes
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Consolidações - criar (autenticados)"
ON public.consolidacoes
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Consolidações - atualizar (autenticados)"
ON public.consolidacoes
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Consolidações - deletar (autenticados)"
ON public.consolidacoes
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_consolidacoes_updated_at
BEFORE UPDATE ON public.consolidacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para definir created_by
CREATE TRIGGER set_consolidacoes_created_by
BEFORE INSERT ON public.consolidacoes
FOR EACH ROW
EXECUTE FUNCTION public.set_created_by();

-- Trigger para definir updated_by
CREATE TRIGGER set_consolidacoes_updated_by
BEFORE UPDATE ON public.consolidacoes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_by();