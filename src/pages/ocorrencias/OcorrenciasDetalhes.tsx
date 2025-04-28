
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock data for a single occurrence
const mockOcorrencia = {
  id: "1",
  // Identificação
  data: "2023-05-15",
  hora: "10:30",
  mes: "Maio",
  ano: "2023",
  cca: "CCA-001",
  empresa: "Empresa A",
  disciplina: "Elétrica",
  engenheiroResponsavel: "João Silva",
  supervisorResponsavel: "Carlos Pereira",
  encarregadoResponsavel: "Antonio Oliveira",
  colaboradoresAcidentados: [
    { nome: "José da Silva", funcao: "Eletricista", matricula: "12345" }
  ],
  tipoOcorrencia: "Acidente com Afastamento",
  tipoEvento: "Queda de Altura",
  classificacaoOcorrencia: "Grave",
  
  // Informações da Ocorrência
  houveAfastamento: "Sim",
  diasPerdidos: 5,
  diasDebitados: 2,
  parteCorpoAtingida: "Cabeça",
  lateralidade: "Não aplicável",
  agenteCausador: "Escada",
  situacaoGeradora: "Escorregamento",
  naturezaLesao: "Fratura",
  descricaoOcorrencia: "FUNCIONÁRIO ESCORREGOU DA ESCADA DURANTE MANUTENÇÃO ELÉTRICA.",
  numeroCat: "123456",
  cid: "S52",
  catFile: "cat_123456.pdf",
  
  // Classificação de Risco
  exposicao: "3",
  controle: "2",
  deteccao: "2",
  efeitoFalha: "4",
  impacto: "3",
  probabilidade: 7,
  severidade: 7,
  classificacaoRisco: "INTOLERÁVEL",
  
  // Plano de Ação
  acoesCorretivas: [
    {
      id: "1",
      tratativa: "REALIZAR TREINAMENTO SOBRE TRABALHO EM ALTURA.",
      dataAdequacao: "2023-06-15",
      responsavel: "Carlos Pereira",
      funcao: "Supervisor",
      situacao: "Em tratativa",
      status: "Em andamento",
    },
    {
      id: "2",
      tratativa: "SUBSTITUIR ESCADAS ANTIGAS POR MODELOS ANTIDERRAPANTES.",
      dataAdequacao: "2023-07-01",
      responsavel: "Patricia Souza",
      funcao: "Coordenadora de Segurança",
      situacao: "Tratado",
      status: "Concluído",
    }
  ],
  
  // Fechamento
  investigacaoRealizada: "Sim",
  informePreliminarFile: "informe_123.pdf",
  raiFile: "rai_123.pdf",
  licoesAprendidas: "Sim",
  licoesAprendidasFile: "licoes_123.pdf",
};

// Function to get the background and text colors for the risk classification
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
  const [ocorrencia] = useState(mockOcorrencia); // In a real app, fetch by ID

  const handleEdit = () => {
    navigate(`/ocorrencias/editar/${id}`);
  };

  const handleUpdatePlanoAcao = () => {
    toast.success("Plano de ação atualizado com sucesso!");
  };

  const handleBack = () => {
    navigate("/ocorrencias/consulta");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Detalhes da Ocorrência</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleBack}>
            Voltar
          </Button>
          <Button onClick={handleEdit}>
            Editar Ocorrência
          </Button>
        </div>
      </div>

      <Tabs defaultValue="identificacao">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="identificacao">Identificação</TabsTrigger>
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="risco">Classificação de Risco</TabsTrigger>
          <TabsTrigger value="plano">Plano de Ação</TabsTrigger>
          <TabsTrigger value="fechamento">Fechamento</TabsTrigger>
        </TabsList>

        {/* Aba de Identificação */}
        <TabsContent value="identificacao">
          <Card>
            <CardHeader>
              <CardTitle>Identificação da Ocorrência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Data</p>
                  <p>{new Date(ocorrencia.data).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Hora</p>
                  <p>{ocorrencia.hora}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Mês/Ano</p>
                  <p>{ocorrencia.mes}/{ocorrencia.ano}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">CCA</p>
                  <p>{ocorrencia.cca}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Empresa</p>
                  <p>{ocorrencia.empresa}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Disciplina</p>
                  <p>{ocorrencia.disciplina}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Engenheiro Responsável</p>
                  <p>{ocorrencia.engenheiroResponsavel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Supervisor Responsável</p>
                  <p>{ocorrencia.supervisorResponsavel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Encarregado Responsável</p>
                  <p>{ocorrencia.encarregadoResponsavel}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Colaboradores Acidentados</p>
                {ocorrencia.colaboradoresAcidentados.map((colaborador, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md mb-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nome</p>
                        <p>{colaborador.nome}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Função</p>
                        <p>{colaborador.funcao}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Matrícula</p>
                        <p>{colaborador.matricula}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo da Ocorrência</p>
                  <p>{ocorrencia.tipoOcorrencia}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo do Evento</p>
                  <p>{ocorrencia.tipoEvento}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Classificação da Ocorrência</p>
                  <p>{ocorrencia.classificacaoOcorrencia}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Informações da Ocorrência */}
        <TabsContent value="informacoes">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Ocorrência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Houve Afastamento</p>
                  <p>{ocorrencia.houveAfastamento}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dias Perdidos</p>
                  <p>{ocorrencia.diasPerdidos}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dias Debitados</p>
                  <p>{ocorrencia.diasDebitados}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Parte do Corpo Atingida</p>
                  <p>{ocorrencia.parteCorpoAtingida}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Lateralidade</p>
                  <p>{ocorrencia.lateralidade}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-500">Agente Causador</p>
                <p>{ocorrencia.agenteCausador}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Situação Geradora</p>
                <p>{ocorrencia.situacaoGeradora}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Natureza da Lesão</p>
                <p>{ocorrencia.naturezaLesao}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Descrição da Ocorrência</p>
                <p className="bg-gray-50 p-3 rounded-md">{ocorrencia.descricaoOcorrencia}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Número da CAT</p>
                  <p>{ocorrencia.numeroCat}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">CID</p>
                  <p>{ocorrencia.cid}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">CAT</p>
                <div className="flex items-center mt-1">
                  <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2">{ocorrencia.catFile}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Classificação de Risco */}
        <TabsContent value="risco">
          <Card>
            <CardHeader>
              <CardTitle>Classificação de Risco</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Probabilidade</h3>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Exposição</p>
                    <p>{ocorrencia.exposicao === "1" ? "1 - Baixa" : ocorrencia.exposicao === "2" ? "2 - Média" : "3 - Alta"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Controle</p>
                    <p>
                      {ocorrencia.controle === "0" ? "0 - Excelente" : 
                       ocorrencia.controle === "1" ? "1 - Essencial" : 
                       ocorrencia.controle === "2" ? "2 - Precário" : "3 - Inexistente"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Detecção</p>
                    <p>{ocorrencia.deteccao === "1" ? "1 - Fácil" : ocorrencia.deteccao === "2" ? "2 - Moderada" : "3 - Difícil"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Severidade</h3>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Efeito de Falha</p>
                    <p>
                      {ocorrencia.efeitoFalha === "1" ? "1 - Muito baixa" : 
                       ocorrencia.efeitoFalha === "2" ? "2 - Baixa" : 
                       ocorrencia.efeitoFalha === "3" ? "3 - Média" : 
                       ocorrencia.efeitoFalha === "4" ? "4 - Alta" : "5 - Muito Alta"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Impacto</p>
                    <p>{ocorrencia.impacto === "1" ? "1 - Baixo" : ocorrencia.impacto === "2" ? "2 - Médio" : "3 - Alto"}</p>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Gradação de Risco</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
                      <p className="text-sm font-medium text-gray-800">Probabilidade</p>
                      <p className="text-2xl font-bold">{ocorrencia.probabilidade}</p>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
                      <p className="text-sm font-medium text-gray-800">Severidade</p>
                      <p className="text-2xl font-bold">{ocorrencia.severidade}</p>
                    </div>
                    
                    <div className={`p-4 rounded-md border ${getRiscoClassColor(ocorrencia.classificacaoRisco)}`}>
                      <p className="text-sm font-medium">Classificação</p>
                      <p className="text-2xl font-bold">{ocorrencia.classificacaoRisco}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Legendas de Classificação</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#34C6F4] mr-2" />
                        <span className="text-sm">TRIVIAL (≤10)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#92D050] mr-2" />
                        <span className="text-sm">TOLERÁVEL (≤21)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#FFE07D] mr-2" />
                        <span className="text-sm">MODERADO (≤40)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#FFC000] mr-2" />
                        <span className="text-sm">SUBSTANCIAL (≤56)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#D13F3F] mr-2" />
                        <span className="text-sm">INTOLERÁVEL ({`>`}56)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Plano de Ação */}
        <TabsContent value="plano">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Plano de Ação</span>
                <Button onClick={handleUpdatePlanoAcao}>Atualizar Plano de Ação</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {ocorrencia.acoesCorretivas.map((acao, index) => (
                <div key={acao.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium mb-3">Ação {index + 1}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tratativa Aplicada</p>
                      <p>{acao.tratativa}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data para Adequação</p>
                        <p>{new Date(acao.dataAdequacao).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Responsável</p>
                        <p>{acao.responsavel}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Função</p>
                        <p>{acao.funcao}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Situação</p>
                        <p>{acao.situacao}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          acao.status === 'Em andamento' 
                            ? 'bg-blue-100 text-blue-800' 
                            : acao.status === 'Pendente'
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {acao.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Fechamento da Ocorrência */}
        <TabsContent value="fechamento">
          <Card>
            <CardHeader>
              <CardTitle>Fechamento da Ocorrência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Status do Plano de Ação</p>
                <div className="mt-2">
                  {ocorrencia.acoesCorretivas.map((acao, index) => (
                    <div key={acao.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <p>Ação {index + 1}: {acao.tratativa.substring(0, 50)}...</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        acao.status === 'Em andamento' 
                          ? 'bg-blue-100 text-blue-800' 
                          : acao.status === 'Pendente'
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {acao.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-500">Investigação realizada em acordo com o PRO-SMS-08?</p>
                <p>{ocorrencia.investigacaoRealizada}</p>
              </div>

              {ocorrencia.investigacaoRealizada === "Sim" && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Informe Preliminar</p>
                    <div className="flex items-center mt-1">
                      <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="ml-2">{ocorrencia.informePreliminarFile}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Relatório de Análise e Investigação (RAI)</p>
                    <div className="flex items-center mt-1">
                      <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="ml-2">{ocorrencia.raiFile}</span>
                    </div>
                  </div>
                </>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500">Lições Aprendidas Enviada?</p>
                <p>{ocorrencia.licoesAprendidas}</p>
              </div>

              {ocorrencia.licoesAprendidas === "Sim" && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Lições Aprendidas</p>
                  <div className="flex items-center mt-1">
                    <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="ml-2">{ocorrencia.licoesAprendidasFile}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OcorrenciasDetalhes;
