import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, RotateCcw } from "lucide-react";
import { useOS } from "@/contexts/OSContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import FinalizacaoOSModal from "@/components/FinalizacaoOSModal";
import { useState } from "react";

export default function OSEmExecucao() {
  const { osList } = useOS();
  
  const osEmExecucao = osList.filter(os => os.status === "em-execucao");

  const capitalizarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">OS Em execução</h1>
          <p className="text-muted-foreground">
            {osEmExecucao.length} ordem{osEmExecucao.length !== 1 ? 's' : ''} de serviço em execução
          </p>
        </div>
      </div>

      {osEmExecucao.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma OS em execução encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {osEmExecucao.map((os) => (
            <Card key={os.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    OS Nº {os.numero || os.id} - CCA {os.cca}
                    <Badge variant="default">
                      Em execução
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Link to="/os-em-fechamento">
                      <Button 
                        variant="default" 
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Iniciar fechamento
                      </Button>
                    </Link>
                    <Link to="/os-replanejamento">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Replanejar
                      </Button>
                    </Link>
                    <Link to={`/os/${os.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{os.cliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disciplina</p>
                    <p className="font-medium">{capitalizarTexto(os.disciplina)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HH total</p>
                    <p className="font-medium">
                      {os.hhPlanejado + (os.hhAdicional || 0)}h
                      {os.hhAdicional && os.hhAdicional > 0 && (
                        <span className="text-orange-600 text-xs ml-1">
                          (+{os.hhAdicional}h adicional)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor estimado</p>
                    <p className="font-medium">
                      {formatCurrency((os.hhPlanejado + (os.hhAdicional || 0)) * 95)}
                    </p>
                  </div>
                  {os.dataInicioPrevista && os.dataFimPrevista && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Período previsto</p>
                      <p className="font-medium">
                        {formatDate(os.dataInicioPrevista)} - {formatDate(os.dataFimPrevista)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável EM</p>
                    <p className="font-medium">{os.responsavelEM}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solicitante</p>
                    <p className="font-medium">{os.nomeSolicitante}</p>
                  </div>
                </div>

                {/* Histórico de Replanejamentos */}
                {os.historicoReplanejamentos && os.historicoReplanejamentos.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Histórico de Replanejamentos ({os.historicoReplanejamentos.length})
                    </h4>
                    <div className="space-y-2">
                      {os.historicoReplanejamentos.map((replan, index) => (
                        <div key={index} className="text-sm border-l-2 border-orange-300 pl-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-orange-700">
                                Replanejamento #{index + 1}
                              </p>
                              <p className="text-orange-600">
                                +{replan.hhAdicional}h | {formatDate(replan.novaDataInicio)} - {formatDate(replan.novaDataFim)}
                              </p>
                              <p className="text-orange-600 text-xs">
                                {formatDate(replan.data)} por {replan.usuario}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-orange-600 mt-1">{replan.motivo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="text-sm">{os.descricao}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}