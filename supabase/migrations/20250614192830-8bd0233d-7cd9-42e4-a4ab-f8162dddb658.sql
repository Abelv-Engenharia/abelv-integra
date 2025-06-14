
-- Remover a constraint de chave estrangeira existente de treinamentos_normativos.treinamento_id para treinamentos(id)
ALTER TABLE public.treinamentos_normativos
  DROP CONSTRAINT IF EXISTS treinamentos_normativos_treinamento_id_fkey;

-- Adicionar a nova constraint de chave estrangeira apontando para lista_treinamentos_normativos(id)
ALTER TABLE public.treinamentos_normativos
  ADD CONSTRAINT treinamentos_normativos_treinamento_id_fkey
    FOREIGN KEY (treinamento_id)
    REFERENCES public.lista_treinamentos_normativos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT;
