-- Primeiro, vamos limpar registros órfãos na tabela inspecoes_sms
DELETE FROM inspecoes_sms 
WHERE modelo_id NOT IN (SELECT id FROM checklists_avaliacao);

-- Agora podemos corrigir a foreign key
ALTER TABLE inspecoes_sms 
DROP CONSTRAINT IF EXISTS inspecoes_sms_modelo_id_fkey;

ALTER TABLE inspecoes_sms 
ADD CONSTRAINT inspecoes_sms_modelo_id_fkey 
FOREIGN KEY (modelo_id) REFERENCES checklists_avaliacao(id) ON DELETE CASCADE;