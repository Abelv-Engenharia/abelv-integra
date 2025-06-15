
export type TarefaStatus = 'programada' | 'concluida' | 'em-andamento' | 'pendente';
export type TarefaCriticidade = 'baixa' | 'media' | 'alta' | 'critica';
export type TipoCCA = 'linha-inteira' | 'parcial' | 'equipamento' | 'especifica';

export type Tarefa = {
  id: string;
  cca: string;
  tipoCca: TipoCCA;
  dataCadastro: string;
  dataConclusao: string;
  data_real_conclusao?: string | null; // <-- NOVO: campo opcional para a data real de conclusão
  descricao: string;
  titulo?: string;
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
