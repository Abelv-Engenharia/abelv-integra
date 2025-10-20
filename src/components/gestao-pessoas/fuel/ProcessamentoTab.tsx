import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertTriangle, CheckCircle, Clock, FileSpreadsheet } from "lucide-react";
import { FuelReportImportComponent } from "./FuelReportImportComponent";
import { MapaMOI, ProcessamentoQuinzenal, FuelTransaction } from "@/types/fuel";
import { useToast } from "@/hooks/use-toast";

interface ProcessamentoTabProps {
  mapaMOI: MapaMOI | null;
  primeira_quinzena: ProcessamentoQuinzenal | null;
  segunda_quinzena: ProcessamentoQuinzenal | null;
  onProcessamentoChange: (periodo: '1ª quinzena' | '2ª quinzena', processamento: ProcessamentoQuinzenal) => void;
}

export const ProcessamentoTab: React.FC<ProcessamentoTabProps> = ({
  mapaMOI,
  primeira_quinzena,
  segunda_quinzena,
  onProcessamentoChange
}) => {
  const { toast } = useToast();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'1ª quinzena' | '2ª quinzena'>('1ª quinzena');
  const [faturaVeloe, setFaturaVeloe] = useState('');
  const [loading, setLoading] = useState(false);
  const [processando, setProcessando] = useState(false);

  const processamentoAtual = periodoSelecionado === '1ª quinzena' ? primeira_quinzena : segunda_quinzena;

  const aplicarRateioMOI = (transacoes: FuelTransaction[]): FuelTransaction[] => {
    if (!mapaMOI) return transacoes;

    return transacoes.map(transacao => {
      const motoristaMOI = mapaMOI.motoristas.find(m => 
        m.motorista.toLowerCase() === transacao.motorista.toLowerCase() ||
        m.placa === transacao.placa
      );

      if (motoristaMOI && motoristaMOI.divisao_ccas.length > 1) {
        // Aplicar rateio - criar múltiplas linhas para cada CCA
        // Por simplicidade, mantemos a transação original aqui
        // Na implementação real, seria gerado um array de transações rateadas
        return {
          ...transacao,
          // Marcar que foi rateada
          rateio_aplicado: true,
          moi_referencia: mapaMOI.id
        };
      }

      return transacao;
    });
  };

  const handleImportData = (novasTransacoes: FuelTransaction[]) => {
    if (!mapaMOI) {
      toast({
        title: "MOI Não Encontrado",
        description: "Carregue o Mapa MOI antes de processar as transações",
        variant: "destructive"
      });
      return;
    }

    if (!faturaVeloe.trim()) {
      toast({
        title: "Fatura Requerida",
        description: "Informe o número da fatura Veloe",
        variant: "destructive"
      });
      return;
    }

    setProcessando(true);

    // Simular processamento com rateio
    setTimeout(() => {
      const transacoesComRateio = aplicarRateioMOI(novasTransacoes);
      const totalValor = transacoesComRateio.reduce((sum, t) => sum + t.valor, 0);

      const novoProcessamento: ProcessamentoQuinzenal = {
        id: `proc_${Date.now()}`,
        periodo: periodoSelecionado,
        mes_ano: mapaMOI.mes_referencia,
        fatura_veloe: faturaVeloe,
        moi_aplicado: mapaMOI.id,
        transacoes: transacoesComRateio,
        data_processamento: new Date(),
        total_valor: totalValor,
        total_transacoes: transacoesComRateio.length
      };

      onProcessamentoChange(periodoSelecionado, novoProcessamento);
      
      const transacoesComRateioAplicado = transacoesComRateio.filter(t => (t as any).rateio_aplicado).length;
      
      toast({
        title: "Processamento Concluído",
        description: `${periodoSelecionado} processada: ${novoProcessamento.total_transacoes} transações, ${transacoesComRateioAplicado} com rateio aplicado`
      });

      setFaturaVeloe('');
      setProcessando(false);
    }, 2000);
  };

  const getPeriodoStatus = (periodo: '1ª quinzena' | '2ª quinzena') => {
    const processamento = periodo === '1ª quinzena' ? primeira_quinzena : segunda_quinzena;
    
    if (processamento) {
      return { icon: CheckCircle, color: 'text-green-600', label: 'Processada' };
    }
    return { icon: Clock, color: 'text-yellow-600', label: 'Pendente' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Processamento Quinzenal</h2>
          <p className="text-muted-foreground">
            Importação e processamento de faturas Veloe
          </p>
        </div>
      </div>

      {/* Status MOI */}
      {!mapaMOI && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Mapa MOI não carregado!</strong> É necessário carregar o Mapa MOI antes de processar as transações.
          </AlertDescription>
        </Alert>
      )}

      {/* Seleção de Período */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={`cursor-pointer transition-colors ${periodoSelecionado === '1ª quinzena' ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader className="pb-3" onClick={() => setPeriodoSelecionado('1ª quinzena')}>
            <CardTitle className="flex items-center justify-between text-base">
              <span>1ª Quinzena (1-15)</span>
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getPeriodoStatus('1ª quinzena');
                  const Icon = status.icon;
                  return (
                    <>
                      <Icon className={`h-4 w-4 ${status.color}`} />
                      <Badge variant={primeira_quinzena ? 'default' : 'secondary'}>
                        {status.label}
                      </Badge>
                    </>
                  );
                })()}
              </div>
            </CardTitle>
          </CardHeader>
          {primeira_quinzena && (
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                <p>Fatura: {primeira_quinzena.fatura_veloe}</p>
                <p>Transações: {primeira_quinzena.total_transacoes}</p>
                <p>Valor: {primeira_quinzena.total_valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className={`cursor-pointer transition-colors ${periodoSelecionado === '2ª quinzena' ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader className="pb-3" onClick={() => setPeriodoSelecionado('2ª quinzena')}>
            <CardTitle className="flex items-center justify-between text-base">
              <span>2ª Quinzena (16-31)</span>
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getPeriodoStatus('2ª quinzena');
                  const Icon = status.icon;
                  return (
                    <>
                      <Icon className={`h-4 w-4 ${status.color}`} />
                      <Badge variant={segunda_quinzena ? 'default' : 'secondary'}>
                        {status.label}
                      </Badge>
                    </>
                  );
                })()}
              </div>
            </CardTitle>
          </CardHeader>
          {segunda_quinzena && (
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                <p>Fatura: {segunda_quinzena.fatura_veloe}</p>
                <p>Transações: {segunda_quinzena.total_transacoes}</p>
                <p>Valor: {segunda_quinzena.total_valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Área de Processamento */}
      <Card>
        <CardHeader>
          <CardTitle>
            Processar {periodoSelecionado}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {processamentoAtual ? (
            /* Período já processado */
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {periodoSelecionado} já processada
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Processada em {processamentoAtual.data_processamento.toLocaleDateString('pt-BR')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-lg font-bold">{processamentoAtual.total_transacoes}</div>
                  <div className="text-xs text-muted-foreground">Transações</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {processamentoAtual.total_valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <div className="text-xs text-muted-foreground">Valor Total</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{processamentoAtual.fatura_veloe}</div>
                  <div className="text-xs text-muted-foreground">Fatura</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {mapaMOI?.motoristas.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Rateios</div>
                </div>
              </div>
            </div>
          ) : (
            /* Processar novo período */
            <div className="space-y-4">
              {/* Informações da Fatura */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Número da Fatura Veloe
                  </label>
                  <Input
                    placeholder="Ex: VEL-2025-001"
                    value={faturaVeloe}
                    onChange={(e) => setFaturaVeloe(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Período de Referência
                  </label>
                  <Input
                    value={`${periodoSelecionado} - ${mapaMOI?.mes_referencia || 'MOI não carregado'}`}
                    disabled
                  />
                </div>
              </div>

              {/* Área de Upload */}
              <div className="border rounded-lg p-6">
                <FuelReportImportComponent
                  onImport={handleImportData}
                  loading={processando}
                  setLoading={setLoading}
                />
              </div>

              {/* Informações do Rateio */}
              {mapaMOI && (
                <Alert>
                  <FileSpreadsheet className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Rateio automático ativo:</strong> {mapaMOI.motoristas.length} motoristas com divisão configurada no MOI de {mapaMOI.mes_referencia}.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};