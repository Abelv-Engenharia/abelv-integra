import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockMetas = [
  {
    id: "1",
    cca: "24043",
    obra: "Obra São Paulo Centro",
    fornecedor: "Transportadora São Paulo Ltda",
    periodo: "09/2024",
    meta_mensal_viagens: 60,
    meta_mensal_valor: 9000.00,
    realizado_viagens: 58,
    realizado_valor: 8700.00,
    percentual: 96.7,
    status: "em_andamento"
  },
  {
    id: "2",
    cca: "24044",
    obra: "Obra Guarulhos", 
    fornecedor: "Van Express Transportes",
    periodo: "09/2024",
    meta_mensal_viagens: 45,
    meta_mensal_valor: 3600.00,
    realizado_viagens: 45,
    realizado_valor: 3600.00,
    percentual: 100.0,
    status: "concluido"
  }
];

export default function Metas() {
  const [metas] = useState(mockMetas);
  const [novaMeta, setNovaMeta] = useState({
    cca: "",
    fornecedor: "",
    periodo: "",
    meta_mensal_viagens: "",
    meta_mensal_valor: ""
  });
  const { toast } = useToast();

  const handleSalvar = () => {
    if (!novaMeta.cca || !novaMeta.fornecedor || !novaMeta.meta_mensal_viagens) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Meta cadastrada com sucesso"
    });
    
    // Reset form
    setNovaMeta({
      cca: "",
      fornecedor: "",
      periodo: "",
      meta_mensal_viagens: "",
      meta_mensal_valor: ""
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

  const getProgressColor = (percentual: number) => {
    if (percentual >= 100) return "bg-green-600";
    if (percentual >= 80) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas</h1>
          <p className="text-muted-foreground">Definir e acompanhar metas por CCA/Fornecedor/período</p>
        </div>
      </div>

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
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Total de metas no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Média de Atingimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.4%</div>
            <p className="text-xs text-muted-foreground">Média geral das metas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Metas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-xs text-muted-foreground">De 2 metas ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Valor Total Realizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.300</div>
            <p className="text-xs text-muted-foreground">Setembro/2024</p>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Nova Meta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nova Meta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cca">Obra / Projeto (CCA) *</Label>
              <Select value={novaMeta.cca} onValueChange={(value) => setNovaMeta({...novaMeta, cca: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24043">24043 - Obra São Paulo Centro</SelectItem>
                  <SelectItem value="24044">24044 - Obra Guarulhos</SelectItem>
                  <SelectItem value="24045">24045 - Obra Osasco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Select value={novaMeta.fornecedor} onValueChange={(value) => setNovaMeta({...novaMeta, fornecedor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transportadora-sp">Transportadora São Paulo Ltda</SelectItem>
                  <SelectItem value="van-express">Van Express Transportes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo">Período (Mês/Ano) *</Label>
              <Input 
                id="periodo"
                type="month"
                value={novaMeta.periodo}
                onChange={(e) => setNovaMeta({...novaMeta, periodo: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_viagens">Meta Mensal (Viagens) *</Label>
              <Input 
                id="meta_viagens"
                type="number"
                value={novaMeta.meta_mensal_viagens}
                onChange={(e) => setNovaMeta({...novaMeta, meta_mensal_viagens: e.target.value})}
                placeholder="Número de viagens"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_valor">Meta Mensal (Valor) *</Label>
              <Input 
                id="meta_valor"
                type="number"
                step="0.01"
                value={novaMeta.meta_mensal_valor}
                onChange={(e) => setNovaMeta({...novaMeta, meta_mensal_valor: e.target.value})}
                placeholder="Valor em reais"
              />
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Meta Viagens</TableHead>
                <TableHead>Meta Valor</TableHead>
                <TableHead>Realizado</TableHead>
                <TableHead>Atingimento</TableHead>
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
                  <TableCell>{meta.meta_mensal_viagens}</TableCell>
                  <TableCell>R$ {meta.meta_mensal_valor.toFixed(2)}</TableCell>
                  <TableCell>
                    <div>
                      <div>{meta.realizado_viagens} viagens</div>
                      <div className="text-sm text-muted-foreground">
                        R$ {meta.realizado_valor.toFixed(2)}
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