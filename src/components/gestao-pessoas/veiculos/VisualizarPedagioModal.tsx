import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { format } from "date-fns";

interface Pedagio {
  id: string;
  data_utilizacao: string;
  tipo_servico: string;
  placa: string;
  condutor_nome: string;
  valor: number;
  local: string;
  horario?: string;
  cca_id?: number;
  finalidade?: string;
  created_at?: string;
}

interface VisualizarPedagioModalProps {
  pedagio: Pedagio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditar?: () => void;
}

export function VisualizarPedagioModal({ pedagio, open, onOpenChange, onEditar }: VisualizarPedagioModalProps) {
  if (!pedagio) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalhes da Transação</DialogTitle>
            {onEditar && (
              <Button variant="outline" size="sm" onClick={onEditar}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dados da Transação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados da Transação</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data</label>
                <p className="text-sm mt-1">{format(new Date(pedagio.data_utilizacao), "dd/MM/yyyy")}</p>
              </div>
              {pedagio.horario && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Horário</label>
                  <p className="text-sm mt-1">{pedagio.horario}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <div className="mt-1">
                  <Badge variant="outline">
                    {pedagio.tipo_servico === "pedágio" ? "Pedágio" : "Estacionamento"}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Valor</label>
                <p className="text-sm mt-1">
                  R$ {pedagio.valor?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Veículo e Condutor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Veículo e Condutor</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Placa</label>
                <p className="text-sm mt-1 font-mono">{pedagio.placa}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Condutor</label>
                <p className="text-sm mt-1">{pedagio.condutor_nome}</p>
              </div>
            </CardContent>
          </Card>

          {/* Local */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Local</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{pedagio.local}</p>
            </CardContent>
          </Card>

          {/* Dados Adicionais */}
          {(pedagio.cca_id || pedagio.finalidade) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dados Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {pedagio.cca_id && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">CCA (ID)</label>
                    <p className="text-sm mt-1">{pedagio.cca_id}</p>
                  </div>
                )}
                {pedagio.finalidade && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Finalidade</label>
                    <p className="text-sm mt-1">{pedagio.finalidade}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadados */}
          {pedagio.created_at && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações de Cadastro</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cadastrado em</label>
                  <p className="text-sm mt-1">{format(new Date(pedagio.created_at), "dd/MM/yyyy HH:mm")}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
