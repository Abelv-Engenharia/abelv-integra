import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VisualizarPrestadorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prestador: any;
}

export function VisualizarPrestadorModal({ open, onOpenChange, prestador }: VisualizarPrestadorModalProps) {
  const formatDate = (date: any) => {
    if (!date) return "-";
    try {
      return format(new Date(date), "dd/MM/yyyy");
    } catch {
      return "-";
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return "R$ 0,00";
    return value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Detalhes do Prestador</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)] pr-4">
          <div className="space-y-6">
            {/* Dados da Empresa */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Dados da Empresa</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Razão Social</Label>
                  <p className="font-medium">{prestador.razaosocial || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CNPJ</Label>
                  <p className="font-medium">{prestador.cnpj || "-"}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Descrição da Atividade</Label>
                <p className="font-medium">{prestador.descricaoatividade || "-"}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número de CNAE</Label>
                  <p className="font-medium">{prestador.numerocnae || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Grau de Risco</Label>
                  <p className="font-medium">{prestador.grauderisco || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nº Credor Sienge</Label>
                  <p className="font-medium">{prestador.numerocredorsienge || "-"}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Endereço</Label>
                <p className="font-medium">{prestador.endereco || "-"}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{prestador.telefone || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{prestador.email || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Chave PIX</Label>
                  <p className="font-medium">{prestador.contabancaria || "-"}</p>
                </div>
              </div>
            </div>

            {/* Dados do Representante Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Dados do Representante Legal</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome Completo</Label>
                  <p className="font-medium">{prestador.nomecompleto || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CPF</Label>
                  <p className="font-medium">{prestador.cpf || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data de Nascimento</Label>
                  <p className="font-medium">{formatDate(prestador.datanascimento)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">RG</Label>
                  <p className="font-medium">{prestador.rg || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Registro Funcional</Label>
                  <p className="font-medium">{prestador.registrofuncional || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{prestador.telefonerepresentante || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{prestador.emailrepresentante || "-"}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Endereço</Label>
                <p className="font-medium">{prestador.enderecorepresentante || "-"}</p>
              </div>
            </div>

            {/* Condições Financeiras */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Condições Financeiras</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Serviço</Label>
                  <p className="font-medium">{prestador.servico || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor Prestação de Serviço</Label>
                  <p className="font-medium">{formatCurrency(prestador.valorprestacaoservico)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data Início Contrato</Label>
                  <p className="font-medium">{formatDate(prestador.datainiciocontrato)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tempo de Contrato</Label>
                  <p className="font-medium">{prestador.tempocontrato || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CCA Obra</Label>
                  <p className="font-medium">{prestador.ccaobra || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Ajuda de Custo</Label>
                  <p className="font-medium">{formatCurrency(prestador.ajudacusto)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ajuda de Aluguel</Label>
                  <p className="font-medium">{formatCurrency(prestador.ajudaaluguel)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Auxílio Convênio Médico</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={prestador.auxilioconveniomedico ? "default" : "secondary"}>
                      {prestador.auxilioconveniomedico ? "Sim" : "Não"}
                    </Badge>
                    {prestador.auxilioconveniomedico && (
                      <span className="text-sm">{formatCurrency(prestador.valorauxilioconveniomedico)}</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vale Refeição</Label>
                  <p className="font-medium">{formatCurrency(prestador.valerefeicao)}</p>
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Benefícios Adicionais</Label>
                <div className="flex flex-wrap gap-2">
                  {prestador.cafemanha && (
                    <Badge>Café da Manhã: {formatCurrency(prestador.valorcafemanha)}</Badge>
                  )}
                  {prestador.cafetarde && (
                    <Badge>Café da Tarde: {formatCurrency(prestador.valorcafetarde)}</Badge>
                  )}
                  {prestador.almoco && (
                    <Badge>Almoço: {formatCurrency(prestador.valoralmoco)}</Badge>
                  )}
                  {prestador.veiculo && (
                    <Badge>Veículo: {prestador.detalhesveiculo || "Sim"}</Badge>
                  )}
                  {prestador.celular && <Badge>Celular</Badge>}
                  {prestador.alojamento && (
                    <Badge>Alojamento: {prestador.detalhesalojamento || "Sim"}</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Folga em Campo</Label>
                  <p className="font-medium">{prestador.folgacampo || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Período de Férias</Label>
                  <p className="font-medium">{prestador.periodoferias || "-"}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Quantidade de Dias de Férias</Label>
                <p className="font-medium">{prestador.quantidadediasferias || "-"}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
