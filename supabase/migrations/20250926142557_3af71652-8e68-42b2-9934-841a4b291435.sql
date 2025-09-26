-- Tornar o bucket comunicados-anexos público para permitir acesso às imagens dos comunicados
UPDATE storage.buckets 
SET public = true 
WHERE id = 'comunicados-anexos';