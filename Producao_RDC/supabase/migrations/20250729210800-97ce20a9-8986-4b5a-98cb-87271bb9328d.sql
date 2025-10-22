-- Criar tabela para salvar os relatórios de mecânica
CREATE TABLE public.relatorios_mecanica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL,
  projeto TEXT NOT NULL,
  responsavel TEXT,
  localizacao TEXT,
  condicoes_climaticas JSONB, -- array de tempo selecionado (Manhã, Tarde, Noite)
  condicao_descricao TEXT,
  indice_pluviometrico TEXT,
  anotacoes_gerais TEXT,
  comentarios TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para salvar as atividades do relatório
CREATE TABLE public.relatorios_atividades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  relatorio_id UUID NOT NULL REFERENCES public.relatorios_mecanica(id) ON DELETE CASCADE,
  atividade TEXT NOT NULL,
  fluido_id UUID REFERENCES public.fluidos(id),
  linha_id UUID REFERENCES public.linhas(id),
  juntas_ids TEXT[], -- array de IDs das juntas trabalhadas
  tag_valvula TEXT,
  horas_informadas NUMERIC NOT NULL,
  total_pessoas_equipe INTEGER NOT NULL, -- soma total da equipe
  horas_totais NUMERIC NOT NULL, -- horas × total_pessoas
  detalhes_equipe JSONB NOT NULL, -- array com detalhes da equipe (FuncaoEquipe[])
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para rastrear status das juntas
CREATE TABLE public.status_juntas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  junta_id UUID NOT NULL REFERENCES public.juntas(id) ON DELETE CASCADE,
  atividade TEXT NOT NULL,
  data_atividade TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  relatorio_atividade_id UUID REFERENCES public.relatorios_atividades(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.relatorios_mecanica ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatorios_atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_juntas ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (permitir acesso completo por enquanto)
CREATE POLICY "Allow all access to relatorios_mecanica" 
ON public.relatorios_mecanica 
FOR ALL 
USING (true);

CREATE POLICY "Allow all access to relatorios_atividades" 
ON public.relatorios_atividades 
FOR ALL 
USING (true);

CREATE POLICY "Allow all access to status_juntas" 
ON public.status_juntas 
FOR ALL 
USING (true);

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_relatorios_mecanica_updated_at
BEFORE UPDATE ON public.relatorios_mecanica
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_relatorios_atividades_updated_at
BEFORE UPDATE ON public.relatorios_atividades
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para melhor performance
CREATE INDEX idx_relatorios_atividades_relatorio_id ON public.relatorios_atividades(relatorio_id);
CREATE INDEX idx_status_juntas_junta_id ON public.status_juntas(junta_id);
CREATE INDEX idx_status_juntas_atividade ON public.status_juntas(atividade);