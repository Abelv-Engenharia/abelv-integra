-- Criar tabela de tokens para checklist público
CREATE TABLE public.veiculos_checklists_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  placa VARCHAR(8) NOT NULL,
  marca_modelo TEXT NOT NULL,
  condutor_nome TEXT NOT NULL,
  tipo_operacao TEXT NOT NULL CHECK (tipo_operacao IN ('Retirada', 'Devolução')),
  validade TIMESTAMP WITH TIME ZONE NOT NULL,
  usado BOOLEAN DEFAULT false,
  checklist_id UUID REFERENCES public.veiculos_checklists(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_checklist_tokens_token ON public.veiculos_checklists_tokens(token);
CREATE INDEX idx_checklist_tokens_validade ON public.veiculos_checklists_tokens(validade);

-- RLS: Permitir acesso público apenas para validação do token
ALTER TABLE public.veiculos_checklists_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tokens públicos podem ser lidos se válidos"
ON public.veiculos_checklists_tokens FOR SELECT
TO anon, authenticated
USING (validade > now() AND usado = false);

CREATE POLICY "Usuários autenticados podem criar tokens"
ON public.veiculos_checklists_tokens FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Sistema pode atualizar tokens"
ON public.veiculos_checklists_tokens FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Atualizar RLS da tabela veiculos_checklists para permitir inserção pública com token
CREATE POLICY "veiculos_checklists_insert_public"
ON public.veiculos_checklists FOR INSERT
TO anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.veiculos_checklists_tokens
    WHERE token = current_setting('request.headers', true)::json->>'x-checklist-token'
    AND validade > now()
    AND usado = false
  )
);

-- Atualizar RLS do bucket veiculos-checklists-fotos para upload público
CREATE POLICY "Público pode fazer upload com token válido"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'veiculos-checklists-fotos'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.veiculos_checklists_tokens
    WHERE validade > now() AND usado = false
  )
);

CREATE POLICY "Público pode visualizar fotos com token válido"
ON storage.objects FOR SELECT
TO anon
USING (
  bucket_id = 'veiculos-checklists-fotos'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.veiculos_checklists_tokens
    WHERE validade > now()
  )
);