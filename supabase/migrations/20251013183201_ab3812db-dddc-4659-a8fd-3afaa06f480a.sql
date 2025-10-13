-- Criar ENUM para Disciplina
CREATE TYPE disciplina_engenharia_matricial AS ENUM ('ELETRICA', 'MECANICA', 'AMBAS');

-- Criar tabela usuarios_engenharia_matricial
CREATE TABLE public.usuarios_engenharia_matricial (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  disciplina_preferida disciplina_engenharia_matricial NOT NULL DEFAULT 'AMBAS',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.usuarios_engenharia_matricial ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: usuários autenticados podem visualizar
CREATE POLICY "Usuários podem visualizar config Eng Matricial"
ON public.usuarios_engenharia_matricial
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema') 
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR 'config_modulo_engenharia_matricial_usuarios' = ANY(get_user_permissions(auth.uid()))
  OR auth.uid() = usuario_id
);

-- Política para INSERT: apenas admins ou usuários com permissão
CREATE POLICY "Admin pode criar config Eng Matricial"
ON public.usuarios_engenharia_matricial
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR 'config_modulo_engenharia_matricial_usuarios' = ANY(get_user_permissions(auth.uid()))
);

-- Política para UPDATE: apenas admins ou usuários com permissão
CREATE POLICY "Admin pode atualizar config Eng Matricial"
ON public.usuarios_engenharia_matricial
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR 'config_modulo_engenharia_matricial_usuarios' = ANY(get_user_permissions(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR 'config_modulo_engenharia_matricial_usuarios' = ANY(get_user_permissions(auth.uid()))
);

-- Política para DELETE: apenas admins ou usuários com permissão
CREATE POLICY "Admin pode deletar config Eng Matricial"
ON public.usuarios_engenharia_matricial
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin_sistema')
  OR '*' = ANY(get_user_permissions(auth.uid()))
  OR 'config_modulo_engenharia_matricial_usuarios' = ANY(get_user_permissions(auth.uid()))
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_usuarios_engenharia_matricial_updated_at
BEFORE UPDATE ON public.usuarios_engenharia_matricial
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para setar created_by
CREATE TRIGGER set_created_by_usuarios_engenharia_matricial
BEFORE INSERT ON public.usuarios_engenharia_matricial
FOR EACH ROW
EXECUTE FUNCTION public.set_created_by();

-- Trigger para setar updated_by
CREATE OR REPLACE FUNCTION public.set_updated_by()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_by_usuarios_engenharia_matricial
BEFORE UPDATE ON public.usuarios_engenharia_matricial
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_by();

-- Índices para performance
CREATE INDEX idx_usuarios_engenharia_matricial_usuario_id ON public.usuarios_engenharia_matricial(usuario_id);
CREATE INDEX idx_usuarios_engenharia_matricial_ativo ON public.usuarios_engenharia_matricial(ativo);
CREATE INDEX idx_usuarios_engenharia_matricial_usuario_ativo ON public.usuarios_engenharia_matricial(usuario_id, ativo);