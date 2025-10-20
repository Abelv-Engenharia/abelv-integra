-- Create storage bucket for hospedagem attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('hospedagem-anexos', 'hospedagem-anexos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for hospedagem-anexos bucket
CREATE POLICY "Allow public read access to hospedagem anexos"
ON storage.objects FOR SELECT
USING (bucket_id = 'hospedagem-anexos');

CREATE POLICY "Allow authenticated users to upload hospedagem anexos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hospedagem-anexos');

CREATE POLICY "Allow authenticated users to update their hospedagem anexos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'hospedagem-anexos');

CREATE POLICY "Allow authenticated users to delete hospedagem anexos"
ON storage.objects FOR DELETE
USING (bucket_id = 'hospedagem-anexos');