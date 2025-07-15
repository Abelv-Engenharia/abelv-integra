-- Criar tabela para emails pendentes
CREATE TABLE public.emails_pendentes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destinatario TEXT NOT NULL,
  assunto TEXT NOT NULL,
  corpo TEXT NOT NULL,
  anexos JSONB DEFAULT '[]'::jsonb,
  enviado BOOLEAN NOT NULL DEFAULT false,
  tentativas INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.emails_pendentes ENABLE ROW LEVEL SECURITY;

-- Criar políticas para acesso aos emails pendentes
CREATE POLICY "Usuários autenticados podem visualizar emails pendentes" 
ON public.emails_pendentes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem inserir emails pendentes" 
ON public.emails_pendentes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar emails pendentes" 
ON public.emails_pendentes 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_emails_pendentes_updated_at
  BEFORE UPDATE ON public.emails_pendentes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para performance
CREATE INDEX idx_emails_pendentes_enviado ON public.emails_pendentes(enviado);
CREATE INDEX idx_emails_pendentes_tentativas ON public.emails_pendentes(tentativas);
CREATE INDEX idx_emails_pendentes_criado_em ON public.emails_pendentes(criado_em);