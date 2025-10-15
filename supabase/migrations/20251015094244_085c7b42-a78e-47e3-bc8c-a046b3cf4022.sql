
-- Etapa 1: Corrigir funções sem search_path definido (CRÍTICO - Segurança)
-- Adicionar search_path = public em todas as funções que não têm este parâmetro

ALTER FUNCTION public.update_repositorio_updated_at() SET search_path = public;
ALTER FUNCTION public.calculate_prazo_envio_s2220() SET search_path = public;
ALTER FUNCTION public.set_created_by() SET search_path = public;
ALTER FUNCTION public.set_updated_by() SET search_path = public;
ALTER FUNCTION public.calculate_probabilidade() SET search_path = public;
ALTER FUNCTION public.set_created_by_on_tarefas_anexos() SET search_path = public;
ALTER FUNCTION public.calculate_severidade() SET search_path = public;
ALTER FUNCTION public.calcular_horas_totais() SET search_path = public;
ALTER FUNCTION public.calculate_classificacao_risco() SET search_path = public;
ALTER FUNCTION public.check_aposentadoria_especial() SET search_path = public;
