-- Create public storage bucket for cauções unified PDFs and allow access
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'caucoes') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('caucoes', 'caucoes', true);
  END IF;
END $$;

-- Policies for storage.objects limited to bucket 'caucoes'
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Permitir leitura de arquivos de caucoes'
  ) THEN
    CREATE POLICY "Permitir leitura de arquivos de caucoes"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'caucoes');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Permitir insercao de arquivos de caucoes'
  ) THEN
    CREATE POLICY "Permitir insercao de arquivos de caucoes"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'caucoes');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Permitir atualizacao de arquivos de caucoes'
  ) THEN
    CREATE POLICY "Permitir atualizacao de arquivos de caucoes"
    ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'caucoes');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Permitir exclusao de arquivos de caucoes'
  ) THEN
    CREATE POLICY "Permitir exclusao de arquivos de caucoes"
    ON storage.objects
    FOR DELETE
    USING (bucket_id = 'caucoes');
  END IF;
END $$;