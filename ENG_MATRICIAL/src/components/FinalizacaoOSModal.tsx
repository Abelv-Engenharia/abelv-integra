import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, DollarSign, CheckCircle, X } from "lucide-react";
import { useOS } from "@/contexts/OSContext";
import { useToast } from "@/hooks/use-toast";

interface FinalizacaoOSModalProps {
  osId: number;
  isOpen: boolean;
  onClose: () => void;
}

const FinalizacaoOSModal = ({ osId, isOpen, onClose }: FinalizacaoOSModalProps) => {
  console.log("FinalizacaoOSModal renderizado:", { osId, isOpen });
  
  const { getOSById, finalizarOS } = useOS();
  const { toast } = useToast();
  
  const os = getOSById(osId);
  
  const [valorEngenharia, setValorEngenharia] = useState("");
  const [valorSuprimentos, setValorSuprimentos] = useState("");
  const [justificativaEngenharia, setJustificativaEngenharia] = useState("");
  const [dataConclusao, setDataConclusao] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [competencia, setCompetencia] = useState(
    new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })
  );
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularSaving = () => {
    if (!os || !valorEngenharia) return null;
    const valorEngenhariaNum = parseFloat(valorEngenharia);
    const valorSAO = os.valorOrcamento;
    return ((valorEngenhariaNum - valorSAO) / valorSAO) * 100;
  };

  const calcularSavingSuprimentos = () => {
    if (!os || !valorSuprimentos) return null;
    const valorSuprimentosNum = parseFloat(valorSuprimentos);
    const valorSAO = os.valorOrcamento;
    return ((valorSuprimentosNum - valorSAO) / valorSAO) * 100;
  };

  const getResultadoDisplay = (percentual: number) => {
    if (percentual === 0) {
      return { text: "0%", color: "text-foreground", label: "" };
    } else if (percentual > 0) {
      return { text: `+${percentual.toFixed(1)}%`, color: "text-red-600", label: " (perda)" };
    } else {
      return { text: `${percentual.toFixed(1)}%`, color: "text-green-600", label: " (ganho)" };
    }
  };

  const getValorTotal = () => {
    if (!valorSuprimentos) return 0;
    return parseFloat(valorSuprimentos);
  };

  const atualizarCompetencia = (data: string) => {
    const dataObj = new Date(data);
    const novaCompetencia = dataObj.toLocaleDateString('pt-BR', { 
      month: '2-digit', 
      year: 'numeric' 
    });
    setCompetencia(novaCompetencia);
  };

  const handleDataChange = (data: string) => {
    setDataConclusao(data);
    atualizarCompetencia(data);
  };

  const handleSubmit = async () => {
    if (!valorEngenharia || !valorSuprimentos || !dataConclusao || !competencia) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se justificativa é obrigatória
    const resultadoEngenharia = calcularSaving();
    if (resultadoEngenharia !== null && resultadoEngenharia !== 0 && !justificativaEngenharia.trim()) {
      toast({
        title: "Justificativa obrigatória",
        description: "Por favor, informe a justificativa para o resultado da engenharia.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(valorEngenharia) <= 0 || parseFloat(valorSuprimentos) <= 0) {
      toast({
        title: "Valores inválidos",
        description: "Os valores devem ser maiores que zero.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const valorEngenhariaNum = parseFloat(valorEngenharia);
      const valorSuprimentosNum = parseFloat(valorSuprimentos);
      finalizarOS(osId, valorEngenharia, valorSuprimentos, dataConclusao, competencia, justificativaEngenharia);
      
      const saving = calcularSaving();
      
      toast({
        title: "OS finalizada com sucesso!",
        description: `Competência ${competencia} - Resultado: ${saving && saving >= 0 ? '+' + saving.toFixed(1) : saving?.toFixed(1)}%`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao finalizar OS",
        description: "Ocorreu um erro ao finalizar a OS. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !os) {
    console.log("Modal não renderizado:", { isOpen, os: !!os });
    return null;
  }

  console.log("Renderizando modal completo");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Finalizar OS
              </CardTitle>
              <CardDescription>
                Registre os valores finais e valide a conclusão da OS
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informações da OS */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">CCA:</span> {os.cca}
              </div>
              <div>
                <span className="font-medium">Cliente:</span> {os.cliente}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Descrição:</span> {os.descricao}
              </div>
              <div>
                <span className="font-medium">Valor SAO:</span> {formatCurrency(os.valorOrcamento)}
              </div>
              <div>
                <span className="font-medium">HH total:</span> {os.hhPlanejado + (os.hhAdicional || 0)}h
              </div>
            </div>
          </div>

          <Separator />

          {/* Formulário de Finalização */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorSAO" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Valor SAO (automático)
                </Label>
                <Input
                  id="valorSAO"
                  type="text"
                  value={formatCurrency(os?.valorOrcamento || 0)}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorEngenharia" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Valor Engenharia *
                </Label>
                <Input
                  id="valorEngenharia"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 15000.00"
                  value={valorEngenharia}
                  onChange={(e) => setValorEngenharia(e.target.value)}
                  className={!valorEngenharia ? "border-red-300" : ""}
                />
                {!valorEngenharia && (
                  <p className="text-sm text-red-600">Campo obrigatório</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorSuprimentos" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor Suprimentos *
              </Label>
              <Input
                id="valorSuprimentos"
                type="number"
                step="0.01"
                placeholder="Ex: 7500.00"
                value={valorSuprimentos}
                onChange={(e) => setValorSuprimentos(e.target.value)}
                className={!valorSuprimentos ? "border-red-300" : ""}
              />
              {!valorSuprimentos && (
                <p className="text-sm text-red-600">Campo obrigatório</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataConclusao" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Data de conclusão *
              </Label>
              <Input
                id="dataConclusao"
                type="date"
                value={dataConclusao}
                onChange={(e) => handleDataChange(e.target.value)}
                className={!dataConclusao ? "border-red-300" : ""}
              />
              {!dataConclusao && (
                <p className="text-sm text-red-600">Campo obrigatório</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="competencia">Competência (controladoria) *</Label>
              <Input
                id="competencia"
                type="text"
                value={competencia}
                onChange={(e) => setCompetencia(e.target.value)}
                placeholder="MM/AAAA"
                className={!competencia ? "border-red-300" : ""}
              />
              {!competencia && (
                <p className="text-sm text-red-600">Campo obrigatório</p>
              )}
            </div>
          </div>

          {/* Preview da Economia */}
          {valorEngenharia && valorSuprimentos && (
            <>
              <Separator />
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Preview financeiro
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Valor SAO:</span>
                    <span className="font-medium">{formatCurrency(os.valorOrcamento)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Engenharia:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(valorEngenharia))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Suprimentos:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(valorSuprimentos))}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Valor total:</span>
                    <span className="font-bold">{formatCurrency(getValorTotal())}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  <div className="text-xs space-y-2 bg-muted/50 p-2 rounded">
                    <div className="font-medium text-muted-foreground mb-1">Informações de resultado:</div>
                    <div className="flex justify-between">
                      <span>Engenharia vs SAO:</span>
                      <span className={`font-medium ${getResultadoDisplay(calcularSaving()!).color}`}>
                        {getResultadoDisplay(calcularSaving()!).text}
                        {getResultadoDisplay(calcularSaving()!).label}
                      </span>
                    </div>
                    
                    {/* Campo de justificativa para engenharia quando diferente de zero */}
                    {calcularSaving() !== null && calcularSaving() !== 0 && (
                      <div className="mt-2 space-y-2">
                        <Label htmlFor="justificativaEngenharia" className="text-xs">
                          Justificativa do resultado da engenharia *
                        </Label>
                        <textarea
                          id="justificativaEngenharia"
                          placeholder="Informe o motivo do resultado..."
                          value={justificativaEngenharia}
                          onChange={(e) => setJustificativaEngenharia(e.target.value)}
                          className={`w-full text-xs p-2 border rounded-md resize-none h-16 ${!justificativaEngenharia.trim() ? "border-red-300" : "border-input"}`}
                        />
                        {!justificativaEngenharia.trim() && (
                          <p className="text-xs text-red-600">Campo obrigatório</p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Suprimentos vs SAO (Saving):</span>
                      <span className={`font-medium ${getResultadoDisplay(calcularSavingSuprimentos()!).color}`}>
                        {getResultadoDisplay(calcularSavingSuprimentos()!).text}
                        {getResultadoDisplay(calcularSavingSuprimentos()!).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !valorEngenharia || !valorSuprimentos || !dataConclusao || !competencia || (calcularSaving() !== null && calcularSaving() !== 0 && !justificativaEngenharia.trim())}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? "Finalizando..." : "Finalizar OS"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizacaoOSModal;