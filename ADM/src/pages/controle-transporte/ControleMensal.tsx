import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, AlertTriangle, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockDadosFechamento = [
  {
    id: "1",
    cca: "24043",
    obra: "Obra São Paulo Centro",
    fornecedor: "Transportadora São Paulo Ltda",
    periodo: "09/2024",
    medicoes_validadas: 3,
    nf_lancadas: 3,
    status_integracao: "ok",
    divergencias: 0,
    valor_total: 9000.00,
    status_fechamento: "aberto"
  },
  {
    id: "2",
    cca: "24044", 
    obra: "Obra Guarulhos",
    fornecedor: "Van Express Transportes",
    periodo: "09/2024",
    medicoes_validadas: 2,
    nf_lancadas: 1,
    status_integracao: "pendente",
    divergencias: 1,
    valor_total: 3600.00,
    status_fechamento: "aberto"
  }
];

export default function ControleMensal() {
  const [dadosFechamento] = useState(mockDadosFechamento);
  const [filtros, setFiltros] = useState({
    periodo: "09/2024",
    cca: "all",
    fornecedor: "all"
  });
  const [checklist, setChecklist] = useState({
    medicoes_validadas: false,
    nf_lancadas: false,
    sem_divergencias: false,
    alertas_resolvidos: false
  });
  const { toast } = useToast();

  const handleFecharMes = () => {
    const checklistCompleto = Object.values(checklist).every(item => item);
    
    if (!checklistCompleto) {
      toast({
        title: "Erro",
        description: "Complete todos os itens do checklist antes de fechar o mês",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Fechamento mensal realizado com sucesso. Período bloqueado para edições."
    });
  };

  const handleReabrirMes = () => {
    toast({
      title: "Aviso",
      description: "Período reaberto. Edições liberadas novamente."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return <Badge variant="default">OK</Badge>;
      case "erro":
        return <Badge variant="destructive">Erro</Badge>;
      case "pendente":
        return <Badge variant="secondary">Pendente</Badge>;
      case "fechado":
        return <Badge variant="outline">Fechado</Badge>;
      case "aberto":
        return <Badge variant="secondary">Aberto</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressoFechamento = (item: typeof mockDadosFechamento[0]) => {
    let pontos = 0;
    const totalPontos = 4;

    if (item.medicoes_validadas > 0) pontos++;
    if (item.nf_lancadas === item.medicoes_validadas) pontos++;
    if (item.status_integracao === "ok") pontos++;
    if (item.divergencias === 0) pontos++;

    return (pontos / totalPontos) * 100;
  };

  // Estatísticas gerais
  const totalMedicoes = dadosFechamento.reduce((sum, item) => sum + item.medicoes_validadas, 0);
  const totalNF = dadosFechamento.reduce((sum, item) => sum + item.nf_lancadas, 0);
  const totalDivergencias = dadosFechamento.reduce((sum, item) => sum + item.divergencias, 0);
  const totalValor = dadosFechamento.reduce((sum, item) => sum + item.valor_total, 0);

  const dadosFiltrados = dadosFechamento.filter(item => {
    return (filtros.cca === "all" || item.cca === filtros.cca) &&
           (filtros.fornecedor === "all" || item.fornecedor === filtros.fornecedor) &&
           item.periodo === filtros.periodo;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle Mensal de Lançamentos</h1>
          <p className="text-muted-foreground">Consolidação e fechamento mensal por CCA/Fornecedor</p>
        </div>
      </div>

      {/* KPIs de Fechamento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Total de Medições
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMedicoes}</div>
            <p className="text-xs text-muted-foreground">Validadas no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Total de NFs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNF}</div>
            <p className="text-xs text-muted-foreground">Lançadas e integradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Divergências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalDivergencias > 0 ? "text-red-600" : "text-green-600"}`}>
              {totalDivergencias}
            </div>
            <p className="text-xs text-muted-foreground">Pendências identificadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValor.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Setembro/2024</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Select value={filtros.periodo} onValueChange={(value) => setFiltros({...filtros, periodo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09/2024">Setembro/2024</SelectItem>
                  <SelectItem value="08/2024">Agosto/2024</SelectItem>
                  <SelectItem value="07/2024">Julho/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={filtros.cca} onValueChange={(value) => setFiltros({...filtros, cca: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Obra / CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os CCAs</SelectItem>
                  <SelectItem value="24043">24043 - Obra São Paulo Centro</SelectItem>
                  <SelectItem value="24044">24044 - Obra Guarulhos</SelectItem>
                  <SelectItem value="24045">24045 - Obra Osasco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={filtros.fornecedor} onValueChange={(value) => setFiltros({...filtros, fornecedor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os fornecedores</SelectItem>
                  <SelectItem value="transportadora-sp">Transportadora São Paulo Ltda</SelectItem>
                  <SelectItem value="van-express">Van Express Transportes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist de Fechamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Checklist de Fechamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="medicoes"
                checked={checklist.medicoes_validadas}
                onCheckedChange={(checked) => setChecklist({...checklist, medicoes_validadas: !!checked})}
              />
              <label htmlFor="medicoes" className="text-sm font-medium">
                ✓ Todas as medições do mês estão validadas
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="nf"
                checked={checklist.nf_lancadas}
                onCheckedChange={(checked) => setChecklist({...checklist, nf_lancadas: !!checked})}
              />
              <label htmlFor="nf" className="text-sm font-medium">
                ✓ Todas as NF estão lançadas e integradas ao Sienge
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="divergencias"
                checked={checklist.sem_divergencias}
                onCheckedChange={(checked) => setChecklist({...checklist, sem_divergencias: !!checked})}
              />
              <label htmlFor="divergencias" className="text-sm font-medium">
                ✓ Sem divergências bloqueantes
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="alertas"
                checked={checklist.alertas_resolvidos}
                onCheckedChange={(checked) => setChecklist({...checklist, alertas_resolvidos: !!checked})}
              />
              <label htmlFor="alertas" className="text-sm font-medium">
                ✓ Alertas críticos resolvidos
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button onClick={handleFecharMes} className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Fechar Mês (Matricial)
            </Button>
            <Button variant="outline" onClick={handleReabrirMes} className="flex items-center gap-2">
              <Unlock className="w-4 h-4" />
              Reabrir Período
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Consolidação por CCA/Fornecedor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Consolidação Mensal - {filtros.periodo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Medições Validadas</TableHead>
                <TableHead>NFs Lançadas</TableHead>
                <TableHead>Status Integração</TableHead>
                <TableHead>Divergências</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosFiltrados.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.cca}</TableCell>
                  <TableCell>{item.obra}</TableCell>
                  <TableCell>{item.fornecedor}</TableCell>
                  <TableCell>{item.medicoes_validadas}</TableCell>
                  <TableCell>{item.nf_lancadas}</TableCell>
                  <TableCell>{getStatusBadge(item.status_integracao)}</TableCell>
                  <TableCell>
                    <Badge variant={item.divergencias > 0 ? "destructive" : "default"}>
                      {item.divergencias}
                    </Badge>
                  </TableCell>
                  <TableCell>R$ {item.valor_total.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">{getProgressoFechamento(item).toFixed(0)}%</span>
                      </div>
                      <Progress value={getProgressoFechamento(item)} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status_fechamento)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}