-- Criar tabela para armazenar páginas favoritas dos usuários
CREATE TABLE public.paginas_favoritas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id uuid NOT NULL,
  nome_pagina text NOT NULL,
  url_pagina text NOT NULL,
  icone text DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, url_pagina)
);

-- Habilitar RLS
ALTER TABLE public.paginas_favoritas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem gerenciar seus próprios favoritos"
ON public.paginas_favoritas
FOR ALL
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_paginas_favoritas_updated_at
BEFORE UPDATE ON public.paginas_favoritas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();