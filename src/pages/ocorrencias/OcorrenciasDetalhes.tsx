import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const mockOcorrencias = [
  {
    id: "1",
    data: "2023-05-15",
    colaborador: "José da Silva",
    matricula: "123456",
    empresa: "Empresa A",
    cca: "CCA-001",
    disciplina: "Elétrica",
    tipoOcorrencia: "Acidente com Afastamento",
    classificacaoRisco: "INTOLERÁVEL",
    pontuacaoRisco: 64,
    status: "Em tratativa",
    descricao: "O colaborador estava realizando manutenção em um painel elétrico quando sofreu um choque elétrico de alta tensão.",
    acoesImediatas: "Atendimento médico imediato e isolamento da área para verificação.",
    causaRaiz: "Ausência de procedimento adequado para bloqueio e etiquetagem.",
    planoAcao: [
      {
        id: "1-1",
        acao: "Revisar procedimento de bloqueio e etiquetagem",
        responsavel: "Carlos Santos",
        prazo: "2023-06-15",
        status: "Concluído"
      },
      {
        id: "1-2",
        acao: "Realizar treinamento com todos os eletricistas",
        responsavel: "Mariana Oliveira",
        prazo: "2023-06-30",
        status: "Em andamento"
      },
      {
        id: "1-3",
        acao: "Adquirir novos EPIs para trabalhos em eletricidade",
        responsavel: "Pedro Almeida",
        prazo: "2023-07-10",
        status: "Pendente"
      }
    ]
  },
  {
    id: "2",
    data: "2023-06-22",
    colaborador: "Paulo Souza",
    matricula: "789012",
    empresa: "Empresa B",
    cca: "CCA-002",
    disciplina: "Mecânica",
    tipoOcorrencia: "Acidente sem Afastamento",
    classificacaoRisco: "MODERADO",
    pontuacaoRisco: 32,
    status: "Concluído",
    descricao: "Durante a manutenção de um equipamento, o colaborador sofreu um corte superficial na mão.",
    acoesImediatas: "Primeiros socorros e curativo no ambulatório da empresa.",
    causaRaiz: "Ferramenta inadequada para o serviço.",
    planoAcao: [
      {
        id: "2-1",
        acao: "Verificar ferramentas disponíveis para o tipo de serviço",
        responsavel: "Roberto Dias",
        prazo: "2023-07-05",
        status: "Concluído"
      },
      {
        id: "2-2",
        acao: "Substituir ferramentas danificadas",
        responsavel: "André Lima",
        prazo: "2023-07-15",
        status: "Concluído"
      }
    ]
  },
  {
    id: "3",
    data: "2023-07-05",
    colaborador: "Carla Oliveira",
    matricula: "345678",
    empresa: "Empresa C",
    cca: "CCA-003",
    disciplina: "Civil",
    tipoOcorrencia: "Quase Acidente",
    classificacaoRisco: "TRIVIAL",
    pontuacaoRisco: 8,
    status: "Em tratativa",
    descricao: "Um andaime foi montado incorretamente, mas foi identificado antes de qualquer uso.",
    acoesImediatas: "Desmontagem imediata do andaime e isolamento da área.",
    causaRaiz: "Falta de inspeção após montagem do andaime.",
    planoAcao: [
      {
        id: "3-1",
        acao: "Implementar checklist para montagem de andaimes",
        responsavel: "Fernanda Costa",
        prazo: "2023-07-20",
        status: "Em andamento"
      },
      {
        id: "3-2",
        acao: "Treinamento de reciclagem para montadores de andaime",
        responsavel: "Ricardo Gomes",
        prazo: "2023-08-10",
        status: "Pendente"
      }
    ]
  },
  {
    id: "4",
    data: "2023-08-11",
    colaborador: "Rafael Lima",
    matricula: "901234",
    empresa: "Empresa A",
    cca: "CCA-001",
    disciplina: "Elétrica",
    tipoOcorrencia: "Acidente sem Afastamento",
    classificacaoRisco: "SUBSTANCIAL",
    pontuacaoRisco: 48,
    status: "Concluído",
    descricao: "Colaborador sofreu uma queda de mesmo nível ao tropeçar em um cabo elétrico não sinalizado.",
    acoesImediatas: "Atendimento médico e organização imediata da área.",
    causaRaiz: "Falta de organização e sinalização na área de trabalho.",
    planoAcao: [
      {
        id: "4-1",
        acao: "Implementar programa 5S na área elétrica",
        responsavel: "Julia Santos",
        prazo: "2023-09-15",
        status: "Concluído"
      },
      {
        id: "4-2",
        acao: "Adquirir material para sinalização de cabos",
        responsavel: "Marcos Vieira",
        prazo: "2023-09-05",
        status: "Concluído"
      }
    ]
  },
  {
    id: "5",
    data: "2023-09-28",
    colaborador: "Mariana Costa",
    matricula: "567890",
    empresa: "Empresa D",
    cca: "CCA-004",
    disciplina: "Instrumentação",
    tipoOcorrencia: "Acidente com Afastamento",
    classificacaoRisco: "TOLERÁVEL",
    pontuacaoRisco: 18,
    status: "Em tratativa",
    descricao: "Colaboradora sofreu uma entorse no tornozelo ao descer uma escada.",
    acoesImediatas: "Atendimento médico e afastamento para recuperação.",
    causaRaiz: "Escada com degrau danificado.",
    planoAcao: [
      {
        id: "5-1",
        acao: "Realizar inspeção em todas as escadas do setor",
        responsavel: "Renato Silva",
        prazo: "2023-10-10",
        status: "Em andamento"
      },
      {
        id: "5-2",
        acao: "Substituir escadas danificadas",
        responsavel: "Tatiana Alves",
        prazo: "2023-10-30",
        status: "Pendente"
      }
    ]
  }
];

const getRiscoClassColor = (classificacao) => {
  switch (classificacao) {
    case "TRIVIAL":
      return "bg-[#34C6F4] text-white";
    case "TOLERÁVEL":
      return "bg-[#92D050] text-white";
    case "MODERADO":
      return "bg-[#FFE07D] text-gray-800";
    case "SUBSTANCIAL":
      return "bg-[#FFC000] text-gray-800";
    case "INTOLERÁVEL":
      return "bg-[#D13F3F] text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OcorrenciasDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ocorrencia, setOcorrencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [actionToUpdate, setActionToUpdate] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockOcorrencias.find(item => item.id === id);
      if (found) {
        setOcorrencia(found);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const confirmEdit = () => {
    navigate(`/ocorrencias/cadastro?id=${id}`);
    setEditDialogOpen(false);
    toast({
      title: "Modo de edição",
      description: "Você está editando esta ocorrência."
    });
  };

  const handleUpdateAction = (actionId) => {
    setActionToUpdate(actionId);
    toast({
      title: "Ação atualizada",
      description: `A ação ${actionId} foi atualizada com sucesso.`
    });
    
    setLoading(true);
    setTimeout(() => {
      const updatedOcorrencia = {...ocorrencia};
      const actionIndex = updatedOcorrencia.planoAcao.findIndex(a => a.id === actionId);
      if (actionIndex !== -1) {
        updatedOcorrencia.planoAcao[actionIndex].status = 'Concluído';
      }
      setOcorrencia(updatedOcorrencia);
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!ocorrencia) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/ocorrencias/consulta")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Consulta
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-800">Ocorrência não encontrada</h2>
              <p className="text-muted-foreground mt-2">
                A ocorrência que você está procurando não existe ou foi removida.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate("/ocorrencias/consulta")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Consulta
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Detalhes da Ocorrência</h1>
          <p className="text-muted-foreground">
            Visualize os detalhes completos da ocorrência #{ocorrencia.id}
          </p>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar Ocorrência
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Data da Ocorrência</h3>
              <p>{new Date(ocorrencia.data).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Tipo de Ocorrência</h3>
              <p>{ocorrencia.tipoOcorrencia}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Classificação de Risco</h3>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs ${getRiscoClassColor(ocorrencia.classificacaoRisco)} mr-2`}>
                  {ocorrencia.classificacaoRisco}
                </span>
                <span className="text-xs text-muted-foreground">
                  (Pontuação: {ocorrencia.pontuacaoRisco})
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Status</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                ocorrencia.status === 'Em tratativa' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {ocorrencia.status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Colaborador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Nome do Colaborador</h3>
              <p>{ocorrencia.colaborador}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Matrícula</h3>
              <p>{ocorrencia.matricula}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Empresa</h3>
              <p>{ocorrencia.empresa}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">CCA</h3>
              <p>{ocorrencia.cca}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Disciplina</h3>
              <p>{ocorrencia.disciplina}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Ocorrência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Descrição da Ocorrência</h3>
            <p className="text-sm">{ocorrencia.descricao}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Ações Imediatas</h3>
            <p className="text-sm">{ocorrencia.acoesImediatas}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Causa Raiz</h3>
            <p className="text-sm">{ocorrencia.causaRaiz}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plano de Ação</CardTitle>
          <CardDescription>Lista de ações para tratativa da ocorrência</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ocorrencia.planoAcao.map((acao) => (
              <div key={acao.id} className="border rounded-lg p-4 bg-muted/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm">{acao.acao}</h4>
                    <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 text-xs text-muted-foreground mt-1">
                      <span>Responsável: {acao.responsavel}</span>
                      <span>Prazo: {new Date(acao.prazo).toLocaleDateString()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs inline-block w-fit ${
                        acao.status === 'Concluído' 
                          ? 'bg-green-100 text-green-800' 
                          : acao.status === 'Em andamento' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {acao.status}
                      </span>
                    </div>
                  </div>
                  {acao.status !== 'Concluído' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateAction(acao.id)}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Atualizar Status
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Ocorrência</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a editar esta ocorrência. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEdit}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OcorrenciasDetalhes;
