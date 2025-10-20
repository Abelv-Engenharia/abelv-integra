-- Adicionar novos campos na tabela analises_contratuais
ALTER TABLE public.analises_contratuais
ADD COLUMN IF NOT EXISTS bloco_atual text DEFAULT 'cadastro',
ADD COLUMN IF NOT EXISTS quantidade_quartos integer,
ADD COLUMN IF NOT EXISTS capacidade_total integer,
ADD COLUMN IF NOT EXISTS observacoes_imovel text,
ADD COLUMN IF NOT EXISTS custo_unitario numeric;

-- Criar tabela de aprovações
CREATE TABLE IF NOT EXISTS public.aprovacoes_analise (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analise_id uuid REFERENCES public.analises_contratuais(id) ON DELETE CASCADE,
  bloco text NOT NULL,
  aprovador text NOT NULL,
  acao text NOT NULL CHECK (acao IN ('aprovar', 'reprovar')),
  comentario text,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela aprovacoes_analise
ALTER TABLE public.aprovacoes_analise ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para aprovacoes_analise
CREATE POLICY "Permitir leitura de aprovações para todos"
ON public.aprovacoes_analise
FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção de aprovações para todos"
ON public.aprovacoes_analise
FOR INSERT
WITH CHECK (true);

-- Criar tabela de destinatários de aprovação
CREATE TABLE IF NOT EXISTS public.destinatarios_aprovacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text UNIQUE NOT NULL CHECK (tipo IN ('financeiro', 'adm_matricial', 'superintendencia', 'assinatura')),
  emails text[] NOT NULL,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela destinatarios_aprovacao
ALTER TABLE public.destinatarios_aprovacao ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para destinatarios_aprovacao
CREATE POLICY "Permitir leitura de destinatários para todos"
ON public.destinatarios_aprovacao
FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção de destinatários para admins"
ON public.destinatarios_aprovacao
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Permitir atualização de destinatários para admins"
ON public.destinatarios_aprovacao
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Inserir destinatários padrão
INSERT INTO public.destinatarios_aprovacao (tipo, emails) VALUES
  ('financeiro', ARRAY['financeiro@abelv.com.br']),
  ('adm_matricial', ARRAY['adm.matricial@abelv.com.br']),
  ('superintendencia', ARRAY['gestao@abelv.com.br']),
  ('assinatura', ARRAY['ely@abelv.com.br'])
ON CONFLICT (tipo) DO NOTHING;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_destinatarios_aprovacao_updated_at
BEFORE UPDATE ON public.destinatarios_aprovacao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();