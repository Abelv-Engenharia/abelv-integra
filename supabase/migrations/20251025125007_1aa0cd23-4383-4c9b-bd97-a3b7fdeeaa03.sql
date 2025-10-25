-- Adicionar coluna para vincular prestador ao usuário do sistema
ALTER TABLE public.prestadores_pj 
ADD COLUMN IF NOT EXISTS usuario_sistema_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_prestadores_pj_usuario_sistema 
ON public.prestadores_pj(usuario_sistema_id);

-- Comentário explicativo
COMMENT ON COLUMN public.prestadores_pj.usuario_sistema_id 
IS 'ID do usuário do sistema vinculado a este prestador PJ (permite login e acesso ao sistema)';