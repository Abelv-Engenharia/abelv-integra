-- Criar tabela unidades_medidas
CREATE TABLE public.unidades_medidas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo integer NOT NULL,
  simbolo varchar(8) NOT NULL,
  descricao varchar(100) NOT NULL,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.unidades_medidas ENABLE ROW LEVEL SECURITY;

-- Política de leitura para usuários autenticados
CREATE POLICY "Unidades medidas - ler (autenticados)"
ON public.unidades_medidas
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_unidades_medidas_updated_at
BEFORE UPDATE ON public.unidades_medidas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índice único no código
CREATE UNIQUE INDEX unidades_medidas_codigo_unique ON public.unidades_medidas(codigo);