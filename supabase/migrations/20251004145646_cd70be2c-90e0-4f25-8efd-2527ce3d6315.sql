-- Adicionar colunas TEXT para entrada manual de supervisor, encarregado e colaborador
-- quando empresa não for ABELV

ALTER TABLE public.desvios_completos
ADD COLUMN IF NOT EXISTS supervisor_responsavel_nome TEXT,
ADD COLUMN IF NOT EXISTS encarregado_responsavel_nome TEXT;

-- Comentários para documentação
COMMENT ON COLUMN public.desvios_completos.supervisor_responsavel_nome IS 'Nome do supervisor quando entrada manual (empresas não-ABELV)';
COMMENT ON COLUMN public.desvios_completos.encarregado_responsavel_nome IS 'Nome do encarregado quando entrada manual (empresas não-ABELV)';

-- As colunas UUID existentes continuam sendo usadas para ABELV:
-- supervisor_responsavel_id (UUID) - usado quando empresa = ABELV
-- encarregado_responsavel_id (UUID) - usado quando empresa = ABELV

-- Para funcionarios_envolvidos, o campo 'funcionario_id' pode ser NULL
-- e o campo 'tipo' pode ser usado para armazenar o nome quando entrada manual