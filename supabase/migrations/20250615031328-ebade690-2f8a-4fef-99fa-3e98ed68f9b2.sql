
-- Criação da tabela tipo_inspecao_hsa para cadastrar tipos de inspeção de Hora da Segurança
CREATE TABLE public.tipo_inspecao_hsa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilita Row Level Security (RLS)
ALTER TABLE public.tipo_inspecao_hsa ENABLE ROW LEVEL SECURITY;

-- Política: Permitir SELECT para usuários autenticados
CREATE POLICY "Permitir leitura para autenticados" 
  ON public.tipo_inspecao_hsa 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Política: Permitir INSERT para usuários autenticados
CREATE POLICY "Permitir inserção para autenticados"
  ON public.tipo_inspecao_hsa
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Permitir UPDATE para usuários autenticados
CREATE POLICY "Permitir atualização para autenticados"
  ON public.tipo_inspecao_hsa
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Permitir DELETE para usuários autenticados
CREATE POLICY "Permitir exclusão para autenticados"
  ON public.tipo_inspecao_hsa
  FOR DELETE
  TO authenticated
  USING (true);

-- Trigger opcional para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at_tipo_inspecao_hsa()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_tipo_inspecao_hsa ON public.tipo_inspecao_hsa;
CREATE TRIGGER trigger_set_updated_at_tipo_inspecao_hsa
  BEFORE UPDATE ON public.tipo_inspecao_hsa
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_tipo_inspecao_hsa();
