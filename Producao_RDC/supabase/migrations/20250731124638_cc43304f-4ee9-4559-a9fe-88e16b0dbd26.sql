-- Criar tabela para cadastro de atividades
CREATE TABLE public.atividades_cadastradas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ativar RLS
ALTER TABLE public.atividades_cadastradas ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso completo
CREATE POLICY "Allow all access to atividades_cadastradas" 
ON public.atividades_cadastradas 
FOR ALL 
USING (true);

-- Criar trigger para updated_at
CREATE TRIGGER update_atividades_cadastradas_updated_at
BEFORE UPDATE ON public.atividades_cadastradas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir algumas atividades padrão
INSERT INTO public.atividades_cadastradas (nome, descricao) VALUES
('Soldagem', 'Processo de união de materiais metálicos'),
('Montagem', 'Montagem de estruturas e componentes'),
('Inspeção', 'Verificação e controle de qualidade'),
('Preparação', 'Preparação de materiais e superfícies'),
('Acabamento', 'Finalização e acabamento de componentes');