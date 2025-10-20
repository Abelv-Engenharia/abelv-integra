-- Criar tabela de CCAs do Nydhus
CREATE TABLE IF NOT EXISTS public.nydhus_ccas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo text NOT NULL UNIQUE,
  nome text NOT NULL,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Dados iniciais de CCAs
INSERT INTO public.nydhus_ccas (codigo, nome) VALUES
  ('023101', 'Nexa PDSR'),
  ('023102', 'Nexa Aripuanã'),
  ('023103', 'Nexa Vazante'),
  ('024201', 'Vale Carajás'),
  ('024202', 'Vale Itabira'),
  ('025301', 'Anglo American Minas-Rio');

-- RLS para CCAs
ALTER TABLE public.nydhus_ccas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de CCAs para todos"
  ON public.nydhus_ccas FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de CCAs para todos"
  ON public.nydhus_ccas FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de CCAs para todos"
  ON public.nydhus_ccas FOR UPDATE
  USING (true);

-- Criar tabela de Funções do Nydhus
CREATE TABLE IF NOT EXISTS public.nydhus_funcoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL UNIQUE,
  cbo text NOT NULL,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Dados iniciais de Funções
INSERT INTO public.nydhus_funcoes (nome, cbo) VALUES
  ('Ajudante Geral', '7170-15'),
  ('Almoxarife', '4141-05'),
  ('Armador', '7151-15'),
  ('Auxiliar Administrativo', '4110-05'),
  ('Bombeiro Civil', '5171-05'),
  ('Carpinteiro', '7153-05'),
  ('Eletricista', '7156-10'),
  ('Encanador', '7241-10'),
  ('Engenheiro Civil', '2142-05'),
  ('Engenheiro de Segurança', '2149-15'),
  ('Mecânico', '9144-05'),
  ('Motorista', '7823-05'),
  ('Operador de Equipamentos', '7151-05'),
  ('Pedreiro', '7152-10'),
  ('Pintor', '7166-10'),
  ('Servente', '7170-20'),
  ('Soldador', '7241-05'),
  ('Técnico de Segurança', '3516-05'),
  ('Técnico em Segurança do Trabalho', '3516-05'),
  ('Topógrafo', '3113-05');

-- RLS para Funções
ALTER TABLE public.nydhus_funcoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de funções para todos"
  ON public.nydhus_funcoes FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de funções para todos"
  ON public.nydhus_funcoes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de funções para todos"
  ON public.nydhus_funcoes FOR UPDATE
  USING (true);