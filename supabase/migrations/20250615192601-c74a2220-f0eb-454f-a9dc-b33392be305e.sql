
-- Criação da tabela das opções de medidas disciplinares
CREATE TABLE public.tipo_medida_disciplinar (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE, -- Opção da medida
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Inserção das opções solicitadas
INSERT INTO public.tipo_medida_disciplinar (nome) VALUES
  ('ADVERTÊNCIA VERBAL'),
  ('ADVERTÊNCIA FORMAL'),
  ('SUSPENSÃO'),
  ('DEMISSÃO POR JUSTA CAUSA');
