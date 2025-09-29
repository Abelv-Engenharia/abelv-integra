-- Adicionar coluna cca_id à tabela extintores
ALTER TABLE public.extintores 
ADD COLUMN IF NOT EXISTS cca_id INTEGER REFERENCES public.ccas(id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_extintores_cca_id ON public.extintores(cca_id);
CREATE INDEX IF NOT EXISTS idx_extintores_codigo ON public.extintores(codigo);

-- Atualizar política RLS para visualização pública de extintores ativos
DROP POLICY IF EXISTS "Usuários podem visualizar extintores" ON public.extintores;
CREATE POLICY "Público pode visualizar extintores ativos"
ON public.extintores 
FOR SELECT 
USING (ativo = true);

-- Política para admin gerenciar extintores
CREATE POLICY "Admin podem gerenciar extintores"
ON public.extintores
FOR ALL
USING (
  (get_user_permissions(auth.uid()) ->> 'admin_funcionarios')::boolean = true
);

-- Política para usuários inserirem extintores
CREATE POLICY "Usuários podem inserir extintores"
ON public.extintores
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Política para usuários atualizarem extintores
CREATE POLICY "Usuários podem atualizar extintores"
ON public.extintores
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Atualizar política RLS para visualização pública de inspeções
DROP POLICY IF EXISTS "Usuários podem visualizar inspeções de extintores" ON public.inspecoes_extintores;
CREATE POLICY "Público pode visualizar inspeções"
ON public.inspecoes_extintores 
FOR SELECT 
USING (true);