-- Criar tabela para equipamentos mecânicos
CREATE TABLE public.equipamentos_mecanicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag TEXT NOT NULL,
  tipo_equipamento TEXT NOT NULL,
  descricao TEXT,
  area_id UUID,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para válvulas
CREATE TABLE public.valvulas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag TEXT NOT NULL UNIQUE,
  tipo_valvula TEXT NOT NULL,
  linha_id UUID,
  fluido_id UUID,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.equipamentos_mecanicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valvulas ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso público para equipamentos_mecanicos
CREATE POLICY "Allow all access to equipamentos_mecanicos" 
ON public.equipamentos_mecanicos 
FOR ALL 
USING (true);

-- Criar políticas de acesso público para valvulas
CREATE POLICY "Allow all access to valvulas" 
ON public.valvulas 
FOR ALL 
USING (true);

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_equipamentos_mecanicos_updated_at
  BEFORE UPDATE ON public.equipamentos_mecanicos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_valvulas_updated_at
  BEFORE UPDATE ON public.valvulas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();