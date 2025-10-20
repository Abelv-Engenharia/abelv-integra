import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NotaFiscal } from "@/types/gestao-pessoas/nf";
import { StatusBadgeNF } from "./StatusBadgeNF";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface VisualizarNFModalProps {
  open: boolean;
  onClose: () => void;
  notaFiscal: NotaFiscal | null;
}

export function VisualizarNFModal({ open, onClose, notaFiscal }: VisualizarNFModalProps) {
  if (!notaFiscal) return null;

  const handleDownload = () => {
    toast.success("Download iniciado");
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
                <p className="text-sm mt-1">{new Date(notaFiscal.dataemissao).toLocaleDateString('pt-BR')}</p>
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
              
              <div>
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

          {/* Dados da Aprovação */}
          {(notaFiscal.tipodocumento || notaFiscal.empresadestino) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Dados da Aprovação</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {notaFiscal.tipodocumento && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo de Documento</label>
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
                    <label className="text-sm font-medium text-muted-foreground">Número de Credor</label>
                    <p className="text-sm mt-1">{notaFiscal.numerocredor}</p>
                  </div>
                )}
                
                {notaFiscal.datavencimento && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Vencimento</label>
                    <p className="text-sm mt-1">{new Date(notaFiscal.datavencimento).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                
                {notaFiscal.planofinanceiro && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Plano Financeiro</label>
                    <p className="text-sm mt-1">{notaFiscal.planofinanceiro}</p>
                  </div>
                )}
                
                {notaFiscal.statusaprovacao && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status da Aprovação</label>
                    <p className="text-sm mt-1">{notaFiscal.statusaprovacao}</p>
                  </div>
                )}
                
                {notaFiscal.observacoesaprovacao && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Observações da Aprovação</label>
                    <p className="text-sm mt-1">{notaFiscal.observacoesaprovacao}</p>
                  </div>
                )}
                
                {notaFiscal.aprovadopor && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Aprovado Por</label>
                    <p className="text-sm mt-1">{notaFiscal.aprovadopor}</p>
                  </div>
                )}
                
                {notaFiscal.dataaprovacao && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Aprovação</label>
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
