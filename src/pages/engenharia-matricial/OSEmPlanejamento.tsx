import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useOSList, useUpdateOS, useAvancarFaseOS } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export default function OSEmPlanejamento() {
  const { data: osList = [], isLoading } = useOSList({ status: "em-planejamento" });
  const updateOSMutation = useUpdateOS();
  const avancarFaseMutation = useAvancarFaseOS();
  const [osEmEdicao, setOsEmEdicao] = useState<string | null>(null);
  const [dataInicioPrevista, setDataInicioPrevista] = useState("");
  const [dataFimPrevista, setDataFimPrevista] = useState("");
  const [hhPlanejado, setHhPlanejado] = useState("");
  const [hhAdicional, setHhAdicional] = useState("");
  const [valorSAO, setValorSAO] = useState("");

  const osEmPlanejamento = osList;

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

  const calcularValorEstimado = () => {
    const hhPlanejadoNum = parseFloat(hhPlanejado) || 0;
    const hhAdicionalNum = parseFloat(hhAdicional) || 0;
    const valorHora = 95.0;
    return (hhPlanejadoNum + hhAdicionalNum) * valorHora;
  };

  const handleIniciarPlanejamento = (osId: string) => {
    const os = osList.find((o) => o.id === osId);
    setOsEmEdicao(osId);
    setDataInicioPrevista("");
    setDataFimPrevista("");
    setHhPlanejado("");
    setHhAdicional("");
    setValorSAO(os?.valor_orcamento ? os.valor_orcamento.toString() : "");
  };

  const handleCancelarPlanejamento = () => {
    setOsEmEdicao(null);
    setDataInicioPrevista("");
    setDataFimPrevista("");
    setHhPlanejado("");
    setHhAdicional("");
    setValorSAO("");
  };

  const handleFinalizarPlanejamento = (osId: string) => {
    const os = osList.find((o) => o.id === osId);

    // Se valorSAO não foi preenchido inicialmente, validar agora
    if (!os?.valor_orcamento && !valorSAO) {
      toast.error("Valor SAO é obrigatório! Preencha antes de finalizar o planejamento.");
      return;
    }

    if (!dataInicioPrevista || !dataFimPrevista || !hhPlanejado) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    if (new Date(dataFimPrevista) <= new Date(dataInicioPrevista)) {
      toast.error("A data de fim deve ser posterior à data de início!");
      return;
    }

    const hhPlanejadoNum = parseFloat(hhPlanejado);
    const hhAdicionalNum = parseFloat(hhAdicional) || 0;

    if (hhPlanejadoNum <= 0) {
      toast.error("HH planejado deve ser maior que zero!");
      return;
    }

    const valorSAONum = parseFloat(valorSAO);
    if (!os?.valor_orcamento && (!valorSAONum || valorSAONum <= 0)) {
      toast.error("Valor SAO deve ser maior que zero!");
      return;
    }

    // Atualizar dados do planejamento
    updateOSMutation.mutate(
      {
        id: osId,
        data: {
          data_inicio_prevista: dataInicioPrevista,
          data_fim_prevista: dataFimPrevista,
          hh_planejado: hhPlanejadoNum,
          hh_adicional: hhAdicionalNum,
          ...(valorSAONum > 0 && { valor_orcamento: valorSAONum }),
        },
      },
      {
        onSuccess: () => {
          // Avançar para próxima fase
          avancarFaseMutation.mutate(
            { id: osId },
            {
              onSuccess: () => {
                toast.success("Planejamento finalizado com sucesso! OS enviada para aguardando aceite.");
                handleCancelarPlanejamento();
              },
            },
          );
        },
        onError: (error) => {
          console.error("Erro ao finalizar planejamento:", error);
          toast.error("Erro ao finalizar planejamento. Tente novamente.");
        },
      },
    );
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
          <h1 className="text-3xl font-bold">OS Em planejamento</h1>
          <p className="text-muted-foreground">
            {osEmPlanejamento.length} ordem{osEmPlanejamento.length !== 1 ? "s" : ""} de serviço em planejamento
          </p>
        </div>
      </div>

      {osEmPlanejamento.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma OS em planejamento encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Formulário de Planejamento */}
          {osEmEdicao &&
            (() => {
              const os = osList.find((o) => o.id === osEmEdicao);
              if (!os) return null;

              return (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Calendar className="h-5 w-5" />
                      Planejamento da OS Nº {(os as any).numero || os.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Valor SAO (se não foi preenchido) */}
                    {!os.valor_orcamento && (
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <p className="text-sm text-amber-800 mb-3">
                          ⚠️ O Valor SAO não foi preenchido pelo solicitante. É necessário preencher antes de finalizar
                          o planejamento.
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="valorSAO" className="text-red-600">
                            Valor SAO (custo de venda) *
                          </Label>
                          <Input
                            id="valorSAO"
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={valorSAO}
                            onChange={(e) => setValorSAO(e.target.value)}
                            className={!valorSAO ? "border-red-500" : ""}
                          />
                        </div>
                      </div>
                    )}

                    {/* Período de Execução */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dataInicio" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Data início prevista <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="dataInicio"
                          type="date"
                          value={dataInicioPrevista}
                          onChange={(e) => setDataInicioPrevista(e.target.value)}
                          className={!dataInicioPrevista ? "border-red-300" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dataFim" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Data fim prevista <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="dataFim"
                          type="date"
                          value={dataFimPrevista}
                          onChange={(e) => setDataFimPrevista(e.target.value)}
                          className={!dataFimPrevista ? "border-red-300" : ""}
                        />
                      </div>
                    </div>

                    {/* HH Planejado e Adicional */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hhPlanejado" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          HH planejado <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="hhPlanejado"
                          type="number"
                          step="0.5"
                          min="0.5"
                          placeholder="Ex: 40"
                          value={hhPlanejado}
                          onChange={(e) => setHhPlanejado(e.target.value)}
                          className={!hhPlanejado ? "border-red-300" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hhAdicional" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          HH adicional (opcional)
                        </Label>
                        <Input
                          id="hhAdicional"
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="Ex: 8"
                          value={hhAdicional}
                          onChange={(e) => setHhAdicional(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Resumo Financeiro */}
                    {(hhPlanejado || hhAdicional) && (
                      <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                        <h4 className="font-medium">Resumo financeiro</h4>
                        <div className="text-sm space-y-1">
                          <div>HH planejado: {hhPlanejado || 0}h</div>
                          <div>HH adicional: {hhAdicional || 0}h</div>
                          <div>Total HH: {(parseFloat(hhPlanejado) || 0) + (parseFloat(hhAdicional) || 0)}h</div>
                          <div>Valor por hora: {formatCurrency(95)}</div>
                          <Separator className="my-2" />
                          <div className="font-medium text-lg">
                            Valor total estimado: {formatCurrency(calcularValorEstimado())}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={handleCancelarPlanejamento}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => handleFinalizarPlanejamento(osEmEdicao)}
                        disabled={!dataInicioPrevista || !dataFimPrevista || !hhPlanejado}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Finalizar planejamento
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

          {/* Lista de OS */}
          {osEmPlanejamento.map((os) => (
            <Card key={os.id} className={osEmEdicao === os.id ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    OS Nº {os.numero} - CCA {os.cca?.codigo || os.cca_id}
                    <Badge variant="outline">Em planejamento</Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    {osEmEdicao !== os.id && (
                      <Button variant="default" size="sm" onClick={() => handleIniciarPlanejamento(os.id)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Iniciar planejamento
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
                    <p className="font-medium">{os.cliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disciplina</p>
                    <p className="font-medium">{capitalizarTexto(os.disciplina)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor SAO</p>
                    {os.valor_orcamento && os.valor_orcamento > 0 ? (
                      <p className="font-medium">{formatCurrency(os.valor_orcamento)}</p>
                    ) : (
                      <>
                        <p className="font-medium text-amber-600">Não informado</p>
                        <p className="text-xs text-amber-600">Deverá ser preenchido no planejamento</p>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data compromissada</p>
                    <p className="font-medium">{formatDate(os.data_compromissada)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável EM</p>
                    <p className="font-medium">{os.responsavel_em?.nome || "Não atribuído"}</p>
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
