-- Adicionar campo número ABELV na tabela documents
ALTER TABLE public.documents 
ADD COLUMN numero_abelv text;

-- Criar índice para performance
CREATE INDEX idx_documents_numero_abelv ON public.documents(numero_abelv);