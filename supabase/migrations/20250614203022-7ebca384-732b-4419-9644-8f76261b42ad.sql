
-- Cria o bucket privado para certificados de treinamentos normativos
insert into storage.buckets (id, name, public)
values ('certificados-treinamentos-normativos', 'certificados-treinamentos-normativos', false)
on conflict (id) do nothing;

-- Permitir INSERT (upload) apenas para usuários autenticados
create policy "Authenticated users can upload certificados"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'certificados-treinamentos-normativos'
);

-- Permitir SELECT (download/leitura) apenas para usuários autenticados
create policy "Authenticated users can select (list) certificados"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'certificados-treinamentos-normativos'
);

-- Permitir DELETE apenas para usuários autenticados
create policy "Authenticated users can delete certificados"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'certificados-treinamentos-normativos'
);

-- Permitir UPDATE apenas para usuários autenticados
create policy "Authenticated users can update certificados"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'certificados-treinamentos-normativos'
);
