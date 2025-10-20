-- Migration: criar_painel_analise_contratual
-- Adicionar novos campos à tabela analises_contratuais

-- 1. Criar tabela de análises contratuais
CREATE TABLE IF NOT EXISTS analises_contratuais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Cliente/Projeto
  cca_codigo text,
  nome_cliente text,
  nome_projeto text,
  
  -- Dados do Fornecedor
  fornecedor_id uuid REFERENCES fornecedores_alojamento(id),
  fornecedor_nome text NOT NULL,
  fornecedor_cnpj text NOT NULL,
  fornecedor_contato text,
  fornecedor_email text,
  
  -- Locador (proprietário)
  nome_proprietario text NOT NULL,
  cpf_proprietario text,
  
  -- Endereço detalhado
  logradouro text NOT NULL,
  numero text NOT NULL,
  complemento text,
  bairro text NOT NULL,
  cidade text NOT NULL,
  uf text NOT NULL,
  cep text NOT NULL,
  
  -- Dados Contratuais
  numero_contrato text NOT NULL,
  valor_mensal numeric NOT NULL,
  dia_vencimento integer NOT NULL,
  forma_pagamento text NOT NULL,
  
  -- Detalhes financeiros adicionais
  tem_ir boolean DEFAULT false,
  caucao numeric,
  meses_caucao integer,
  
  -- Prazo contratual detalhado
  data_inicio_contrato date NOT NULL,
  data_fim_contrato date NOT NULL,
  prazo_contratual integer,
  
  -- Vistoria
  tem_vistoria boolean DEFAULT false,
  vistoria_pdf_url text,
  
  -- Despesas e cláusulas
  despesas_adicionais text,
  clausula_multa text,
  observacoes_clausulas text,
  
  -- Documentação
  contrato_pdf_url text NOT NULL,
  anexos jsonb DEFAULT '[]'::jsonb,
  
  -- Análise
  responsavel_analise text NOT NULL,
  status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'validado', 'enviado_gestao')),
  destinatarios_validacao jsonb DEFAULT '[]'::jsonb,
  
  -- Conclusão customizável
  texto_conclusao text DEFAULT 'não há demais pontos a questionar. Contrato liberado para assinatura.',
  
  -- Destinatário principal (para menção @)
  destinatario_principal_email text,
  destinatario_principal_nome text,
  
  -- Resumo gerado
  resumo_pdf_url text,
  
  -- Vínculo com contrato definitivo
  contrato_definitivo_id uuid REFERENCES contratos_alojamento(id),
  
  -- Auditoria
  data_envio_validacao timestamptz,
  data_criacao_contrato timestamptz
);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_analises_status ON analises_contratuais(status);
CREATE INDEX IF NOT EXISTS idx_analises_fornecedor ON analises_contratuais(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_analises_responsavel ON analises_contratuais(responsavel_analise);
CREATE INDEX IF NOT EXISTS idx_analises_cca ON analises_contratuais(cca_codigo);

-- 3. Trigger para updated_at
CREATE TRIGGER update_analises_contratuais_updated_at
  BEFORE UPDATE ON analises_contratuais
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. RLS
ALTER TABLE analises_contratuais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de análises para todos"
ON analises_contratuais FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção de análises para todos"
ON analises_contratuais FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir atualização de análises para todos"
ON analises_contratuais FOR UPDATE
USING (true);

CREATE POLICY "Permitir exclusão de análises para todos"
ON analises_contratuais FOR DELETE
USING (true);

-- 5. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('analises-contratuais', 'analises-contratuais', true)
ON CONFLICT (id) DO NOTHING;