-- Update storage policies to allow users with same CCA access to view photos
DROP POLICY IF EXISTS "Users can view their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;

-- Allow users to view photos from inspections in their allowed CCAs
CREATE POLICY "Users can view photos from allowed CCAs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'inspecoes-sms-fotos' 
  AND (
    -- User is the owner of the photo
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- User has access to the CCA of the inspection
    EXISTS (
      SELECT 1 
      FROM inspecoes_sms i
      WHERE i.id::text = (storage.foldername(name))[2]
      AND EXISTS (
        SELECT 1 
        FROM jsonb_array_elements_text(get_user_allowed_ccas(auth.uid())) j(val)
        WHERE j.val = i.cca_id::text
      )
    )
  )
);

-- Allow users to upload photos for inspections in their allowed CCAs
CREATE POLICY "Users can upload photos for allowed CCAs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'inspecoes-sms-fotos'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 
    FROM inspecoes_sms i
    WHERE i.id::text = (storage.foldername(name))[2]
    AND EXISTS (
      SELECT 1 
      FROM jsonb_array_elements_text(get_user_allowed_ccas(auth.uid())) j(val)
      WHERE j.val = i.cca_id::text
    )
  )
);

-- Allow users to update their own photos
CREATE POLICY "Users can update their own photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'inspecoes-sms-fotos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'inspecoes-sms-fotos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);