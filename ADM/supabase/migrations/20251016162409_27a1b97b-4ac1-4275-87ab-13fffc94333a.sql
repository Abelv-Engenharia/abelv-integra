-- Adicionar colunas em analises_contratuais para rastrear criação de contrato definitivo
ALTER TABLE analises_contratuais 
ADD COLUMN IF NOT EXISTS contrato_criado boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS data_criacao_contrato_definitivo timestamp with time zone;

-- Adicionar colunas em contratos_alojamento para vincular à análise contratual
ALTER TABLE contratos_alojamento
ADD COLUMN IF NOT EXISTS analise_contratual_id uuid REFERENCES analises_contratuais(id),
ADD COLUMN IF NOT EXISTS cca_codigo text,
ADD COLUMN IF NOT EXISTS tipo_alojamento text DEFAULT 'MOD',
ADD COLUMN IF NOT EXISTS numero_sequencial integer,
ADD COLUMN IF NOT EXISTS valor_caucao_previsto numeric,
ADD COLUMN IF NOT EXISTS meses_caucao integer,
ADD COLUMN IF NOT EXISTS dia_vencimento_aluguel integer,
ADD COLUMN IF NOT EXISTS forma_pagamento_aluguel text,
ADD COLUMN IF NOT EXISTS tem_ir boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS valor_ir numeric,
ADD COLUMN IF NOT EXISTS possui_caucao boolean DEFAULT false;

-- Criar tabela para alertas de medição de aluguel
CREATE TABLE IF NOT EXISTS alertas_medicao_aluguel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id uuid REFERENCES contratos_alojamento(id) ON DELETE CASCADE NOT NULL,
  cca_codigo text NOT NULL,
  data_referencia date NOT NULL,
  competencia text NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  data_medicao timestamp with time zone,
  medicao_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(contrato_id, competencia)
);

-- Habilitar RLS na nova tabela
ALTER TABLE alertas_medicao_aluguel ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para alertas_medicao_aluguel
CREATE POLICY "Usuários autenticados podem visualizar alertas"
ON alertas_medicao_aluguel FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir alertas"
ON alertas_medicao_aluguel FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar alertas"
ON alertas_medicao_aluguel FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Apenas admins podem deletar alertas"
ON alertas_medicao_aluguel FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_alertas_medicao_aluguel_updated_at
BEFORE UPDATE ON alertas_medicao_aluguel
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas colunas para documentação
COMMENT ON COLUMN contratos_alojamento.analise_contratual_id IS 'Vínculo com a análise contratual aprovada que originou este contrato';
COMMENT ON COLUMN contratos_alojamento.tipo_alojamento IS 'Tipo de alojamento: MOD (Modular) ou MOI (Imóvel)';
COMMENT ON COLUMN contratos_alojamento.numero_sequencial IS 'Número sequencial do alojamento por CCA e tipo (01-99)';
COMMENT ON TABLE alertas_medicao_aluguel IS 'Alertas mensais para medição de aluguel gerados automaticamente no dia 01 de cada mês';