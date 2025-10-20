-- Criar tabela para cadastro de cauções
CREATE TABLE public.caucoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Referência ao contrato
  contrato_id uuid NOT NULL REFERENCES public.contratos_alojamento(id) ON DELETE CASCADE,
  
  -- Dados do formulário
  data_emissao date NOT NULL,
  data_vencimento date NOT NULL,
  tipo_documento text NOT NULL,
  observacoes text,
  conta_financeira text NOT NULL,
  centro_custo text NOT NULL,
  forma_pagamento text NOT NULL,
  banco text,
  agencia text,
  conta text,
  operacao text,
  
  -- Status do fluxo (pendente, aprovado, reprovado, liquidado)
  status text NOT NULL DEFAULT 'pendente',
  
  -- Dados de aprovação/reprovação
  aprovado_por text,
  data_aprovacao timestamp with time zone,
  motivo_reprovacao text,
  
  -- Dados de liquidação
  titulo_sienge text,
  data_pagamento date,
  comprovante_pagamento_url text,
  arquivo_pdf_unificado_url text
);

-- Habilitar RLS
ALTER TABLE public.caucoes ENABLE ROW LEVEL SECURITY;

-- Policies de acesso
CREATE POLICY "Permitir leitura de cauções para todos"
ON public.caucoes FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção de cauções para todos"
ON public.caucoes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir atualização de cauções para todos"
ON public.caucoes FOR UPDATE
USING (true);

CREATE POLICY "Permitir exclusão de cauções para todos"
ON public.caucoes FOR DELETE
USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_caucoes_updated_at
BEFORE UPDATE ON public.caucoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();