
-- Cria o bucket "avatars" como público
insert into storage.buckets
  (id, name, public)
values
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Permite INSERT (upload) apenas para usuários autenticados
create policy "Authenticated users can upload avatars"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars');

-- Permite SELECT (download) para todos (como é bucket público)
create policy "Anyone can select avatars"
on storage.objects
for select
using (bucket_id = 'avatars');

-- Permite UPDATE apenas para usuários autenticados
create policy "Authenticated users can update avatars"
on storage.objects
for update
to authenticated
using (bucket_id = 'avatars');

-- Permite DELETE apenas para usuários autenticados
create policy "Authenticated users can delete avatars"
on storage.objects
for delete
to authenticated
using (bucket_id = 'avatars');
