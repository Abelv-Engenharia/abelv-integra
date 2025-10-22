-- Criar tabela de disciplinas elétricas
CREATE TABLE public.disciplinas_eletricas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.disciplinas_eletricas ENABLE ROW LEVEL SECURITY;

-- Criar policy para acesso público
CREATE POLICY "Allow all access to disciplinas_eletricas"
ON public.disciplinas_eletricas
FOR ALL
USING (true)
WITH CHECK (true);

-- Inserir disciplinas padrão
INSERT INTO public.disciplinas_eletricas (nome, descricao) VALUES
  ('Automação', 'Sistemas de automação e controle'),
  ('Força', 'Instalações de força e motores'),
  ('Iluminação e Tomadas', 'Sistemas de iluminação e tomadas'),
  ('SPDA', 'Sistema de Proteção contra Descargas Atmosféricas'),
  ('Telecomunicações', 'Sistemas de telecomunicações'),
  ('Instrumentação', 'Instrumentação e controle'),
  ('Aterramento', 'Sistemas de aterramento');