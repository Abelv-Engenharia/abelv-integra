-- Habilitar RLS na tabela prestadores_ferias se ainda não estiver habilitado
ALTER TABLE public.prestadores_ferias ENABLE ROW LEVEL SECURITY;

-- Política para administradores verem todas as solicitações de férias
CREATE POLICY "Administradores podem ver todas as solicitações de férias"
ON public.prestadores_ferias
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin_sistema')
);

-- Política para responsáveis diretos verem suas solicitações
CREATE POLICY "Responsáveis diretos podem ver solicitações sob sua responsabilidade"
ON public.prestadores_ferias
FOR SELECT
TO authenticated
USING (
  responsaveldireto_id = auth.uid()
);

-- Política para administradores aprovarem/rejeitarem todas as solicitações
CREATE POLICY "Administradores podem atualizar todas as solicitações de férias"
ON public.prestadores_ferias
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin_sistema')
);

-- Política para responsáveis diretos atualizarem suas solicitações
CREATE POLICY "Responsáveis diretos podem atualizar solicitações sob sua responsabilidade"
ON public.prestadores_ferias
FOR UPDATE
TO authenticated
USING (
  responsaveldireto_id = auth.uid()
);

-- Política para usuários autenticados criarem solicitações
CREATE POLICY "Usuários autenticados podem criar solicitações de férias"
ON public.prestadores_ferias
FOR INSERT
TO authenticated
WITH CHECK (true);