
-- Renomear a coluna 'local' para 'responsavel_inspecao' na tabela desvios_completos
ALTER TABLE public.desvios_completos 
RENAME COLUMN local TO responsavel_inspecao;
