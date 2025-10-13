import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Eye, Calculator, DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { useOS } from "@/contexts/OSContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export default function OSEmFechamento() {
  const { osList, finalizarOS, updateOSStatus } = useOS();
  const [osEmFechamento, setOsEmFechamento] = useState<number | null>(null);
  const [valorSAO, setValorSAO] = useState("");
  const [valorEngenharia, setValorEngenharia] = useState("");
  const [valorSuprimentos, setValorSuprimentos] = useState("");
  const [justificativaEngenharia, setJustificativaEngenharia] = useState("");
  const [justificativaSuprimentos, setJustificativaSuprimentos] = useState("");
  
  const osParaFechamento = osList.filter(os => os.status === "em-execucao");

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

  const calcularPercentualEngenharia = () => {
    const sao = parseFloat(valorSAO) || 0;
    const eng = parseFloat(valorEngenharia) || 0;
    if (sao === 0) return 0;
    return ((eng - sao) / sao) * 100;
  };

  const calcularSavingSuprimentos = () => {
    const sao = parseFloat(valorSAO) || 0;
    const sup = parseFloat(valorSuprimentos) || 0;
    if (sao === 0) return 0;
    return ((sao - sup) / sao) * 100; // Percentual de economia em relação ao SAO
  };

  const handleIniciarFechamento = (osId: number, os: any) => {
    setOsEmFechamento(osId);
    // Pré-preencher valor SAO com o orçamento
    setValorSAO(os.valorOrcamento.toString());
    setValorEngenharia("");
    setValorSuprimentos("");
    setJustificativaEngenharia("");
    setJustificativaSuprimentos("");
  };

  const handleCancelarFechamento = () => {
    setOsEmFechamento(null);
    setValorSAO("");
    setValorEngenharia("");
    setValorSuprimentos("");
    setJustificativaEngenharia("");
    setJustificativaSuprimentos("");
  };

  const handleFinalizarFechamento = (osId: number) => {
    // Validação apenas do Valor SAO (que é preenchido automaticamente)
    if (!valorSAO) {
      toast.error("Erro: Valor SAO não encontrado!");
      return;
    }

    const valorSAONum = parseFloat(valorSAO) || 0;
    const valorEngenhariaNum = parseFloat(valorEngenharia) || 0;
    const valorSuprimentosNum = parseFloat(valorSuprimentos) || 0;

    // Validar justificativas apenas se os valores forem preenchidos
    if (valorEngenhariaNum > 0 && needsEngenhariaJustification && !justificativaEngenharia.trim()) {
      toast.error("É necessário justificar quando a engenharia gasta mais que o valor SAO!");
      return;
    }

    if (valorSuprimentosNum > 0 && needsSuprimentosJustification && !justificativaSuprimentos.trim()) {
      toast.error("É necessário justificar quando não há saving de suprimentos!");
      return;
    }

    const justificativas = [];
    if (valorEngenhariaNum > 0 && needsEngenhariaJustification) {
      justificativas.push(`Engenharia: ${justificativaEngenharia.trim()}`);
    }
    if (valorSuprimentosNum > 0 && needsSuprimentosJustification) {
      justificativas.push(`Suprimentos: ${justificativaSuprimentos.trim()}`);
    }

    finalizarOS(
      osId,
      valorEngenhariaNum.toString(),
      valorSuprimentosNum.toString(),
      new Date().toISOString().split('T')[0],
      new Date().toISOString().split('-')[0] + '-' + new Date().toISOString().split('-')[1],
      justificativas.join(' | ')
    );

    toast.success("OS enviada para aceite de fechamento do solicitante!");
    handleCancelarFechamento();
  };

  const percentualEngenharia = calcularPercentualEngenharia();
  const savingSuprimentos = calcularSavingSuprimentos();
  const valorSAONum = parseFloat(valorSAO) || 0;
  const valorEngenhariaNum = parseFloat(valorEngenharia) || 0;
  const valorSuprimentosNum = parseFloat(valorSuprimentos) || 0;
  const isEngenhariaPositiva = valorEngenhariaNum <= valorSAONum && valorSAONum > 0; // Positivo quando eng <= sao
  const isSuprimentosPositivo = valorSuprimentosNum < valorSAONum && valorSAONum > 0; // Positivo quando sup < sao (há saving)
  const needsEngenhariaJustification = valorEngenhariaNum > valorSAONum && valorSAONum > 0;
  const needsSuprimentosJustification = valorSuprimentosNum >= valorSAONum && valorSAONum > 0;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">OS Em fechamento</h1>
          <p className="text-muted-foreground">
            {osParaFechamento.length} ordem{osParaFechamento.length !== 1 ? 's' : ''} de serviço disponível{osParaFechamento.length !== 1 ? 'is' : ''} para fechamento
          </p>
        </div>
      </div>

      {osParaFechamento.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma OS em execução encontrada para fechamento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Formulário de Fechamento */}
          {osEmFechamento && (() => {
            const os = osList.find(o => o.id === osEmFechamento);
            if (!os) return null;
            
            return (
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Calculator className="h-5 w-5" />
                    Fechamento da OS Nº {(os as any).numero || os.id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <>
                    {/* Informações da OS */}
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium">Cliente:</span> {os.cliente}</div>
                        <div><span className="font-medium">Disciplina:</span> {os.disciplina}</div>
                        <div><span className="font-medium">HH Total:</span> {os.hhPlanejado + (os.hhAdicional || 0)}h</div>
                        <div><span className="font-medium">Valor OS:</span> {formatCurrency(os.valorOrcamento)}</div>
                      </div>
                    </div>

                    <Separator />

                      {/* Valores Financeiros */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="valorSAO" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Valor SAO (informado na abertura)
                          </Label>
                          <Input
                            id="valorSAO"
                            type="number"
                            step="0.01"
                            min="0"
                            value={valorSAO}
                            disabled
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            Valor do orçamento informado pelo solicitante
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="valorEngenharia" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            R$ Engenharia
                          </Label>
                          <Input
                            id="valorEngenharia"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Ex: 48000.00 (deixe vazio se não houver)"
                            value={valorEngenharia}
                            onChange={(e) => setValorEngenharia(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="valorSuprimentos" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            R$ Suprimentos
                          </Label>
                          <Input
                            id="valorSuprimentos"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Ex: 45000.00 (deixe vazio se não houver)"
                            value={valorSuprimentos}
                            onChange={(e) => setValorSuprimentos(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Resultados Calculados */}
                      {(valorSAO && valorEngenharia && valorSuprimentos) && (
                        <Card className="bg-muted/30">
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Calculator className="h-4 w-4" />
                              Resultados Calculados
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Resultado Engenharia */}
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                              <div className="flex items-center gap-2">
                                {isEngenhariaPositiva ? (
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span className="font-medium">Resultado Engenharia:</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={isEngenhariaPositiva ? "default" : "destructive"}
                                  className={isEngenhariaPositiva ? "bg-green-100 text-green-800 border-green-300" : ""}
                                >
                                  {percentualEngenharia.toFixed(2)}%
                                </Badge>
                                <span className={`text-sm font-medium ${isEngenhariaPositiva ? 'text-green-600' : 'text-red-600'}`}>
                                  ({formatCurrency(parseFloat(valorEngenharia) - parseFloat(valorSAO))})
                                </span>
                              </div>
                            </div>

                            {/* Saving Suprimentos */}
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                              <div className="flex items-center gap-2">
                                {isSuprimentosPositivo ? (
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span className="font-medium">Saving Suprimentos:</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={isSuprimentosPositivo ? "default" : "destructive"}
                                  className={isSuprimentosPositivo ? "bg-green-100 text-green-800 border-green-300" : ""}
                                >
                                  {savingSuprimentos.toFixed(2)}%
                                </Badge>
                                <span className={`text-sm font-medium ${isSuprimentosPositivo ? 'text-green-600' : 'text-red-600'}`}>
                                  ({formatCurrency(parseFloat(valorSAO) - parseFloat(valorSuprimentos))})
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Justificativas para resultados negativos */}
                      {(needsEngenhariaJustification || needsSuprimentosJustification) && (
                        <div className="space-y-4">
                          {needsEngenhariaJustification && (
                            <div className="space-y-2">
                              <Label htmlFor="justificativaEngenharia" className="flex items-center gap-2 text-orange-600">
                                <AlertTriangle className="h-4 w-4" />
                                Justificativa para gasto maior que SAO na engenharia <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="justificativaEngenharia"
                                placeholder="Explique os motivos do gasto maior que o valor SAO na engenharia..."
                                value={justificativaEngenharia}
                                onChange={(e) => setJustificativaEngenharia(e.target.value)}
                                className={needsEngenhariaJustification && !justificativaEngenharia.trim() ? "border-red-300" : ""}
                                rows={3}
                              />
                            </div>
                          )}
                          
                          {needsSuprimentosJustification && (
                            <div className="space-y-2">
                              <Label htmlFor="justificativaSuprimentos" className="flex items-center gap-2 text-orange-600">
                                <AlertTriangle className="h-4 w-4" />
                                Justificativa para ausência de saving em suprimentos <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="justificativaSuprimentos"
                                placeholder="Explique os motivos da ausência de saving em suprimentos..."
                                value={justificativaSuprimentos}
                                onChange={(e) => setJustificativaSuprimentos(e.target.value)}
                                className={needsSuprimentosJustification && !justificativaSuprimentos.trim() ? "border-red-300" : ""}
                                rows={3}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Botões de Ação */}
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={handleCancelarFechamento}>
                          Cancelar
                        </Button>
                        <Button 
                          onClick={() => handleFinalizarFechamento(osEmFechamento)}
                          disabled={!valorSAO || !valorEngenharia || !valorSuprimentos || 
                            (needsEngenhariaJustification && !justificativaEngenharia.trim()) ||
                            (needsSuprimentosJustification && !justificativaSuprimentos.trim())
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Enviar para aceite
                        </Button>
                      </div>
                    </>
                  </CardContent>
                </Card>
              );
            })()}

          {/* Lista de OS em Execução */}
          {osParaFechamento.map((os) => (
            <Card key={os.id} className={osEmFechamento === os.id ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    OS Nº {os.numero || os.id} - CCA {os.cca}
                    <Badge variant="default">
                      Em execução
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    {osEmFechamento !== os.id && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleIniciarFechamento(os.id, os)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Iniciar fechamento
                      </Button>
                    )}
                    <Link to={`/os/${os.id}`}>
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
                    <p className="text-sm text-muted-foreground">HH total</p>
                    <p className="font-medium">
                      {os.hhPlanejado + (os.hhAdicional || 0)}h
                      {os.hhAdicional && os.hhAdicional > 0 && (
                        <span className="text-orange-600 text-xs ml-1">
                          (+{os.hhAdicional}h adicional)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor estimado</p>
                    <p className="font-medium">
                      {formatCurrency((os.hhPlanejado + (os.hhAdicional || 0)) * 95)}
                    </p>
                  </div>
                  {os.dataInicioPrevista && os.dataFimPrevista && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Período previsto</p>
                      <p className="font-medium">
                        {formatDate(os.dataInicioPrevista)} - {formatDate(os.dataFimPrevista)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável EM</p>
                    <p className="font-medium">{os.responsavelEM}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solicitante</p>
                    <p className="font-medium">{os.nomeSolicitante}</p>
                  </div>
                </div>

                {/* Histórico de Replanejamentos */}
                {os.historicoReplanejamentos && os.historicoReplanejamentos.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Histórico de Replanejamentos ({os.historicoReplanejamentos.length})
                    </h4>
                    <div className="space-y-2">
                      {os.historicoReplanejamentos.map((replan, index) => (
                        <div key={index} className="text-sm border-l-2 border-orange-300 pl-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-orange-700">
                                Replanejamento #{index + 1}
                              </p>
                              <p className="text-orange-600">
                                +{replan.hhAdicional}h | {formatDate(replan.novaDataInicio)} - {formatDate(replan.novaDataFim)}
                              </p>
                              <p className="text-orange-600 text-xs">
                                {formatDate(replan.data)} por {replan.usuario}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-orange-600 mt-1">{replan.motivo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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