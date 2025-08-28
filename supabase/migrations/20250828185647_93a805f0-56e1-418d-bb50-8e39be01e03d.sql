-- Verificar a estrutura da tabela inspecoes_sms
\d inspecoes_sms;

-- Verificar se existe a tabela modelos_inspecao_sms
\d modelos_inspecao_sms;

-- Corrigir a foreign key para referenciar a tabela correta
ALTER TABLE inspecoes_sms 
DROP CONSTRAINT IF EXISTS inspecoes_sms_modelo_id_fkey;

ALTER TABLE inspecoes_sms 
ADD CONSTRAINT inspecoes_sms_modelo_id_fkey 
FOREIGN KEY (modelo_id) REFERENCES checklists_avaliacao(id);