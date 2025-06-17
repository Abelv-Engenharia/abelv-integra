
-- Adicionar campo ccas_permitidas na tabela perfis para armazenar os CCAs que cada perfil pode acessar
ALTER TABLE public.perfis 
ADD COLUMN ccas_permitidas jsonb DEFAULT '[]'::jsonb;

-- Atualizar perfis existentes com todos os CCAs disponíveis por padrão
UPDATE public.perfis 
SET ccas_permitidas = (
  SELECT jsonb_agg(id) 
  FROM public.ccas 
  WHERE ativo = true
);
