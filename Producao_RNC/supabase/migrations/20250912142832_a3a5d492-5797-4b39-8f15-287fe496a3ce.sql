-- Add description and evidence_number fields to rnc_attachments table
ALTER TABLE public.rnc_attachments 
ADD COLUMN description TEXT,
ADD COLUMN evidence_number INTEGER;