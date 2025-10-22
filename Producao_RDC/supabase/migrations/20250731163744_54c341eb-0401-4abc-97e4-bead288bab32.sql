-- Criar tabela para normalizar as funções/cargos da equipe
CREATE TABLE public.funcoes_equipe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir funções padrão
INSERT INTO public.funcoes_equipe (nome, descricao) VALUES
('Soldador', 'Profissional responsável por soldagem'),
('Encanador', 'Profissional responsável por tubulação'),
('Mecânico Montador', 'Profissional responsável por montagem mecânica'),
('Mecânico Ajustador', 'Profissional responsável por ajustes mecânicos'),
('Ajudante', 'Auxiliar nas atividades'),
('Meio Oficial', 'Profissional com conhecimento intermediário');

-- Criar tabela para detalhes da equipe (normalizar o JSON)
CREATE TABLE public.detalhes_equipe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  atividade_principal_id UUID NOT NULL,
  funcao_id UUID NOT NULL REFERENCES public.funcoes_equipe(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (atividade_principal_id) REFERENCES public.atividades_principais(id) ON DELETE CASCADE
);

-- Criar tabela para informações específicas de suportes
CREATE TABLE public.informacoes_suporte (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  relatorio_atividade_id UUID NOT NULL,
  peso_kg DECIMAL(10,2),
  quantidade INTEGER NOT NULL DEFAULT 1,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (relatorio_atividade_id) REFERENCES public.relatorios_atividades(id) ON DELETE CASCADE
);

-- Criar tabela para condições climáticas (normalizar o JSON)
CREATE TABLE public.condicoes_climaticas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  relatorio_id UUID NOT NULL,
  periodo VARCHAR(20) NOT NULL, -- 'Manhã', 'Tarde', 'Noite'
  condicao VARCHAR(50), -- 'Ensolarado', 'Chuvoso', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (relatorio_id) REFERENCES public.relatorios_mecanica(id) ON DELETE CASCADE
);

-- Criar tabela para localização (para normalizar e permitir relatórios por local)
CREATE TABLE public.localizacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar coluna para referenciar localização na tabela de relatórios
ALTER TABLE public.relatorios_mecanica 
ADD COLUMN localizacao_id UUID REFERENCES public.localizacoes(id);

-- Criar índices para melhorar performance dos relatórios (apenas os novos)
CREATE INDEX idx_detalhes_equipe_atividade ON public.detalhes_equipe(atividade_principal_id);
CREATE INDEX idx_detalhes_equipe_funcao ON public.detalhes_equipe(funcao_id);
CREATE INDEX idx_informacoes_suporte_relatorio ON public.informacoes_suporte(relatorio_atividade_id);
CREATE INDEX idx_condicoes_climaticas_relatorio ON public.condicoes_climaticas(relatorio_id);
CREATE INDEX idx_relatorios_mecanica_localizacao ON public.relatorios_mecanica(localizacao_id);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.funcoes_equipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalhes_equipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.informacoes_suporte ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condicoes_climaticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localizacoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para permitir acesso total (ajustar conforme necessário)
CREATE POLICY "Allow all access to funcoes_equipe" ON public.funcoes_equipe FOR ALL USING (true);
CREATE POLICY "Allow all access to detalhes_equipe" ON public.detalhes_equipe FOR ALL USING (true);
CREATE POLICY "Allow all access to informacoes_suporte" ON public.informacoes_suporte FOR ALL USING (true);
CREATE POLICY "Allow all access to condicoes_climaticas" ON public.condicoes_climaticas FOR ALL USING (true);
CREATE POLICY "Allow all access to localizacoes" ON public.localizacoes FOR ALL USING (true);

-- Criar triggers para updated_at
CREATE TRIGGER update_funcoes_equipe_updated_at
  BEFORE UPDATE ON public.funcoes_equipe
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_detalhes_equipe_updated_at
  BEFORE UPDATE ON public.detalhes_equipe
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_informacoes_suporte_updated_at
  BEFORE UPDATE ON public.informacoes_suporte
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_localizacoes_updated_at
  BEFORE UPDATE ON public.localizacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir algumas localizações comuns
INSERT INTO public.localizacoes (nome, descricao) VALUES
('Área Industrial 1', 'Primeira área industrial do projeto'),
('Área Industrial 2', 'Segunda área industrial do projeto'),
('Área de Utilidades', 'Área de equipamentos auxiliares'),
('Área de Tanques', 'Área de armazenamento'),
('Oficina', 'Área de manutenção e fabricação'),
('Pátio de Materiais', 'Área de estoque de materiais');