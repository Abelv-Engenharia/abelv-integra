
-- Ajusta SET search_path = public para funções PL/pgSQL conforme orientação de melhores práticas

CREATE OR REPLACE FUNCTION public.calculate_probabilidade()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.exposicao IS NOT NULL AND NEW.controle IS NOT NULL AND NEW.deteccao IS NOT NULL THEN
    NEW.probabilidade := NEW.exposicao + NEW.controle + NEW.deteccao;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_severidade()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.efeito_falha IS NOT NULL AND NEW.impacto IS NOT NULL THEN
    NEW.severidade := NEW.efeito_falha + NEW.impacto;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_classificacao_risco()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  total INTEGER;
BEGIN
  IF NEW.probabilidade IS NOT NULL AND NEW.severidade IS NOT NULL THEN
    total := NEW.probabilidade * NEW.severidade;
    IF total <= 10 THEN
      NEW.classificacao_risco := 'TRIVIAL';
    ELSIF total <= 21 THEN
      NEW.classificacao_risco := 'TOLERÁVEL';
    ELSIF total <= 40 THEN
      NEW.classificacao_risco := 'MODERADO';
    ELSIF total <= 56 THEN
      NEW.classificacao_risco := 'SUBSTANCIAL';
    ELSE
      NEW.classificacao_risco := 'INTOLERÁVEL';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.criar_notificacao_tarefa()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- Inserir notificação para o responsável da tarefa
  INSERT INTO public.notificacoes (
    usuario_id,
    titulo,
    mensagem,
    tipo,
    tarefa_id
  ) VALUES (
    NEW.responsavel_id,
    'Nova tarefa atribuída',
    'Você tem uma nova tarefa: ' || NEW.descricao,
    'tarefa',
    NEW.id
  );

  RETURN NEW;
END;
$function$;
