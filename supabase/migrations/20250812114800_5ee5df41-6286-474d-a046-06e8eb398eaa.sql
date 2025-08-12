
-- Phase 1: Critical Security Fixes

-- 1. Add proper RLS policies for medidas_disciplinares table
ALTER TABLE public.medidas_disciplinares ENABLE ROW LEVEL SECURITY;

-- Policy for users to view disciplinary measures from their allowed CCAs
CREATE POLICY "Usuários podem visualizar medidas disciplinares de CCAs permitidas"
ON public.medidas_disciplinares
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  (
    -- Admin users can see all
    (get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true OR
    -- Regular users can only see from their allowed CCAs
    (get_user_allowed_ccas(auth.uid()) ? (cca_id)::text)
  )
);

-- Policy for admin users to manage disciplinary measures
CREATE POLICY "Admin funcionários podem gerenciar medidas disciplinares"
ON public.medidas_disciplinares
FOR ALL
USING ((get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true)
WITH CHECK ((get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true);

-- Policy for users to create disciplinary measures for their allowed CCAs
CREATE POLICY "Usuários podem criar medidas disciplinares para CCAs permitidas"
ON public.medidas_disciplinares
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  (
    -- Admin users can create for any CCA
    (get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true OR
    -- Regular users can only create for their allowed CCAs
    (get_user_allowed_ccas(auth.uid()) ? (cca_id)::text)
  )
);

-- 2. Fix overly permissive RLS policies for desvios_completos
DROP POLICY IF EXISTS "Usuários podem visualizar desvios" ON public.desvios_completos;
DROP POLICY IF EXISTS "Usuários podem criar desvios" ON public.desvios_completos;
DROP POLICY IF EXISTS "Usuários podem atualizar desvios" ON public.desvios_completos;
DROP POLICY IF EXISTS "Usuários podem excluir" ON public.desvios_completos;

-- New secure policies for desvios_completos
CREATE POLICY "Usuários podem visualizar desvios de CCAs permitidas"
ON public.desvios_completos
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  (
    -- Admin users can see all
    (get_user_permissions(auth.uid())->>'desvios')::boolean = true OR
    -- Users can see desvios from their allowed CCAs
    (get_user_allowed_ccas(auth.uid()) ? (cca_id)::text)
  )
);

CREATE POLICY "Usuários podem criar desvios para CCAs permitidas"
ON public.desvios_completos
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  (get_user_permissions(auth.uid())->>'desvios')::boolean = true AND
  (
    -- Admin users can create for any CCA
    (get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true OR
    -- Regular users can only create for their allowed CCAs
    (get_user_allowed_ccas(auth.uid()) ? (cca_id)::text)
  )
);

CREATE POLICY "Usuários podem atualizar desvios de CCAs permitidas"
ON public.desvios_completos
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  (get_user_permissions(auth.uid())->>'desvios')::boolean = true AND
  (
    -- Admin users can update any desvio
    (get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true OR
    -- Regular users can only update desvios from their allowed CCAs
    (get_user_allowed_ccas(auth.uid()) ? (cca_id)::text)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  (get_user_permissions(auth.uid())->>'desvios')::boolean = true AND
  (
    -- Admin users can update for any CCA
    (get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true OR
    -- Regular users can only update for their allowed CCAs
    (get_user_allowed_ccas(auth.uid()) ? (cca_id)::text)
  )
);

CREATE POLICY "Admin podem excluir desvios"
ON public.desvios_completos
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND
  (get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true
);

-- 3. Fix encarregado_ccas policies
DROP POLICY IF EXISTS "Permitir acesso a encarregado_ccas" ON public.encarregado_ccas;

CREATE POLICY "Usuários autenticados podem visualizar encarregado_ccas"
ON public.encarregado_ccas
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin podem gerenciar encarregado_ccas"
ON public.encarregado_ccas
FOR ALL
USING ((get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true)
WITH CHECK ((get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true);

-- 4. Fix lista_treinamentos_normativos policies
DROP POLICY IF EXISTS "Permitir acesso a usuário autenticado" ON public.lista_treinamentos_normativos;

CREATE POLICY "Usuários com permissão de treinamentos podem visualizar"
ON public.lista_treinamentos_normativos
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  (get_user_permissions(auth.uid())->>'treinamentos')::boolean = true
);

CREATE POLICY "Admin podem gerenciar lista treinamentos normativos"
ON public.lista_treinamentos_normativos
FOR ALL
USING ((get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true)
WITH CHECK ((get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true);

-- 5. Fix metas_indicadores policies
DROP POLICY IF EXISTS "Permitir acesso total a metas_indicadores" ON public.metas_indicadores;

CREATE POLICY "Usuários autenticados podem visualizar metas"
ON public.metas_indicadores
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin podem gerenciar metas indicadores"
ON public.metas_indicadores
FOR ALL
USING ((get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true)
WITH CHECK ((get_user_permissions(auth.uid())->>'admin_funcionarios')::boolean = true);

-- 6. Fix database function security - Add proper search path to all functions
CREATE OR REPLACE FUNCTION public.populate_missing_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert profiles for any auth users that don't have a profile yet
  INSERT INTO public.profiles (id, nome, email)
  SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'nome', au.raw_user_meta_data->>'name', ''),
    au.email
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.id = au.id
  WHERE p.id IS NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_probabilidade()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
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
SET search_path TO 'public'
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
SET search_path TO 'public'
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
SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.criar_notificacao_tarefa()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.update_classificacao_ocorrencia_codigo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Se classificacao_ocorrencia foi definida, buscar o código correspondente
  IF NEW.classificacao_ocorrencia IS NOT NULL AND NEW.classificacao_ocorrencia != '' THEN
    SELECT codigo INTO NEW.classificacao_ocorrencia_codigo
    FROM public.classificacoes_ocorrencia
    WHERE nome = NEW.classificacao_ocorrencia AND ativo = true
    LIMIT 1;
  ELSE
    NEW.classificacao_ocorrencia_codigo := NULL;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calcular_horas_totais()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.horas_totais := NEW.carga_horaria * (NEW.efetivo_mod + NEW.efetivo_moi);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_execucao_deleted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at_execucao_hsa()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
