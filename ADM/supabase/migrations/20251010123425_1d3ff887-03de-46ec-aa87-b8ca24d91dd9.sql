-- Criar tabela para medições de transporte
CREATE TABLE public.medicoes_transporte (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_medicao text NOT NULL,
  cca text NOT NULL,
  fornecedor text NOT NULL,
  cnpj text,
  periodo text NOT NULL,
  data_emissao date,
  prazo_pagamento date,
  valor_total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pendente',
  numero_nf text,
  itens jsonb NOT NULL DEFAULT '[]'::jsonb,
  anexo_nf_url text,
  anexo_nf_nome text,
  status_integracao text NOT NULL DEFAULT 'pendente_nf',
  numero_sienge text,
  dados_sienge jsonb,
  observacoes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medicoes_transporte ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Permitir leitura de medições de transporte para todos"
  ON public.medicoes_transporte
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de medições de transporte para todos"
  ON public.medicoes_transporte
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de medições de transporte para todos"
  ON public.medicoes_transporte
  FOR UPDATE
  USING (true);

CREATE POLICY "Permitir exclusão de medições de transporte para todos"
  ON public.medicoes_transporte
  FOR DELETE
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_medicoes_transporte_updated_at
  BEFORE UPDATE ON public.medicoes_transporte
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();