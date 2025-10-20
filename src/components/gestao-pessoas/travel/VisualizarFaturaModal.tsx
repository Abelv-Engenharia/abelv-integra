import { FaturaIntegra } from "@/types/gestao-pessoas/travel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface VisualizarFaturaModalProps {
  fatura: FaturaIntegra;
  open: boolean;
  onClose: () => void;
}

export const VisualizarFaturaModal = ({ fatura, open, onClose }: VisualizarFaturaModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Fatura</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dados da Fatura */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Dados da Fatura</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Data Emissão</Label>
                <p className="font-medium">
                  {new Date(fatura.dataemissaofat).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Agência</Label>
                <p className="font-medium">{fatura.agencia}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Número Fatura</Label>
                <p className="font-medium">{fatura.numerodefat}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Protocolo</Label>
                <p className="font-medium">{fatura.protocolo}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dados da Viagem */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Dados da Viagem</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Data Compra</Label>
                <p className="font-medium">
                  {new Date(fatura.datadacompra).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Viajante</Label>
                <p className="font-medium">{fatura.viajante}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tipo</Label>
                <p className="font-medium">{fatura.tipo}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Comprador</Label>
                <p className="font-medium">{fatura.comprador}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Origem</Label>
                <p className="font-medium">{fatura.origem}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Destino</Label>
                <p className="font-medium">{fatura.destino}</p>
              </div>
            </div>
          </div>

          {/* Hospedagem (condicional) */}
          {fatura.tipo === "Hotel" && fatura.hospedagem && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3">Hospedagem</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Nome Hospedagem</Label>
                    <p className="font-medium">{fatura.hospedagem}</p>
                  </div>
                  {fatura.checkin && (
                    <div>
                      <Label className="text-muted-foreground">Check-in</Label>
                      <p className="font-medium">
                        {new Date(fatura.checkin).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                  {fatura.checkout && (
                    <div>
                      <Label className="text-muted-foreground">Check-out</Label>
                      <p className="font-medium">
                        {new Date(fatura.checkout).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Dados Aéreos (condicional) */}
          {fatura.tipo === "Aéreo" && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3">Dados Aéreos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Cia Ida</Label>
                    <p className="font-medium">{fatura.ciaida || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Cia Volta</Label>
                    <p className="font-medium">{fatura.ciavolta || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Possui Bagagem</Label>
                    <p className="font-medium">{fatura.possuibagagem}</p>
                  </div>
                  {fatura.valorpagodebagagem && (
                    <div>
                      <Label className="text-muted-foreground">Valor Bagagem</Label>
                      <p className="font-medium">
                        {fatura.valorpagodebagagem.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Dados Financeiros */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Dados Financeiros</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Valor Pago</Label>
                <p className="font-medium text-lg">
                  {fatura.valorpago.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">CCA</Label>
                <p className="font-medium">{fatura.cca}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Centro Custo</Label>
                <p className="font-medium">{fatura.centrodecusto}</p>
              </div>
              {fatura.codconta && (
                <div>
                  <Label className="text-muted-foreground">Cód. Conta</Label>
                  <p className="font-medium">{fatura.codconta}</p>
                </div>
              )}
              {fatura.contafinanceira && (
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Conta Financeira</Label>
                  <p className="font-medium">{fatura.contafinanceira}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações Adicionais */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Informações Adicionais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Motivo/Evento</Label>
                <p className="font-medium">{fatura.motivoevento}</p>
              </div>
              {fatura.antecedencia !== undefined && (
                <div>
                  <Label className="text-muted-foreground">Antecedência</Label>
                  <p className="font-medium">{fatura.antecedencia} dias</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Dentro da Política</Label>
                <p className="font-medium">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      fatura.dentrodapolitica === "Sim"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {fatura.dentrodapolitica}
                  </span>
                </p>
              </div>
              {fatura.quemsolicitouforapolitica && (
                <div>
                  <Label className="text-muted-foreground">Quem Solicitou</Label>
                  <p className="font-medium">{fatura.quemsolicitouforapolitica}</p>
                </div>
              )}
              {fatura.observacao && (
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Observação</Label>
                  <p className="font-medium">{fatura.observacao}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
