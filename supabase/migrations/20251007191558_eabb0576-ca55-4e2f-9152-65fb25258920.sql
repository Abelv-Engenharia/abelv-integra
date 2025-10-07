-- Modificar trigger para usar responsavel_id diretamente da tabela tarefas
CREATE OR REPLACE FUNCTION public.criar_notificacoes_para_responsaveis()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Criar notificação para o responsável direto (se existir)
  IF NEW.responsavel_id IS NOT NULL THEN
    INSERT INTO public.notificacoes (
      usuario_id,
      titulo,
      mensagem,
      tipo,
      tarefa_id
    )
    VALUES (
      NEW.responsavel_id,
      'Nova tarefa atribuída',
      'Você tem uma nova tarefa: ' || COALESCE(NEW.titulo, 'Sem título'),
      'tarefa',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;