-- Adicionar foreign key entre inspecoes_extintores e profiles
-- Isso permite que o Supabase faça o JOIN automático na query
ALTER TABLE public.inspecoes_extintores
ADD CONSTRAINT fk_inspecoes_responsavel
FOREIGN KEY (responsavel_id)
REFERENCES public.profiles(id)
ON DELETE RESTRICT;