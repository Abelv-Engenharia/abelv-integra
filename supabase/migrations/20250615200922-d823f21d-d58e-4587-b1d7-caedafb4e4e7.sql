
-- 1. Tabela principal do PGR, vinculada a uma avaliação de risco (por enquanto, simplificando: pode ser vinculada à avaliação por UUID opcionalmente)
create table public.pgr_planos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  criado_em timestamp with time zone default now(),
  atualizado_em timestamp with time zone default now()
);

-- 2. Medidas de controle vinculadas ao plano (PGR) e risco
create table public.pgr_medidas (
  id uuid primary key default gen_random_uuid(),
  plano_id uuid references public.pgr_planos(id) on delete cascade,
  risco_id uuid, -- para futuro vínculo explícito, se risco ficar em tabela separada
  tipo text not null check (tipo in ('eliminação', 'substituição', 'engenharia', 'administrativa', 'epi')),
  descricao text not null,
  responsavel_id uuid references public.profiles(id),
  prazo date,
  status text not null default 'pendente' check (status in ('pendente', 'em andamento', 'concluída', 'não eficaz')),
  eficacia text, -- avaliação de eficácia (comentário livre)
  criado_em timestamp with time zone default now(),
  atualizado_em timestamp with time zone default now()
);

-- Ajustar conforme futuros vínculos a riscos específicos se preciso (coluna risco_id UUID é opcional por enquanto).

-- Tornar as tabelas editáveis só por usuários autenticados da organização:
alter table public.pgr_planos enable row level security;
alter table public.pgr_medidas enable row level security;

-- Policies: apenas donos (no futuro pode ser aberto para perfis autorizados)
create policy "Permitir acesso autenticado aos PGR" on public.pgr_planos
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "Permitir acesso autenticado às medidas PGR" on public.pgr_medidas
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

