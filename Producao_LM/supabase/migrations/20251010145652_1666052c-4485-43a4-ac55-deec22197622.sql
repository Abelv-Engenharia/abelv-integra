-- Create storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'document-uploads',
  'document-uploads',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.dwg',
    'application/acad',
    'image/vnd.dwg',
    'application/x-dwg'
  ]
);

-- RLS policies for document-uploads bucket
CREATE POLICY "Users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'document-uploads');

CREATE POLICY "Users can view their files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'document-uploads');

CREATE POLICY "Users can update their files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'document-uploads');

CREATE POLICY "Users can delete their files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'document-uploads');

-- Add pending_upload column to documents table
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS pending_upload boolean DEFAULT false;