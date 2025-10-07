-- Criar o trigger na tabela tarefas para chamar a função de notificações
DROP TRIGGER IF EXISTS trigger_criar_notificacoes_tarefas ON tarefas;

CREATE TRIGGER trigger_criar_notificacoes_tarefas
  AFTER INSERT ON tarefas
  FOR EACH ROW
  EXECUTE FUNCTION criar_notificacoes_para_responsaveis();