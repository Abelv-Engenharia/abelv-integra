
-- Adiciona restrição UNIQUE em usuario_id na tabela usuario_perfis
ALTER TABLE public.usuario_perfis
ADD CONSTRAINT usuario_perfis_usuario_id_unique UNIQUE (usuario_id);
