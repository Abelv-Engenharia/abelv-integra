
export type Notificacao = {
  id: string;
  usuario_id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  tarefa_id?: string;
  created_at: string;
  updated_at: string;
};
