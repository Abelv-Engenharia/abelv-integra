-- Criar tabela de comunicados
CREATE TABLE public.comunicados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  arquivo_url TEXT,
  arquivo_nome TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  publico_alvo JSONB NOT NULL DEFAULT '{"tipo": "todos"}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de ciência dos comunicados
CREATE TABLE public.comunicados_ciencia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comunicado_id UUID NOT NULL REFERENCES public.comunicados(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_ciencia TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comunicado_id, usuario_id)
);

-- Criar bucket para anexos de comunicados
INSERT INTO storage.buckets (id, name, public) 
VALUES ('comunicados-anexos', 'comunicados-anexos', false);

-- Habilitar RLS nas tabelas
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicados_ciencia ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para comunicados
CREATE POLICY "Admin podem gerenciar comunicados" 
ON public.comunicados 
FOR ALL 
USING (((get_user_permissions(auth.uid()) ->> 'admin_comunicados'::text))::boolean = true)
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_comunicados'::text))::boolean = true);

CREATE POLICY "Usuários podem visualizar comunicados ativos" 
ON public.comunicados 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND ativo = true 
  AND CURRENT_DATE BETWEEN data_inicio AND data_fim
  AND (
    (publico_alvo->>'tipo' = 'todos') OR
    (publico_alvo->>'tipo' = 'ccas' AND EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(publico_alvo->'ccas') AS cca_id
      WHERE cca_id::integer = ANY(
        SELECT unnest(
          ARRAY(
            SELECT jsonb_array_elements_text(get_user_allowed_ccas(auth.uid()))::integer
          )
        )
      )
    ))
  )
);

-- Políticas RLS para ciência
CREATE POLICY "Usuários podem gerenciar sua própria ciência" 
ON public.comunicados_ciencia 
FOR ALL 
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Admin podem visualizar todas as ciências" 
ON public.comunicados_ciencia 
FOR SELECT 
USING (((get_user_permissions(auth.uid()) ->> 'admin_comunicados'::text))::boolean = true);

-- Políticas de storage para anexos
CREATE POLICY "Admin podem fazer upload de anexos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'comunicados-anexos' 
  AND ((get_user_permissions(auth.uid()) ->> 'admin_comunicados'::text))::boolean = true
);

CREATE POLICY "Admin podem atualizar anexos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'comunicados-anexos' 
  AND ((get_user_permissions(auth.uid()) ->> 'admin_comunicados'::text))::boolean = true
);

CREATE POLICY "Admin podem excluir anexos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'comunicados-anexos' 
  AND ((get_user_permissions(auth.uid()) ->> 'admin_comunicados'::text))::boolean = true
);

CREATE POLICY "Usuários autenticados podem visualizar anexos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'comunicados-anexos' AND auth.uid() IS NOT NULL);

-- Trigger para updated_at
CREATE TRIGGER update_comunicados_updated_at
  BEFORE UPDATE ON public.comunicados
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar permissão admin_comunicados ao perfil Administrador
UPDATE public.perfis 
SET permissoes = permissoes || '{"admin_comunicados": true}'::jsonb
WHERE nome = 'Administrador';