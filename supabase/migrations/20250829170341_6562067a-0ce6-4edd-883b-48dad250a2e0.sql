-- Desabilitar temporariamente o trigger de notificação para tarefas
DROP TRIGGER IF EXISTS trigger_criar_notificacao_tarefa ON public.tarefas;

-- Recriar a função de notificação para funcionar com múltiplos responsáveis
DROP FUNCTION IF EXISTS public.criar_notificacao_tarefa();

CREATE OR REPLACE FUNCTION public.criar_notificacoes_para_responsaveis()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir notificações para todos os responsáveis da tarefa
  INSERT INTO public.notificacoes (
    usuario_id,
    titulo,
    mensagem,
    tipo,
    tarefa_id
  )
  SELECT 
    tr.usuario_id,
    'Nova tarefa atribuída',
    'Você tem uma nova tarefa: ' || NEW.titulo,
    'tarefa',
    NEW.id
  FROM public.tarefas_responsaveis tr
  WHERE tr.tarefa_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;