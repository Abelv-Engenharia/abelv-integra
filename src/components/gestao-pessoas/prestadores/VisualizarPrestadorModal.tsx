import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrestadorPJ } from "@/hooks/gestao-pessoas/usePrestadoresPJ";

interface VisualizarPrestadorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prestador: PrestadorPJ;
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

  const formatCurrency = (value: number) => {
    if (!value) return "R$ 0,00";
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
                  <p className="font-medium">{prestador.razaoSocial || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CNPJ</Label>
                  <p className="font-medium">{prestador.cnpj || "-"}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Descrição da Atividade</Label>
                <p className="font-medium">{prestador.descricaoAtividade || "-"}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número de CNAE</Label>
                  <p className="font-medium">{prestador.numeroCnae || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Grau de Risco</Label>
                  <p className="font-medium">{prestador.grauDeRisco || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nº Credor Sienge</Label>
                  <p className="font-medium">{prestador.numeroCredorSienge || "-"}</p>
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
                  <p className="font-medium">{prestador.contaBancaria || "-"}</p>
                </div>
              </div>
            </div>

            {/* Dados do Representante Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Dados do Representante Legal</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome Completo</Label>
                  <p className="font-medium">{prestador.nomeCompleto || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CPF</Label>
                  <p className="font-medium">{prestador.cpf || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data de Nascimento</Label>
                  <p className="font-medium">{formatDate(prestador.dataNascimento)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">RG</Label>
                  <p className="font-medium">{prestador.rg || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Registro Funcional</Label>
                  <p className="font-medium">{prestador.registroFuncional || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{prestador.telefoneRepresentante || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{prestador.emailRepresentante || "-"}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Endereço</Label>
                <p className="font-medium">{prestador.enderecoRepresentante || "-"}</p>
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
                  <p className="font-medium">
                    {prestador.valorPrestacaoServico 
                      ? prestador.valorPrestacaoServico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                      : "R$ 0,00"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data Início Contrato</Label>
                  <p className="font-medium">{formatDate(prestador.dataInicioContrato)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo de Contrato</Label>
                  <p className="font-medium">{prestador.tipoContrato === 'determinado' ? 'Determinado' : 'Padrão'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CCA</Label>
                  <p className="font-medium">{prestador.ccaNome || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Ajuda de Custo</Label>
                  <p className="font-medium">
                    {prestador.valorAjudaCusto 
                      ? prestador.valorAjudaCusto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                      : "R$ 0,00"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ajuda de Aluguel</Label>
                  <p className="font-medium">
                    {prestador.valorAjudaAluguel 
                      ? prestador.valorAjudaAluguel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                      : "R$ 0,00"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Auxílio Convênio Médico</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={prestador.auxilioConvenioMedico ? "default" : "secondary"}>
                      {prestador.auxilioConvenioMedico ? "Sim" : "Não"}
                    </Badge>
                    {prestador.auxilioConvenioMedico && (
                      <span className="text-sm">
                        {prestador.valorAuxilioConvenioMedico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vale Refeição</Label>
                  <p className="font-medium">
                    {prestador.valeRefeicao 
                      ? prestador.valeRefeicao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                      : "R$ 0,00"}
                  </p>
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Benefícios Adicionais</Label>
                <div className="flex flex-wrap gap-2">
                  {prestador.cafeManha && (
                    <Badge>
                      Café da Manhã: {prestador.valorCafeManha.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Badge>
                  )}
                  {prestador.cafeTarde && (
                    <Badge>
                      Café da Tarde: {prestador.valorCafeTarde.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Badge>
                  )}
                  {prestador.almoco && (
                    <Badge>
                      Almoço: {prestador.valorAlmoco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Badge>
                  )}
                  {prestador.veiculo && (
                    <Badge>Veículo: {prestador.detalhesVeiculo || "Sim"}</Badge>
                  )}
                  {prestador.celular && <Badge>Celular</Badge>}
                  {prestador.alojamento && (
                    <Badge>Alojamento: {prestador.detalhesAlojamento || "Sim"}</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Folga em Campo</Label>
                  <p className="font-medium">{prestador.folgaCampo || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Período de Férias</Label>
                  <p className="font-medium">{prestador.periodoFerias || "-"}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Quantidade de Dias de Férias</Label>
                <p className="font-medium">{prestador.quantidadeDiasFerias || "-"}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
