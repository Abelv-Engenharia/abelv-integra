import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { format } from "date-fns";

interface Cartao {
  id: string;
  numero_cartao: string;
  bandeira: string;
  status: string;
  condutor_nome: string;
  placa: string;
  veiculo_modelo: string;
  data_validade: string;
  limite_credito: number;
  created_at?: string;
}

interface VisualizarCartaoModalProps {
  cartao: Cartao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditar?: () => void;
}

export function VisualizarCartaoModal({ cartao, open, onOpenChange, onEditar }: VisualizarCartaoModalProps) {
  if (!cartao) return null;

  const mascaraCartao = (numero: string) => {
    if (!numero || numero.length < 4) return numero;
    return `**** **** **** ${numero.slice(-4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalhes do Cartão</DialogTitle>
            {onEditar && (
              <Button variant="outline" size="sm" onClick={onEditar}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dados do Cartão */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados do Cartão</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Número do Cartão</label>
                <p className="text-sm mt-1 font-mono">{mascaraCartao(cartao.numero_cartao)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bandeira</label>
                <div className="mt-1">
                  <Badge variant="outline">{cartao.bandeira}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={cartao.status === "ativo" ? "default" : "secondary"}>
                    {cartao.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Validade</label>
                <p className="text-sm mt-1">{format(new Date(cartao.data_validade), "dd/MM/yyyy")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Limite de Crédito</label>
                <p className="text-sm mt-1">
                  R$ {cartao.limite_credito?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vinculação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vinculação</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Condutor</label>
                <p className="text-sm mt-1">{cartao.condutor_nome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Placa</label>
                <p className="text-sm mt-1 font-mono">{cartao.placa}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Modelo do Veículo</label>
                <p className="text-sm mt-1">{cartao.veiculo_modelo}</p>
              </div>
            </CardContent>
          </Card>

          {/* Metadados */}
          {cartao.created_at && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações de Cadastro</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cadastrado em</label>
                  <p className="text-sm mt-1">{format(new Date(cartao.created_at), "dd/MM/yyyy HH:mm")}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
