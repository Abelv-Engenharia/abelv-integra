-- Criar tabela para metas anuais
CREATE TABLE public.metas_anuais (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ano integer NOT NULL UNIQUE,
  meta_anual numeric NOT NULL CHECK (meta_anual > 0),
  meta_t1 numeric NOT NULL CHECK (meta_t1 > 0),
  meta_t2 numeric NOT NULL CHECK (meta_t2 > 0),
  meta_t3 numeric NOT NULL CHECK (meta_t3 > 0),
  meta_t4 numeric NOT NULL CHECK (meta_t4 > 0),
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- Criar índice no ano para otimizar consultas
CREATE INDEX idx_metas_anuais_ano ON public.metas_anuais(ano);

-- Habilitar RLS
ALTER TABLE public.metas_anuais ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Metas anuais - visualizar (autenticados)"
ON public.metas_anuais
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Metas anuais - criar (autenticados)"
ON public.metas_anuais
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Metas anuais - atualizar (autenticados)"
ON public.metas_anuais
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Metas anuais - deletar (autenticados)"
ON public.metas_anuais
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_metas_anuais_updated_at
BEFORE UPDATE ON public.metas_anuais
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para definir created_by
CREATE TRIGGER set_metas_anuais_created_by
BEFORE INSERT ON public.metas_anuais
FOR EACH ROW
EXECUTE FUNCTION public.set_created_by();

-- Trigger para definir updated_by
CREATE TRIGGER set_metas_anuais_updated_by
BEFORE UPDATE ON public.metas_anuais
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_by();