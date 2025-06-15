
-- 1. Adiciona a coluna cca_id (aceitando nulos de início)
ALTER TABLE public.execucao_hsa
  ADD COLUMN IF NOT EXISTS cca_id integer;

-- 2. Preenche cca_id a partir do codigo armazenado atualmente em cca (supõe-se que o campo anterior era um código igual ao de ccas.codigo)
UPDATE public.execucao_hsa
SET cca_id = c.id
FROM public.ccas c
WHERE execucao_hsa.cca = c.codigo;

-- 3. Garante que todos os registros agora têm cca_id preenchido.
--    Se houver registros sem correspondência, eles ficarão com cca_id NULL e precisam ser corrigidos manualmente.

-- 4. Torna cca_id obrigatório
ALTER TABLE public.execucao_hsa
  ALTER COLUMN cca_id SET NOT NULL;

-- 5. Remove a coluna antiga de texto
ALTER TABLE public.execucao_hsa
  DROP COLUMN IF EXISTS cca;

-- 6. Adiciona a foreign key para ccas.id
ALTER TABLE public.execucao_hsa
  ADD CONSTRAINT execucao_hsa_cca_id_fkey FOREIGN KEY (cca_id) REFERENCES public.ccas(id);

