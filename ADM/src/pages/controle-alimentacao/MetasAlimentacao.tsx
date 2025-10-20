import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Target, Plus, TrendingUp, Utensils, AlertCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockMetas = [
  {
    id: "1",
    cca: "CCA25052",
    obra: "24021 - ROUSSELOT - CANINDÉ",
    fornecedor: "Caio Henrique Alves Lima",
    periodo: "09/2024",
    meta_mensal_refeicoes: 840,
    meta_mensal_valor: 18480.00,
    valor_unitario: 22.00,
    dias_uteis: 21,
    realizado_refeicoes: 820,
    realizado_valor: 18040.00,
    percentual: 97.6,
    status: "em_andamento",
    ultima_medicao: "2024-09-15",
    alertas_ativos: true
  },
  {
    id: "2",
    cca: "CCA25051",
    obra: "24022 - OBRA BETA", 
    fornecedor: "Restaurante Bom Sabor LTDA",
    periodo: "09/2024",
    meta_mensal_refeicoes: 600,
    meta_mensal_valor: 13200.00,
    valor_unitario: 22.00,
    dias_uteis: 21,
    realizado_refeicoes: 600,
    realizado_valor: 13200.00,
    percentual: 100.0,
    status: "concluido",
    ultima_medicao: "2024-09-30",
    alertas_ativos: true
  }
];

export default function MetasAlimentacao() {
  const [metas] = useState(mockMetas);
  const [novaMeta, setNovaMeta] = useState({
    cca: "",
    fornecedor: "",
    periodo: "",
    meta_mensal_refeicoes: "",
    valor_unitario: "",
    dias_uteis: "",
    alertas_ativos: true
  });
  const { toast } = useToast();

  const calcularMetaValor = () => {
    if (novaMeta.meta_mensal_refeicoes && novaMeta.valor_unitario) {
      return (parseFloat(novaMeta.meta_mensal_refeicoes) * parseFloat(novaMeta.valor_unitario)).toFixed(2);
    }
    return "0.00";
  };

  const handleSalvar = () => {
    if (!novaMeta.cca || !novaMeta.fornecedor || !novaMeta.meta_mensal_refeicoes || !novaMeta.valor_unitario) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Meta cadastrada com sucesso. Alertas automáticos serão enviados no dia 1º de cada mês."
    });
    
    // Reset form
    setNovaMeta({
      cca: "",
      fornecedor: "",
      periodo: "",
      meta_mensal_refeicoes: "",
      valor_unitario: "",
      dias_uteis: "",
      alertas_ativos: true
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "concluido":
        return <Badge variant="default">Concluído</Badge>;
      case "em_andamento":
        return <Badge variant="secondary">Em Andamento</Badge>;
      default:
        return <Badge variant="outline">Não Iniciado</Badge>;
    }
  };

  const totalMetasAtivas = metas.length;
  const metasConcluidas = metas.filter(m => m.status === "concluido").length;
  const mediaAtingimento = metas.reduce((sum, m) => sum + m.percentual, 0) / metas.length;
  const valorTotalRealizado = metas.reduce((sum, m) => sum + m.realizado_valor, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas - Controle de Alimentação</h1>
          <p className="text-muted-foreground">Definir e acompanhar metas mensais por CCA/Fornecedor</p>
        </div>
      </div>

      {/* Alerta Informativo */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Lembrete Automático:</strong> Todo dia 1º de cada mês, será enviado um alerta por e-mail aos administrativos 
          responsáveis para realizarem a medição e anexarem a nota fiscal até o dia 3 do mês subsequente.
        </AlertDescription>
      </Alert>

      {/* KPIs de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Metas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetasAtivas}</div>
            <p className="text-xs text-muted-foreground">Total de metas no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 w-4" />
              Média de Atingimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaAtingimento.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Média geral das metas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Metas Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metasConcluidas}</div>
            <p className="text-xs text-muted-foreground">De {totalMetasAtivas} metas ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Valor Total Realizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {valorTotalRealizado.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Setembro/2024</p>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Nova Meta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nova Meta de Alimentação
          </CardTitle>
          <CardDescription>
            Configure a meta mensal de refeições por CCA. O sistema calculará automaticamente o valor baseado 
            na quantidade de refeições e valor unitário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cca" className="text-red-500">Obra / Projeto (CCA) *</Label>
              <Select value={novaMeta.cca} onValueChange={(value) => setNovaMeta({...novaMeta, cca: value})}>
                <SelectTrigger className={!novaMeta.cca ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Selecione a obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CCA25052">CCA25052 - 24021 - ROUSSELOT - CANINDÉ</SelectItem>
                  <SelectItem value="CCA25051">CCA25051 - 24022 - OBRA BETA</SelectItem>
                  <SelectItem value="CCA25050">CCA25050 - 24023 - OBRA GAMMA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor" className="text-red-500">Fornecedor *</Label>
              <Input 
                id="fornecedor"
                value={novaMeta.fornecedor}
                onChange={(e) => setNovaMeta({...novaMeta, fornecedor: e.target.value})}
                placeholder="Nome do fornecedor"
                className={!novaMeta.fornecedor ? 'border-red-300' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo" className="text-red-500">Período (Mês/Ano) *</Label>
              <Input 
                id="periodo"
                type="month"
                value={novaMeta.periodo}
                onChange={(e) => setNovaMeta({...novaMeta, periodo: e.target.value})}
                className={!novaMeta.periodo ? 'border-red-300' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dias_uteis">Dias Úteis do Mês</Label>
              <Input 
                id="dias_uteis"
                type="number"
                value={novaMeta.dias_uteis}
                onChange={(e) => setNovaMeta({...novaMeta, dias_uteis: e.target.value})}
                placeholder="Ex: 21"
              />
              <p className="text-xs text-muted-foreground">
                Informativo para cálculo de efetivo x dias úteis
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_refeicoes" className="text-red-500">Meta Mensal (Refeições) *</Label>
              <Input 
                id="meta_refeicoes"
                type="number"
                value={novaMeta.meta_mensal_refeicoes}
                onChange={(e) => setNovaMeta({...novaMeta, meta_mensal_refeicoes: e.target.value})}
                placeholder="Quantidade de refeições"
                className={!novaMeta.meta_mensal_refeicoes ? 'border-red-300' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Baseado no efetivo do Nydhus na obra
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_unitario" className="text-red-500">Valor Unitário (R$) *</Label>
              <Input 
                id="valor_unitario"
                type="number"
                step="0.01"
                value={novaMeta.valor_unitario}
                onChange={(e) => setNovaMeta({...novaMeta, valor_unitario: e.target.value})}
                placeholder="Valor por refeição"
                className={!novaMeta.valor_unitario ? 'border-red-300' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_valor">Meta Mensal (Valor Total)</Label>
              <Input 
                id="meta_valor"
                value={`R$ ${calcularMetaValor()}`}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Calculado automaticamente
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 mt-0.5 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">Alertas Automáticos</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  No dia 1º de cada mês, será enviado um e-mail para o administrativo responsável lembrando:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Realizar a medição de alimentação do mês anterior</li>
                  <li>Anexar a nota fiscal até o dia 3 do mês corrente</li>
                  <li>Verificar se as quantidades estão de acordo com o efetivo da obra</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSalvar}>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Meta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Metas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Metas Cadastradas
          </CardTitle>
          <CardDescription>
            Acompanhamento mensal das metas de alimentação por obra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Dias Úteis</TableHead>
                <TableHead>Meta Refeições</TableHead>
                <TableHead>Meta Valor</TableHead>
                <TableHead>Realizado</TableHead>
                <TableHead>Atingimento</TableHead>
                <TableHead>Última Medição</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metas.map((meta) => (
                <TableRow key={meta.id}>
                  <TableCell className="font-medium">{meta.cca}</TableCell>
                  <TableCell>{meta.obra}</TableCell>
                  <TableCell>{meta.fornecedor}</TableCell>
                  <TableCell>{meta.periodo}</TableCell>
                  <TableCell className="text-center">{meta.dias_uteis}</TableCell>
                  <TableCell>{meta.meta_mensal_refeicoes} ref.</TableCell>
                  <TableCell>R$ {meta.meta_mensal_valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <div>
                      <div>{meta.realizado_refeicoes} ref.</div>
                      <div className="text-sm text-muted-foreground">
                        R$ {meta.realizado_valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{meta.percentual.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={meta.percentual} 
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(meta.ultima_medicao).toLocaleDateString('pt-BR')}
                    </div>
                    {meta.alertas_ativos && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Alertas ativos
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(meta.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
