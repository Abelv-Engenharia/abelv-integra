-- Criar tabela de áreas do projeto (compartilhada entre módulos)
CREATE TABLE public.areas_projeto (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de desenhos de elétrica
CREATE TABLE public.desenhos_eletrica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL,
  disciplina TEXT NOT NULL CHECK (disciplina IN ('Automação', 'Força', 'Iluminação e Tomadas', 'SPDA', 'Telecomunicações')),
  area_id UUID REFERENCES public.areas_projeto(id),
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de infraestrutura elétrica
CREATE TABLE public.infraestrutura_eletrica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  desenho_id UUID REFERENCES public.desenhos_eletrica(id),
  nome TEXT NOT NULL,
  dimensao TEXT,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de cabos
CREATE TABLE public.cabos_eletrica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  desenho_id UUID REFERENCES public.desenhos_eletrica(id),
  tipo_cabo TEXT NOT NULL,
  tipo_condutor TEXT NOT NULL CHECK (tipo_condutor IN ('Fase', 'Neutro', 'Terra')),
  dimensao TEXT,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de instrumentos
CREATE TABLE public.instrumentos_eletrica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  desenho_id UUID REFERENCES public.desenhos_eletrica(id),
  fluido_id UUID REFERENCES public.fluidos(id),
  linha_id UUID REFERENCES public.linhas(id),
  tipo_instrumento TEXT NOT NULL,
  tag TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de equipamentos elétricos
CREATE TABLE public.equipamentos_eletricos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  area_id UUID REFERENCES public.areas_projeto(id),
  disciplina TEXT NOT NULL CHECK (disciplina IN ('Automação', 'Força', 'Iluminação e Tomadas', 'SPDA', 'Telecomunicações')),
  tipo_equipamento TEXT NOT NULL,
  tag TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de luminárias
CREATE TABLE public.luminarias_eletrica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  desenho_id UUID REFERENCES public.desenhos_eletrica(id),
  tipo_luminaria TEXT NOT NULL,
  tag TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de encarregados de elétrica (separada dos encarregados de mecânica)
CREATE TABLE public.encarregados_eletrica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  telefone TEXT,
  email TEXT,
  equipe JSONB DEFAULT '[]'::jsonb,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.areas_projeto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desenhos_eletrica ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infraestrutura_eletrica ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabos_eletrica ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instrumentos_eletrica ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipamentos_eletricos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.luminarias_eletrica ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encarregados_eletrica ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
CREATE POLICY "Allow all access to areas_projeto" ON public.areas_projeto FOR ALL USING (true);
CREATE POLICY "Allow all access to desenhos_eletrica" ON public.desenhos_eletrica FOR ALL USING (true);
CREATE POLICY "Allow all access to infraestrutura_eletrica" ON public.infraestrutura_eletrica FOR ALL USING (true);
CREATE POLICY "Allow all access to cabos_eletrica" ON public.cabos_eletrica FOR ALL USING (true);
CREATE POLICY "Allow all access to instrumentos_eletrica" ON public.instrumentos_eletrica FOR ALL USING (true);
CREATE POLICY "Allow all access to equipamentos_eletricos" ON public.equipamentos_eletricos FOR ALL USING (true);
CREATE POLICY "Allow all access to luminarias_eletrica" ON public.luminarias_eletrica FOR ALL USING (true);
CREATE POLICY "Allow all access to encarregados_eletrica" ON public.encarregados_eletrica FOR ALL USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_areas_projeto_updated_at
  BEFORE UPDATE ON public.areas_projeto
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_desenhos_eletrica_updated_at
  BEFORE UPDATE ON public.desenhos_eletrica
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_infraestrutura_eletrica_updated_at
  BEFORE UPDATE ON public.infraestrutura_eletrica
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cabos_eletrica_updated_at
  BEFORE UPDATE ON public.cabos_eletrica
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_instrumentos_eletrica_updated_at
  BEFORE UPDATE ON public.instrumentos_eletrica
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipamentos_eletricos_updated_at
  BEFORE UPDATE ON public.equipamentos_eletricos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_luminarias_eletrica_updated_at
  BEFORE UPDATE ON public.luminarias_eletrica
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_encarregados_eletrica_updated_at
  BEFORE UPDATE ON public.encarregados_eletrica
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();