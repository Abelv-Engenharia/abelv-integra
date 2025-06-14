
-- Criação do bucket privado (apenas autenticados) "treinamentos-anexos"
insert into storage.buckets (id, name, public)
values ('treinamentos-anexos', 'treinamentos-anexos', false)
on conflict (id) do nothing;

-- Permitir INSERT (upload) apenas para usuários autenticados
create policy "Authenticated users can upload files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'treinamentos-anexos'
);

-- Permitir SELECT (download/leitura) apenas para usuários autenticados
create policy "Authenticated users can select (list) files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'treinamentos-anexos'
);

-- Permitir DELETE apenas para usuários autenticados
create policy "Authenticated users can delete files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'treinamentos-anexos'
);

-- Permitir UPDATE apenas para usuários autenticados
create policy "Authenticated users can update files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'treinamentos-anexos'
);
