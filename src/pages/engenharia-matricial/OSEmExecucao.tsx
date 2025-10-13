import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import FinalizacaoOSModal from "@/components/engenharia-matricial/FinalizacaoOSModal";
import { useState } from "react";
import { useOSList } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";

export default function OSEmExecucao() {
  const { data: osList = [], isLoading } = useOSList({ status: "em-execucao" });

  const capitalizarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center py-8">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">OS Em execução</h1>
          <p className="text-muted-foreground">
            {osList.length} ordem{osList.length !== 1 ? "s" : ""} de serviço em execução
          </p>
        </div>
      </div>

      {osList.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma OS em execução encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {osList.map((os) => (
            <Card key={os.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    OS Nº {os.numero || os.id} - CCA {os.cca?.codigo || "N/A"}
                    <Badge variant="default">Em execução</Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Link to="/os-em-fechamento">
                      <Button variant="default" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Iniciar fechamento
                      </Button>
                    </Link>
                    <Link to="/os-replanejamento">
                      <Button variant="outline" size="sm" className="text-orange-600 hover:text-orange-700">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Replanejar
                      </Button>
                    </Link>
                    <Link to={`/engenharia-matricial/os/${os.id}`}>
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
                      {os.hh_planejado + (os.hh_adicional || 0)}h
                      {os.hh_adicional && os.hh_adicional > 0 && (
                        <span className="text-orange-600 text-xs ml-1">(+{os.hh_adicional}h adicional)</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor estimado</p>
                    <p className="font-medium">
                      {formatCurrency((os.hh_planejado + (os.hh_adicional || 0)) * (os.valor_hora_hh || 95))}
                    </p>
                  </div>
                  {os.data_inicio_prevista && os.data_fim_prevista && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Período previsto</p>
                      <p className="font-medium">
                        {formatDate(os.data_inicio_prevista)} - {formatDate(os.data_fim_prevista)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável EM</p>
                    <p className="font-medium">{os.responsavel_em?.nome || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solicitante</p>
                    <p className="font-medium">{os.solicitante_nome}</p>
                  </div>
                </div>

                {/* Histórico de Replanejamentos - não implementado no banco ainda */}

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
