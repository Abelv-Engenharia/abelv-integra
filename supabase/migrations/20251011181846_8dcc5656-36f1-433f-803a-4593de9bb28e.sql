-- Política pública para visualizar CCAs ativos
CREATE POLICY "Público pode visualizar CCAs ativos"
ON public.ccas
FOR SELECT
TO public
USING (ativo = true);

-- Política pública para visualizar checklists ativos
CREATE POLICY "Público pode visualizar checklists ativos"
ON public.checklists_avaliacao
FOR SELECT
TO public
USING (ativo = true);

-- Política pública para visualizar informações básicas de profiles (nome e email dos responsáveis)
CREATE POLICY "Público pode visualizar informações de responsáveis"
ON public.profiles
FOR SELECT
TO public
USING (true);