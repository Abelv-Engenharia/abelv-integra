-- Create storage bucket for RNC attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('rnc-attachments', 'rnc-attachments', false);

-- Create table for RNC attachments
CREATE TABLE public.rnc_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rnc_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  attachment_type TEXT NOT NULL CHECK (attachment_type IN ('evidencia_nc', 'evidencia_disposicao')),
  uploaded_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on attachments table
ALTER TABLE public.rnc_attachments ENABLE ROW LEVEL SECURITY;

-- RLS policies for attachments
CREATE POLICY "Users can view all attachments" 
ON public.rnc_attachments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own attachments" 
ON public.rnc_attachments 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own attachments" 
ON public.rnc_attachments 
FOR UPDATE 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own attachments" 
ON public.rnc_attachments 
FOR DELETE 
USING (auth.uid() = uploaded_by);

-- Storage policies for RNC attachments
CREATE POLICY "Users can view RNC attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'rnc-attachments');

CREATE POLICY "Users can upload RNC attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'rnc-attachments');

CREATE POLICY "Users can update RNC attachments" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'rnc-attachments');

CREATE POLICY "Users can delete RNC attachments" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'rnc-attachments');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rnc_attachments_updated_at
BEFORE UPDATE ON public.rnc_attachments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();