import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Eye, Calendar, Clock, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { useOSList, useUpdateOS } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export default function OSReplanejamento() {
  const { data: osList = [], isLoading } = useOSList({ status: "em-execucao" });
  const updateOS = useUpdateOS();
  const [osEmReplanejamento, setOsEmReplanejamento] = useState<string | null>(null);
  const [novaDataInicio, setNovaDataInicio] = useState("");
  const [novaDataFim, setNovaDataFim] = useState("");
  const [hhAdicional, setHhAdicional] = useState("");
  const [motivo, setMotivo] = useState("");

  const osParaReplanejamento = osList;

  const capitalizarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calcularNovoValorEstimado = (os: any) => {
    const hhTotalAtual = (os.hh_planejado || 0) + (os.hh_adicional || 0);
    const hhAdicionalNum = parseFloat(hhAdicional) || 0;
    const hhTotalNovo = hhTotalAtual + hhAdicionalNum;
    const valorHora = 95.0;
    return hhTotalNovo * valorHora;
  };

  const handleIniciarReplanejamento = (osId: string, os: any) => {
    setOsEmReplanejamento(osId);
    // Pré-preencher com valores atuais
    setNovaDataInicio(os.data_inicio_prevista || "");
    setNovaDataFim(os.data_fim_prevista || "");
    setHhAdicional("");
    setMotivo("");
  };

  const handleCancelarReplanejamento = () => {
    setOsEmReplanejamento(null);
    setNovaDataInicio("");
    setNovaDataFim("");
    setHhAdicional("");
    setMotivo("");
  };

  const handleSubmitReplanejamento = async (osId: string) => {
    if (!novaDataInicio || !novaDataFim || !hhAdicional || !motivo.trim()) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    if (new Date(novaDataFim) <= new Date(novaDataInicio)) {
      toast.error("A data de fim deve ser posterior à data de início!");
      return;
    }

    const hhAdicionalNum = parseFloat(hhAdicional);
    if (hhAdicionalNum <= 0) {
      toast.error("HH adicional deve ser maior que zero!");
      return;
    }

    try {
      const osAtual = osList.find((o) => o.id === osId);
      const hhTotalAtual = (osAtual?.hh_planejado || 0) + (osAtual?.hh_adicional || 0);

      await updateOS.mutateAsync({
        id: osId,
        data: {
          data_inicio_prevista: novaDataInicio,
          data_fim_prevista: novaDataFim,
          hh_adicional: hhTotalAtual - (osAtual?.hh_planejado || 0) + hhAdicionalNum,
          justificativa_engenharia: motivo.trim(),
        },
      });

      toast.success("Replanejamento aplicado com sucesso!");
      handleCancelarReplanejamento();
    } catch (error) {
      toast.error("Erro ao enviar replanejamento");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Replanejamento de OS</h1>
          <p className="text-muted-foreground">
            {osParaReplanejamento.length} ordem{osParaReplanejamento.length !== 1 ? "s" : ""} de serviço disponível
            {osParaReplanejamento.length !== 1 ? "is" : ""} para replanejamento
          </p>
        </div>
      </div>

      {osParaReplanejamento.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma OS em execução encontrada para replanejamento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Formulário de Replanejamento */}
          {osEmReplanejamento && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <RotateCcw className="h-5 w-5" />
                  Replanejamento da OS #{os.numero}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const os = osList.find((o) => o.id === osEmReplanejamento);
                  if (!os) return null;

                  return (
                    <>
                      {/* Comparação Planejamento Atual vs Novo */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Planejamento Atual */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-lg flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Planejamento Atual
                          </h4>
                          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                            <div>
                              <Label className="text-sm text-muted-foreground">Período atual:</Label>
                              <p className="font-medium">
                                {os.data_inicio_prevista ? formatDate(os.data_inicio_prevista) : "N/A"} -{" "}
                                {os.data_fim_prevista ? formatDate(os.data_fim_prevista) : "N/A"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">HH total atual:</Label>
                              <p className="font-medium">{(os.hh_planejado || 0) + (os.hh_adicional || 0)}h</p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Valor atual estimado:</Label>
                              <p className="font-medium">
                                {formatCurrency(((os.hh_planejado || 0) + (os.hh_adicional || 0)) * 95)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Novo Planejamento */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-lg flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            Novo Planejamento
                          </h4>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="novaDataInicio" className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  Nova data início <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="novaDataInicio"
                                  type="date"
                                  value={novaDataInicio}
                                  onChange={(e) => setNovaDataInicio(e.target.value)}
                                  className={!novaDataInicio ? "border-red-300" : ""}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="novaDataFim" className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  Nova data fim <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="novaDataFim"
                                  type="date"
                                  value={novaDataFim}
                                  onChange={(e) => setNovaDataFim(e.target.value)}
                                  className={!novaDataFim ? "border-red-300" : ""}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="hhAdicional" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                HH adicional necessário <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="hhAdicional"
                                type="number"
                                step="0.5"
                                min="0.5"
                                placeholder="Ex: 16"
                                value={hhAdicional}
                                onChange={(e) => setHhAdicional(e.target.value)}
                                className={!hhAdicional ? "border-red-300" : ""}
                              />
                            </div>

                            {/* Preview do novo valor */}
                            {hhAdicional && (
                              <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                                <div className="text-sm space-y-1">
                                  <div>
                                    Novo HH total:{" "}
                                    {(os.hh_planejado || 0) + (os.hh_adicional || 0) + (parseFloat(hhAdicional) || 0)}h
                                  </div>
                                  <div>HH adicional: +{hhAdicional}h</div>
                                  <div className="font-medium text-orange-700">
                                    Novo valor estimado: {formatCurrency(calcularNovoValorEstimado(os))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Motivo do Replanejamento */}
                      <div className="space-y-2">
                        <Label htmlFor="motivo" className="flex items-center gap-2">
                          <RotateCcw className="h-4 w-4" />
                          Motivo do replanejamento <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="motivo"
                          placeholder="Explique os motivos que levaram à necessidade de replanejamento..."
                          value={motivo}
                          onChange={(e) => setMotivo(e.target.value)}
                          className={!motivo.trim() ? "border-red-300" : ""}
                          rows={4}
                        />
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={handleCancelarReplanejamento}>
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => handleSubmitReplanejamento(osEmReplanejamento)}
                          disabled={!novaDataInicio || !novaDataFim || !hhAdicional || !motivo.trim()}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Enviar replanejamento
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Lista de OS em Execução */}
          {osParaReplanejamento.map((os) => (
            <Card key={os.id} className={osEmReplanejamento === os.id ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    OS Nº {os.numero || os.id} - CCA {os.cca?.codigo || "N/A"}
                    <Badge variant="default">Em execução</Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    {osEmReplanejamento !== os.id && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleIniciarReplanejamento(os.id, os)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Iniciar replanejamento
                      </Button>
                    )}
                    <Link to={`/engenharia-matricial/os/${os.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{os.solicitante_nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disciplina</p>
                    <p className="font-medium">{capitalizarTexto(os.disciplina || "")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HH planejado</p>
                    <p className="font-medium">{(os.hh_planejado || 0) + (os.hh_adicional || 0)}h</p>
                  </div>
                  {os.data_inicio_prevista && os.data_fim_prevista && (
                    <div className="md:col-span-3">
                      <p className="text-sm text-muted-foreground">Período atual</p>
                      <p className="font-medium">
                        {formatDate(os.data_inicio_prevista)} - {formatDate(os.data_fim_prevista)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável EM</p>
                    <p className="font-medium">{os.responsavel_em?.nome || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solicitante</p>
                    <p className="font-medium">{os.solicitante_nome}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="text-sm">{os.descricao}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
