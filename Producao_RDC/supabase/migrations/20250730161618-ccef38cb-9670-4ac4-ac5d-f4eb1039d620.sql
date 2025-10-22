-- Criar tabela de CCAs (Centro de Custo ABELV)
CREATE TABLE public.ccas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de Encarregados
CREATE TABLE public.encarregados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  telefone TEXT,
  email TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar colunas de referência na tabela relatorios_mecanica
ALTER TABLE public.relatorios_mecanica 
ADD COLUMN cca_id UUID REFERENCES public.ccas(id),
ADD COLUMN encarregado_id UUID REFERENCES public.encarregados(id);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.ccas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encarregados ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para CCAs
CREATE POLICY "Allow all access to ccas" 
ON public.ccas 
FOR ALL 
USING (true);

-- Políticas RLS para Encarregados
CREATE POLICY "Allow all access to encarregados" 
ON public.encarregados 
FOR ALL 
USING (true);

-- Trigger para updated_at nas tabelas CCAs
CREATE TRIGGER update_ccas_updated_at
BEFORE UPDATE ON public.ccas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para updated_at nas tabelas Encarregados
CREATE TRIGGER update_encarregados_updated_at
BEFORE UPDATE ON public.encarregados
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrar dados existentes de projetos para CCAs
INSERT INTO public.ccas (codigo, nome, descricao) VALUES 
('23.024', 'Centro de Custo ABELV - 23.024', 'Centro de custo migrado automaticamente'),
('24023', 'Centro de Custo ABELV - 24023', 'Centro de custo migrado automaticamente');

-- Atualizar registros existentes para referenciar os CCAs criados
UPDATE public.relatorios_mecanica 
SET cca_id = (SELECT id FROM public.ccas WHERE codigo = relatorios_mecanica.projeto)
WHERE projeto IN ('23.024', '24023');