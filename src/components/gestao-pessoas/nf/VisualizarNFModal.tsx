import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NotaFiscal } from "@/types/gestao-pessoas/nf";
import { StatusBadgeNF } from "./StatusBadgeNF";
import { Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VisualizarNFModalProps {
  open: boolean;
  onClose: () => void;
  notaFiscal: NotaFiscal | null;
}

export function VisualizarNFModal({ open, onClose, notaFiscal }: VisualizarNFModalProps) {
  if (!notaFiscal) return null;

  const handleDownload = () => {
    if (!notaFiscal?.arquivourl) {
      toast.error("URL do arquivo não disponível");
      return;
    }
    
    // Abre o arquivo em uma nova aba
    window.open(notaFiscal.arquivourl, '_blank');
    toast.success("Abrindo arquivo...");
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visualizar Nota Fiscal - {notaFiscal.numero}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <StatusBadgeNF status={notaFiscal.status} />
          </div>

          {/* Dados da Emissão */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Dados da Emissão</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Número da NF</label>
                <p className="text-sm mt-1">{notaFiscal.numero}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Emissão</label>
                <p className="text-sm mt-1">{format(parseISO(notaFiscal.dataemissao), 'dd/MM/yyyy')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome da Empresa</label>
                <p className="text-sm mt-1">{notaFiscal.nomeempresa}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome do Representante</label>
                <p className="text-sm mt-1">{notaFiscal.nomerepresentante}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Período Contábil</label>
                <p className="text-sm mt-1">{notaFiscal.periodocontabil}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">CCA</label>
                <p className="text-sm mt-1">{notaFiscal.cca}</p>
              </div>
              
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Descrição do Serviço</label>
                <p className="text-sm mt-1">{notaFiscal.descricaoservico}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Valor</label>
                <p className="text-sm mt-1 font-semibold">{formatarValor(notaFiscal.valor)}</p>
              </div>
              
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Arquivo</label>
                <div className="mt-1">
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    {notaFiscal.arquivonome || "Baixar NF"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Destaque para Reprovação */}
          {notaFiscal.statusaprovacao === "Reprovado" && notaFiscal.observacoesaprovacao && (
            <Alert variant="destructive" className="border-red-300 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold text-red-900">Motivo da reprovação:</p>
                  <p className="text-red-800">{notaFiscal.observacoesaprovacao}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Dados da Aprovação */}
          {(notaFiscal.tipodocumento || notaFiscal.empresadestino) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Dados da aprovação</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {notaFiscal.tipodocumento && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo de documento</label>
                    <p className="text-sm mt-1">{notaFiscal.tipodocumento}</p>
                  </div>
                )}
                
                {notaFiscal.empresadestino && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                    <p className="text-sm mt-1">{notaFiscal.empresadestino}</p>
                  </div>
                )}
                
                {notaFiscal.numerocredor && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Número de credor</label>
                    <p className="text-sm mt-1">{notaFiscal.numerocredor}</p>
                  </div>
                )}
                
                {notaFiscal.datavencimento && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de vencimento</label>
                    <p className="text-sm mt-1">{format(parseISO(notaFiscal.datavencimento), 'dd/MM/yyyy')}</p>
                  </div>
                )}
                
                {notaFiscal.planofinanceiro && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Plano financeiro</label>
                    <p className="text-sm mt-1">{notaFiscal.planofinanceiro}</p>
                  </div>
                )}
                
                {notaFiscal.statusaprovacao && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status da aprovação</label>
                    <p className="text-sm mt-1">{notaFiscal.statusaprovacao}</p>
                  </div>
                )}
                
                {notaFiscal.observacoesaprovacao && notaFiscal.statusaprovacao !== "Reprovado" && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Observações</label>
                    <p className="text-sm mt-1">{notaFiscal.observacoesaprovacao}</p>
                  </div>
                )}
                
                {notaFiscal.aprovadopor && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Aprovado por</label>
                    <p className="text-sm mt-1">{notaFiscal.aprovadopor}</p>
                  </div>
                )}
                
                {notaFiscal.dataaprovacao && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de aprovação</label>
                    <p className="text-sm mt-1">{notaFiscal.dataaprovacao}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botão de Fechar */}
          <div className="flex justify-end">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
