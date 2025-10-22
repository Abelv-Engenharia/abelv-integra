import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { format } from "date-fns";

interface Veiculo {
  id: string;
  status: string;
  locadora_nome?: string;
  locadora?: { id: string; nome: string };
  tipo_locacao: string;
  placa: string;
  modelo: string;
  franquia_km: string;
  condutor_principal_nome?: string;
  condutor?: { id: string; nome_condutor: string };
  data_retirada: string;
  data_devolucao: string;
  created_at?: string;
}

interface VisualizarVeiculoModalProps {
  veiculo: Veiculo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditar?: () => void;
}

export function VisualizarVeiculoModal({ veiculo, open, onOpenChange, onEditar }: VisualizarVeiculoModalProps) {
  if (!veiculo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalhes do Veículo</DialogTitle>
            {onEditar && (
              <Button variant="outline" size="sm" onClick={onEditar}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dados Básicos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados Básicos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={veiculo.status === "Ativo" ? "default" : "secondary"}>
                    {veiculo.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Locadora</label>
                <p className="text-sm mt-1">{veiculo.locadora?.nome || veiculo.locadora_nome || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo de Locação</label>
                <p className="text-sm mt-1">{veiculo.tipo_locacao}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Placa</label>
                <p className="text-sm mt-1 font-mono">{veiculo.placa}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                <p className="text-sm mt-1">{veiculo.modelo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Franquia Km</label>
                <p className="text-sm mt-1">{veiculo.franquia_km}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dados da Locação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados da Locação</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Condutor Principal</label>
                <p className="text-sm mt-1">{veiculo.condutor?.nome_condutor || veiculo.condutor_principal_nome || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Retirada</label>
                <p className="text-sm mt-1">{format(new Date(veiculo.data_retirada), "dd/MM/yyyy")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Devolução</label>
                <p className="text-sm mt-1">{format(new Date(veiculo.data_devolucao), "dd/MM/yyyy")}</p>
              </div>
              {veiculo.created_at && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cadastrado em</label>
                  <p className="text-sm mt-1">{format(new Date(veiculo.created_at), "dd/MM/yyyy HH:mm")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
