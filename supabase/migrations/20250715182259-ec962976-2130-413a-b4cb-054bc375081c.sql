-- Adicionar campo cca_id na tabela configuracoes_emails
ALTER TABLE public.configuracoes_emails 
ADD COLUMN cca_id integer REFERENCES public.ccas(id);