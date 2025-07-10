
-- Migrar dados existentes dos funcionários para a nova tabela funcionario_ccas
-- Primeiro, vamos verificar se existem funcionários com cca_id definido
INSERT INTO public.funcionario_ccas (funcionario_id, cca_id)
SELECT id, cca_id 
FROM public.funcionarios 
WHERE cca_id IS NOT NULL;

-- Agora podemos remover a coluna cca_id da tabela funcionarios se ela ainda existir
-- (esta operação pode falhar se a coluna já foi removida, mas não causará problemas)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'funcionarios' 
        AND column_name = 'cca_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.funcionarios DROP COLUMN cca_id;
    END IF;
END $$;
