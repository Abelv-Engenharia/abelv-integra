
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tarefa } from "@/types/tarefas";

export const getStatusColor = (status: Tarefa["status"]) => {
  switch (status) {
    case "concluida":
      return "bg-green-100 text-green-800";
    case "em-andamento":
      return "bg-blue-100 text-blue-800";
    case "pendente":
      return "bg-yellow-100 text-yellow-800";
    case "programada":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getCriticidadeColor = (criticidade: Tarefa["configuracao"]["criticidade"]) => {
  switch (criticidade) {
    case "critica":
      return "bg-red-100 text-red-800";
    case "alta":
      return "bg-orange-100 text-orange-800";
    case "media":
      return "bg-yellow-100 text-yellow-800";
    case "baixa":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatTimeRemaining = (dateConclusao: string) => {
  const date = new Date(dateConclusao);
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
};

export const mockUsuarios = [
  { id: '1', nome: 'João Silva', email: 'joao.silva@empresa.com', cargo: 'Técnico de Segurança', departamento: 'SMS' },
  { id: '2', nome: 'Maria Santos', email: 'maria.santos@empresa.com', cargo: 'Engenheira', departamento: 'Operações' },
  { id: '3', nome: 'Pedro Costa', email: 'pedro.costa@empresa.com', cargo: 'Supervisor', departamento: 'Produção' },
  { id: '4', nome: 'Ana Oliveira', email: 'ana.oliveira@empresa.com', cargo: 'Analista de SMS', departamento: 'SMS' },
  { id: '5', nome: 'Carlos Pereira', email: 'carlos.pereira@empresa.com', cargo: 'Coordenador', departamento: 'Manutenção' }
];

export const mockTarefas: Tarefa[] = [
  {
    id: '1',
    cca: '2025-0001',
    tipoCca: 'linha-inteira',
    dataCadastro: '2025-04-01',
    dataConclusao: '2025-05-10',
    descricao: 'Revisão do procedimento de segurança para trabalhos em altura',
    responsavel: { id: '1', nome: 'João Silva' },
    status: 'pendente',
    iniciada: false,
    configuracao: {
      criticidade: 'alta',
      requerValidacao: true,
      notificarUsuario: true,
      recorrencia: {
        ativa: true,
        frequencia: 'mensal'
      }
    }
  },
  {
    id: '2',
    cca: '2025-0002',
    tipoCca: 'parcial',
    dataCadastro: '2025-04-02',
    dataConclusao: '2025-05-08',
    descricao: 'Treinamento da equipe técnica nos novos protocolos de segurança',
    responsavel: { id: '2', nome: 'Maria Santos' },
    status: 'em-andamento',
    iniciada: true,
    configuracao: {
      criticidade: 'media',
      requerValidacao: true,
      notificarUsuario: true
    }
  },
  {
    id: '3',
    cca: '2025-0003',
    tipoCca: 'equipamento',
    dataCadastro: '2025-04-03',
    dataConclusao: '2025-05-05',
    descricao: 'Atualização do manual de operações e procedimentos da planta',
    responsavel: { id: '3', nome: 'Pedro Costa' },
    status: 'concluida',
    iniciada: true,
    anexo: 'manual_operacoes_v2.pdf',
    configuracao: {
      criticidade: 'baixa',
      requerValidacao: false,
      notificarUsuario: false
    }
  },
  {
    id: '4',
    cca: '2025-0004',
    tipoCca: 'especifica',
    dataCadastro: '2025-04-04',
    dataConclusao: '2025-05-15',
    descricao: 'Inspeção dos equipamentos de proteção coletiva da área de produção',
    responsavel: { id: '4', nome: 'Ana Oliveira' },
    status: 'programada',
    iniciada: false,
    configuracao: {
      criticidade: 'critica',
      requerValidacao: true,
      notificarUsuario: true,
      recorrencia: {
        ativa: true,
        frequencia: 'trimestral'
      }
    }
  },
  {
    id: '5',
    cca: '2025-0005',
    tipoCca: 'linha-inteira',
    dataCadastro: '2025-04-05',
    dataConclusao: '2025-05-12',
    descricao: 'Reunião com fornecedores de EPI para avaliar novas tecnologias',
    responsavel: { id: '5', nome: 'Carlos Pereira' },
    status: 'pendente',
    iniciada: false,
    configuracao: {
      criticidade: 'media',
      requerValidacao: false,
      notificarUsuario: true
    }
  },
  {
    id: '6',
    cca: '2025-0006',
    tipoCca: 'parcial',
    dataCadastro: '2025-04-06',
    dataConclusao: '2025-05-20',
    descricao: 'Auditoria interna de conformidade com normas de segurança',
    responsavel: { id: '4', nome: 'Ana Oliveira' },
    status: 'programada',
    iniciada: false,
    configuracao: {
      criticidade: 'alta',
      requerValidacao: true,
      notificarUsuario: true,
      recorrencia: {
        ativa: true,
        frequencia: 'semestral'
      }
    }
  },
  {
    id: '7',
    cca: '2025-0007',
    tipoCca: 'equipamento',
    dataCadastro: '2025-04-07',
    dataConclusao: '2025-05-25',
    descricao: 'Elaboração de relatório mensal de indicadores de segurança',
    responsavel: { id: '1', nome: 'João Silva' },
    status: 'programada',
    iniciada: false,
    configuracao: {
      criticidade: 'baixa',
      requerValidacao: false,
      notificarUsuario: false,
      recorrencia: {
        ativa: true,
        frequencia: 'mensal'
      }
    }
  }
];
