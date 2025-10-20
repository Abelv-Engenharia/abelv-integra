-- Criar tabela para medições de aluguel
CREATE TABLE public.medicoes_aluguel (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contrato_id uuid NOT NULL REFERENCES contratos_alojamento(id) ON DELETE CASCADE,
  numero_medicao text NOT NULL,
  obra text NOT NULL,
  competencia text NOT NULL,
  empresa text,
  data_inicio date,
  data_fim date,
  dias_aluguel integer NOT NULL DEFAULT 0,
  valor_total numeric NOT NULL DEFAULT 0,
  valor_diaria numeric,
  colaboradores jsonb NOT NULL DEFAULT '[]'::jsonb,
  observacoes text,
  anexos jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'rascunho',
  data_envio timestamp with time zone,
  validador_responsavel text,
  titulo_sienge text,
  numero_titulo text,
  vencimento date,
  situacao_sienge text,
  dados_sienge jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medicoes_aluguel ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Permitir leitura de medições para todos"
  ON public.medicoes_aluguel
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de medições para todos"
  ON public.medicoes_aluguel
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de medições para todos"
  ON public.medicoes_aluguel
  FOR UPDATE
  USING (true);

CREATE POLICY "Permitir exclusão de medições para todos"
  ON public.medicoes_aluguel
  FOR DELETE
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_medicoes_aluguel_updated_at
  BEFORE UPDATE ON public.medicoes_aluguel
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();