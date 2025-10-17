-- Tabela para armazenar estruturas EAP completas por CCA
CREATE TABLE public.eap_estruturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cca_id INTEGER REFERENCES public.ccas(id) ON DELETE CASCADE NOT NULL,
  estrutura JSONB NOT NULL DEFAULT '[]'::jsonb,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(cca_id, nome)
);

-- Tabela para armazenar itens individuais da EAP (para referências)
CREATE TABLE public.eap_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eap_estrutura_id UUID REFERENCES public.eap_estruturas(id) ON DELETE CASCADE NOT NULL,
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  nivel INTEGER NOT NULL DEFAULT 1,
  parent_id UUID REFERENCES public.eap_itens(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(eap_estrutura_id, codigo)
);

-- Índices para performance
CREATE INDEX idx_eap_estruturas_cca ON public.eap_estruturas(cca_id) WHERE ativo = true;
CREATE INDEX idx_eap_itens_estrutura ON public.eap_itens(eap_estrutura_id) WHERE ativo = true;
CREATE INDEX idx_eap_itens_parent ON public.eap_itens(parent_id) WHERE ativo = true;
CREATE INDEX idx_eap_itens_codigo ON public.eap_itens(eap_estrutura_id, codigo) WHERE ativo = true;

-- Trigger para updated_at em eap_estruturas
CREATE TRIGGER update_eap_estruturas_updated_at
  BEFORE UPDATE ON public.eap_estruturas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para updated_at em eap_itens
CREATE TRIGGER update_eap_itens_updated_at
  BEFORE UPDATE ON public.eap_itens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para created_by em eap_estruturas
CREATE TRIGGER set_created_by_eap_estruturas
  BEFORE INSERT ON public.eap_estruturas
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

-- Trigger para updated_by em eap_estruturas
CREATE TRIGGER set_updated_by_eap_estruturas
  BEFORE UPDATE ON public.eap_estruturas
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_by();

-- RLS Policies para eap_estruturas
ALTER TABLE public.eap_estruturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem visualizar EAP estruturas"
  ON public.eap_estruturas FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar EAP estruturas"
  ON public.eap_estruturas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar EAP estruturas"
  ON public.eap_estruturas FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem deletar EAP estruturas"
  ON public.eap_estruturas FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- RLS Policies para eap_itens
ALTER TABLE public.eap_itens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem visualizar EAP itens"
  ON public.eap_itens FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar EAP itens"
  ON public.eap_itens FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar EAP itens"
  ON public.eap_itens FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem deletar EAP itens"
  ON public.eap_itens FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Comentários para documentação
COMMENT ON TABLE public.eap_estruturas IS 'Armazena estruturas EAP (Estrutura Analítica de Projeto) completas por CCA';
COMMENT ON TABLE public.eap_itens IS 'Armazena itens individuais da EAP de forma plana para permitir referências em outras tabelas';
COMMENT ON COLUMN public.eap_itens.codigo IS 'Código único do item dentro da estrutura (ex: 1.1, 1.1.1)';
COMMENT ON COLUMN public.eap_itens.nivel IS 'Nível de profundidade na hierarquia (1 = raiz)';
COMMENT ON COLUMN public.eap_itens.ordem IS 'Ordem de exibição dentro do mesmo nível';