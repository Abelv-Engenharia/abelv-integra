begin;

-- Drop overly permissive RLS policies
DROP POLICY IF EXISTS "Permitir acesso" ON public.base_legal_opcoes;
DROP POLICY IF EXISTS "Permitir acesso a usuário autenticado" ON public.causas_provaveis;
DROP POLICY IF EXISTS "Permitir acesso a usuário autenticado" ON public.ccas;
DROP POLICY IF EXISTS "Usuários autenticados podem" ON public.controle_opcoes;
DROP POLICY IF EXISTS "Usuários autenticados podem" ON public.deteccao_opcoes;
DROP POLICY IF EXISTS "Permitir acesso a usuário autenticado" ON public.eventos_identificados;
DROP POLICY IF EXISTS "Permitir atualização para autenticados" ON public.execucao_hsa;
DROP POLICY IF EXISTS "Permitir exclusão para autenticados" ON public.execucao_hsa;
DROP POLICY IF EXISTS "Permitir inserção para autenticados" ON public.execucao_hsa;
DROP POLICY IF EXISTS "Permitir leitura para autenticados" ON public.execucao_hsa;
DROP POLICY IF EXISTS "Permitir acesso" ON public.execucao_treinamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem" ON public.exposicao_opcoes;
DROP POLICY IF EXISTS "Permitir acesso" ON public.horas_trabalhadas;
DROP POLICY IF EXISTS "Permitir acesso a usuário logado" ON public.idsms_indicadores;
DROP POLICY IF EXISTS "Usuários autenticados podem" ON public.impacto_opcoes;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar lateralidades" ON public.lateralidade;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir lateralidades" ON public.lateralidade;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir lateralidades" ON public.lateralidade;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar lateralidades" ON public.lateralidade;
DROP POLICY IF EXISTS "Permitir atualização de relacionamentos empresa_ccas" ON public.empresa_ccas;
DROP POLICY IF EXISTS "Permitir exclusão de relacionamentos empresa_ccas" ON public.empresa_ccas;
DROP POLICY IF EXISTS "Permitir inserção de relacionamentos empresa_ccas" ON public.empresa_ccas;
DROP POLICY IF EXISTS "Permitir seleção de relacionamentos empresa_ccas" ON public.empresa_ccas;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar empresa_ccas" ON public.empresa_ccas;
DROP POLICY IF EXISTS "Permitir atualização de relacionamentos engenheiro_ccas" ON public.engenheiro_ccas;
DROP POLICY IF EXISTS "Permitir exclusão de relacionamentos engenheiro_ccas" ON public.engenheiro_ccas;
DROP POLICY IF EXISTS "Permitir inserção de relacionamentos engenheiro_ccas" ON public.engenheiro_ccas;
DROP POLICY IF EXISTS "Permitir seleção de relacionamentos engenheiro_ccas" ON public.engenheiro_ccas;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar engenheiro_ccas" ON public.engenheiro_ccas;

-- Tighten configuracoes_emails policies
DROP POLICY IF EXISTS "Admins podem gerenciar configurações de emails" ON public.configuracoes_emails;

-- Recreate stricter policies

-- base_legal_opcoes
CREATE POLICY "Base legal - ler (autenticados)"
ON public.base_legal_opcoes FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Base legal - gerenciar (admin)"
ON public.base_legal_opcoes FOR ALL
USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- causas_provaveis
CREATE POLICY "Causas prováveis - ler (autenticados)"
ON public.causas_provaveis FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Causas prováveis - gerenciar (admin)"
ON public.causas_provaveis FOR ALL
USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- impacto_opcoes
CREATE POLICY "Impacto opções - ler (autenticados)"
ON public.impacto_opcoes FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Impacto opções - gerenciar (admin)"
ON public.impacto_opcoes FOR ALL
USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- empresa_ccas
CREATE POLICY "empresa_ccas - ler (autenticados)"
ON public.empresa_ccas FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "empresa_ccas - gerenciar (admin_empresas)"
ON public.empresa_ccas FOR ALL
USING (((get_user_permissions(auth.uid()) ->> 'admin_empresas')::boolean = true))
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_empresas')::boolean = true));

-- engenheiro_ccas
CREATE POLICY "engenheiro_ccas - ler (autenticados)"
ON public.engenheiro_ccas FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "engenheiro_ccas - gerenciar (admin_funcionarios)"
ON public.engenheiro_ccas FOR ALL
USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- configuracoes_emails (separate read vs manage)
CREATE POLICY "config emails - ler (autenticados)"
ON public.configuracoes_emails FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "config emails - inserir (admin_usuarios)"
ON public.configuracoes_emails FOR INSERT
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

CREATE POLICY "config emails - atualizar (admin_usuarios)"
ON public.configuracoes_emails FOR UPDATE
USING (((get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true))
WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

CREATE POLICY "config emails - excluir (admin_usuarios)"
ON public.configuracoes_emails FOR DELETE
USING (((get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

-- Add updated_at triggers across key tables
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT unnest(ARRAY[
      'agente_causador',
      'classificacoes_ocorrencia',
      'controle_opcoes',
      'deteccao_opcoes',
      'efeito_falha_opcoes',
      'execucao_hsa',
      'execucao_treinamentos',
      'horas_trabalhadas',
      'idsms_indicadores',
      'inspecoes_sms',
      'lateralidade',
      'lista_treinamentos_normativos',
      'logs_importacao_funcionarios',
      'funcionarios',
      'ccas',
      'desvios_completos',
      'emails_pendentes'
    ]) AS tbl
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at_%I ON public.%I;', rec.tbl, rec.tbl);
    EXECUTE format('CREATE TRIGGER set_updated_at_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();', rec.tbl, rec.tbl);
  END LOOP;
END$$;

-- Trigger to auto-add new CCA to admin profiles
DROP TRIGGER IF EXISTS add_cca_to_admin_profiles_trigger ON public.ccas;
CREATE TRIGGER add_cca_to_admin_profiles_trigger
AFTER INSERT ON public.ccas
FOR EACH ROW
EXECUTE FUNCTION public.add_cca_to_admin_profiles();

-- Triggers for role assignment validation and auditing
DROP TRIGGER IF EXISTS validate_role_assignment_trigger ON public.usuario_perfis;
CREATE TRIGGER validate_role_assignment_trigger
BEFORE INSERT OR UPDATE ON public.usuario_perfis
FOR EACH ROW
EXECUTE FUNCTION public.validate_role_assignment();

DROP TRIGGER IF EXISTS audit_role_change_trigger ON public.usuario_perfis;
CREATE TRIGGER audit_role_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.usuario_perfis
FOR EACH ROW
EXECUTE FUNCTION public.audit_role_change();

-- Triggers for execucao_treinamentos
DROP TRIGGER IF EXISTS calcular_horas_totais_trigger ON public.execucao_treinamentos;
CREATE TRIGGER calcular_horas_totais_trigger
BEFORE INSERT OR UPDATE ON public.execucao_treinamentos
FOR EACH ROW
EXECUTE FUNCTION public.calcular_horas_totais();

DROP TRIGGER IF EXISTS notify_execucao_deleted_trigger ON public.execucao_treinamentos;
CREATE TRIGGER notify_execucao_deleted_trigger
AFTER DELETE ON public.execucao_treinamentos
FOR EACH ROW
EXECUTE FUNCTION public.notify_execucao_deleted();

-- Triggers for desvios_completos calculations
DROP TRIGGER IF EXISTS calculate_probabilidade_trigger ON public.desvios_completos;
CREATE TRIGGER calculate_probabilidade_trigger
BEFORE INSERT OR UPDATE ON public.desvios_completos
FOR EACH ROW
EXECUTE FUNCTION public.calculate_probabilidade();

DROP TRIGGER IF EXISTS calculate_severidade_trigger ON public.desvios_completos;
CREATE TRIGGER calculate_severidade_trigger
BEFORE INSERT OR UPDATE ON public.desvios_completos
FOR EACH ROW
EXECUTE FUNCTION public.calculate_severidade();

DROP TRIGGER IF EXISTS calculate_classificacao_risco_trigger ON public.desvios_completos;
CREATE TRIGGER calculate_classificacao_risco_trigger
BEFORE INSERT OR UPDATE ON public.desvios_completos
FOR EACH ROW
EXECUTE FUNCTION public.calculate_classificacao_risco();

commit;