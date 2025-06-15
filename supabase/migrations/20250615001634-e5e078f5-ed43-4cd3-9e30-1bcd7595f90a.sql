
-- Criação do bucket 'ocorrencias' (privado por padrão)
insert into storage.buckets (id, name, public)
values ('ocorrencias', 'ocorrencias', false)
on conflict (id) do nothing;

-- Permitir INSERT (upload) apenas para usuários autenticados
create policy "Authenticated users can upload CAT files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'ocorrencias'
);

-- Permitir SELECT (download/leitura) apenas para usuários autenticados
create policy "Authenticated users can select CAT files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'ocorrencias'
);

-- Permitir DELETE apenas para usuários autenticados
create policy "Authenticated users can delete CAT files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'ocorrencias'
);

-- Permitir UPDATE apenas para usuários autenticados
create policy "Authenticated users can update CAT files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'ocorrencias'
);
