import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Plus, Eye, Pencil, Trash2, Search, Download, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import type { ControlePassivos } from "@/types/passivos";
import { NovoPassivoModal } from "@/components/passivos/NovoPassivoModal";
import { VisualizarPassivoModal } from "@/components/passivos/VisualizarPassivoModal";
import { EditarPassivoModal } from "@/components/passivos/EditarPassivoModal";
import { PassivoStatusBadge } from "@/components/passivos/PassivoStatusBadge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as XLSX from "xlsx";

export default function ControlePassivos() {
  const [passivos, setPassivos] = useState<ControlePassivos[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [novoModalOpen, setNovoModalOpen] = useState(false);
  const [visualizarModalOpen, setVisualizarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [passivoSelecionado, setPassivoSelecionado] = useState<ControlePassivos | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("controle_passivos");
    if (stored) {
      const passivosstored = JSON.parse(stored);
      setPassivos(passivosstored);
    }
  }, []);

  const salvarPassivos = (novospassivos: ControlePassivos[]) => {
    localStorage.setItem("controle_passivos", JSON.stringify(novospassivos));
    setPassivos(novospassivos);
  };

  const handleNovoPassivo = (novoPassivo: ControlePassivos) => {
    const novospassivos = [...passivos, novoPassivo];
    salvarPassivos(novospassivos);
  };

  const handleEditarPassivo = (passivoAtualizado: ControlePassivos) => {
    const novospassivos = passivos.map(p => p.id === passivoAtualizado.id ? passivoAtualizado : p);
    salvarPassivos(novospassivos);
  };

  const handleExcluirPassivo = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este passivo?")) {
      const novospassivos = passivos.filter(p => p.id !== id);
      salvarPassivos(novospassivos);
      toast.success("Passivo excluído com sucesso!");
    }
  };

  const handleVisualizar = (passivo: ControlePassivos) => {
    setPassivoSelecionado(passivo);
    setVisualizarModalOpen(true);
  };

  const handleEditar = (passivo: ControlePassivos) => {
    setPassivoSelecionado(passivo);
    setEditarModalOpen(true);
  };

  const handleExportarExcel = () => {
    const dadosExport = passivos.map(p => ({
      "Prestador": p.nomeprestador,
      "Empresa": p.empresa,
      "Cargo": p.cargo,
      "Salário Base": p.salariobase,
      "Data Admissão": format(new Date(p.dataadmissao), "dd/MM/yyyy"),
      "Data Corte": format(new Date(p.datacorte), "dd/MM/yyyy"),
      "Saldo Férias": p.saldoferias,
      "13º Salário": p.decimoterceiro,
      "Aviso Prévio": p.avisopravio,
      "Total": p.total,
      "Status": p.status,
      "Observações": p.observacoes || ""
    }));

    const ws = XLSX.utils.json_to_sheet(dadosExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Passivos");
    XLSX.writeFile(wb, `controle_passivos_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Relatório exportado com sucesso!");
  };

  const passivosFiltrados = passivos.filter(p =>
    p.nomeprestador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPassivos = passivos.reduce((acc, p) => acc + p.total, 0);
  const colaboradoresComPendencias = passivos.filter(p => p.status === "ativo" || p.status === "pendente").length;
  const maiorPassivo = passivos.length > 0 ? Math.max(...passivos.map(p => p.total)) : 0;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calculator className="h-8 w-8" />
            Controle de passivos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os cálculos de passivos trabalhistas
          </p>
        </div>
        <Button onClick={() => setNovoModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo cálculo de passivo
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de passivos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPassivos)}</div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os passivos calculados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prestadores com pendências</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{colaboradoresComPendencias}</div>
            <p className="text-xs text-muted-foreground">
              Passivos ativos ou pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior passivo individual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(maiorPassivo)}</div>
            <p className="text-xs text-muted-foreground">
              Maior valor calculado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Passivos Cadastrados</CardTitle>
          <CardDescription>
            Lista completa de passivos trabalhistas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código, cargo ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleExportarExcel}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Data admissão</TableHead>
                  <TableHead>Data corte</TableHead>
                  <TableHead className="text-right">Saldo férias</TableHead>
                  <TableHead className="text-right">13º salário</TableHead>
                  <TableHead className="text-right">Aviso prévio</TableHead>
                  <TableHead className="text-right font-bold">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {passivosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Nenhum passivo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  passivosFiltrados.map((passivo) => (
                    <TableRow key={passivo.id}>
                      <TableCell className="font-medium">{passivo.nomeprestador}</TableCell>
                      <TableCell>{passivo.empresa}</TableCell>
                      <TableCell>{format(new Date(passivo.dataadmissao), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{format(new Date(passivo.datacorte), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="text-right">{formatCurrency(passivo.saldoferias)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(passivo.decimoterceiro)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(passivo.avisopravio)}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {formatCurrency(passivo.total)}
                      </TableCell>
                      <TableCell>
                        <PassivoStatusBadge status={passivo.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVisualizar(passivo)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditar(passivo)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExcluirPassivo(passivo.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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

      {/* Modais */}
      <NovoPassivoModal
        open={novoModalOpen}
        onOpenChange={setNovoModalOpen}
        onSave={handleNovoPassivo}
      />

      <VisualizarPassivoModal
        passivo={passivoSelecionado}
        open={visualizarModalOpen}
        onOpenChange={setVisualizarModalOpen}
      />

      <EditarPassivoModal
        passivo={passivoSelecionado}
        open={editarModalOpen}
        onOpenChange={setEditarModalOpen}
        onSave={handleEditarPassivo}
      />
    </div>
  );
}
