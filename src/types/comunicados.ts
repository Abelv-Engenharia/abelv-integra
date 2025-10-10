export interface Comunicado {
  id: string;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string;
  arquivo_url: string | null;
  arquivo_nome: string | null;
  ativo: boolean;
  publico_alvo: {
    tipo: 'todos' | 'cca' | 'usuarios';
    cca_id?: number;
    usuarios_ids?: string[];
  };
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComunicadoCiencia {
  id: string;
  comunicado_id: string;
  usuario_id: string;
  data_ciencia: string;
  created_at: string;
  profiles?: {
    nome: string;
    email: string;
  };
}

export interface ComunicadoComCiencia extends Comunicado {
  ja_deu_ciencia?: boolean;
}