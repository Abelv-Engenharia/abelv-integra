-- Criar tabela de logs para importação de HSA
CREATE TABLE public.logs_importacao_hsa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_importacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_registros INTEGER NOT NULL DEFAULT 0,
  registros_criados INTEGER NOT NULL DEFAULT 0,
  registros_atualizados INTEGER NOT NULL DEFAULT 0,
  registros_com_erro INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'concluida',
  detalhes_erro TEXT,
  nome_arquivo TEXT,
  usuario_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.logs_importacao_hsa ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados insiram logs
CREATE POLICY "Sistema pode criar logs de importação HSA" 
ON public.logs_importacao_hsa 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Política para permitir que usuários autenticados visualizem logs
CREATE POLICY "Usuários autenticados podem visualizar logs de importação HSA" 
ON public.logs_importacao_hsa 
FOR SELECT 
USING (auth.uid() IS NOT NULL);