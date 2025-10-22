import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, FileCheck } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface Condutor {
  id: string;
  nome_condutor: string;
  cpf: string;
  numero_cnh?: string;
  categoria_cnh: string;
  validade_cnh: string;
  status_cnh: string;
  pontuacao_atual?: number;
  termo_anexado_url?: string;
  termo_anexado_nome?: string;
  observacao?: string;
  created_at?: string;
}

interface VisualizarCondutorModalProps {
  condutor: Condutor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditar?: () => void;
}

export function VisualizarCondutorModal({ condutor, open, onOpenChange, onEditar }: VisualizarCondutorModalProps) {
  if (!condutor) return null;

  const diasRestantes = differenceInDays(new Date(condutor.validade_cnh), new Date());
  const cnhVencida = diasRestantes < 0;
  const cnhVencendo = diasRestantes >= 0 && diasRestantes <= 30;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalhes do Condutor</DialogTitle>
            {onEditar && (
              <Button variant="outline" size="sm" onClick={onEditar}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                <p className="text-sm mt-1">{condutor.nome_condutor}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CPF</label>
                <p className="text-sm mt-1 font-mono">{condutor.cpf}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dados da CNH */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados da CNH</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {condutor.numero_cnh && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Número CNH</label>
                  <p className="text-sm mt-1 font-mono">{condutor.numero_cnh}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Categoria</label>
                <div className="mt-1">
                  <Badge variant="outline">{condutor.categoria_cnh}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Validade CNH</label>
                <p className="text-sm mt-1">{format(new Date(condutor.validade_cnh), "dd/MM/yyyy")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status CNH</label>
                <div className="mt-1">
                  {cnhVencida ? (
                    <Badge variant="destructive">Vencida</Badge>
                  ) : cnhVencendo ? (
                    <Badge className="bg-yellow-500">Vencendo em {diasRestantes} dias</Badge>
                  ) : (
                    <Badge variant="default">Válida</Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Pontuação Atual</label>
                <div className="mt-1">
                  <Badge variant={
                    (condutor.pontuacao_atual || 0) >= 20 ? "destructive" : 
                    (condutor.pontuacao_atual || 0) >= 10 ? "default" : 
                    "secondary"
                  }>
                    {condutor.pontuacao_atual || 0} pts
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Termo de Responsabilidade</label>
                <div className="mt-2">
                  {condutor.termo_anexado_url ? (
                    <a 
                      href={condutor.termo_anexado_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <FileCheck className="h-4 w-4" />
                      {condutor.termo_anexado_nome || "Termo anexado"}
                    </a>
                  ) : (
                    <Badge variant="secondary">Não anexado</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {condutor.observacao && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{condutor.observacao}</p>
              </CardContent>
            </Card>
          )}

          {/* Metadados */}
          {condutor.created_at && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações de Cadastro</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cadastrado em</label>
                  <p className="text-sm mt-1">{format(new Date(condutor.created_at), "dd/MM/yyyy HH:mm")}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
