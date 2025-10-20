import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockAlertas = [
  {
    id: "1",
    cca: "24043",
    obra: "Obra São Paulo Centro",
    tipo: "Integração Sienge",
    descricao: "Falha na integração da NF 001234 - Erro de conexão com API",
    data_identificacao: "2024-09-25",
    responsavel: "Matricial",
    vinculo_medicao: "MED-001",
    vinculo_nf: "NF-001234",
    status: "aberto",
    observacoes: "Erro intermitente - necessário reprocessar"
  },
  {
    id: "2",
    cca: "24044", 
    obra: "Obra Guarulhos",
    tipo: "Documental",
    descricao: "NF lançada sem vínculo de Medição - NF 001235",
    data_identificacao: "2024-09-24",
    responsavel: "Administrativo",
    vinculo_medicao: "",
    vinculo_nf: "NF-001235",
    status: "em_tratativa",
    observacoes: "Vinculação pendente"
  },
  {
    id: "3",
    cca: "24043",
    obra: "Obra São Paulo Centro", 
    tipo: "Operacional",
    descricao: "Medição Validada sem NF há 7 dias - MED-002",
    data_identificacao: "2024-09-20",
    responsavel: "Matricial",
    vinculo_medicao: "MED-002",
    vinculo_nf: "",
    status: "resolvido",
    observacoes: "NF lançada em 26/09/2024"
  }
];

export default function AlertasTransporte() {
  const [alertas] = useState(mockAlertas);
  const [novoAlerta, setNovoAlerta] = useState({
    cca: "",
    tipo: "",
    descricao: "",
    responsavel: "",
    vinculo_medicao: "",
    vinculo_nf: "",
    observacoes: ""
  });
  const [filtros, setFiltros] = useState({
    cca: "all",
    tipo: "all", 
    status: "all",
    responsavel: "all"
  });
  const { toast } = useToast();

  const handleSalvar = () => {
    if (!novoAlerta.cca || !novoAlerta.tipo || !novoAlerta.descricao) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Alerta cadastrado com sucesso"
    });
    
    // Reset form
    setNovoAlerta({
      cca: "",
      tipo: "",
      descricao: "",
      responsavel: "",
      vinculo_medicao: "",
      vinculo_nf: "",
      observacoes: ""
    });
  };

  const handleAlterarStatus = (id: string, novoStatus: string) => {
    toast({
      title: "Sucesso",
      description: `Status do alerta alterado para ${novoStatus}`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aberto":
        return <Badge variant="destructive">Aberto</Badge>;
      case "em_tratativa":
        return <Badge variant="secondary">Em Tratativa</Badge>;
      case "resolvido":
        return <Badge variant="default">Resolvido</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Integração Sienge":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Documental":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "Operacional":
        return <Clock className="w-4 h-4 text-blue-600" />;  
      case "Financeiro":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const alertasFiltrados = alertas.filter(alerta => {
    return (filtros.cca === "all" || alerta.cca === filtros.cca) &&
           (filtros.tipo === "all" || alerta.tipo === filtros.tipo) &&
           (filtros.status === "all" || alerta.status === filtros.status) &&
           (filtros.responsavel === "all" || alerta.responsavel === filtros.responsavel);
  });

  // Estatísticas
  const totalAlertas = alertas.length;
  const alertasAbertos = alertas.filter(a => a.status === "aberto").length;
  const alertasEmTratativa = alertas.filter(a => a.status === "em_tratativa").length;
  const alertasResolvidos = alertas.filter(a => a.status === "resolvido").length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertas</h1>
          <p className="text-muted-foreground">Monitorar pendências, inconsistências e falhas de integração</p>
        </div>
      </div>

      {/* KPIs de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Total de Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlertas}</div>
            <p className="text-xs text-muted-foreground">Todos os períodos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              Alertas Abertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertasAbertos}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              Em Tratativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{alertasEmTratativa}</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Resolvidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{alertasResolvidos}</div>
            <p className="text-xs text-muted-foreground">Concluídos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filtro-cca">Obra / CCA</Label>
              <Select value={filtros.cca} onValueChange={(value) => setFiltros({...filtros, cca: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por CCA" />
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
              <Label htmlFor="filtro-tipo">Tipo de Alerta</Label>
              <Select value={filtros.tipo} onValueChange={(value) => setFiltros({...filtros, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Documental">Documental</SelectItem>
                  <SelectItem value="Operacional">Operacional</SelectItem>
                  <SelectItem value="Integração Sienge">Integração Sienge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-status">Status</Label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="em_tratativa">Em Tratativa</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-responsavel">Responsável</Label>
              <Select value={filtros.responsavel} onValueChange={(value) => setFiltros({...filtros, responsavel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os responsáveis</SelectItem>
                  <SelectItem value="Administrativo">Administrativo</SelectItem>
                  <SelectItem value="Matricial">Matricial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Novo Alerta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Novo Alerta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cca">Obra / Projeto (CCA) *</Label>
              <Select value={novoAlerta.cca} onValueChange={(value) => setNovoAlerta({...novoAlerta, cca: value})}>
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
              <Label htmlFor="tipo">Tipo de Alerta *</Label>
              <Select value={novoAlerta.tipo} onValueChange={(value) => setNovoAlerta({...novoAlerta, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Documental">Documental</SelectItem>
                  <SelectItem value="Operacional">Operacional</SelectItem>
                  <SelectItem value="Integração Sienge">Integração Sienge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea 
                id="descricao"
                value={novoAlerta.descricao}
                onChange={(e) => setNovoAlerta({...novoAlerta, descricao: e.target.value})}
                placeholder="Descreva o problema identificado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável pela Tratativa *</Label>
              <Select value={novoAlerta.responsavel} onValueChange={(value) => setNovoAlerta({...novoAlerta, responsavel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrativo">Administrativo</SelectItem>
                  <SelectItem value="Matricial">Matricial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vinculo_medicao">Vínculo - Medição (opcional)</Label>
              <Input 
                id="vinculo_medicao"
                value={novoAlerta.vinculo_medicao}
                onChange={(e) => setNovoAlerta({...novoAlerta, vinculo_medicao: e.target.value})}
                placeholder="ID da medição relacionada"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vinculo_nf">Vínculo - NF (opcional)</Label>
              <Input 
                id="vinculo_nf"
                value={novoAlerta.vinculo_nf}
                onChange={(e) => setNovoAlerta({...novoAlerta, vinculo_nf: e.target.value})}
                placeholder="Número da NF relacionada"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes"
                value={novoAlerta.observacoes}
                onChange={(e) => setNovoAlerta({...novoAlerta, observacoes: e.target.value})}
                placeholder="Observações adicionais"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSalvar}>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Alerta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertas ({alertasFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Vínculos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertasFiltrados.map((alerta) => (
                <TableRow key={alerta.id}>
                  <TableCell className="font-medium">{alerta.cca}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTipoIcon(alerta.tipo)}
                      <span className="text-sm">{alerta.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={alerta.descricao}>
                    {alerta.descricao}
                  </TableCell>
                  <TableCell>{alerta.data_identificacao}</TableCell>
                  <TableCell>{alerta.responsavel}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {alerta.vinculo_medicao && (
                        <Badge variant="outline" className="text-xs">
                          {alerta.vinculo_medicao}
                        </Badge>
                      )}
                      {alerta.vinculo_nf && (
                        <Badge variant="outline" className="text-xs">
                          {alerta.vinculo_nf}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(alerta.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {alerta.status === "aberto" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAlterarStatus(alerta.id, "em_tratativa")}
                        >
                          <Clock className="w-3 h-3" />
                        </Button>
                      )}
                      {alerta.status === "em_tratativa" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAlterarStatus(alerta.id, "resolvido")}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}