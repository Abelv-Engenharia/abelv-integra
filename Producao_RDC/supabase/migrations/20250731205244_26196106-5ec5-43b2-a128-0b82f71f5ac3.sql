-- Adicionar campo DN (Diâmetro Nominal) na tabela juntas
ALTER TABLE public.juntas 
ADD COLUMN dn numeric;