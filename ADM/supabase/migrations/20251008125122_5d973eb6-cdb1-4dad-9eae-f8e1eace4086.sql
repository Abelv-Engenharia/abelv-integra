-- Criar tabela de vistorias de alojamento
CREATE TABLE public.vistorias_alojamento (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contrato_id uuid NOT NULL REFERENCES public.contratos_alojamento(id) ON DELETE CASCADE,
  data date NOT NULL,
  tipo text NOT NULL,
  responsavel text NOT NULL,
  documento_anexo text,
  registro_fotografico jsonb DEFAULT '{"totalCategorias": 0, "totalFotos": 0, "categorias": []}'::jsonb,
  observacoes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.vistorias_alojamento ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Permitir leitura de vistorias para todos"
  ON public.vistorias_alojamento
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de vistorias para todos"
  ON public.vistorias_alojamento
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de vistorias para todos"
  ON public.vistorias_alojamento
  FOR UPDATE
  USING (true);

CREATE POLICY "Permitir exclusão de vistorias para todos"
  ON public.vistorias_alojamento
  FOR DELETE
  USING (true);

-- Índices para melhor performance
CREATE INDEX idx_vistorias_contrato_id ON public.vistorias_alojamento(contrato_id);
CREATE INDEX idx_vistorias_data ON public.vistorias_alojamento(data);
CREATE INDEX idx_vistorias_tipo ON public.vistorias_alojamento(tipo);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_vistorias_alojamento_updated_at
  BEFORE UPDATE ON public.vistorias_alojamento
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();