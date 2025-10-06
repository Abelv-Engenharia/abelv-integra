-- Remover políticas antigas que verificam permissão 'treinamentos' (causando conflito)
DROP POLICY IF EXISTS "Exec Trein - inserir (perm treinamentos)" ON public.execucao_treinamentos;
DROP POLICY IF EXISTS "Exec Trein - atualizar (perm treinamentos)" ON public.execucao_treinamentos;
DROP POLICY IF EXISTS "Exec Trein - excluir (perm treinamentos)" ON public.execucao_treinamentos;

-- As políticas corretas que verificam 'treinamentos_execucao' já existem e permanecerão ativas