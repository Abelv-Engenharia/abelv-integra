-- Adicionar novas colunas à tabela profiles para permissões diretas
ALTER TABLE public.profiles 
ADD COLUMN tipo_usuario text DEFAULT 'usuario' CHECK (tipo_usuario IN ('administrador', 'usuario')),
ADD COLUMN permissoes_customizadas jsonb DEFAULT '{}',
ADD COLUMN ccas_permitidas jsonb DEFAULT '[]',
ADD COLUMN menus_sidebar jsonb DEFAULT '[]';

-- Migrar dados existentes dos perfis para as novas colunas
UPDATE public.profiles 
SET 
  tipo_usuario = CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.usuario_perfis up 
      JOIN public.perfis p ON up.perfil_id = p.id 
      WHERE up.usuario_id = profiles.id 
      AND (p.nome ILIKE '%admin%' OR (p.permissoes->>'admin_funcionarios')::boolean = true)
    ) THEN 'administrador'
    ELSE 'usuario'
  END,
  permissoes_customizadas = COALESCE((
    SELECT p.permissoes 
    FROM public.usuario_perfis up 
    JOIN public.perfis p ON up.perfil_id = p.id 
    WHERE up.usuario_id = profiles.id 
    LIMIT 1
  ), '{}'),
  ccas_permitidas = COALESCE((
    SELECT p.ccas_permitidas 
    FROM public.usuario_perfis up 
    JOIN public.perfis p ON up.perfil_id = p.id 
    WHERE up.usuario_id = profiles.id 
    LIMIT 1
  ), '[]'),
  menus_sidebar = COALESCE((
    SELECT p.permissoes->'menus_sidebar' 
    FROM public.usuario_perfis up 
    JOIN public.perfis p ON up.perfil_id = p.id 
    WHERE up.usuario_id = profiles.id 
    LIMIT 1
  ), '[]');

-- Criar índices para melhor performance
CREATE INDEX idx_profiles_tipo_usuario ON public.profiles(tipo_usuario);
CREATE INDEX idx_profiles_permissoes_customizadas ON public.profiles USING GIN(permissoes_customizadas);
CREATE INDEX idx_profiles_ccas_permitidas ON public.profiles USING GIN(ccas_permitidas);