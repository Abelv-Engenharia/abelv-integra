
-- Cria o bucket privado
insert into storage.buckets (id, name, public)
values ('funcionarios-fotos', 'funcionarios-fotos', false)
on conflict (id) do nothing;

-- Permitir INSERT (upload) apenas para usuários autenticados
create policy "Authenticated users can upload fotos funcionarios"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'funcionarios-fotos');

-- Permitir SELECT (download/leitura) apenas para usuários autenticados
create policy "Authenticated users can select fotos funcionarios"
on storage.objects
for select
to authenticated
using (bucket_id = 'funcionarios-fotos');

-- Permitir DELETE apenas para usuários autenticados
create policy "Authenticated users can delete fotos funcionarios"
on storage.objects
for delete
to authenticated
using (bucket_id = 'funcionarios-fotos');

-- Permitir UPDATE apenas para usuários autenticados
create policy "Authenticated users can update fotos funcionarios"
on storage.objects
for update
to authenticated
using (bucket_id = 'funcionarios-fotos');
