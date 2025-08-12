-- 1) STORAGE: Make sensitive buckets private and add strict policies
update storage.buckets set public = false where id in ('medidas_disciplinares','email-attachments');

-- Clean old policies (if any) for medidas_disciplinares
drop policy if exists "md_select_admin_funcionarios" on storage.objects;
drop policy if exists "md_insert_admin_funcionarios" on storage.objects;
drop policy if exists "md_update_admin_funcionarios" on storage.objects;
drop policy if exists "md_delete_admin_funcionarios" on storage.objects;

-- Policies for medidas_disciplinares bucket (admin_funcionarios only)
create policy "md_select_admin_funcionarios"
  on storage.objects for select
  using (
    bucket_id = 'medidas_disciplinares'
    and ((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)
  );

create policy "md_insert_admin_funcionarios"
  on storage.objects for insert
  with check (
    bucket_id = 'medidas_disciplinares'
    and ((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)
  );

create policy "md_update_admin_funcionarios"
  on storage.objects for update
  using (
    bucket_id = 'medidas_disciplinares'
    and ((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)
  )
  with check (
    bucket_id = 'medidas_disciplinares'
    and ((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)
  );

create policy "md_delete_admin_funcionarios"
  on storage.objects for delete
  using (
    bucket_id = 'medidas_disciplinares'
    and ((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)
  );

-- Clean old policies (if any) for email-attachments
drop policy if exists "email_attachments_select_admin_usuarios" on storage.objects;
drop policy if exists "email_attachments_insert_admin_usuarios" on storage.objects;
drop policy if exists "email_attachments_update_admin_usuarios" on storage.objects;
drop policy if exists "email_attachments_delete_admin_usuarios" on storage.objects;

-- Policies for email-attachments bucket (admin_usuarios only)
create policy "email_attachments_select_admin_usuarios"
  on storage.objects for select
  using (
    bucket_id = 'email-attachments'
    and ((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true)
  );

create policy "email_attachments_insert_admin_usuarios"
  on storage.objects for insert
  with check (
    bucket_id = 'email-attachments'
    and ((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true)
  );

create policy "email_attachments_update_admin_usuarios"
  on storage.objects for update
  using (
    bucket_id = 'email-attachments'
    and ((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true)
  )
  with check (
    bucket_id = 'email-attachments'
    and ((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true)
  );

create policy "email_attachments_delete_admin_usuarios"
  on storage.objects for delete
  using (
    bucket_id = 'email-attachments'
    and ((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true)
  );

-- 2) EMAILS: Restrict email logs visibility to admins only
-- Drop permissive SELECT policy and recreate for admins
drop policy if exists "Usuários autenticados podem visualizar emails pendentes" on public.emails_pendentes;
create policy "Apenas admins podem visualizar emails pendentes"
  on public.emails_pendentes for select
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_usuarios')::boolean = true));

-- 3) ROLE ASSIGNMENTS: Add validation and audit triggers on usuario_perfis
-- Remove existing triggers if present, then (re)create with safe names
-- Note: assumes table public.usuario_perfis exists
drop trigger if exists trg_validate_role_assignment on public.usuario_perfis;
drop trigger if exists trg_audit_role_change on public.usuario_perfis;

create trigger trg_validate_role_assignment
  before insert or update on public.usuario_perfis
  for each row execute function public.validate_role_assignment();

create trigger trg_audit_role_change
  after insert or update or delete on public.usuario_perfis
  for each row execute function public.audit_role_change();

-- 4) Secure SECURITY DEFINER function search_path
create or replace function public.processar_configuracoes_emails()
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
DECLARE
  config_record RECORD;
  current_weekday INTEGER;
  current_day INTEGER;
  current_hour INTEGER;
  should_send BOOLEAN;
  destinatario TEXT;
  anexos_json JSONB;
  relatorio_html TEXT;
  corpo_final TEXT;
BEGIN
  current_weekday := EXTRACT(DOW FROM now());
  current_day := EXTRACT(DAY FROM now());
  current_hour := EXTRACT(HOUR FROM now());
  
  FOR config_record IN 
    SELECT * FROM public.configuracoes_emails 
    WHERE ativo = true 
    AND EXTRACT(HOUR FROM hora_envio) = current_hour
  LOOP
    should_send := false;
    CASE config_record.periodicidade
      WHEN 'diario' THEN
        should_send := true;
      WHEN 'semanal' THEN
        should_send := (
          (config_record.dia_semana = 'domingo' AND current_weekday = 0) OR
          (config_record.dia_semana = 'segunda' AND current_weekday = 1) OR
          (config_record.dia_semana = 'terca' AND current_weekday = 2) OR
          (config_record.dia_semana = 'quarta' AND current_weekday = 3) OR
          (config_record.dia_semana = 'quinta' AND current_weekday = 4) OR
          (config_record.dia_semana = 'sexta' AND current_weekday = 5) OR
          (config_record.dia_semana = 'sabado' AND current_weekday = 6)
        );
      WHEN 'quinzenal' THEN
        should_send := (current_day = 1 OR current_day = 15);
      WHEN 'mensal' THEN
        should_send := (current_day = 1);
    END CASE;
    
    IF should_send THEN
      corpo_final := config_record.mensagem;
      IF config_record.tipo_relatorio IS NOT NULL THEN
        corpo_final := corpo_final || '<br><br><h3>Relatório Automático</h3>';
        corpo_final := corpo_final || '<p>Relatório de ' || config_record.tipo_relatorio || ' dos últimos ' || COALESCE(config_record.periodo_dias, 30) || ' dias';
        IF config_record.cca_id IS NOT NULL THEN
          corpo_final := corpo_final || ' para o CCA selecionado';
        END IF;
        corpo_final := corpo_final || ' será anexado automaticamente.</p>';
      END IF;
      
      IF config_record.anexo_url IS NOT NULL THEN
        anexos_json := jsonb_build_array(
          jsonb_build_object(
            'nome_arquivo', split_part(config_record.anexo_url, '/', array_length(string_to_array(config_record.anexo_url, '/'), 1)),
            'url', config_record.anexo_url
          )
        );
      ELSE
        anexos_json := '[]'::jsonb;
      END IF;
      
      FOREACH destinatario IN ARRAY config_record.destinatarios
      LOOP
        INSERT INTO public.emails_pendentes (
          destinatario,
          assunto,
          corpo,
          anexos,
          enviado,
          tentativas,
          criado_em,
          updated_at
        ) VALUES (
          destinatario,
          config_record.assunto,
          corpo_final,
          anexos_json,
          false,
          0,
          now(),
          now()
        );
      END LOOP;
    END IF;
  END LOOP;
END;
$function$;