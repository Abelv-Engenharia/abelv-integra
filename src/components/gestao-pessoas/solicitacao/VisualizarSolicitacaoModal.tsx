import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatarNumeroSolicitacao } from "@/utils/gestao-pessoas/formatters";
import { useCCAs } from "@/hooks/useCCAs";
import { 
  SolicitacaoServico, 
  TipoServico, 
  VoucherUber, 
  LocacaoVeiculo,
  Passagens,
  Hospedagem,
  Logistica,
  CartaoAbastecimento,
  VeloeGo,
  PrioridadeSolicitacao,
  StatusSolicitacao
} from "@/types/gestao-pessoas/solicitacao";

interface VisualizarSolicitacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solicitacao: SolicitacaoServico | null;
  onSave: (updates: Partial<SolicitacaoServico>) => void;
  onSaveAndApprove: (updates: Partial<SolicitacaoServico>) => void;
  onConcluir?: (id: string, dadosConclusao?: {
    observacoesconclusao: string;
    comprovanteconclusao: string;
    concluidopor: string;
  }) => void;
  modoVisualizacao?: boolean;
}

const usuariosistema = [
  { id: "1", nome: "Carlos Silva - Gestor" },
  { id: "2", nome: "Ana Santos - Supervisora" },
  { id: "3", nome: "Pedro Costa - Coordenador" },
  { id: "4", nome: "Maria Oliveira - Diretora" },
];

const priorityconfig = {
  [PrioridadeSolicitacao.ALTA]: { color: "bg-red-500", label: "Alta" },
  [PrioridadeSolicitacao.MEDIA]: { color: "bg-yellow-500", label: "Média" },
  [PrioridadeSolicitacao.BAIXA]: { color: "bg-green-500", label: "Baixa" }
};

const statusconfig = {
  [StatusSolicitacao.PENDENTE]: { color: "bg-orange-500", label: "Pendente" },
  [StatusSolicitacao.EM_ANDAMENTO]: { color: "bg-blue-500", label: "Em Andamento" },
  [StatusSolicitacao.AGUARDANDO_APROVACAO]: { color: "bg-amber-500", label: "Aguardando Aprovação" },
  [StatusSolicitacao.APROVADO]: { color: "bg-green-500", label: "Aprovado" },
  [StatusSolicitacao.CONCLUIDO]: { color: "bg-purple-500", label: "Concluído" },
  [StatusSolicitacao.REJEITADO]: { color: "bg-red-500", label: "Rejeitado" }
};

const formattiposervico = (tipo: TipoServico) => {
  const labels: Record<TipoServico, string> = {
    [TipoServico.VOUCHER_UBER]: "Voucher Uber",
    [TipoServico.LOCACAO_VEICULO]: "Locação de Veículo",
    [TipoServico.CARTAO_ABASTECIMENTO]: "Cartão Abastecimento",
    [TipoServico.VELOE_GO]: "Veloe Go",
    [TipoServico.PASSAGENS]: "Passagens",
    [TipoServico.HOSPEDAGEM]: "Hospedagem",
    [TipoServico.LOGISTICA]: "Logística",
    [TipoServico.CORREIOS_LOGGI]: "Correios/Loggi"
  };
  return labels[tipo] || tipo;
};

const getCcaSolicitacao = (solicitacao: SolicitacaoServico, ccas: any[]): string => {
  // Primeiro tenta pelo ccaId
  if ((solicitacao as any).ccaId) {
    const cca = ccas.find(c => c.id === (solicitacao as any).ccaId);
    if (cca) return cca.nome;
  }
  
  // Se não encontrar pelo ID, tenta pelo código em centroCusto
  const codigoCca = solicitacao.centroCusto || '';
  const cca = ccas.find(c => c.codigo === codigoCca);
  if (cca) return cca.nome;
  
  // Se não encontrar, retorna o código mesmo
  return codigoCca;
};

export function VisualizarSolicitacaoModal({
  open,
  onOpenChange,
  solicitacao,
  onSave,
  onSaveAndApprove,
  onConcluir,
  modoVisualizacao = false
}: VisualizarSolicitacaoModalProps) {
  const { data: ccas = [] } = useCCAs();
  const [observacoesgestao, setObservacoesGestao] = useState("");
  const [imagemanexo, setImagemAnexo] = useState<string>("");
  const [estimativavalor, setEstimativaValor] = useState("");
  const [responsavelaprovacao, setResponsavelAprovacao] = useState("");
  const [observacoesconclusao, setObservacoesConclusao] = useState("");
  const [comprovanteconclusao, setComprovanteConclusao] = useState<string | undefined>();

  useEffect(() => {
    if (solicitacao) {
      console.log("=== DEBUG MODAL: Dados da solicitação ===", solicitacao);
      console.log("Número:", solicitacao.numeroSolicitacao);
      console.log("Centro de Custo:", solicitacao.centroCusto);
      console.log("Valor:", (solicitacao as any).valor);
      console.log("Data de Uso:", (solicitacao as any).dataUso);
      console.log("Local Partida:", (solicitacao as any).localPartida);
      console.log("Local Destino:", (solicitacao as any).localDestino);
      console.log("Motivo:", (solicitacao as any).motivo);
      
      setObservacoesGestao(solicitacao.observacoesgestao || "");
      setImagemAnexo(solicitacao.imagemanexo || "");
      setEstimativaValor(solicitacao.estimativavalor?.toString() || "");
      setResponsavelAprovacao(solicitacao.responsavelaprovacao || "");
      setObservacoesConclusao("");
      setComprovanteConclusao(undefined);
    }
  }, [solicitacao]);

  if (!solicitacao) return null;

  const isAprovado = solicitacao.status === StatusSolicitacao.APROVADO;
  const isReadOnly = isAprovado || solicitacao.status === StatusSolicitacao.CONCLUIDO;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB.");
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error("Apenas imagens (JPG, PNG) ou PDF são permitidos.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemAnexo(reader.result as string);
        toast.success(`${file.type === 'application/pdf' ? 'PDF' : 'Imagem'} carregado com sucesso!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComprovanteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB.");
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error("Apenas imagens (JPG, PNG) ou PDF são permitidos.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setComprovanteConclusao(reader.result as string);
        toast.success(`${file.type === 'application/pdf' ? 'PDF' : 'Imagem'} carregado com sucesso!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvar = () => {
    const updates = {
      observacoesgestao,
      imagemanexo: imagemanexo || undefined,
      estimativavalor: estimativavalor ? parseFloat(estimativavalor) : undefined,
      responsavelaprovacao: responsavelaprovacao || undefined
    };
    onSave(updates);
  };

  const handleSalvarEAprovar = () => {
    if (!estimativavalor || parseFloat(estimativavalor) <= 0) {
      toast.error("Estimativa de valor é obrigatória");
      return;
    }
    if (!responsavelaprovacao) {
      toast.error("Selecione um responsável pela aprovação");
      return;
    }

    const updates = {
      observacoesgestao,
      imagemanexo: imagemanexo || undefined,
      estimativavalor: parseFloat(estimativavalor),
      responsavelaprovacao
    };
    onSaveAndApprove(updates);
  };

  const handleConcluir = () => {
    if (!observacoesconclusao.trim()) {
      toast.error("Por favor, adicione observações de conclusão.");
      return;
    }
    
    if (!comprovanteconclusao) {
      toast.error("Por favor, anexe o comprovante de conclusão.");
      return;
    }
    
    if (onConcluir && solicitacao) {
      onConcluir(solicitacao.id, {
        observacoesconclusao: observacoesconclusao,
        comprovanteconclusao: comprovanteconclusao,
        concluidopor: "Carlos Silva - Gestor"
      });
      toast.success("Solicitação concluída com sucesso!");
      onOpenChange(false);
    }
  };

  const handleDownloadComprovante = (tipo: 'pdf' | 'imagem') => {
    if (!solicitacao?.comprovanteconclusao) return;
    
    const link = document.createElement('a');
    link.href = solicitacao.comprovanteconclusao;
    link.download = tipo === 'pdf' 
      ? `comprovante-${solicitacao.id}.pdf`
      : `comprovante-${solicitacao.id}.jpg`;
    link.click();
    
    toast.success("Comprovante baixado com sucesso!");
  };

  const handleReabrir = () => {
    if (!solicitacao) return;
    
    const updates = {
      status: StatusSolicitacao.EM_ANDAMENTO,
      observacoesgestao: (observacoesgestao || '') + '\n\n[REABERTO] Chamado reaberto em ' + new Date().toLocaleString('pt-BR')
    };
    
    onSave(updates);
    toast.success("Chamado reaberto com sucesso!");
    onOpenChange(false);
  };

  const renderDetalhesServico = () => {
    switch (solicitacao.tipoServico) {
      case TipoServico.VOUCHER_UBER: {
        const voucher = solicitacao as VoucherUber;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Valor</Label>
              <p className="font-medium">R$ {voucher.valor?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data de uso</Label>
              <p className="font-medium">{voucher.dataUso ? new Date(voucher.dataUso).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Motivo</Label>
              <p className="font-medium">{voucher.motivo || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Local partida</Label>
              <p className="font-medium">{voucher.localPartida || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Local destino</Label>
              <p className="font-medium">{voucher.localDestino || '-'}</p>
            </div>
          </div>
        );
      }
      case TipoServico.LOCACAO_VEICULO: {
        const locacao = solicitacao as LocacaoVeiculo;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Nome condutor</Label>
              <p className="font-medium">{locacao.nomeCondutor || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Motivo</Label>
              <p className="font-medium">{locacao.motivo || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data retirada</Label>
              <p className="font-medium">{locacao.dataRetirada ? new Date(locacao.dataRetirada).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Período locação</Label>
              <p className="font-medium">{locacao.periodoLocacao || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Local retirada</Label>
              <p className="font-medium">{locacao.localRetirada || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Franquia km</Label>
              <p className="font-medium">{locacao.franquiaKm || "Não informado"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Termo responsabilidade</Label>
              <p className="font-medium">{locacao.termoResponsabilidade ? 'Sim' : 'Não'}</p>
            </div>
          </div>
        );
      }
      case TipoServico.PASSAGENS: {
        const passagens = solicitacao as Passagens;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Tipo passagem</Label>
                <p className="font-medium">{passagens.tipoPassagem === 'aerea' ? 'Aérea' : 'Rodoviária'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Motivo</Label>
                <p className="font-medium">{passagens.motivo || '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Origem</Label>
                <p className="font-medium">{passagens.origem || '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Destino</Label>
                <p className="font-medium">{passagens.destino || '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data viagem</Label>
                <p className="font-medium">{passagens.dataViagem ? new Date(passagens.dataViagem).toLocaleDateString('pt-BR') : '-'}</p>
              </div>
              {passagens.dataVolta && (
                <div>
                  <Label className="text-muted-foreground">Data volta</Label>
                  <p className="font-medium">{new Date(passagens.dataVolta).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Precisa bagagem</Label>
                <p className="font-medium">{passagens.precisaBagagem ? 'Sim' : 'Não'}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Viajantes ({passagens.viajantes?.length || 0})</Label>
              {passagens.viajantes?.map((v, idx) => (
                <p key={idx} className="font-medium text-sm">{v.nome}</p>
              )) || <p className="text-sm text-muted-foreground">Nenhum viajante cadastrado</p>}
            </div>
            {passagens.observacoesViagem && (
              <div>
                <Label className="text-muted-foreground">Observações viagem</Label>
                <p className="font-medium">{passagens.observacoesViagem}</p>
              </div>
            )}
          </div>
        );
      }
      case TipoServico.HOSPEDAGEM: {
        const hospedagem = solicitacao as Hospedagem;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Hotel</Label>
              <p className="font-medium">{hospedagem.hotel || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Número pessoas</Label>
              <p className="font-medium">{hospedagem.numeroPessoas || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data início</Label>
              <p className="font-medium">{hospedagem.dataInicio ? new Date(hospedagem.dataInicio).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data fim</Label>
              <p className="font-medium">{hospedagem.dataFim ? new Date(hospedagem.dataFim).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Motivo</Label>
              <p className="font-medium">{hospedagem.motivo || '-'}</p>
            </div>
            {hospedagem.observacoesHospedagem && (
              <div className="col-span-2">
                <Label className="text-muted-foreground">Observações</Label>
                <p className="font-medium">{hospedagem.observacoesHospedagem}</p>
              </div>
            )}
          </div>
        );
      }
      case TipoServico.LOGISTICA: {
        const logistica = solicitacao as Logistica;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Tipo serviço</Label>
              <p className="font-medium">{logistica.tipoServicoLogistica === 'envio' ? 'Envio' : 'Retirada'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Peso aproximado</Label>
              <p className="font-medium">{logistica.pesoAproximado || '-'} kg</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data serviço</Label>
              <p className="font-medium">{logistica.dataServico ? new Date(logistica.dataServico).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Motivo</Label>
              <p className="font-medium">{logistica.motivo || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Remetente/destinatário</Label>
              <p className="font-medium">{logistica.remetenteDestinatario || '-'}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">Endereço completo</Label>
              <p className="font-medium">{logistica.enderecoCompleto || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Cidade</Label>
              <p className="font-medium">{logistica.cidade || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Estado</Label>
              <p className="font-medium">{logistica.estado || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Cep</Label>
              <p className="font-medium">{logistica.cep || '-'}</p>
            </div>
          </div>
        );
      }
      case TipoServico.CARTAO_ABASTECIMENTO: {
        const cartao = solicitacao as CartaoAbastecimento;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Nome solicitante</Label>
              <p className="font-medium">{cartao.nomeSolicitante || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Tipo solicitação</Label>
              <p className="font-medium">
                {cartao.tipoSolicitacao === 'recarga_adicional' ? 'Recarga Adicional' : 
                 cartao.tipoSolicitacao === 'cartao_novo' ? 'Cartão Novo' : 'Bloqueio'}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Motivo</Label>
              <p className="font-medium">{cartao.motivo || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data</Label>
              <p className="font-medium">{cartao.data ? new Date(cartao.data).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
            {cartao.valorAdicional && (
              <div>
                <Label className="text-muted-foreground">Valor adicional</Label>
                <p className="font-medium">R$ {cartao.valorAdicional?.toFixed(2) || '0.00'}</p>
              </div>
            )}
            {cartao.kmVeiculo && (
              <div>
                <Label className="text-muted-foreground">Km veículo</Label>
                <p className="font-medium">{cartao.kmVeiculo} km</p>
              </div>
            )}
            {cartao.placaAssociada && (
              <div>
                <Label className="text-muted-foreground">Placa associada</Label>
                <p className="font-medium">{cartao.placaAssociada}</p>
              </div>
            )}
          </div>
        );
      }
      case TipoServico.VELOE_GO: {
        const veloe = solicitacao as VeloeGo;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Valor</Label>
              <p className="font-medium">R$ {veloe.valor?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data uso</Label>
              <p className="font-medium">{veloe.dataUso ? new Date(veloe.dataUso).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Local partida</Label>
              <p className="font-medium">{veloe.localPartida || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Local destino</Label>
              <p className="font-medium">{veloe.localDestino || '-'}</p>
            </div>
          </div>
        );
      }
      default:
        return <p className="text-muted-foreground">Detalhes não disponíveis</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Visualizar Solicitação - {formatarNumeroSolicitacao(solicitacao.numeroSolicitacao)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Prioridade */}
          <div className="flex gap-2">
            <Badge className={`${priorityconfig[solicitacao.prioridade].color} text-white`}>
              {priorityconfig[solicitacao.prioridade].label}
            </Badge>
            <Badge className={`${statusconfig[solicitacao.status].color} text-white`}>
              {statusconfig[solicitacao.status].label}
            </Badge>
          </div>

          <Separator />

          {/* Dados da Solicitação */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Dados da solicitação</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Tipo de serviço</Label>
                  <p className="font-medium">{formattiposervico(solicitacao.tipoServico)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Solicitante</Label>
                  <p className="font-medium">{solicitacao.solicitante}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data</Label>
                  <p className="font-medium">{new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cca</Label>
                  <p className="font-medium">{getCcaSolicitacao(solicitacao, ccas)}</p>
                </div>
                {solicitacao.observacoes && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Observações</Label>
                    <p className="font-medium">{solicitacao.observacoes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Serviço */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Detalhes do serviço</h3>
              {renderDetalhesServico()}
            </CardContent>
          </Card>

          {/* Gestão da Solicitação - Oculto para usuários em modo visualização */}
          {!modoVisualizacao && (
            <Card className={isAprovado ? "border-green-500/30" : "border-primary/20"}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Gestão da solicitação</h3>
                  {isAprovado && <Badge className="bg-green-500 text-white">Aprovado</Badge>}
                </div>
                
                {isReadOnly ? (
                  <>
                    {/* MODO SOMENTE LEITURA */}
                    {solicitacao.observacoesgestao && (
                      <div className="space-y-2">
                        <Label>Observações de gestão</Label>
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm whitespace-pre-wrap">
                            {solicitacao.observacoesgestao}
                          </p>
                        </div>
                      </div>
                    )}

                    {solicitacao.imagemanexo && (
                      <div className="space-y-2">
                        <Label>Imagem/anexo</Label>
                        <div className="border rounded-md p-2">
                          <img 
                            src={solicitacao.imagemanexo} 
                            alt="Anexo" 
                            className="max-w-full h-auto rounded"
                          />
                        </div>
                      </div>
                    )}

                    {solicitacao.estimativavalor && (
                      <div className="space-y-2">
                        <Label>Estimativa de valor</Label>
                        <p className="text-lg font-semibold text-green-600">
                          R$ {solicitacao.estimativavalor?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    )}

                    {solicitacao.responsavelaprovacao && (
                      <div className="space-y-2">
                        <Label>Responsável pela aprovação</Label>
                        <p className="font-medium">{solicitacao.responsavelaprovacao}</p>
                      </div>
                    )}

                    <Separator />

                    {/* Dados da Aprovação */}
                    {solicitacao.dataaprovacao && (
                      <div className="space-y-2">
                        <Label>Data de aprovação</Label>
                        <p className="font-medium">
                          {new Date(solicitacao.dataaprovacao).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}

                    {solicitacao.aprovadopor && (
                      <div className="space-y-2">
                        <Label>Aprovado por</Label>
                        <p className="font-medium">{solicitacao.aprovadopor}</p>
                      </div>
                    )}

                    {solicitacao.justificativaaprovacao && (
                      <div className="space-y-2">
                        <Label>Justificativa de aprovação</Label>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm">{solicitacao.justificativaaprovacao}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* MODO EDITÁVEL */}
                    <div className="space-y-2">
                      <Label htmlFor="observacoesgestao">Observações de gestão</Label>
                      <Textarea
                        id="observacoesgestao"
                        placeholder="Adicione observações sobre a solicitação..."
                        value={observacoesgestao}
                        onChange={(e) => setObservacoesGestao(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imagemanexo">Imagem/anexo</Label>
                      {imagemanexo ? (
                        <div className="relative">
                          <img 
                            src={imagemanexo} 
                            alt="Anexo" 
                            className="max-h-48 rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setImagemAnexo("")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-md p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <Label htmlFor="file-upload" className="cursor-pointer text-sm text-muted-foreground">
                            Clique ou arraste para fazer upload
                          </Label>
                          <Input
                            id="file-upload"
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimativavalor" className="text-destructive">
                        Estimativa de valor *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                        <Input
                          id="estimativavalor"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          value={estimativavalor}
                          onChange={(e) => setEstimativaValor(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responsavelaprovacao" className="text-destructive">
                        Responsável pela aprovação *
                      </Label>
                      <Select value={responsavelaprovacao} onValueChange={setResponsavelAprovacao}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um responsável..." />
                        </SelectTrigger>
                        <SelectContent>
                          {usuariosistema.map((usuario) => (
                            <SelectItem key={usuario.id} value={usuario.nome}>
                              {usuario.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Card: Finalizar Solicitação - Apenas para status APROVADO e não em modo visualização */}
          {!modoVisualizacao && isAprovado && (
            <Card className="border-purple-500/30 bg-purple-50/50">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">🎯 Finalizar solicitação</h3>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                    Campos obrigatórios
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Adicione as observações finais e o comprovante de conclusão para finalizar esta solicitação.
                </p>

                {/* Observações de Conclusão */}
                <div className="space-y-2">
                  <Label htmlFor="observacoesconclusao" className="text-red-600">
                    Observações de conclusão *
                  </Label>
                  <Textarea
                    id="observacoesconclusao"
                    placeholder="Descreva como a solicitação foi finalizada, detalhes importantes, etc."
                    value={observacoesconclusao}
                    onChange={(e) => setObservacoesConclusao(e.target.value)}
                    className={cn(
                      "min-h-[100px]",
                      !observacoesconclusao.trim() && "border-red-300 focus-visible:ring-red-500"
                    )}
                  />
                  {!observacoesconclusao.trim() && (
                    <p className="text-xs text-red-600">Campo obrigatório</p>
                  )}
                </div>

                {/* Comprovante de Conclusão */}
                <div className="space-y-2">
                  <Label htmlFor="comprovante-upload" className="text-red-600">
                    Comprovante de conclusão *
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="comprovante-upload"
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={handleComprovanteUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('comprovante-upload')?.click()}
                      className={cn(
                        !comprovanteconclusao && "border-red-300"
                      )}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {comprovanteconclusao ? 'Alterar comprovante' : 'Escolher arquivo'}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Formatos: JPG, PNG ou PDF (máx. 5MB)
                    </span>
                  </div>
                  {!comprovanteconclusao && (
                    <p className="text-xs text-red-600">Campo obrigatório</p>
                  )}

                  {/* Preview do Comprovante */}
                  {comprovanteconclusao && (
                    <div className="border rounded-md p-3 bg-white">
                      {comprovanteconclusao.startsWith('data:application/pdf') ? (
                        <div className="flex items-center gap-3">
                          <FileText className="h-10 w-10 text-red-500" />
                          <div>
                            <p className="font-medium text-sm">Documento PDF anexado</p>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-xs"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = comprovanteconclusao;
                                link.download = 'comprovante-conclusao.pdf';
                                link.click();
                              }}
                            >
                              Visualizar PDF
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setComprovanteConclusao(undefined)}
                            className="ml-auto"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <img 
                            src={comprovanteconclusao} 
                            alt="Comprovante" 
                            className="max-w-full h-auto rounded max-h-[300px] object-contain"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setComprovanteConclusao(undefined)}
                            className="absolute top-2 right-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card: Dados de Conclusão - Apenas para status CONCLUIDO */}
          {solicitacao?.status === StatusSolicitacao.CONCLUIDO && (
            <Card className="border-purple-500/30 bg-purple-50/50">
              <CardContent className="pt-6 space-y-4">
                {/* Badge de conclusão */}
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">✅ Solicitação concluída</h3>
                  <Badge className="bg-purple-600 text-white">Finalizado</Badge>
                </div>
                
                {/* Informações de conclusão */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {solicitacao.dataconclusao && (
                    <div>
                      <Label className="text-muted-foreground">Data de conclusão</Label>
                      <p className="font-medium">
                        {new Date(solicitacao.dataconclusao).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  )}
                  {solicitacao.concluidopor && (
                    <div>
                      <Label className="text-muted-foreground">Concluído por</Label>
                      <p className="font-medium">{solicitacao.concluidopor}</p>
                    </div>
                  )}
                </div>
                
                {/* Observações de conclusão */}
                {solicitacao.observacoesconclusao && (
                  <div className="space-y-2">
                    <Label>Observações de conclusão</Label>
                    <div className="border rounded-md p-3 bg-white">
                      <p className="text-sm whitespace-pre-wrap">
                        {solicitacao.observacoesconclusao}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Comprovante de conclusão */}
                {solicitacao.comprovanteconclusao && (
                  <div className="space-y-2">
                    <Label>Comprovante de conclusão</Label>
                    <div className="border rounded-md p-3 bg-white">
                      {solicitacao.comprovanteconclusao.startsWith('data:application/pdf') ? (
                        // Preview PDF
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-10 w-10 text-red-500" />
                            <div>
                              <p className="font-medium text-sm">Documento PDF</p>
                              <p className="text-xs text-muted-foreground">
                                Comprovante de conclusão
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadComprovante('pdf')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Baixar PDF
                          </Button>
                        </div>
                      ) : (
                        // Preview Imagem
                        <div className="space-y-2">
                          <img 
                            src={solicitacao.comprovanteconclusao} 
                            alt="Comprovante de conclusão" 
                            className="max-w-full h-auto rounded max-h-[400px] object-contain border"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadComprovante('imagem')}
                            className="w-full"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Baixar imagem
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2">
          {/* Botão Fechar - sempre visível */}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          
          {/* Botão Reabrir - apenas para solicitações concluídas (gestor) */}
          {!modoVisualizacao && solicitacao?.status === StatusSolicitacao.CONCLUIDO && (
            <Button 
              onClick={handleReabrir}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Reabrir chamado
            </Button>
          )}
          
          {/* Botão Concluir - apenas para solicitações aprovadas (não concluídas) */}
          {!modoVisualizacao && isAprovado && solicitacao?.status !== StatusSolicitacao.CONCLUIDO && (
            <Button 
              onClick={handleConcluir}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Concluir solicitação
            </Button>
          )}
          
          {/* Botões Salvar - apenas para solicitações não aprovadas e não concluídas */}
          {!modoVisualizacao && !isAprovado && solicitacao?.status !== StatusSolicitacao.CONCLUIDO && (
            <>
              <Button variant="secondary" onClick={handleSalvar}>
                Salvar
              </Button>
              <Button onClick={handleSalvarEAprovar}>
                Salvar e enviar para aprovação
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
