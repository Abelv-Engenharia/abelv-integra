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

  const getCcaSolicitacao = (solicitacao: SolicitacaoServico, ccas: any[]): string => {
    // Primeiro tenta pelo ccaId
    if ((solicitacao as any).ccaId) {
      const cca = ccas.find(c => c.id === (solicitacao as any).ccaId);
      if (cca) return `${cca.codigo} - ${cca.nome}`;
    }
    
    // Se não encontrar pelo ccaId, tenta buscar por id usando centroCusto
    const centroCusto = solicitacao.centroCusto || '';
    if (centroCusto) {
      // Tenta buscar por ID (valor numérico)
      const ccaById = ccas.find(c => c.id === parseInt(centroCusto));
      if (ccaById) return `${ccaById.codigo} - ${ccaById.nome}`;
      
      // Tenta buscar por código (valor string)
      const ccaByCodigo = ccas.find(c => c.codigo === centroCusto);
      if (ccaByCodigo) return `${ccaByCodigo.codigo} - ${ccaByCodigo.nome}`;
    }
    
    // Se não encontrar, retorna o valor original de centroCusto
    return centroCusto || "N/A";
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
  const priorityconfig = {
    [PrioridadeSolicitacao.ALTA]: { color: "bg-red-500", label: "Alta" },
    [PrioridadeSolicitacao.MEDIA]: { color: "bg-yellow-500", label: "Média" },
    [PrioridadeSolicitacao.BAIXA]: { color: "bg-green-500", label: "Baixa" }
  };
  const renderDetalhesServico = () => {
    switch (solicitacao.tipoServico) {
      case TipoServico.VOUCHER_UBER:
        {
          const dados = solicitacao as VoucherUber;
          return <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Valor</Label>
              <p className="font-medium">R$ {dados.valor?.toFixed(2) || "0.00"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data de uso</Label>
              <p className="font-medium">{format(new Date(dados.dataUso), "dd/MM/yyyy")}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Local partida</Label>
              <p className="font-medium">{dados.localPartida}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Local destino</Label>
              <p className="font-medium">{dados.localDestino}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Motivo</Label>
              <p className="font-medium">{dados.motivo}</p>
            </div>
          </div>;
        }
      case TipoServico.LOCACAO_VEICULO:
        {
          const dados = solicitacao as LocacaoVeiculo;
          return <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Condutor</Label>
              <p className="font-medium">{dados.nomeCondutor}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data retirada</Label>
              <p className="font-medium">{format(new Date(dados.dataRetirada), "dd/MM/yyyy")}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Período</Label>
              <p className="font-medium">{dados.periodoLocacao}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Franquia km</Label>
              <p className="font-medium">{dados.franquiaKm || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Local retirada</Label>
              <p className="font-medium">{dados.localRetirada}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Termo responsabilidade</Label>
              <p className="font-medium">{dados.termoResponsabilidade ? "Sim" : "Não"}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Motivo</Label>
              <p className="font-medium">{dados.motivo}</p>
            </div>
          </div>;
        }
      case TipoServico.PASSAGENS:
        {
          const dados = solicitacao as Passagens;
          return <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Tipo passagem</Label>
                <p className="font-medium">{dados.tipoPassagem === "aerea" ? "Aérea" : "Rodoviária"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Motivo</Label>
                <p className="font-medium">{dados.motivo}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Origem</Label>
                <p className="font-medium">{dados.origem}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Destino</Label>
                <p className="font-medium">{dados.destino}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data viagem</Label>
                <p className="font-medium">{format(new Date(dados.dataViagem), "dd/MM/yyyy")}</p>
              </div>
              {dados.dataVolta && (
                <div>
                  <Label className="text-muted-foreground">Data volta</Label>
                  <p className="font-medium">{format(new Date(dados.dataVolta), "dd/MM/yyyy")}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Precisa bagagem</Label>
                <p className="font-medium">{dados.precisaBagagem ? "Sim" : "Não"}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Viajantes ({dados.viajantes?.length || 0})</Label>
              {dados.viajantes?.map((v, idx) => (
                <p key={idx} className="font-medium text-sm">{v.nome}</p>
              )) || <p className="text-sm text-muted-foreground">Nenhum viajante</p>}
            </div>
          </div>;
        }
      case TipoServico.HOSPEDAGEM:
        {
          const dados = solicitacao as Hospedagem;
          return <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Hotel</Label>
              <p className="font-medium">{dados.hotel}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Nº pessoas</Label>
              <p className="font-medium">{dados.numeroPessoas}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Check-in</Label>
              <p className="font-medium">{format(new Date(dados.dataInicio), "dd/MM/yyyy")}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Check-out</Label>
              <p className="font-medium">{format(new Date(dados.dataFim), "dd/MM/yyyy")}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Motivo</Label>
              <p className="font-medium">{dados.motivo}</p>
            </div>
          </div>;
        }
      case TipoServico.LOGISTICA:
        {
          const dados = solicitacao as Logistica;
          return <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Tipo serviço</Label>
              <p className="font-medium">{dados.tipoServicoLogistica === "envio" ? "Envio" : "Retirada"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data</Label>
              <p className="font-medium">{format(new Date(dados.dataServico), "dd/MM/yyyy")}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Peso aprox.</Label>
              <p className="font-medium">{dados.pesoAproximado} kg</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Remetente/destinatário</Label>
              <p className="font-medium">{dados.remetenteDestinatario}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Endereço</Label>
              <p className="font-medium">{dados.enderecoCompleto}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Cep</Label>
              <p className="font-medium">{dados.cep}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Cidade</Label>
              <p className="font-medium">{dados.cidade}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Estado</Label>
              <p className="font-medium">{dados.estado}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Motivo</Label>
              <p className="font-medium">{dados.motivo}</p>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Tipo de serviço</Label>
                <p className="font-medium">{formatarTipoServico(solicitacao.tipoServico)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Solicitante</Label>
                <p className="font-medium">{solicitacao.solicitante}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data</Label>
                <p className="font-medium">{format(new Date(solicitacao.dataSolicitacao), "dd/MM/yyyy")}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">CCA</Label>
                <p className="font-medium">{getCcaSolicitacao(solicitacao, ccas)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Prioridade</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${priorityconfig[solicitacao.prioridade].color}`} />
                  <span className="font-medium">{priorityconfig[solicitacao.prioridade].label}</span>
                </div>
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