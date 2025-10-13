import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Eye, CheckCircle, XCircle, Calendar, Clock, RotateCcw, ArrowRight, AlertTriangle } from "lucide-react";
import { useOS } from "@/contexts/engenharia-matricial/OSContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

export default function OSAguardandoAceiteReplanejamento() {
  const { osList, aprovarPlanejamento, updateOSStatus } = useOS();
  const [osParaRejeitar, setOsParaRejeitar] = useState<number | null>(null);
  const [justificativaRejeicao, setJustificativaRejeicao] = useState("");
  const [loading, setLoading] = useState(false);
  
  const osAguardandoAceiteReplanejamento = osList.filter(os => 
    os.status === "aguardando-aceite" && os.historicoReplanejamentos && os.historicoReplanejamentos.length > 0
  );

  const capitalizarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAprovarReplanejamento = (osId: number) => {
    aprovarPlanejamento(osId);
    toast.success("Replanejamento aprovado! OS retornada para execução.");
  };

  const handleIniciarRejeicaoReplanejamento = (osId: number) => {
    setOsParaRejeitar(osId);
    setJustificativaRejeicao("");
  };

  const handleCancelarRejeicao = () => {
    setOsParaRejeitar(null);
    setJustificativaRejeicao("");
  };

  const handleConfirmarRejeicaoReplanejamento = async () => {
    if (!justificativaRejeicao.trim()) {
      toast.error("Por favor, informe o motivo da rejeição do replanejamento.");
      return;
    }

    if (!osParaRejeitar) return;

    setLoading(true);
    try {
      // Volta para execução sem as alterações do replanejamento
      updateOSStatus(osParaRejeitar, "em-execucao", `Replanejamento rejeitado: ${justificativaRejeicao.trim()}`);
      toast.error("Replanejamento rejeitado. OS mantida no planejamento original.");
      handleCancelarRejeicao();
    } catch (error) {
      toast.error("Erro ao rejeitar replanejamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getUltimoReplanejamento = (os: any) => {
    if (!os.historicoReplanejamentos || os.historicoReplanejamentos.length === 0) return null;
    return os.historicoReplanejamentos[os.historicoReplanejamentos.length - 1];
  };

  const calcularNovoValorEstimado = (os: any, replanejamento: any) => {
    const hhTotalAtual = os.hhPlanejado + (os.hhAdicional || 0);
    const hhTotalNovo = hhTotalAtual + replanejamento.hhAdicional;
    const valorHora = 95.00;
    return hhTotalNovo * valorHora;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">OS Aguardando aceite de replanejamento</h1>
          <p className="text-muted-foreground">
            {osAguardandoAceiteReplanejamento.length} ordem{osAguardandoAceiteReplanejamento.length !== 1 ? 's' : ''} de serviço aguardando aprovação do replanejamento
          </p>
        </div>
      </div>

      {osAguardandoAceiteReplanejamento.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma OS aguardando aceite de replanejamento encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {osAguardandoAceiteReplanejamento.map((os) => {
            const ultimoReplanejamento = getUltimoReplanejamento(os);
            if (!ultimoReplanejamento) return null;

            return (
              <Card key={os.id} className="border-orange-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      OS Nº {os.numero || os.id} - CCA {os.cca}
                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Replanejamento pendente
                      </Badge>
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="default"
                        size="sm"
                        onClick={() => handleAprovarReplanejamento(os.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar replanejamento
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleIniciarRejeicaoReplanejamento(os.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                      <Link to={`/os/${os.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informações básicas da OS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="font-medium">{os.cliente}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Disciplina</p>
                      <p className="font-medium">{capitalizarTexto(os.disciplina)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Solicitante</p>
                      <p className="font-medium">{os.nomeSolicitante}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Comparação Planejamento Original vs Replanejamento */}
                  <div>
                    <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
                      <RotateCcw className="h-5 w-5 text-orange-600" />
                      Comparação de Planejamento
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Planejamento Original */}
                      <div className="space-y-3">
                        <h5 className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Planejamento Original
                        </h5>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Período original</p>
                            <p className="font-medium">
                              {os.dataInicioPrevista ? formatDate(os.dataInicioPrevista) : "N/A"} - {os.dataFimPrevista ? formatDate(os.dataFimPrevista) : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">HH original</p>
                            <p className="font-medium">{os.hhPlanejado + (os.hhAdicional || 0)}h</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Valor original</p>
                            <p className="font-medium">{formatCurrency((os.hhPlanejado + (os.hhAdicional || 0)) * 95)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Novo Planejamento */}
                      <div className="space-y-3">
                        <h5 className="font-medium flex items-center gap-2 text-orange-700">
                          <ArrowRight className="h-4 w-4" />
                          Novo Planejamento
                        </h5>
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Novo período</p>
                            <p className="font-medium text-orange-700">
                              {formatDate(ultimoReplanejamento.novaDataInicio)} - {formatDate(ultimoReplanejamento.novaDataFim)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">HH adicional</p>
                            <p className="font-medium text-orange-700">+{ultimoReplanejamento.hhAdicional}h</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Novo HH total</p>
                            <p className="font-medium text-orange-700">
                              {os.hhPlanejado + (os.hhAdicional || 0) + ultimoReplanejamento.hhAdicional}h
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Novo valor estimado</p>
                            <p className="font-medium text-orange-700">
                              {formatCurrency(calcularNovoValorEstimado(os, ultimoReplanejamento))}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Impacto financeiro</p>
                            <p className="font-medium text-red-600">
                              +{formatCurrency(ultimoReplanejamento.hhAdicional * 95)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Motivo do Replanejamento */}
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-2">Motivo do Replanejamento:</h5>
                    <p className="text-sm text-yellow-700">{ultimoReplanejamento.motivo}</p>
                    <div className="mt-2 text-xs text-yellow-600">
                      Solicitado em: {formatDate(ultimoReplanejamento.data)} por {ultimoReplanejamento.usuario}
                    </div>
                  </div>

                  {/* Descrição da OS */}
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição da OS</p>
                    <p className="text-sm">{os.descricao}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Rejeição de Replanejamento com Justificativa */}
      <Dialog open={!!osParaRejeitar} onOpenChange={(open) => !open && handleCancelarRejeicao()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Rejeitar replanejamento
            </DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição do replanejamento da OS #{osParaRejeitar}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="justificativa" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Motivo da rejeição <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="justificativa"
                placeholder="Explique detalhadamente o motivo da rejeição do replanejamento..."
                value={justificativaRejeicao}
                onChange={(e) => setJustificativaRejeicao(e.target.value)}
                className={!justificativaRejeicao.trim() ? "border-red-300" : ""}
                rows={4}
              />
              {!justificativaRejeicao.trim() && (
                <p className="text-sm text-red-600">Campo obrigatório</p>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Atenção:</strong> Ao rejeitar o replanejamento, a OS retornará para execução 
                mantendo o planejamento original sem as alterações solicitadas.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelarRejeicao} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmarRejeicaoReplanejamento}
              disabled={loading || !justificativaRejeicao.trim()}
            >
              {loading ? "Rejeitando..." : "Confirmar rejeição"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}