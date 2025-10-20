import { Calendar, User, Building, Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FeriasStatusBadge } from "./FeriasStatusBadge";
import { ControleFérias, StatusFerias } from "@/types/ferias";

interface VisualizarFeriasModalProps {
  aberto: boolean;
  ferias: ControleFérias;
  onFechar: () => void;
}

export function VisualizarFeriasModal({ aberto, ferias, onFechar }: VisualizarFeriasModalProps) {
  const calcularDiasRestantes = () => {
    const hoje = new Date();
    const inicio = new Date(ferias.dataInicioFerias);
    const diferenca = Math.ceil((inicio.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    return diferenca;
  };

  const diasRestantes = calcularDiasRestantes();

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Férias — {ferias.nomePrestador} — {ferias.obraLocalAtuacao}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Alertas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FeriasStatusBadge status={ferias.status} />
              {diasRestantes > 0 && diasRestantes <= 15 && (
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  Inicia em {diasRestantes} dias
                </Badge>
              )}
              {diasRestantes === 0 && (
                <Badge variant="default">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Inicia hoje
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações do Prestador */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informações do Prestador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="font-medium">{ferias.nomePrestador}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                  <p>{ferias.empresa}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Função / Cargo</p>
                  <p>{ferias.funcaoCargo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Obra / Local</p>
                  <p>{ferias.obraLocalAtuacao}</p>
                </div>
              </CardContent>
            </Card>

            {/* Informações das Férias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Detalhes das Férias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Início das Férias</p>
                  <p className="font-medium">
                    {format(ferias.dataInicioFerias, "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dias de Férias</p>
                  <p className="font-medium">{ferias.diasFerias} dias</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Período Aquisitivo</p>
                  <p>{ferias.periodoAquisitivo}</p>
                </div>
              </CardContent>
            </Card>

            {/* Responsáveis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Responsáveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Responsável pelo Registro</p>
                  <p>{ferias.responsavelRegistro}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Responsável Direto</p>
                  <p>{ferias.responsavelDireto}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                  <p>{format(ferias.dataCriacao, "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                </div>
                {ferias.dataAprovacao && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Aprovação</p>
                    <p>{format(ferias.dataAprovacao, "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Observações e Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ferias.observacoes ? (
                  <div>
                    <p className="text-sm">{ferias.observacoes}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhuma observação registrada</p>
                )}

                {ferias.justificativaReprovacao && (
                  <div className="bg-destructive/10 p-3 rounded-lg">
                    <p className="text-sm font-medium text-destructive flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Motivo da Reprovação
                    </p>
                    <p className="text-sm mt-1">{ferias.justificativaReprovacao}</p>
                  </div>
                )}

                {ferias.anexos && ferias.anexos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Anexos</p>
                    <div className="space-y-2">
                      {ferias.anexos.map((anexo, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4" />
                          <span>{anexo}</span>
                          <Button variant="ghost" size="sm">
                            Baixar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline de Status (se houver histórico) */}
          {ferias.historicoStatus && ferias.historicoStatus.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Status</CardTitle>
                <CardDescription>Timeline de mudanças de status das férias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ferias.historicoStatus.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FeriasStatusBadge status={item.status} />
                          <span className="text-sm text-muted-foreground">
                            {format(item.data, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Por: {item.usuario}</p>
                        {item.observacao && (
                          <p className="text-sm">{item.observacao}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações de Aprovação */}
          {ferias.status === StatusFerias.AGUARDANDO_APROVACAO && (
            <Card>
              <CardHeader>
                <CardTitle>Ações de Aprovação</CardTitle>
                <CardDescription>Aprovar ou reprovar esta solicitação de férias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button variant="destructive">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reprovar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onFechar}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}