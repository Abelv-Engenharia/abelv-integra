-- Corrigir a foreign key para referenciar a tabela correta
ALTER TABLE inspecoes_sms 
DROP CONSTRAINT IF EXISTS inspecoes_sms_modelo_id_fkey;

ALTER TABLE inspecoes_sms 
ADD CONSTRAINT inspecoes_sms_modelo_id_fkey 
FOREIGN KEY (modelo_id) REFERENCES checklists_avaliacao(id) ON DELETE CASCADE;