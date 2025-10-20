-- Criar tabela para medições de hospedagem
CREATE TABLE public.medicoes_hospedagem (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_medicao text NOT NULL UNIQUE,
  fornecedor_nome text NOT NULL,
  fornecedor_cpf_cnpj text NOT NULL,
  fornecedor_tipo text NOT NULL,
  fornecedor_endereco text,
  fornecedor_telefone text,
  obra text NOT NULL,
  competencia text NOT NULL,
  empresa text,
  data_inicio date,
  data_fim date,
  dias_hospedagem integer NOT NULL,
  valor_diaria numeric NOT NULL,
  valor_total numeric NOT NULL,
  colaboradores jsonb NOT NULL DEFAULT '[]'::jsonb,
  anexos jsonb NOT NULL DEFAULT '[]'::jsonb,
  observacoes text,
  status text NOT NULL DEFAULT 'rascunho',
  validador_responsavel text,
  data_envio timestamp with time zone,
  titulo_sienge text,
  numero_titulo text,
  vencimento date,
  situacao_sienge text,
  dados_sienge jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.medicoes_hospedagem ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Permitir leitura de medições para todos"
ON public.medicoes_hospedagem
FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção de medições para todos"
ON public.medicoes_hospedagem
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir atualização de medições para todos"
ON public.medicoes_hospedagem
FOR UPDATE
USING (true);

CREATE POLICY "Permitir exclusão de medições para todos"
ON public.medicoes_hospedagem
FOR DELETE
USING (true);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_medicoes_hospedagem_updated_at
BEFORE UPDATE ON public.medicoes_hospedagem
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para melhor performance
CREATE INDEX idx_medicoes_hospedagem_status ON public.medicoes_hospedagem(status);
CREATE INDEX idx_medicoes_hospedagem_obra ON public.medicoes_hospedagem(obra);
CREATE INDEX idx_medicoes_hospedagem_competencia ON public.medicoes_hospedagem(competencia);