import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { SolicitacaoServico, TipoServico, PrioridadeSolicitacao, VoucherUber, LocacaoVeiculo, CartaoAbastecimento, VeloeGo, Passagens, Hospedagem, Logistica, CorreiosLoggi } from "@/types/gestao-pessoas/solicitacao";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import { formatarNumeroSolicitacao } from "@/utils/gestao-pessoas/formatters";
import { useCCAs } from "@/hooks/useCCAs";
interface AprovarSolicitacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solicitacao: SolicitacaoServico | null;
  onAprovar: (justificativa?: string) => void;
  onReprovar: (justificativa: string) => void;
}
export function AprovarSolicitacaoModal({
  open,
  onOpenChange,
  solicitacao,
  onAprovar,
  onReprovar
}: AprovarSolicitacaoModalProps) {
  const [justificativa, setJustificativa] = useState("");
  const [mostrarJustificativaAprovacao, setMostrarJustificativaAprovacao] = useState(false);
  const { data: ccas = [] } = useCCAs();
  
  if (!solicitacao) return null;

  const getCodigoNomeCCA = (ccaId?: number) => {
    if (!ccaId) return "N/A";
    const cca = ccas.find(c => c.id === ccaId);
    return cca ? `${cca.codigo} - ${cca.nome}` : ccaId.toString();
  };
  const handleAprovar = () => {
    onAprovar(justificativa || undefined);
    setJustificativa("");
    setMostrarJustificativaAprovacao(false);
  };
  const handleReprovar = () => {
    if (!justificativa.trim()) {
      toast.error("Justificativa é obrigatória para reprovar");
      return;
    }
    onReprovar(justificativa);
    setJustificativa("");
  };
  const formatarTipoServico = (tipo: TipoServico): string => {
    const tipos = {
      [TipoServico.VOUCHER_UBER]: "Voucher Uber",
      [TipoServico.LOCACAO_VEICULO]: "Locação de Veículo",
      [TipoServico.CARTAO_ABASTECIMENTO]: "Cartão de Abastecimento",
      [TipoServico.VELOE_GO]: "Veloe Go",
      [TipoServico.PASSAGENS]: "Passagens",
      [TipoServico.HOSPEDAGEM]: "Hospedagem",
      [TipoServico.LOGISTICA]: "Logística",
      [TipoServico.CORREIOS_LOGGI]: "Correios/Loggi"
    };
    return tipos[tipo] || tipo;
  };
  const getBadgePrioridade = (prioridade: PrioridadeSolicitacao) => {
    const variants = {
      baixa: "secondary",
      media: "default",
      alta: "destructive"
    };
    const labels = {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta"
    };
    return <Badge variant={variants[prioridade] as any}>
        {labels[prioridade]}
      </Badge>;
  };
  const renderDetalhesServico = () => {
    switch (solicitacao.tipoServico) {
      case TipoServico.VOUCHER_UBER:
        {
          const dados = solicitacao as VoucherUber;
          return <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Cca:</span> {dados.cca}</div>
              <div><span className="font-medium">Valor:</span> R$ {dados.valor?.toFixed(2) || "0.00"}</div>
              <div><span className="font-medium">Data de uso:</span> {format(new Date(dados.dataUso), "dd/MM/yyyy")}</div>
              <div className="col-span-2"><span className="font-medium">Local de partida:</span> {dados.localPartida}</div>
              <div className="col-span-2"><span className="font-medium">Local de destino:</span> {dados.localDestino}</div>
              <div className="col-span-2"><span className="font-medium">Motivo:</span> {dados.motivo}</div>
            </div>
          </div>;
        }
      case TipoServico.LOCACAO_VEICULO:
        {
          const dados = solicitacao as LocacaoVeiculo;
          return <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Cca:</span> {dados.cca}</div>
              <div><span className="font-medium">Condutor:</span> {dados.nomeCondutor}</div>
              <div><span className="font-medium">Data de retirada:</span> {format(new Date(dados.dataRetirada), "dd/MM/yyyy")}</div>
              <div><span className="font-medium">Período:</span> {dados.periodoLocacao}</div>
              <div><span className="font-medium">Franquia km:</span> {dados.franquiaKm || "N/A"}</div>
              <div><span className="font-medium">Local de retirada:</span> {dados.localRetirada}</div>
              <div className="col-span-2"><span className="font-medium">Motivo:</span> {dados.motivo}</div>
            </div>
          </div>;
        }
      case TipoServico.PASSAGENS:
        {
          const dados = solicitacao as Passagens;
          return <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Tipo:</span> {dados.tipoPassagem === "aerea" ? "Aérea" : "Rodoviária"}</div>
              
              <div><span className="font-medium">Origem:</span> {dados.origem}</div>
              <div><span className="font-medium">Destino:</span> {dados.destino}</div>
              <div><span className="font-medium">Data de ida:</span> {format(new Date(dados.dataViagem), "dd/MM/yyyy")}</div>
              <div><span className="font-medium">Data de volta:</span> {dados.dataVolta ? format(new Date(dados.dataVolta), "dd/MM/yyyy") : "N/A"}</div>
              <div><span className="font-medium">Viajantes:</span> {dados.viajantes?.length || 0}</div>
              <div><span className="font-medium">Bagagem:</span> {dados.precisaBagagem ? "Sim" : "Não"}</div>
              <div className="col-span-2"><span className="font-medium">Motivo:</span> {dados.motivo}</div>
            </div>
          </div>;
        }
      case TipoServico.HOSPEDAGEM:
        {
          const dados = solicitacao as Hospedagem;
          return <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Hotel:</span> {dados.hotel}</div>
              <div><span className="font-medium">Nº de pessoas:</span> {dados.numeroPessoas}</div>
              <div><span className="font-medium">Check-in:</span> {format(new Date(dados.dataInicio), "dd/MM/yyyy")}</div>
              <div><span className="font-medium">Check-out:</span> {format(new Date(dados.dataFim), "dd/MM/yyyy")}</div>
              <div className="col-span-2"><span className="font-medium">Motivo:</span> {dados.motivo}</div>
            </div>
          </div>;
        }
      case TipoServico.LOGISTICA:
        {
          const dados = solicitacao as Logistica;
          return <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Tipo de serviço:</span> {dados.tipoServicoLogistica === "envio" ? "Envio" : "Retirada"}</div>
              <div><span className="font-medium">Data:</span> {format(new Date(dados.dataServico), "dd/MM/yyyy")}</div>
              <div><span className="font-medium">Peso aprox.:</span> {dados.pesoAproximado} kg</div>
              <div><span className="font-medium">Remetente/destinatário:</span> {dados.remetenteDestinatario}</div>
              <div className="col-span-2"><span className="font-medium">Endereço:</span> {dados.enderecoCompleto}</div>
              <div><span className="font-medium">Cep:</span> {dados.cep}</div>
              <div><span className="font-medium">Cidade:</span> {dados.cidade}</div>
              <div><span className="font-medium">Estado:</span> {dados.estado}</div>
              <div className="col-span-2"><span className="font-medium">Motivo:</span> {dados.motivo}</div>
            </div>
          </div>;
        }
      default:
        return <p className="text-sm text-muted-foreground">Detalhes não disponíveis</p>;
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aprovar Solicitação - {formatarNumeroSolicitacao(solicitacao.numeroSolicitacao)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dados da Solicitação */}
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold text-sm">Dados da Solicitação</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Tipo de serviço:</span>{" "}
                {formatarTipoServico(solicitacao.tipoServico)}
              </div>
              <div>
                <span className="font-medium">Solicitante:</span> {solicitacao.solicitante}
              </div>
              <div>
                <span className="font-medium">Data:</span>{" "}
                {format(new Date(solicitacao.dataSolicitacao), "dd/MM/yyyy")}
              </div>
              <div>
                <span className="font-medium">CCA:</span> {getCodigoNomeCCA(solicitacao.ccaId)}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Prioridade:</span>
                {getBadgePrioridade(solicitacao.prioridade)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Detalhes do Serviço */}
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold text-sm">Detalhes do Serviço</h3>
            {renderDetalhesServico()}
          </div>

          <Separator />

          {/* Gestão da Solicitação (Somente Leitura) */}
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold text-sm">Informações de Gestão</h3>
            <div className="space-y-3">
              {solicitacao.observacoesgestao && <div>
                  <Label className="text-xs text-muted-foreground">Observações de gestão</Label>
                  <p className="text-sm mt-1 p-2 bg-muted rounded">{solicitacao.observacoesgestao}</p>
                </div>}
              
              {solicitacao.imagemanexo && <div>
                  <Label className="text-xs text-muted-foreground">Anexo</Label>
                  <img src={solicitacao.imagemanexo} alt="Anexo" className="mt-1 max-w-xs rounded border" />
                </div>}
              
              {solicitacao.estimativavalor && <div>
                  <Label className="text-xs text-muted-foreground">Estimativa de valor</Label>
                  <p className="text-sm mt-1 font-medium">
                    R$ {solicitacao.estimativavalor.toFixed(2)}
                  </p>
                </div>}
            </div>
          </div>

          <Separator />

          {/* Justificativa */}
          <div className="space-y-2">
            <Label htmlFor="justificativa">
              {mostrarJustificativaAprovacao ? "Justificativa (Opcional)" : "Justificativa *"}
            </Label>
            <Textarea id="justificativa" placeholder={mostrarJustificativaAprovacao ? "Adicione uma justificativa para aprovação (opcional)..." : "Adicione uma justificativa para reprovação..."} value={justificativa} onChange={e => setJustificativa(e.target.value)} rows={3} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => {
          onOpenChange(false);
          setJustificativa("");
          setMostrarJustificativaAprovacao(false);
        }}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleReprovar} className="gap-2">
            <XCircle className="h-4 w-4" />
            Reprovar
          </Button>
          <Button onClick={() => {
          if (!mostrarJustificativaAprovacao) {
            setMostrarJustificativaAprovacao(true);
          } else {
            handleAprovar();
          }
        }} className="gap-2">
            <CheckCircle className="h-4 w-4" />
            {mostrarJustificativaAprovacao ? "Confirmar Aprovação" : "Aprovar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}