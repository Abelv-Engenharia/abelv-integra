
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'programada':
      return 'bg-status-programada-bg text-status-programada border-status-programada';
    case 'em-andamento':
      return 'bg-status-andamento-bg text-status-andamento border-status-andamento';
    case 'pendente':
      return 'bg-status-pendente-bg text-status-pendente border-status-pendente';
    case 'concluida':
      return 'bg-status-concluida-bg text-status-concluida border-status-concluida';
    case 'aguardando-validacao':
      return 'text-purple-700 bg-purple-50 border-purple-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};

export const getCriticidadeColor = (criticidade: string) => {
  switch (criticidade) {
    case 'baixa':
      return 'text-green-700 bg-green-50 border-green-200';
    case 'media':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    case 'alta':
      return 'text-orange-700 bg-orange-50 border-orange-200';
    case 'critica':
      return 'text-red-700 bg-red-50 border-red-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};

// Mock data para desenvolvimento e testes
export const mockUsuarios = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@exemplo.com',
    cargo: 'Engenheiro',
    departamento: 'SMS'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@exemplo.com',
    cargo: 'Supervisora',
    departamento: 'Operações'
  },
  {
    id: '3',
    nome: 'Pedro Costa',
    email: 'pedro@exemplo.com',
    cargo: 'Técnico',
    departamento: 'Manutenção'
  }
];

export const mockTarefas = [
  {
    id: '1',
    cca: 'CCA-001 - Linha Principal',
    tipoCca: 'linha-inteira' as const,
    dataCadastro: '2024-01-15',
    dataConclusao: '2024-02-15',
    descricao: 'Realizar inspeção completa da linha',
    responsavel: {
      id: '1',
      nome: 'João Silva'
    },
    status: 'em-andamento' as const,
    iniciada: true,
    configuracao: {
      criticidade: 'alta' as const,
      requerValidacao: true,
      notificarUsuario: true,
      recorrencia: {
        ativa: false,
        frequencia: 'mensal' as const
      }
    }
  }
];
