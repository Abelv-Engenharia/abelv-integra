-- Adicionar campo tipo_material na tabela linhas
ALTER TABLE public.linhas 
ADD COLUMN tipo_material TEXT;

-- Criar tabela para registro de diâmetros de juntas
CREATE TABLE public.diametros_juntas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  junta_id UUID NOT NULL,
  diametro_nominal DECIMAL(10,2) NOT NULL,
  diametro_interno DECIMAL(10,2),
  diametro_externo DECIMAL(10,2),
  espessura_parede DECIMAL(10,2),
  unidade_medida TEXT NOT NULL DEFAULT 'mm',
  observacoes TEXT,
  responsavel_medicao TEXT,
  data_medicao DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_diametros_juntas_junta FOREIGN KEY (junta_id) REFERENCES public.juntas(id) ON DELETE CASCADE
);

-- Habilitar RLS na tabela diametros_juntas
ALTER TABLE public.diametros_juntas ENABLE ROW LEVEL SECURITY;

-- Criar política para acesso total
CREATE POLICY "Allow all access to diametros_juntas" 
ON public.diametros_juntas 
FOR ALL 
USING (true);

-- Criar índices para performance
CREATE INDEX idx_diametros_juntas_junta_id ON public.diametros_juntas(junta_id);
CREATE INDEX idx_diametros_juntas_data_medicao ON public.diametros_juntas(data_medicao);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_diametros_juntas_updated_at
BEFORE UPDATE ON public.diametros_juntas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();