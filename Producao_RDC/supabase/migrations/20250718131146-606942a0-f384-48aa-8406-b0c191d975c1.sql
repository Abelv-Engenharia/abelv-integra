-- Criar tabela Base_tubulacao para armazenar dados de fluido, linha e juntas
CREATE TABLE public.Base_tubulacao (
  id serial PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  Linha character varying,
  Fluido character varying,
  Juntas character varying
);

-- Habilitar RLS
ALTER TABLE public.Base_tubulacao ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso total (como nas outras tabelas)
CREATE POLICY "Permissão de Usuário" 
ON public.Base_tubulacao 
FOR ALL 
USING (true);

-- Inserir alguns dados de exemplo
INSERT INTO public.Base_tubulacao (Fluido, Linha, Juntas) VALUES 
('Água', 'Linha 001', 'Junta A1'),
('Vapor', 'Linha 002', 'Junta A2'),
('Óleo', 'Linha 003', 'Junta B1'),
('Gás Natural', 'Linha 004', 'Junta B2'),
('Ar Comprimido', 'Linha 005', 'Junta C1');