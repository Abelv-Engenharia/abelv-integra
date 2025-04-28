
import React, { useState, useRef } from "react";
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
  MOCK_FUNCIONARIOS, 
  MOCK_TREINAMENTOS, 
  MOCK_TREINAMENTOS_NORMATIVOS,
  Funcionario,
  TreinamentoNormativo
} from "@/types/treinamentos";
import { calcularStatusTreinamento, formatarData } from "@/utils/treinamentosUtils";
import { toast } from "@/hooks/use-toast";

const TreinamentosCracha = () => {
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string | undefined>();
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [treinamentosValidos, setTreinamentosValidos] = useState<TreinamentoNormativo[]>([]);
  const crachaRef = useRef<HTMLDivElement | null>(null);

  const handleFuncionarioChange = (funcionarioId: string) => {
    setSelectedFuncionarioId(funcionarioId);
    
    // Find funcionario
    const selectedFuncionario = MOCK_FUNCIONARIOS.find(f => f.id === funcionarioId);
    setFuncionario(selectedFuncionario || null);
    
    // Find valid trainings for this funcionario
    const treinamentos = MOCK_TREINAMENTOS_NORMATIVOS
      .filter(t => t.funcionarioId === funcionarioId && !t.arquivado)
      .map(t => ({
        ...t,
        status: calcularStatusTreinamento(t.dataValidade)
      }))
      .filter(t => t.status === "Válido" || t.status === "Próximo ao vencimento")
      .sort((a, b) => a.dataValidade.getTime() - b.dataValidade.getTime());
    
    setTreinamentosValidos(treinamentos);
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
    
    // Actual print would happen here
    // window.print();
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

      <Card>
        <CardHeader>
          <CardTitle>Selecione o Funcionário</CardTitle>
          <CardDescription>
            Escolha um funcionário para gerar o crachá de capacitação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <Select onValueChange={handleFuncionarioChange} value={selectedFuncionarioId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funcionário" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_FUNCIONARIOS.map((funcionario) => (
                  <SelectItem key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome} - {funcionario.matricula}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {funcionario ? (
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
                      {treinamentosValidos.map(treinamento => {
                        const treinamentoInfo = MOCK_TREINAMENTOS.find(
                          t => t.id === treinamento.treinamentoId
                        );
                        return (
                          <li key={treinamento.id} className="flex justify-between items-center">
                            <span>{treinamentoInfo?.nome}</span>
                            <span className="text-sm">
                              Válido até {formatarData(treinamento.dataValidade)}
                            </span>
                          </li>
                        );
                      })}
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
                    
                    {treinamentosValidos.length > 0 ? (
                      <div className="overflow-auto max-h-[200px]">
                        <table className="text-sm w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-1">Treinamento</th>
                              <th className="text-right py-1">Validade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {treinamentosValidos.map(treinamento => {
                              const treinamentoInfo = MOCK_TREINAMENTOS.find(
                                t => t.id === treinamento.treinamentoId
                              );
                              return (
                                <tr key={treinamento.id} className="border-b">
                                  <td className="py-2 text-left">
                                    {treinamentoInfo?.nome}
                                  </td>
                                  <td className="py-2 text-right">
                                    {formatarData(treinamento.dataValidade)}
                                  </td>
                                </tr>
                              );
                            })}
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
    </div>
  );
};

export default TreinamentosCracha;
