-- Criar tabela de fornecedores de alojamento
CREATE TABLE IF NOT EXISTS public.fornecedores_alojamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  endereco TEXT NOT NULL,
  contato_nome TEXT,
  telefone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.fornecedores_alojamento ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para todos
CREATE POLICY "Permitir leitura de fornecedores para todos"
ON public.fornecedores_alojamento
FOR SELECT
USING (true);

-- Política para permitir inserção para todos
CREATE POLICY "Permitir inserção de fornecedores para todos"
ON public.fornecedores_alojamento
FOR INSERT
WITH CHECK (true);

-- Política para permitir atualização para todos
CREATE POLICY "Permitir atualização de fornecedores para todos"
ON public.fornecedores_alojamento
FOR UPDATE
USING (true);

-- Política para permitir exclusão para todos
CREATE POLICY "Permitir exclusão de fornecedores para todos"
ON public.fornecedores_alojamento
FOR DELETE
USING (true);

-- Criar índices
CREATE INDEX idx_fornecedores_nome ON public.fornecedores_alojamento(nome);
CREATE INDEX idx_fornecedores_cnpj ON public.fornecedores_alojamento(cnpj);
CREATE INDEX idx_fornecedores_status ON public.fornecedores_alojamento(status);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fornecedores_alojamento_updated_at
  BEFORE UPDATE ON public.fornecedores_alojamento
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();