-- Add column for custom discipline/sector when "Outros" is selected
ALTER TABLE rnc_attachments ADD COLUMN IF NOT EXISTS disciplina_outros TEXT;