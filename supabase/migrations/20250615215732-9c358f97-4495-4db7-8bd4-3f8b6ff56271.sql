
-- Ajusta SET search_path = public para funções PL/pgSQL conforme orientação de boas práticas

CREATE OR REPLACE FUNCTION public.calcular_horas_totais()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.horas_totais := NEW.carga_horaria * (NEW.efetivo_mod + NEW.efetivo_moi);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_execucao_deleted()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
SECURITY DEFINER
AS $function$
DECLARE
  url text;
BEGIN
  -- Pega a url do arquivo que deve ser excluído (se houver)
  url := OLD.lista_presenca_url;
  -- Só notifica se houver url de lista
  IF url IS NOT NULL THEN
    -- Emite evento que será consumido pelo Edge Function via replication (listen/notify)
    PERFORM
      pg_notify('execucao_lista_deleted', url);
  END IF;
  RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at_tipo_inspecao_hsa()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Funções SQL "get_hht_by_month" e "get_hht_by_cca" também recebem o search_path explicitamente
CREATE OR REPLACE FUNCTION public.get_hht_by_month()
RETURNS TABLE(mes integer, ano integer, total_horas numeric)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.get_hht_by_cca()
RETURNS TABLE(cca_id integer, codigo text, nome text, total_horas numeric)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
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
