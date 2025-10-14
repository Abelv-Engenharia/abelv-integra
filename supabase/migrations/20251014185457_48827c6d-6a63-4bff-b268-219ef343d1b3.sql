-- Criar tabela para vendedores comerciais
CREATE TABLE public.vendedores_comercial (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(usuario_id)
);

-- Habilitar RLS
ALTER TABLE public.vendedores_comercial ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Vendedores - visualizar (autenticados)"
ON public.vendedores_comercial
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Vendedores - criar (autenticados)"
ON public.vendedores_comercial
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Vendedores - atualizar (autenticados)"
ON public.vendedores_comercial
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Vendedores - deletar (autenticados)"
ON public.vendedores_comercial
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_vendedores_comercial_updated_at
BEFORE UPDATE ON public.vendedores_comercial
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();