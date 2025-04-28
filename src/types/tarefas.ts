
export type TarefaStatus = 'programada' | 'concluida' | 'em-andamento' | 'pendente';

export type TarefaCriticidade = 'baixa' | 'media' | 'alta' | 'critica';

export type Tarefa = {
  id: string;
  cca: string;
  dataCadastro: string;
  dataConclusao: string;
  descricao: string;
  responsavel: {
    id: string;
    nome: string;
  };
  anexo?: string;
  status: TarefaStatus;
  iniciada: boolean;
  configuracao: {
    recorrencia?: {
      ativa: boolean;
      frequencia: 'diaria' | 'semanal' | 'mensal' | 'trimestral' | 'semestral' | 'anual';
    };
    criticidade: TarefaCriticidade;
    requerValidacao: boolean;
    notificarUsuario: boolean;
  };
};

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
};
