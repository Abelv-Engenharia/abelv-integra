-- ========================================
-- FASE 1: DESBLOQUEAR TABELAS URGENTES
-- ========================================

-- 1.1 MEDIDAS_DISCIPLINARES
CREATE POLICY "Medidas disciplinares - visualizar (autenticados)"
ON public.medidas_disciplinares
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Medidas disciplinares - criar (admin)"
ON public.medidas_disciplinares
FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Medidas disciplinares - atualizar (admin)"
ON public.medidas_disciplinares
FOR UPDATE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Medidas disciplinares - deletar (admin)"
ON public.medidas_disciplinares
FOR DELETE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()));

-- 1.2 COMUNICADOS
CREATE POLICY "Comunicados - visualizar (autenticados)"
ON public.comunicados
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL AND ativo = true);

CREATE POLICY "Comunicados - criar (admin)"
ON public.comunicados
FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Comunicados - atualizar (admin)"
ON public.comunicados
FOR UPDATE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Comunicados - deletar (admin)"
ON public.comunicados
FOR DELETE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()));

-- 1.3 LISTA_TREINAMENTOS_NORMATIVOS
CREATE POLICY "Lista treinamentos normativos - visualizar (autenticados)"
ON public.lista_treinamentos_normativos
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Lista treinamentos normativos - criar (admin)"
ON public.lista_treinamentos_normativos
FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Lista treinamentos normativos - atualizar (admin)"
ON public.lista_treinamentos_normativos
FOR UPDATE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Lista treinamentos normativos - deletar (admin)"
ON public.lista_treinamentos_normativos
FOR DELETE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()));

-- 1.4 TIPOS_DOCUMENTOS
CREATE POLICY "Tipos documentos - visualizar (autenticados)"
ON public.tipos_documentos
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Tipos documentos - criar (admin)"
ON public.tipos_documentos
FOR INSERT
TO authenticated
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Tipos documentos - atualizar (admin)"
ON public.tipos_documentos
FOR UPDATE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

CREATE POLICY "Tipos documentos - deletar (admin)"
ON public.tipos_documentos
FOR DELETE
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()));

-- ========================================
-- FASE 2: LIMPAR POLÍTICAS PROBLEMÁTICAS
-- ========================================

-- 2.1 DESVIOS_COMPLETOS - Remover política genérica
DROP POLICY IF EXISTS "replace_with_policy_name" ON public.desvios_completos;

CREATE POLICY "Desvios - visualizar (autenticados)"
ON public.desvios_completos
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- 2.2 DISCIPLINAS - Remover política redundante
DROP POLICY IF EXISTS "Permitir acesso a usuário autenticado" ON public.disciplinas;

CREATE POLICY "Disciplinas - gerenciar (admin)"
ON public.disciplinas
FOR ALL
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- 2.3 EFEITO_FALHA_OPCOES - Remover política redundante
DROP POLICY IF EXISTS "Usuários autenticados podem" ON public.efeito_falha_opcoes;

CREATE POLICY "Efeito falha opções - gerenciar (admin)"
ON public.efeito_falha_opcoes
FOR ALL
TO authenticated
USING (user_can_manage_funcionarios(auth.uid()))
WITH CHECK (user_can_manage_funcionarios(auth.uid()));

-- 2.4 CREDORES - Consolidar 4 políticas em 1
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar credores" ON public.credores;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir credores" ON public.credores;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar credores" ON public.credores;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar credores" ON public.credores;

CREATE POLICY "Credores - gerenciar (autenticados)"
ON public.credores
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- ========================================
-- FASE 3: CORRIGIR AVISOS DE SEGURANÇA
-- ========================================

-- Adicionar SET search_path = public a todas as funções

CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_prazo_envio_s2220()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.prazo_envio := (date_trunc('month', NEW.data_exame) + interval '1 month + 14 days')::date;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.criar_notificacoes_para_responsaveis()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.responsavel_id IS NOT NULL THEN
    INSERT INTO public.notificacoes (
      usuario_id,
      titulo,
      mensagem,
      tipo,
      tarefa_id
    )
    VALUES (
      NEW.responsavel_id,
      'Nova tarefa atribuída',
      'Você tem uma nova tarefa: ' || COALESCE(NEW.titulo, 'Sem título'),
      'tarefa',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.populate_missing_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
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

CREATE OR REPLACE FUNCTION public.check_aposentadoria_especial()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  SELECT aposentadoria_especial INTO NEW.possivel_aposentadoria_especial
  FROM public.tabela24_agentes_nocivos
  WHERE id = NEW.agente_nocivo_tabela24;
  
  IF NEW.possivel_aposentadoria_especial THEN
    NEW.observacao_aposentadoria := 'Exposição a agente nocivo que pode ensejar aposentadoria especial';
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_classificacao_ocorrencia_codigo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
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

CREATE OR REPLACE FUNCTION public.add_cca_to_admin_profiles()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  UPDATE perfis 
  SET ccas_permitidas = ccas_permitidas || jsonb_build_array(NEW.id)
  WHERE nome = 'Administrador' 
  AND NOT (ccas_permitidas ? NEW.id::text);
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_situacao_desvios()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.status IN ('TRATADO', 'CONCLUÍDO') THEN
    NEW.situacao := 'CONCLUÍDO';
  ELSIF NEW.status = 'EM TRATATIVA' THEN
    IF NEW.prazo_conclusao IS NOT NULL AND NEW.prazo_conclusao > CURRENT_DATE THEN
      NEW.situacao := 'EM ANDAMENTO';
    ELSE
      NEW.situacao := 'PENDENTE';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

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

CREATE OR REPLACE FUNCTION public.audit_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    details,
    timestamp
  ) VALUES (
    auth.uid(),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'role_assigned'
      WHEN TG_OP = 'UPDATE' THEN 'role_updated'
      WHEN TG_OP = 'DELETE' THEN 'role_removed'
    END,
    'usuario_perfis',
    COALESCE(NEW.usuario_id::text, OLD.usuario_id::text),
    jsonb_build_object(
      'old_perfil_id', OLD.perfil_id,
      'new_perfil_id', NEW.perfil_id,
      'target_user_id', COALESCE(NEW.usuario_id, OLD.usuario_id)
    ),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_execucao_deleted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  url text;
BEGIN
  url := OLD.lista_presenca_url;
  IF url IS NOT NULL THEN
    PERFORM pg_notify('execucao_lista_deleted', url);
  END IF;
  RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_snapshot_funcionario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF (OLD.ativo = true AND NEW.ativo = false) OR (OLD.cca_id IS DISTINCT FROM NEW.cca_id) THEN
    PERFORM create_funcionario_snapshot(NEW.id);
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_snapshot_engenheiro()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF (OLD.ativo = true AND NEW.ativo = false) THEN
    PERFORM create_engenheiro_snapshot(NEW.id);
  END IF;
  RETURN NEW;
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

CREATE OR REPLACE FUNCTION public.set_updated_at_execucao_hsa()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_snapshot_supervisor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF (OLD.ativo = true AND NEW.ativo = false) THEN
    PERFORM create_supervisor_snapshot(NEW.id);
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_snapshot_encarregado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF (OLD.ativo = true AND NEW.ativo = false) THEN
    PERFORM create_encarregado_snapshot(NEW.id);
  END IF;
  RETURN NEW;
END;
$function$;

-- ========================================
-- FASE 4: TABELAS SIENGE
-- ========================================

CREATE POLICY "Empresas Sienge - visualizar (autenticados)"
ON public.empresas_sienge
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);