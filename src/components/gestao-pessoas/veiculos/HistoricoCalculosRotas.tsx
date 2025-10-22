import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalculoEstimativaCartao } from "@/types/gestao-pessoas/route";
import { generateRouteReportPDF } from "./GenerateRouteReportPDF";
import { toast } from "@/hooks/use-toast";

interface HistoricoCalculosRotasProps {
  calculos: CalculoEstimativaCartao[];
  onExcluir: (id: string) => void;
  isLoading?: boolean;
}

export function HistoricoCalculosRotas({ calculos, onExcluir, isLoading }: HistoricoCalculosRotasProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Cálculos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  if (calculos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Cálculos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum cálculo salvo ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Cálculos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Distância Mensal</TableHead>
                <TableHead>Estimativa</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead>Limite Cartão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculos.map((calculo) => {
                const statusSuficiente = calculo.limiteAtualCartao 
                  ? calculo.custoEstimadoComMargem <= calculo.limiteAtualCartao
                  : null;

                return (
                  <TableRow key={calculo.id}>
                    <TableCell>
                      {format(new Date(calculo.dataCalculo), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{calculo.placa}</p>
                        <p className="text-sm text-muted-foreground">{calculo.modelo}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {calculo.distanciaTotalMensalKm.toLocaleString('pt-BR')} km
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          R$ {calculo.custoEstimadoComMargem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Base: R$ {calculo.custoEstimadoBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{calculo.margemSegurancaPct}%</TableCell>
                    <TableCell>
                      {calculo.limiteAtualCartao ? (
                        `R$ ${calculo.limiteAtualCartao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {statusSuficiente !== null && (
                        <Badge variant={statusSuficiente ? "default" : "destructive"}>
                          {statusSuficiente ? "Suficiente" : "Insuficiente"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            generateRouteReportPDF(calculo);
                            toast({
                              title: "PDF exportado",
                              description: "O relatório foi baixado com sucesso"
                            });
                          }}
                          title="Exportar PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onExcluir(calculo.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
