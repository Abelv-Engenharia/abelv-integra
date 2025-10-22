-- Criar tabela para atividades principais
CREATE TABLE public.atividades_principais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  relatorio_id UUID NOT NULL,
  atividade_cadastrada_id UUID NOT NULL,
  nome_atividade TEXT NOT NULL,
  equipe JSONB NOT NULL DEFAULT '[]'::jsonb,
  horas_informadas NUMERIC NOT NULL DEFAULT 0,
  total_pessoas INTEGER NOT NULL DEFAULT 0,
  horas_totais NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.atividades_principais ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Allow all access to atividades_principais" 
ON public.atividades_principais 
FOR ALL 
USING (true);

-- Adicionar coluna para vincular etapas à atividade principal
ALTER TABLE public.relatorios_atividades 
ADD COLUMN atividade_principal_id UUID REFERENCES public.atividades_principais(id);

-- Criar índices para melhor performance
CREATE INDEX idx_atividades_principais_relatorio_id ON public.atividades_principais(relatorio_id);
CREATE INDEX idx_atividades_principais_atividade_cadastrada_id ON public.atividades_principais(atividade_cadastrada_id);
CREATE INDEX idx_relatorios_atividades_atividade_principal_id ON public.relatorios_atividades(atividade_principal_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_atividades_principais_updated_at
BEFORE UPDATE ON public.atividades_principais
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();