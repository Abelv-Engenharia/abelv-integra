-- Drop unused tables that have no references in the codebase

-- Drop tables that are not being used in the application
DROP TABLE IF EXISTS public.equipamentos_projeto CASCADE;
DROP TABLE IF EXISTS public.detalhes_equipe CASCADE;
DROP TABLE IF EXISTS public.registro_diario CASCADE;
DROP TABLE IF EXISTS public.funcoes_equipe CASCADE;
DROP TABLE IF EXISTS public.localizacoes CASCADE;
DROP TABLE IF EXISTS public.tarefas_realizadas CASCADE;
DROP TABLE IF EXISTS public."Base_tubulacao" CASCADE;
DROP TABLE IF EXISTS public.condicoes_climaticas CASCADE;