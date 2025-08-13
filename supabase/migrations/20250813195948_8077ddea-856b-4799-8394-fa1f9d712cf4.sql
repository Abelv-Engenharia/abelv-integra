-- Secure the medidas_disciplinares table with proper RLS policies
-- First enable RLS if not already enabled
ALTER TABLE public.medidas_disciplinares ENABLE ROW LEVEL SECURITY;

-- Policy 1: Only users with admin_funcionarios permission can view disciplinary records
CREATE POLICY "Admin funcionários podem visualizar medidas disciplinares"
ON public.medidas_disciplinares
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
);

-- Policy 2: Only users with admin_funcionarios permission can create disciplinary records
CREATE POLICY "Admin funcionários podem criar medidas disciplinares"
ON public.medidas_disciplinares
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
);

-- Policy 3: Only users with admin_funcionarios permission can update disciplinary records
CREATE POLICY "Admin funcionários podem atualizar medidas disciplinares"
ON public.medidas_disciplinares
FOR UPDATE
USING (
  auth.uid() IS NOT NULL 
  AND ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
);

-- Policy 4: Only users with admin_funcionarios permission can delete disciplinary records
CREATE POLICY "Admin funcionários podem excluir medidas disciplinares"
ON public.medidas_disciplinares
FOR DELETE
USING (
  auth.uid() IS NOT NULL 
  AND ((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true
);