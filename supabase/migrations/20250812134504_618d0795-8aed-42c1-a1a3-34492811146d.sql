
-- Create table for logging training execution imports
CREATE TABLE public.logs_importacao_execucao_treinamentos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_importacao timestamp with time zone NOT NULL DEFAULT now(),
  total_registros integer NOT NULL DEFAULT 0,
  registros_criados integer NOT NULL DEFAULT 0,
  registros_atualizados integer NOT NULL DEFAULT 0,
  registros_com_erro integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'concluida',
  detalhes_erro text,
  nome_arquivo text,
  usuario_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.logs_importacao_execucao_treinamentos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Sistema pode criar logs de importação execução treinamentos" 
ON public.logs_importacao_execucao_treinamentos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem visualizar logs de importação execução treinamentos" 
ON public.logs_importacao_execucao_treinamentos 
FOR SELECT 
USING (auth.uid() IS NOT NULL);
