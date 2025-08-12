-- SECURITY HARDENING MIGRATION
-- 1) Ensure RLS is enabled where needed and tighten permissive policies

-- Helper: enable RLS on targeted tables
alter table if exists public.agente_causador enable row level security;
alter table if exists public.classificacoes_ocorrencia enable row level security;
alter table if exists public.controle_opcoes enable row level security;
alter table if exists public.deteccao_opcoes enable row level security;
alter table if exists public.efeito_falha_opcoes enable row level security;
alter table if exists public.exposicao_opcoes enable row level security;
alter table if exists public.eventos_identificados enable row level security;
alter table if exists public.disciplinas enable row level security;
alter table if exists public.lateralidade enable row level security;
alter table if exists public.natureza_lesao enable row level security;
alter table if exists public.execucao_hsa enable row level security;
alter table if exists public.execucao_treinamentos enable row level security;
alter table if exists public.horas_trabalhadas enable row level security;
alter table if exists public.idsms_indicadores enable row level security;
alter table if exists public.ccas enable row level security;

-- Drop overly-permissive policies and recreate safer ones
-- agente_causador
drop policy if exists "Usuários autenticados podem atualizar agentes causadores " on public.agente_causador;
drop policy if exists "Usuários autenticados podem excluir agentes causadores " on public.agente_causador;
drop policy if exists "Usuários autenticados podem inserir agentes causadores " on public.agente_causador;
drop policy if exists "Usuários autenticados podem visualizar agentes causadores " on public.agente_causador;

create policy "Agentes causadores - ler (autenticados)"
  on public.agente_causador for select
  using (auth.uid() is not null);
create policy "Agentes causadores - inserir (admin)"
  on public.agente_causador for insert
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));
create policy "Agentes causadores - atualizar (admin)"
  on public.agente_causador for update
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));
create policy "Agentes causadores - excluir (admin)"
  on public.agente_causador for delete
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- classificacoes_ocorrencia
drop policy if exists "Usuários autenticados podem atualizar classificações de ocor" on public.classificacoes_ocorrencia;
drop policy if exists "Usuários autenticados podem excluir classificações de ocorr" on public.classificacoes_ocorrencia;
drop policy if exists "Usuários autenticados podem inserir classificações de ocorr" on public.classificacoes_ocorrencia;
drop policy if exists "Usuários autenticados podem visualizar classificações de oco" on public.classificacoes_ocorrencia;

create policy "Classificacao ocorr - ler (autenticados)"
  on public.classificacoes_ocorrencia for select
  using (auth.uid() is not null);
create policy "Classificacao ocorr - inserir (admin)"
  on public.classificacoes_ocorrencia for insert
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));
create policy "Classificacao ocorr - atualizar (admin)"
  on public.classificacoes_ocorrencia for update
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));
create policy "Classificacao ocorr - excluir (admin)"
  on public.classificacoes_ocorrencia for delete
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- controle_opcoes
drop policy if exists "Usuários autenticados podem " on public.controle_opcoes;
create policy "Controle opções - ler (autenticados)"
  on public.controle_opcoes for select using (auth.uid() is not null);
create policy "Controle opções - gerenciar (admin)"
  on public.controle_opcoes for all
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- deteccao_opcoes
drop policy if exists "Usuários autenticados podem " on public.deteccao_opcoes;
create policy "Detecção opções - ler (autenticados)"
  on public.deteccao_opcoes for select using (auth.uid() is not null);
create policy "Detecção opções - gerenciar (admin)"
  on public.deteccao_opcoes for all
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- efeito_falha_opcoes
drop policy if exists "Usuários autenticados podem " on public.efeito_falha_opcoes;
create policy "Efeito falha opções - ler (autenticados)"
  on public.efeito_falha_opcoes for select using (auth.uid() is not null);
create policy "Efeito falha opções - gerenciar (admin)"
  on public.efeito_falha_opcoes for all
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- exposicao_opcoes
drop policy if exists "Usuários autenticados podem " on public.exposicao_opcoes;
create policy "Exposição opções - ler (autenticados)"
  on public.exposicao_opcoes for select using (auth.uid() is not null);
create policy "Exposição opções - gerenciar (admin)"
  on public.exposicao_opcoes for all
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- eventos_identificados
drop policy if exists "Permitir acesso a usuário autenticado " on public.eventos_identificados;
create policy "Eventos identificados - ler (autenticados)"
  on public.eventos_identificados for select using (auth.uid() is not null);
create policy "Eventos identificados - gerenciar (admin)"
  on public.eventos_identificados for all
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- disciplinas
drop policy if exists "Permitir acesso a usuário autenticado " on public.disciplinas;
create policy "Disciplinas - ler (autenticados)"
  on public.disciplinas for select using (auth.uid() is not null);
create policy "Disciplinas - gerenciar (admin)"
  on public.disciplinas for all
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- lateralidade
drop policy if exists "Usuários autenticados podem atualizar lateralidades " on public.lateralidade;
drop policy if exists "Usuários autenticados podem excluir lateralidades " on public.lateralidade;
drop policy if exists "Usuários autenticados podem inserir lateralidades " on public.lateralidade;
drop policy if exists "Usuários autenticados podem visualizar lateralidades " on public.lateralidade;
create policy "Lateralidade - ler (autenticados)" on public.lateralidade for select using (auth.uid() is not null);
create policy "Lateralidade - inserir (admin)" on public.lateralidade for insert with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));
create policy "Lateralidade - atualizar (admin)" on public.lateralidade for update using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)) with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));
create policy "Lateralidade - excluir (admin)" on public.lateralidade for delete using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- natureza_lesao
drop policy if exists "Usuários autenticados podem atualizar naturezas de lesão " on public.natureza_lesao;
drop policy if exists "Usuários autenticados podem excluir naturezas de lesão " on public.natureza_lesao;
drop policy if exists "Usuários autenticados podem inserir naturezas de lesão " on public.natureza_lesao;
drop policy if exists "Usuários autenticados podem visualizar naturezas de lesão " on public.natureza_lesao;
create policy "Natureza lesão - ler (autenticados)" on public.natureza_lesao for select using (auth.uid() is not null);
create policy "Natureza lesão - inserir (admin)" on public.natureza_lesao for insert with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));
create policy "Natureza lesão - atualizar (admin)" on public.natureza_lesao for update using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)) with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));
create policy "Natureza lesão - excluir (admin)" on public.natureza_lesao for delete using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- execucao_hsa
-- Drop previous permissive policies
drop policy if exists "Permitir atualização para autenticados " on public.execucao_hsa;
drop policy if exists "Permitir exclusão para autenticados " on public.execucao_hsa;
drop policy if exists "Permitir inserção para autenticados " on public.execucao_hsa;
drop policy if exists "Permitir leitura para autenticados " on public.execucao_hsa;
-- Recreate
create policy "HSA - ler (autenticados)" on public.execucao_hsa for select using (auth.uid() is not null);
create policy "HSA - inserir (autenticados)" on public.execucao_hsa for insert with check (auth.uid() is not null);
create policy "HSA - atualizar (autenticados)" on public.execucao_hsa for update using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "HSA - excluir (autenticados)" on public.execucao_hsa for delete using (auth.uid() is not null);

-- execucao_treinamentos
-- Drop previous permissive policies
drop policy if exists "Permitir acesso " on public.execucao_treinamentos;
-- Recreate granular policies
create policy "Exec Trein - ler (autenticados)" on public.execucao_treinamentos for select using (auth.uid() is not null);
create policy "Exec Trein - inserir (perm treinamentos)" on public.execucao_treinamentos for insert with check (((public.get_user_permissions(auth.uid()) ->> 'treinamentos')::boolean = true));
create policy "Exec Trein - atualizar (perm treinamentos)" on public.execucao_treinamentos for update using (((public.get_user_permissions(auth.uid()) ->> 'treinamentos')::boolean = true)) with check (((public.get_user_permissions(auth.uid()) ->> 'treinamentos')::boolean = true));
create policy "Exec Trein - excluir (perm treinamentos)" on public.execucao_treinamentos for delete using (((public.get_user_permissions(auth.uid()) ->> 'treinamentos')::boolean = true));

-- horas_trabalhadas
drop policy if exists "Permitir acesso " on public.horas_trabalhadas;
create policy "Horas - ler (autenticados)" on public.horas_trabalhadas for select using (auth.uid() is not null);
create policy "Horas - inserir (próprio ou admin)" on public.horas_trabalhadas for insert
  with check ((auth.uid() is not null) and ((usuario_id = auth.uid()) or ((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)));
create policy "Horas - atualizar (próprio ou admin)" on public.horas_trabalhadas for update
  using ((auth.uid() is not null) and ((usuario_id = auth.uid()) or ((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)))
  with check ((auth.uid() is not null) and ((usuario_id = auth.uid()) or ((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)));
create policy "Horas - excluir (admin)" on public.horas_trabalhadas for delete
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- idsms_indicadores
drop policy if exists "Permitir acesso a usuário logado " on public.idsms_indicadores;
create policy "IDSMS - ler (autenticados)" on public.idsms_indicadores for select using (auth.uid() is not null);
create policy "IDSMS - gerenciar (admin)" on public.idsms_indicadores for all
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

-- ccas
drop policy if exists "Permitir acesso a usuário autenticado " on public.ccas;
create policy "CCAs - ler (autenticados)" on public.ccas for select using (auth.uid() is not null);
create policy "CCAs - gerenciar (admin_empresas)" on public.ccas for all
  using ((((public.get_user_permissions(auth.uid()) ->> 'admin_empresas')::boolean = true)))
  with check ((((public.get_user_permissions(auth.uid()) ->> 'admin_empresas')::boolean = true)));

-- 2) Add or attach triggers for auditing and timestamps

-- usuario_perfis triggers: validate and audit
-- Ensure table exists and RLS enabled (do not modify RLS here)
-- Drop triggers if exist to avoid duplicates
DROP TRIGGER IF EXISTS trg_validate_role_assignment ON public.usuario_perfis;
DROP TRIGGER IF EXISTS trg_audit_role_change ON public.usuario_perfis;

CREATE TRIGGER trg_validate_role_assignment
BEFORE INSERT OR UPDATE ON public.usuario_perfis
FOR EACH ROW EXECUTE FUNCTION public.validate_role_assignment();

CREATE TRIGGER trg_audit_role_change
AFTER INSERT OR UPDATE OR DELETE ON public.usuario_perfis
FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

-- Updated_at triggers on key tables
DROP TRIGGER IF EXISTS trg_updated_at_funcionarios ON public.funcionarios;
CREATE TRIGGER trg_updated_at_funcionarios
BEFORE UPDATE ON public.funcionarios
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_updated_at_execucao_treinamentos ON public.execucao_treinamentos;
CREATE TRIGGER trg_updated_at_execucao_treinamentos
BEFORE UPDATE ON public.execucao_treinamentos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_updated_at_emails_pendentes ON public.emails_pendentes;
CREATE TRIGGER trg_updated_at_emails_pendentes
BEFORE UPDATE ON public.emails_pendentes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_updated_at_notificacoes ON public.notificacoes;
CREATE TRIGGER trg_updated_at_notificacoes
BEFORE UPDATE ON public.notificacoes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Attach delete notify trigger for execucao_treinamentos (cleanup lists)
DROP TRIGGER IF EXISTS trg_notify_execucao_deleted ON public.execucao_treinamentos;
CREATE TRIGGER trg_notify_execucao_deleted
AFTER DELETE ON public.execucao_treinamentos
FOR EACH ROW EXECUTE FUNCTION public.notify_execucao_deleted();

-- 3) Auto-create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create a basic profile upon signup if it doesn't exist
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', ''),
          NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4) Storage security policies
-- Allow public read for avatars and tutoriais
DROP POLICY IF EXISTS "Public read for avatars and tutoriais" ON storage.objects;
CREATE POLICY "Public read for avatars and tutoriais"
ON storage.objects FOR SELECT
USING (bucket_id in ('avatars','tutoriais'));

-- Users can manage their own avatar in a folder named with their user id
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can manage 'tutoriais'
DROP POLICY IF EXISTS "Admins can manage tutoriais" ON storage.objects;
CREATE POLICY "Admins can manage tutoriais"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'tutoriais' AND ((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true)
)
WITH CHECK (
  bucket_id = 'tutoriais' AND ((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true)
);
