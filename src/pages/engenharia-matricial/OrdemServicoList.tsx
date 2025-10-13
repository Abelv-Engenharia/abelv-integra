import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useOSList } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";

const statusConfig = {
  aberta: { label: "Os aberta", color: "bg-blue-100 text-blue-800", variant: "secondary" as const },
  "em-planejamento": {
    label: "Em planejamento",
    color: "bg-yellow-100 text-yellow-800",
    variant: "secondary" as const,
  },
  "aguardando-aceite": {
    label: "Aguardando aceite do solicitante",
    color: "bg-orange-100 text-orange-800",
    variant: "secondary" as const,
  },
  "em-execucao": { label: "Em execução", color: "bg-green-100 text-green-800", variant: "secondary" as const },
  "aguardando-aceite-fechamento": {
    label: "Aguardando aceite fechamento",
    color: "bg-purple-100 text-purple-800",
    variant: "secondary" as const,
  },
  cancelada: { label: "Cancelada", color: "bg-red-100 text-red-800", variant: "destructive" as const },
  concluida: { label: "Concluída", color: "bg-emerald-100 text-emerald-800", variant: "secondary" as const },
  rejeitada: { label: "Rejeitada", color: "bg-red-200 text-red-900", variant: "destructive" as const },
};

const OrdemServicoList = () => {
  const { data: osList = [], isLoading } = useOSList();
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroCliente, setFiltroCliente] = useState<string>("todos");
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("todos");
  const [buscaTexto, setBuscaTexto] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const calcularHHTotal = (hhPlanejado: number | null, hhAdicional: number | null) => {
    return (hhPlanejado || 0) + (hhAdicional || 0);
  };

  const calcularPercentualAdicional = (hhPlanejado: number | null, hhAdicional: number | null) => {
    if (!hhPlanejado || hhPlanejado === 0) return "0.0";
    return (((hhAdicional || 0) / hhPlanejado) * 100).toFixed(1);
  };

  // Filtrar OS baseado nos filtros ativos
  const osFiltradas = osList.filter((os) => {
    // Filtro por status
    if (filtroStatus !== "todos" && os.status !== filtroStatus) return false;

    // Filtro por cliente
    if (filtroCliente !== "todos" && os.cca?.nome?.toLowerCase() !== filtroCliente) return false;

    // Filtro por disciplina
    if (filtroDisciplina !== "todos" && os.disciplina?.toLowerCase() !== filtroDisciplina) return false;

    // Filtro de busca por texto
    if (buscaTexto) {
      const texto = buscaTexto.toLowerCase();
      return os.cca?.codigo?.toString().includes(texto) || os.descricao?.toLowerCase().includes(texto);
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordens de serviço</h1>
          <p className="text-muted-foreground">Gerencie as os da engenharia matricial</p>
        </div>
        <Link to="/engenharia-matricial/nova-os">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova os
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cca, descrição..."
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Status</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filtroStatus === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("todos")}
                >
                  Todos
                </Button>
                <Button
                  variant={filtroStatus === "aberta" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("aberta")}
                >
                  Os aberta
                </Button>
                <Button
                  variant={filtroStatus === "em-planejamento" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("em-planejamento")}
                >
                  Em planejamento
                </Button>
                <Button
                  variant={filtroStatus === "aguardando-aceite" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("aguardando-aceite")}
                >
                  Aguardando aceite
                </Button>
                <Button
                  variant={filtroStatus === "em-execucao" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("em-execucao")}
                >
                  Em execução
                </Button>
                <Button
                  variant={filtroStatus === "aguardando-aceite-fechamento" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("aguardando-aceite-fechamento")}
                >
                  Aguardando aceite fechamento
                </Button>
                <Button
                  variant={filtroStatus === "cancelada" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("cancelada")}
                >
                  Cancelada
                </Button>
                <Button
                  variant={filtroStatus === "concluida" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("concluida")}
                >
                  Concluída
                </Button>
              </div>
            </div>

            {/* Disciplina */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Disciplina</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filtroDisciplina === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroDisciplina("todos")}
                >
                  Todas
                </Button>
                <Button
                  variant={filtroDisciplina === "eletrica" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroDisciplina("eletrica")}
                >
                  Elétrica
                </Button>
                <Button
                  variant={filtroDisciplina === "mecanica" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroDisciplina("mecanica")}
                >
                  Mecânica
                </Button>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de OS */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de ordens de serviço</CardTitle>
          <CardDescription>{osFiltradas.length} os encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Os</TableHead>
                  <TableHead>Cca</TableHead>
                  <TableHead>Data abertura</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor orçamento</TableHead>
                  <TableHead>Hh planejado</TableHead>
                  <TableHead>Hh adicional</TableHead>
                  <TableHead>Hh total</TableHead>
                  <TableHead>% adicional</TableHead>
                  <TableHead>Data conclusão</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {osFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center text-muted-foreground">
                      Nenhuma os encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  osFiltradas.map((os) => (
                    <TableRow key={os.id}>
                      <TableCell className="font-medium">#{os.numero}</TableCell>
                      <TableCell>{os.cca?.codigo || "-"}</TableCell>
                      <TableCell>{formatDate(os.data_abertura)}</TableCell>
                      <TableCell>{os.disciplina || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={os.descricao || ""}>
                        {os.descricao || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[os.status as keyof typeof statusConfig]?.variant}>
                          {statusConfig[os.status as keyof typeof statusConfig]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(os.valor_orcamento || 0)}</TableCell>
                      <TableCell>{os.hh_planejado || 0}</TableCell>
                      <TableCell>{os.hh_adicional || 0}</TableCell>
                      <TableCell>{calcularHHTotal(os.hh_planejado, os.hh_adicional)}</TableCell>
                      <TableCell>{calcularPercentualAdicional(os.hh_planejado, os.hh_adicional)}%</TableCell>
                      <TableCell>{formatDate(os.data_conclusao)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/engenharia-matricial/os/${os.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdemServicoList;
