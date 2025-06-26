
-- Criar tabela para tipos de inspeção SMS
CREATE TABLE public.tipos_inspecao_sms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para modelos de inspeção
CREATE TABLE public.modelos_inspecao_sms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  tipo_inspecao_id uuid NOT NULL REFERENCES tipos_inspecao_sms(id),
  arquivo_modelo_url text NOT NULL,
  campos_substituicao jsonb NOT NULL DEFAULT '[]'::jsonb,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para inspeções SMS realizadas
CREATE TABLE public.inspecoes_sms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  modelo_id uuid NOT NULL REFERENCES modelos_inspecao_sms(id),
  responsavel_id uuid NOT NULL REFERENCES profiles(id),
  data_inspecao date NOT NULL,
  local text NOT NULL,
  dados_preenchidos jsonb NOT NULL DEFAULT '{}'::jsonb,
  tem_nao_conformidade boolean NOT NULL DEFAULT false,
  pdf_gerado_url text,
  observacoes text,
  status text NOT NULL DEFAULT 'concluida',
  cca_id integer REFERENCES ccas(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security) para as tabelas
ALTER TABLE public.tipos_inspecao_sms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modelos_inspecao_sms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspecoes_sms ENABLE ROW LEVEL SECURITY;

-- Políticas para tipos_inspecao_sms (leitura para todos usuários autenticados)
CREATE POLICY "Usuários autenticados podem ver tipos de inspeção" 
  ON public.tipos_inspecao_sms 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem gerenciar tipos de inspeção" 
  ON public.tipos_inspecao_sms 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Políticas para modelos_inspecao_sms (leitura para todos, escrita para admins)
CREATE POLICY "Usuários autenticados podem ver modelos" 
  ON public.modelos_inspecao_sms 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem gerenciar modelos" 
  ON public.modelos_inspecao_sms 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Políticas para inspecoes_sms (usuários podem ver suas próprias inspeções)
CREATE POLICY "Usuários podem ver inspeções" 
  ON public.inspecoes_sms 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem criar inspeções" 
  ON public.inspecoes_sms 
  FOR INSERT 
  WITH CHECK (auth.uid() = responsavel_id);

CREATE POLICY "Usuários podem atualizar suas inspeções" 
  ON public.inspecoes_sms 
  FOR UPDATE 
  USING (auth.uid() = responsavel_id);

-- Triggers para updated_at
CREATE TRIGGER update_tipos_inspecao_sms_updated_at
  BEFORE UPDATE ON public.tipos_inspecao_sms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modelos_inspecao_sms_updated_at
  BEFORE UPDATE ON public.modelos_inspecao_sms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inspecoes_sms_updated_at
  BEFORE UPDATE ON public.inspecoes_sms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns tipos de inspeção padrão
INSERT INTO public.tipos_inspecao_sms (nome, descricao) VALUES
('Inspeção de Segurança Geral', 'Inspeção geral de condições de segurança'),
('Inspeção de EPIs', 'Verificação do uso correto de equipamentos de proteção individual'),
('Inspeção de Ferramentas', 'Verificação das condições das ferramentas de trabalho'),
('Inspeção de Ambiente de Trabalho', 'Avaliação das condições do ambiente de trabalho');
