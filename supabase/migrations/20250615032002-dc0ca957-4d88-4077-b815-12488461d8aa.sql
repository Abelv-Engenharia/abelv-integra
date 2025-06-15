
-- Criação da tabela execucao_hsa para registrar execuções de Hora da Segurança
CREATE TABLE public.execucao_hsa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cca text NOT NULL,
  data date NOT NULL, -- data da execução
  ano integer NOT NULL,
  mes integer NOT NULL,
  inspecao_programada text, -- poderia ser relacionado a tipo_inspecao_hsa, mas como solicitado: texto
  responsavel_inspecao text NOT NULL,
  funcao text,
  observacao text,
  desvios_identificados integer NOT NULL DEFAULT 0,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilita Row Level Security (RLS)
ALTER TABLE public.execucao_hsa ENABLE ROW LEVEL SECURITY;

-- Política: Permitir SELECT para usuários autenticados
CREATE POLICY "Permitir leitura para autenticados"
  ON public.execucao_hsa
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Permitir INSERT para usuários autenticados
CREATE POLICY "Permitir inserção para autenticados"
  ON public.execucao_hsa
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Permitir UPDATE para usuários autenticados
CREATE POLICY "Permitir atualização para autenticados"
  ON public.execucao_hsa
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Permitir DELETE para usuários autenticados
CREATE POLICY "Permitir exclusão para autenticados"
  ON public.execucao_hsa
  FOR DELETE
  TO authenticated
  USING (true);

-- Trigger para registrar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at_execucao_hsa()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_execucao_hsa ON public.execucao_hsa;
CREATE TRIGGER trigger_set_updated_at_execucao_hsa
  BEFORE UPDATE ON public.execucao_hsa
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_execucao_hsa();
