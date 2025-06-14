import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, User } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Funcionario,
  TreinamentoNormativo,
  Treinamento
} from "@/types/treinamentos";
import { calcularStatusTreinamento, formatarData, fetchFuncionarios, fetchTreinamentos, getNomeTreinamento } from "@/utils/treinamentosUtils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ccaService } from "@/services/treinamentos/ccaService";

const TreinamentosCracha = () => {
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string | undefined>();
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [treinamentosValidos, setTreinamentosValidos] = useState<TreinamentoNormativo[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [treinamentosInfo, setTreinamentosInfo] = useState<Treinamento[]>([]);
  const [ccas, setCcas] = useState<{ id: number; codigo: string; nome: string }[]>([]);
  const [selectedCcaId, setSelectedCcaId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const crachaRef = useRef<HTMLDivElement | null>(null);

  // Fetch funcionarios data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [funcionariosData, treinamentosData, ccasData] = await Promise.all([
          fetchFuncionarios(),
          fetchTreinamentos(),
          ccaService.getAll(),
        ]);
        setFuncionarios(funcionariosData);
        setTreinamentosInfo(treinamentosData);
        setCcas(ccasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Lista de funcionários filtrada por CCA selecionado
  const funcionariosFiltrados = selectedCcaId
    ? funcionarios.filter((f) => f.cca_id === selectedCcaId)
    : [];

  // Ao trocar o CCA, limpa seleção de funcionário e info dependentes
  const handleCcaChange = (ccaId: string) => {
    setSelectedCcaId(Number(ccaId));
    setSelectedFuncionarioId(undefined);
    setFuncionario(null);
    setTreinamentosValidos([]);
  };

  const handleFuncionarioChange = async (funcionarioId: string) => {
    setSelectedFuncionarioId(funcionarioId);
    setIsLoading(true);
    
    try {
      const selectedFuncionario = funcionariosFiltrados.find(f => f.id === funcionarioId);
      setFuncionario(selectedFuncionario || null);
      
      // Get valid trainings for this funcionario from Supabase
      const { data: treinamentosData, error } = await supabase
        .from('treinamentos_normativos')
        .select('*')
        .eq('funcionario_id', funcionarioId)
        .eq('arquivado', false);
      
      if (error) {
        console.error("Erro ao buscar treinamentos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os treinamentos do funcionário",
          variant: "destructive",
        });
        setTreinamentosValidos([]);
        return;
      }
      
      // Process trainings
      const treinamentosProcessados = await Promise.all(treinamentosData.map(async (t) => {
        const dataRealizacao = t.data_realizacao;
        const dataValidade = t.data_validade;
        const status = calcularStatusTreinamento(new Date(dataValidade));
        const treinamentoNome = await getNomeTreinamento(t.treinamento_id);
        
        return {
          id: t.id,
          funcionario_id: t.funcionario_id,
          treinamento_id: t.treinamento_id,
          tipo: t.tipo as 'Formação' | 'Reciclagem',
          data_realizacao: dataRealizacao,
          data_validade: dataValidade,
          certificado_url: t.certificado_url,
          status: status,
          arquivado: t.arquivado,
          treinamentoNome
        };
      }));
      
      // Filter valid or about to expire trainings
      const treinamentosValidos = treinamentosProcessados
        .filter(t => t.status === "Válido" || t.status === "Próximo ao vencimento")
        .sort((a, b) => new Date(a.data_validade).getTime() - new Date(b.data_validade).getTime());
      
      setTreinamentosValidos(treinamentosValidos);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar os dados",
        variant: "destructive",
      });
      setTreinamentosValidos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!funcionario) {
      toast({
        title: "Aviso",
        description: "Selecione um funcionário para gerar o crachá",
        variant: "destructive",
      });
      return;
    }
    
    if (treinamentosValidos.length === 0) {
      toast({
        title: "Aviso",
        description: "O funcionário não possui treinamentos válidos para emissão de crachá",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Imprimindo",
      description: "Enviando crachá para impressão...",
    });
    
    // Implementação da funcionalidade de impressão
    if (crachaRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        
        // Adicionar estilos para impressão que mantêm o layout exato do preview
        const style = document.createElement('style');
        style.innerHTML = `
          @page {
            size: 100mm 160mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: white;
          }
          .cracha-container {
            width: 100mm;
            height: 160mm;
            box-sizing: border-box;
            padding: 5mm;
            margin: 0 auto;
            page-break-after: always;
            display: flex;
            flex-direction: column;
          }
          .header {
            background-color: hsl(222.2, 47.4%, 11.2%);
            color: white;
            text-align: center;
            padding: 10px;
            border-radius: 4px 4px 0 0;
            margin-bottom: 15px;
          }
          .header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .profile {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
          }
          .photo {
            width: 80px;
            height: 80px;
            background-color: #f3f4f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
          }
          .photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .photo svg {
            width: 40px;
            height: 40px;
            color: #9ca3af;
          }
          .info {
            display: flex;
            flex-direction: column;
          }
          .info h4 {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 5px 0;
          }
          .info p {
            margin: 0 0 5px 0;
            font-size: 14px;
          }
          .info .matricula {
            font-size: 12px;
            color: #6b7280;
          }
          .certifications {
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
            margin-top: 10px;
            flex-grow: 1;
          }
          .certifications h5 {
            font-size: 14px;
            text-align: center;
            margin-top: 0;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .certifications-table {
            width: 100%;
            font-size: 12px;
            border-collapse: collapse;
          }
          .certifications-table thead {
            border-bottom: 1px solid #e5e7eb;
          }
          .certifications-table th {
            text-align: left;
            padding: 5px;
            font-weight: 600;
          }
          .certifications-table th:last-child {
            text-align: right;
          }
          .certifications-table td {
            padding: 5px;
            border-bottom: 1px solid #e5e7eb;
          }
          .certifications-table td:last-child {
            text-align: right;
          }
          .footer {
            border-top: 1px solid #e5e7eb;
            margin-top: auto;
            padding-top: 8px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
          }
          .empty-message {
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            margin-top: 20px;
          }
        `;

        // Criar HTML para impressão usando o design exato do preview
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Crachá de Capacitação - ${funcionario.nome}</title>
            ${style.outerHTML}
          </head>
          <body>
            <div class="cracha-container">
              <div class="header">
                <h3>Crachá de Capacitação</h3>
              </div>
              
              <div class="profile">
                <div class="photo">
                  ${funcionario.foto 
                    ? `<img src="${funcionario.foto}" alt="${funcionario.nome}" />` 
                    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
                  }
                </div>
                
                <div class="info">
                  <h4>${funcionario.nome}</h4>
                  <p>${funcionario.funcao}</p>
                  <p class="matricula">Matrícula: ${funcionario.matricula}</p>
                </div>
              </div>
              
              <div class="certifications">
                <h5>Certificações Válidas</h5>
                
                ${treinamentosValidos.length > 0 
                  ? `<table class="certifications-table">
                      <thead>
                        <tr>
                          <th>Treinamento</th>
                          <th>Validade</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${treinamentosValidos.map(treinamento => `
                          <tr>
                            <td>${treinamento.treinamentoNome || 'Treinamento não encontrado'}</td>
                            <td>${formatarData(treinamento.data_validade)}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>`
                  : `<p class="empty-message">Sem treinamentos válidos</p>`
                }
              </div>
              
              <div class="footer">
                <p>Emitido em ${format(new Date(), "dd/MM/yyyy")}</p>
              </div>
            </div>
          </body>
          </html>
        `);
        
        printWindow.document.close();
        
        // Delay para garantir que o conteúdo foi renderizado antes de imprimir
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link to="/treinamentos/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Emissão de Crachá de Capacitação</h1>
      </div>

      {isLoading && !selectedFuncionarioId ? (
        <div className="flex justify-center items-center py-8">
          <p>Carregando dados...</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Selecione o Funcionário</CardTitle>
              <CardDescription>
                Escolha um CCA e um funcionário para gerar o crachá de capacitação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Campo seleção de CCA */}
                <div className="w-full md:w-1/2">
                  <Select onValueChange={handleCcaChange} value={selectedCcaId ? String(selectedCcaId) : undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um CCA" />
                    </SelectTrigger>
                    <SelectContent>
                      {ccas.map((cca) => (
                        <SelectItem key={cca.id} value={String(cca.id)}>
                          {cca.codigo} - {cca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Campo seleção de funcionário, filtrado por CCA */}
                <div className="w-full md:w-1/2">
                  <Select
                    onValueChange={handleFuncionarioChange}
                    value={selectedFuncionarioId}
                    disabled={!selectedCcaId || funcionariosFiltrados.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCcaId ? (funcionariosFiltrados.length > 0 ? "Selecione um funcionário" : "Nenhum funcionário disponível") : "Selecione um CCA primeiro"} />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionariosFiltrados.map((funcionario) => (
                        <SelectItem key={funcionario.id} value={funcionario.id}>
                          {funcionario.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {funcionario && (
                  <div className="flex flex-1 gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Função</p>
                      <p className="font-medium border rounded-md px-3 py-2">{funcionario.funcao}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Matrícula</p>
                      <p className="font-medium border rounded-md px-3 py-2">{funcionario.matricula}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Employee information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Funcionário</CardTitle>
                <CardDescription>
                  Dados do funcionário e treinamentos válidos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading && selectedFuncionarioId ? (
                  <div className="flex justify-center items-center py-8">
                    <p>Carregando dados do funcionário...</p>
                  </div>
                ) : funcionario ? (
                  <>
                    <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                        {funcionario.foto ? (
                          <img 
                            src={funcionario.foto} 
                            alt={funcionario.nome} 
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Nome</p>
                          <p className="font-medium">{funcionario.nome}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Função</p>
                          <p>{funcionario.funcao}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Matrícula</p>
                          <p>{funcionario.matricula}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Treinamentos Válidos</h3>
                      {treinamentosValidos.length > 0 ? (
                        <ul className="space-y-2">
                          {treinamentosValidos.map(treinamento => (
                            <li key={treinamento.id} className="flex justify-between items-center">
                              <span>{treinamento.treinamentoNome}</span>
                              <span className="text-sm">
                                Válido até {formatarData(treinamento.data_validade)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">
                          Este funcionário não possui treinamentos válidos.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <User className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-muted-foreground">
                      Selecione um funcionário para ver suas informações
                    </p>
                  </div>
                )}
              </CardContent>
              {funcionario && treinamentosValidos.length > 0 && (
                <CardFooter>
                  <Button onClick={handlePrint} className="gap-1">
                    <Printer className="h-4 w-4" />
                    Gerar crachá de capacitação
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* Right side - Badge preview */}
            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização do Crachá</CardTitle>
                <CardDescription>
                  Como ficará o crachá de capacitação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  ref={crachaRef} 
                  className="bg-white border rounded-lg shadow-md p-4 w-full max-w-sm mx-auto aspect-[9/16]"
                >
                  {funcionario ? (
                    <div className="flex flex-col h-full">
                      <div className="bg-primary text-white text-center py-3 rounded-t-md">
                        <h3 className="font-bold uppercase">Crachá de Capacitação</h3>
                      </div>
                      
                      <div className="flex items-start gap-4 my-4">
                        <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          {funcionario.foto ? (
                            <img 
                              src={funcionario.foto} 
                              alt={funcionario.nome} 
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <User className="w-14 h-14 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex flex-col">
                          <h4 className="font-bold text-lg">{funcionario.nome}</h4>
                          <p className="text-gray-600">{funcionario.funcao}</p>
                          <p className="text-sm text-gray-500">Matrícula: {funcionario.matricula}</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 mt-2 flex-grow">
                        <h5 className="font-semibold text-center mb-2">Certificações Válidas</h5>
                        
                        {isLoading ? (
                          <p className="text-center text-sm text-muted-foreground">Carregando treinamentos...</p>
                        ) : treinamentosValidos.length > 0 ? (
                          <div className="overflow-auto max-h-[200px]">
                            <table className="text-sm w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-1">Treinamento</th>
                                  <th className="text-right py-1">Validade</th>
                                </tr>
                              </thead>
                              <tbody>
                                {treinamentosValidos.map(treinamento => (
                                  <tr key={treinamento.id} className="border-b">
                                    <td className="py-2 text-left">
                                      {treinamento.treinamentoNome}
                                    </td>
                                    <td className="py-2 text-right">
                                      {formatarData(treinamento.data_validade)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-center text-sm text-muted-foreground">
                            Sem treinamentos válidos
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-auto border-t pt-3">
                        <p className="text-center text-xs text-gray-500">
                          Emitido em {format(new Date(), "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <User className="w-16 h-16 mb-4" />
                      <p className="text-center">
                        Selecione um funcionário para visualizar o crachá
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              {funcionario && treinamentosValidos.length > 0 && (
                <CardFooter className="justify-center">
                  <Button onClick={handlePrint} variant="outline" className="gap-1">
                    <Printer className="h-4 w-4" />
                    Imprimir crachá
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default TreinamentosCracha;
