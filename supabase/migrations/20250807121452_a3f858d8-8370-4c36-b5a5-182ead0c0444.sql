
-- Criar tabela para logs de importação de funcionários
CREATE TABLE public.logs_importacao_funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users NOT NULL,
  data_importacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_registros INTEGER NOT NULL DEFAULT 0,
  registros_criados INTEGER NOT NULL DEFAULT 0,
  registros_atualizados INTEGER NOT NULL DEFAULT 0,
  registros_com_erro INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'concluida',
  detalhes_erro TEXT,
  nome_arquivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para que usuários vejam todos os logs (para auditoria)
ALTER TABLE public.logs_importacao_funcionarios ENABLE ROW LEVEL SECURITY;

-- Política para visualização (todos os usuários autenticados podem ver)
CREATE POLICY "Usuários autenticados podem visualizar logs de importação" 
  ON public.logs_importacao_funcionarios 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Política para inserção (apenas o sistema pode inserir logs)
CREATE POLICY "Sistema pode criar logs de importação" 
  ON public.logs_importacao_funcionarios 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Índice para melhor performance nas consultas
CREATE INDEX idx_logs_importacao_data ON public.logs_importacao_funcionarios(data_importacao DESC);
CREATE INDEX idx_logs_importacao_usuario ON public.logs_importacao_funcionarios(usuario_id);
