-- 1) Create mapping table for direct supervisors to employees
create table if not exists public.funcionario_supervisores (
  id uuid primary key default gen_random_uuid(),
  funcionario_id uuid not null references public.funcionarios(id) on delete cascade,
  supervisor_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (funcionario_id, supervisor_id)
);

alter table public.funcionario_supervisores enable row level security;

-- Indexes for performance
create index if not exists idx_func_superv_funcionario on public.funcionario_supervisores(funcionario_id);
create index if not exists idx_func_superv_supervisor on public.funcionario_supervisores(supervisor_id);

-- 2) RLS for mapping table: admins can manage; supervisors can read their own mappings
create policy if not exists "Admins can manage funcionario_supervisores"
  on public.funcionario_supervisores for all
  using (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true))
  with check (((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true));

create policy if not exists "Supervisors can view their mappings"
  on public.funcionario_supervisores for select
  using (auth.uid() = supervisor_id);

-- 3) Helper function to check if a user is direct supervisor of an employee
create or replace function public.user_is_supervisor_of(_user_id uuid, _funcionario_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.funcionario_supervisores fs
    where fs.supervisor_id = _user_id and fs.funcionario_id = _funcionario_id
  );
$$;

-- 4) Tighten funcionarios SELECT policy: remove CCA-based read; allow only admins or direct supervisors
-- Drop old permissive SELECT policy
drop policy if exists "Usuários podem ver funcionários de CCAs permitidas" on public.funcionarios;

-- Ensure admin ALL policy exists (already present per schema); add supervisor view policy
create policy "Supervisores podem ver funcionários atribuídos"
  on public.funcionarios for select
  using (
    public.user_is_supervisor_of(auth.uid(), id)
    or ((public.get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true)
  );