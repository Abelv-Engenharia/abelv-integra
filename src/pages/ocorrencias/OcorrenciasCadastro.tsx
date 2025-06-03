import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save,
  X
} from "lucide-react";
import IdentificacaoForm from "@/components/ocorrencias/forms/IdentificacaoForm";
import InformacoesOcorrenciaForm from "@/components/ocorrencias/forms/InformacoesOcorrenciaForm";
import ClassificacaoRiscoForm from "@/components/ocorrencias/forms/ClassificacaoRiscoForm";
import PlanoAcaoForm from "@/components/ocorrencias/forms/PlanoAcaoForm";
import FechamentoForm from "@/components/ocorrencias/forms/FechamentoForm";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

type AcaoPlanoData = {
  tratativaAplicada: string;
  dataAdequacao: Date | null;
  responsavelAcao: string;
  funcaoResponsavel: string;
  situacao: string;
  status: string;
};

type OcorrenciaFormData = {
  data: Date | null;
  hora: string;
  mes: string;
  ano: string;
  cca: string;
  empresa: string;
  disciplina: string;
  engenheiroResponsavel: string;
  supervisorResponsavel: string;
  encarregadoResponsavel: string;
  colaboradoresAcidentados: Array<{
    colaborador: string;
    funcao: string;
    matricula: string;
  }>;
  tipoOcorrencia: string;
  tipoEvento: string;
  classificacaoOcorrencia: string;
  
  houveAfastamento: string;
  diasPerdidos: number | null;
  diasDebitados: number | null;
  parteCorpoAtingida: string;
  lateralidade: string;
  agenteCausador: string;
  situacaoGeradora: string;
  naturezaLesao: string;
  descricaoOcorrencia: string;
  numeroCat: string;
  cid: string;
  arquivoCAT: File | null;
  
  exposicao: string;
  controle: string;
  deteccao: string;
  efeitoFalha: string;
  impacto: string;
  probabilidade: number | null;
  severidade: number | null;
  classificacaoRisco: string;
  
  acoes: AcaoPlanoData[];
  
  investigacaoRealizada: string;
  informePreliminar: File | null;
  relatorioAnalise: File | null;
  licoesAprendidasEnviada: string;
  arquivoLicoesAprendidas: File | null;
};

const mockOcorrencias = [
  {
    id: "1",
    data: new Date("2023-05-15"),
    hora: "14:30",
    mes: "Maio",
    ano: "2023",
    colaborador: "José da Silva",
    matricula: "123456",
    empresa: "Empresa A",
    cca: "CCA-001",
    disciplina: "Elétrica",
    tipoOcorrencia: "Acidente com Afastamento",
    tipoEvento: "Trabalho em altura",
    classificacaoOcorrencia: "Grave",
    engenheiroResponsavel: "Ricardo Engenheiro",
    supervisorResponsavel: "Carlos Supervisor",
    encarregadoResponsavel: "João Encarregado",
    colaboradoresAcidentados: [{
      colaborador: "José da Silva",
      funcao: "Eletricista",
      matricula: "123456"
    }],
    houveAfastamento: "Sim",
    diasPerdidos: 15,
    diasDebitados: 5,
    parteCorpoAtingida: "Mão direita",
    lateralidade: "Direita",
    agenteCausador: "Equipamento elétrico",
    situacaoGeradora: "Manutenção sem desligamento",
    naturezaLesao: "Queimadura",
    descricao: "O colaborador estava realizando manutenção em um painel elétrico quando sofreu um choque elétrico de alta tensão.",
    acoesImediatas: "Atendimento médico imediato e isolamento da área para verificação.",
    numeroCat: "12345678",
    cid: "T75.4",
    causaRaiz: "Ausência de procedimento adequado para bloqueio e etiquetagem.",
    exposicao: "Frequente",
    controle: "Inadequado",
    deteccao: "Baixa",
    efeitoFalha: "Grande",
    impacto: "Alto",
    probabilidade: 8,
    severidade: 8,
    classificacaoRisco: "INTOLERÁVEL",
    investigacaoRealizada: "Sim",
    licoesAprendidasEnviada: "Sim",
    planoAcao: [
      {
        id: "1-1",
        tratativaAplicada: "Revisar procedimento de bloqueio e etiquetagem",
        responsavelAcao: "Carlos Santos",
        funcaoResponsavel: "Engenheiro de Segurança",
        dataAdequacao: new Date("2023-06-15"),
        situacao: "Verificado",
        status: "Concluído"
      },
      {
        id: "1-2",
        tratativaAplicada: "Realizar treinamento com todos os eletricistas",
        responsavelAcao: "Mariana Oliveira",
        funcaoResponsavel: "Analista de Treinamento",
        dataAdequacao: new Date("2023-06-30"),
        situacao: "Em andamento",
        status: "Em andamento"
      }
    ]
  },
];

const OcorrenciasCadastro = () => {
  const [activeTab, setActiveTab] = useState("identificacao");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ocorrenciaId = searchParams.get("id");
  
  const methods = useForm<OcorrenciaFormData>({
    defaultValues: {
      acoes: [{
        tratativaAplicada: '',
        dataAdequacao: null,
        responsavelAcao: '',
        funcaoResponsavel: '',
        situacao: '',
        status: ''
      }]
    }
  });

  useEffect(() => {
    if (ocorrenciaId) {
      setIsEditMode(true);
      setLoadingData(true);
      
      setTimeout(() => {
        const ocorrencia = mockOcorrencias.find(item => item.id === ocorrenciaId);
        
        if (ocorrencia) {
          methods.reset({
            data: ocorrencia.data,
            hora: ocorrencia.hora,
            mes: ocorrencia.mes,
            ano: ocorrencia.ano,
            cca: ocorrencia.cca,
            empresa: ocorrencia.empresa,
            disciplina: ocorrencia.disciplina,
            tipoOcorrencia: ocorrencia.tipoOcorrencia,
            tipoEvento: ocorrencia.tipoEvento,
            classificacaoOcorrencia: ocorrencia.classificacaoOcorrencia,
            engenheiroResponsavel: ocorrencia.engenheiroResponsavel,
            supervisorResponsavel: ocorrencia.supervisorResponsavel,
            encarregadoResponsavel: ocorrencia.encarregadoResponsavel,
            colaboradoresAcidentados: ocorrencia.colaboradoresAcidentados,
            acoes: ocorrencia.planoAcao.map(acao => ({
              tratativaAplicada: acao.tratativaAplicada,
              dataAdequacao: acao.dataAdequacao,
              responsavelAcao: acao.responsavelAcao,
              funcaoResponsavel: acao.funcaoResponsavel,
              situacao: acao.situacao,
              status: acao.status
            }))
          });
          
          toast({
            title: "Edição de Ocorrência",
            description: `Dados da ocorrência ${ocorrencia.id} carregados para edição.`
          });
        } else {
          toast({
            title: "Erro",
            description: "Ocorrência não encontrada.",
            variant: "destructive"
          });
          navigate("/ocorrencias/consulta");
        }
        
        setLoadingData(false);
      }, 1000);
    }
  }, [ocorrenciaId, methods, toast, navigate]);

  const tabs = [
    { id: "identificacao", label: "Identificação" },
    { id: "informacoes", label: "Informações da Ocorrência" },
    { id: "classificacaoRisco", label: "Classificação de Risco" },
    { id: "planoAcao", label: "Plano de Ação" },
    { id: "fechamento", label: "Fechamento" },
  ];

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleCancel = () => {
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    methods.reset({
      acoes: [{
        tratativaAplicada: '',
        dataAdequacao: null,
        responsavelAcao: '',
        funcaoResponsavel: '',
        situacao: '',
        status: ''
      }]
    });
    setActiveTab("identificacao");
    setCancelDialogOpen(false);
    
    toast({
      title: "Formulário cancelado",
      description: "O preenchimento foi cancelado e os dados foram limpos."
    });
  };

  const onSubmit = (data: OcorrenciaFormData) => {
    console.log("Form submitted:", data);
    console.log("Is edit mode:", isEditMode);
    
    if (!data.data || !data.cca || !data.empresa) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setSuccessDialogOpen(true);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditMode ? "Edição de Ocorrência" : "Cadastro de Ocorrências"}
        </h1>
        {isEditMode && (
          <Button 
            variant="outline" 
            onClick={() => navigate(`/ocorrencias/detalhes/${ocorrenciaId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Detalhes
          </Button>
        )}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full flex overflow-x-auto max-w-full mb-6">
                  {tabs.map(tab => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="flex-1"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="identificacao">
                  <IdentificacaoForm />
                </TabsContent>

                <TabsContent value="informacoes">
                  <InformacoesOcorrenciaForm />
                </TabsContent>

                <TabsContent value="classificacaoRisco">
                  <ClassificacaoRiscoForm />
                </TabsContent>

                <TabsContent value="planoAcao">
                  <PlanoAcaoForm />
                </TabsContent>

                <TabsContent value="fechamento">
                  <FechamentoForm />
                </TabsContent>
                
                <div className="flex justify-between mt-6 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={activeTab === tabs[0].id}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Anterior
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                  
                  {activeTab === tabs[tabs.length - 1].id ? (
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      {isEditMode ? "Salvar alterações" : "Salvar ocorrência"}
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleNext}>
                      Próximo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Tabs>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      
      {/* Dialog de cancelamento */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar preenchimento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar o preenchimento? Todos os dados inseridos serão perdidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
            >
              Continuar preenchendo
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmCancel}
            >
              Sim, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode 
                ? "Ocorrência atualizada com sucesso!" 
                : "Ocorrência registrada com sucesso!"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "As alterações foram salvas no sistema." 
                : "Os dados da ocorrência foram salvos no sistema."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {!isEditMode && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSuccessDialogOpen(false);
                  methods.reset({
                    acoes: [{
                      tratativaAplicada: '',
                      dataAdequacao: null,
                      responsavelAcao: '',
                      funcaoResponsavel: '',
                      situacao: '',
                      status: ''
                    }]
                  });
                  setActiveTab("identificacao");
                }}
              >
                Registrar nova ocorrência
              </Button>
            )}
            <Button 
              asChild
              onClick={() => {
                if (isEditMode) {
                  navigate(`/ocorrencias/detalhes/${ocorrenciaId}`);
                }
              }}
            >
              <Link to={isEditMode ? `/ocorrencias/detalhes/${ocorrenciaId}` : "/"}>
                {isEditMode ? "Ver detalhes" : "Menu principal"}
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OcorrenciasCadastro;
