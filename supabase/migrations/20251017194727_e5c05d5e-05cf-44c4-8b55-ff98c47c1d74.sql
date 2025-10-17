-- Criar tabela almoxarifados
CREATE TABLE IF NOT EXISTS public.almoxarifados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cca_id integer NOT NULL REFERENCES public.ccas(id),
  nome text NOT NULL,
  endereco text,
  interno_cliente boolean NOT NULL DEFAULT false,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_almoxarifados_cca_id ON public.almoxarifados(cca_id);
CREATE INDEX IF NOT EXISTS idx_almoxarifados_ativo ON public.almoxarifados(ativo);

-- Habilitar RLS
ALTER TABLE public.almoxarifados ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Almoxarifados - visualizar (autenticados)"
  ON public.almoxarifados
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Almoxarifados - criar (autenticados)"
  ON public.almoxarifados
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Almoxarifados - atualizar (autenticados)"
  ON public.almoxarifados
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Almoxarifados - deletar (autenticados)"
  ON public.almoxarifados
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Trigger para updated_at
CREATE TRIGGER update_almoxarifados_updated_at
  BEFORE UPDATE ON public.almoxarifados
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();