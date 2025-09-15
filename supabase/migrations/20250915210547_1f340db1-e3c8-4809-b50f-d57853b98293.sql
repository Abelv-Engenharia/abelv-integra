-- Corrigir vulnerabilidade de Security Definer View
-- Remover SECURITY DEFINER desnecessário de funções que retornam TABLE

-- Essas funções são apenas consultas de agregação e não precisam de privilégios elevados
-- O SECURITY DEFINER estava contornando as políticas RLS desnecessariamente

-- 1. Recriar get_hht_by_month sem SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_hht_by_month()
 RETURNS TABLE(mes integer, ano integer, total_horas numeric)
 LANGUAGE sql
 STABLE
AS $function$
  SELECT 
    mes, 
    ano, 
    SUM(horas_trabalhadas) AS total_horas
  FROM 
    public.horas_trabalhadas
  GROUP BY 
    mes, ano
  ORDER BY 
    ano DESC, mes DESC;
$function$;

-- 2. Recriar get_hht_by_cca sem SECURITY DEFINER  
CREATE OR REPLACE FUNCTION public.get_hht_by_cca()
 RETURNS TABLE(cca_id integer, codigo text, nome text, total_horas numeric)
 LANGUAGE sql
 STABLE
AS $function$
  SELECT 
    c.id AS cca_id,
    c.codigo,
    c.nome, 
    SUM(h.horas_trabalhadas) AS total_horas
  FROM 
    public.horas_trabalhadas h
    JOIN public.ccas c ON h.cca_id = c.id
  GROUP BY 
    c.id, c.codigo, c.nome
  ORDER BY 
    total_horas DESC;
$function$;

-- 3. Registrar correção de segurança no log de auditoria
INSERT INTO public.audit_logs (
  user_id,
  action,
  table_name,
  details,
  timestamp
) VALUES (
  auth.uid(),
  'security_definer_view_fixed',
  'functions_security',
  jsonb_build_object(
    'description', 'Removido SECURITY DEFINER desnecessário de funções que retornam TABLE',
    'functions_fixed', jsonb_build_array('get_hht_by_month', 'get_hht_by_cca'),
    'security_risk', 'Funções contornavam RLS policies desnecessariamente'
  ),
  now()
);