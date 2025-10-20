import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface CCRData {
  obra: string;
  totalContratual: number;
  totalRealizado: number;
  previsaoCCR: number;
  pendencias: number;
  lancamentosConferidos: number;
}

// Mock data para diferentes obras
const mockCCRData = {
  "25051": {
    obra: "CCA 25051 - Obra Alpha",
    totalContratual: 850000,
    totalRealizado: 632500,
    previsaoCCR: 710000,
    pendencias: 5,
    lancamentosConferidos: 23
  },
  "25052": {
    obra: "CCA 25052 - Obra Beta", 
    totalContratual: 1200000,
    totalRealizado: 1180000,
    previsaoCCR: 1150000,
    pendencias: 2,
    lancamentosConferidos: 31
  },
  "25053": {
    obra: "CCA 25053 - Obra Gamma",
    totalContratual: 650000,
    totalRealizado: 425000,
    previsaoCCR: 480000,
    pendencias: 8,
    lancamentosConferidos: 15
  }
};

const obras = [
  { value: "25051", label: "CCA 25051 - Obra Alpha" },
  { value: "25052", label: "CCA 25052 - Obra Beta" },
  { value: "25053", label: "CCA 25053 - Obra Gamma" }
];

export default function ResumoCCRObra() {
  const [obraSelecionada, setObraSelecionada] = useState<string>('');

  const dados = obraSelecionada ? mockCCRData[obraSelecionada as keyof typeof mockCCRData] : null;
  
  const calcularDiferenca = () => {
    if (!dados) return { valor: 0, percentual: 0, status: 'neutro' };
    
    const diferenca = dados.totalRealizado - dados.previsaoCCR;
    const percentual = ((diferenca / dados.previsaoCCR) * 100);
    const status = diferenca <= 0 ? 'positivo' : 'negativo';
    
    return { valor: diferenca, percentual, status };
  };

  const calcularPercentualRealizado = () => {
    if (!dados) return 0;
    return Math.round((dados.totalRealizado / dados.totalContratual) * 100);
  };

  const diferenca = calcularDiferenca();
  const percentualRealizado = calcularPercentualRealizado();

  return (
    <div className="space-y-6">
      {/* Seleção da Obra */}
      <Card>
        <CardHeader>
          <CardTitle>Seleção da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={obraSelecionada} onValueChange={setObraSelecionada}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma obra para visualizar o resumo CCR" />
            </SelectTrigger>
            <SelectContent>
              {obras.map((obra) => (
                <SelectItem key={obra.value} value={obra.value}>
                  {obra.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Resumo Financeiro Principal */}
      {dados && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumo Financeiro - {dados.obra}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Contratual</p>
                  <p className="text-2xl font-bold">
                    R$ {dados.totalContratual.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Realizado</p>
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {dados.totalRealizado.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Previsão CCR</p>
                  <p className="text-2xl font-bold text-orange-600">
                    R$ {dados.previsaoCCR.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Diferença Total</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${
                      diferenca.status === 'positivo' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {diferenca.valor >= 0 ? '+' : ''}R$ {Math.abs(diferenca.valor).toLocaleString('pt-BR')}
                    </p>
                    <Badge variant={diferenca.status === 'positivo' ? 'default' : 'destructive'}>
                      {diferenca.percentual >= 0 ? '+' : ''}{diferenca.percentual.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Indicador de Progresso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Percentual Realizado vs Contratual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Progresso da obra</span>
                  <span className="text-sm font-medium">{percentualRealizado}%</span>
                </div>
                <Progress value={percentualRealizado} className="w-full" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Valor executado: </span>
                    <span className="font-medium">R$ {dados.totalRealizado.toLocaleString('pt-BR')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor contratual: </span>
                    <span className="font-medium">R$ {dados.totalContratual.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards Auxiliares */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendências</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{dados.pendencias}</div>
                <p className="text-xs text-muted-foreground">
                  Requerem atenção
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lançamentos Conferidos</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{dados.lancamentosConferidos}</div>
                <p className="text-xs text-muted-foreground">
                  No mês atual
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Geral */}
          <Card>
            <CardHeader>
              <CardTitle>Status Geral da Obra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {diferenca.status === 'positivo' ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Dentro da previsão CCR</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Acima da previsão CCR</span>
                  </div>
                )}
                <Badge variant={diferenca.status === 'positivo' ? 'default' : 'destructive'}>
                  {diferenca.status === 'positivo' ? 'Economia' : 'Excesso'}: R$ {Math.abs(diferenca.valor).toLocaleString('pt-BR')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {diferenca.status === 'positivo' 
                  ? 'A obra está executando dentro do orçamento previsto no CCR.'
                  : 'A obra apresenta custos acima do previsto no CCR. Recomenda-se revisão dos lançamentos.'
                }
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}