
-- Criar tabela de notificações
CREATE TABLE public.notificacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES profiles(id),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'tarefa',
  lida BOOLEAN NOT NULL DEFAULT false,
  tarefa_id UUID REFERENCES tarefas(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Política para que usuários vejam apenas suas próprias notificações
CREATE POLICY "Usuários podem ver suas próprias notificações" 
  ON public.notificacoes 
  FOR SELECT 
  USING (auth.uid() = usuario_id);

-- Política para inserir notificações (permitir inserção de sistema)
CREATE POLICY "Sistema pode criar notificações" 
  ON public.notificacoes 
  FOR INSERT 
  WITH CHECK (true);

-- Política para usuários marcarem como lidas
CREATE POLICY "Usuários podem marcar suas notificações como lidas" 
  ON public.notificacoes 
  FOR UPDATE 
  USING (auth.uid() = usuario_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_notificacoes_updated_at
  BEFORE UPDATE ON public.notificacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar notificação quando tarefa é criada
CREATE OR REPLACE FUNCTION public.criar_notificacao_tarefa()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir notificação para o responsável da tarefa
  INSERT INTO public.notificacoes (
    usuario_id,
    titulo,
    mensagem,
    tipo,
    tarefa_id
  ) VALUES (
    NEW.responsavel_id,
    'Nova tarefa atribuída',
    'Você tem uma nova tarefa: ' || NEW.descricao,
    'tarefa',
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para executar a função quando uma tarefa é criada
CREATE TRIGGER trigger_criar_notificacao_tarefa
  AFTER INSERT ON public.tarefas
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_notificacao_tarefa();
