import { useState, useEffect } from "react";
import { Database, Plus, Search, Download, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FaturaIntegra } from "@/types/travel";
import { toast } from "sonner";
import { VisualizarFaturaModal } from "@/components/travel/VisualizarFaturaModal";
import { EditarFaturaModal } from "@/components/travel/EditarFaturaModal";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const ConsultaFaturas = () => {
  const navigate = useNavigate();
  const [faturas, setFaturas] = useState<FaturaIntegra[]>([]);
  const [filteredFaturas, setFilteredFaturas] = useState<FaturaIntegra[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [agenciaFilter, setAgenciaFilter] = useState<string>("all");
  const [tipoFilter, setTipoFilter] = useState<string>("all");
  const [politicaFilter, setPoliticaFilter] = useState<string>("all");
  const [faturaToView, setFaturaToView] = useState<FaturaIntegra | null>(null);
  const [faturaToEdit, setFaturaToEdit] = useState<FaturaIntegra | null>(null);
  const [faturaToDelete, setFaturaToDelete] = useState<FaturaIntegra | null>(null);

  useEffect(() => {
    loadFaturas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [faturas, searchTerm, agenciaFilter, tipoFilter, politicaFilter]);

  const loadFaturas = () => {
    const stored = localStorage.getItem("faturas_integra");
    if (stored) {
      setFaturas(JSON.parse(stored));
    }
  };

  const applyFilters = () => {
    let filtered = [...faturas];

    if (searchTerm) {
      filtered = filtered.filter(
        f =>
          f.viajante.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.numerodefat.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.protocolo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (agenciaFilter !== "all") {
      filtered = filtered.filter(f => f.agencia === agenciaFilter);
    }

    if (tipoFilter !== "all") {
      filtered = filtered.filter(f => f.tipo === tipoFilter);
    }

    if (politicaFilter !== "all") {
      filtered = filtered.filter(f => f.dentrodapolitica === politicaFilter);
    }

    setFilteredFaturas(filtered);
  };

  const handleDelete = () => {
    if (!faturaToDelete) return;

    const updated = faturas.filter(f => f.id !== faturaToDelete.id);
    setFaturas(updated);
    localStorage.setItem("faturas_integra", JSON.stringify(updated));
    toast.success("Fatura excluída com sucesso");
    setFaturaToDelete(null);
  };

  const handleExport = () => {
    if (filteredFaturas.length === 0) {
      toast.error("Nenhuma fatura para exportar");
      return;
    }

    const exportData = filteredFaturas.map(f => ({
      "DATA EMISSÃO FAT": f.dataemissaofat,
      "AGENCIA": f.agencia,
      "NUMERO DE FAT": f.numerodefat,
      "PROTOCOLO": f.protocolo,
      "DATA DA COMPRA": f.datadacompra,
      "VIAJANTE": f.viajante,
      "TIPO": f.tipo,
      "HOSPEDAGEM": f.hospedagem || "",
      "ORIGEM": f.origem,
      "DESTINO": f.destino,
      "CHECK-IN": f.checkin || "",
      "CHECK-OUT": f.checkout || "",
      "COMPRADOR": f.comprador,
      "VALOR PAGO": f.valorpago,
      "MOTIVO_EVENTO": f.motivoevento,
      "CCA": f.cca,
      "CENTRO DE CUSTO": f.centrodecusto,
      "ANTECEDENCIA": f.antecedencia || "",
      "CIA IDA": f.ciaida || "",
      "CIA VOLTA": f.ciavolta || "",
      "POSSUI BAGAGEM": f.possuibagagem,
      "VALOR PAGO DE BAGAGEM": f.valorpagodebagagem || "",
      "OBSERVAÇÃO": f.observacao || "",
      "QUEM SOLICITOU? (FORA DA POLÍTICA)": f.quemsolicitouforapolitica || "",
      "DENTRO DA POLÍTICA": f.dentrodapolitica,
      "CÓD. CONTA": f.codconta || "",
      "CONTA FINANCEIRA": f.contafinanceira || ""
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Faturas");
    XLSX.writeFile(wb, `faturas_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Planilha exportada com sucesso");
  };

  const stats = {
    total: faturas.length,
    valorTotal: faturas.reduce((sum, f) => sum + f.valorpago, 0),
    dentroPolicy: faturas.filter(f => f.dentrodapolitica === "Sim").length,
    foraPolicy: faturas.filter(f => f.dentrodapolitica === "Não").length
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Consulta de Faturas</h1>
        </div>
        <Button onClick={() => navigate("/cadastro-fatura")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Fatura
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Faturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.valorTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dentro da Política
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.dentroPolicy}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fora da Política
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.foraPolicy}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por viajante, nº fatura ou protocolo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={agenciaFilter} onValueChange={setAgenciaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Agência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Agências</SelectItem>
                <SelectItem value="Onfly">Onfly</SelectItem>
                <SelectItem value="Biztrip">Biztrip</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Tipos</SelectItem>
                <SelectItem value="Aéreo">Aéreo</SelectItem>
                <SelectItem value="Hotel">Hotel</SelectItem>
                <SelectItem value="Ônibus">Ônibus</SelectItem>
              </SelectContent>
            </Select>
            <Select value={politicaFilter} onValueChange={setPoliticaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Política" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Sim">Dentro da Política</SelectItem>
                <SelectItem value="Não">Fora da Política</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Fatura</TableHead>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Viajante</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Rota</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>CCA</TableHead>
                  <TableHead>Política</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaturas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Nenhuma fatura encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFaturas.map(fatura => (
                    <TableRow key={fatura.id}>
                      <TableCell className="font-medium">{fatura.numerodefat}</TableCell>
                      <TableCell>{fatura.protocolo}</TableCell>
                      <TableCell>
                        {new Date(fatura.dataemissaofat).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>{fatura.viajante}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {fatura.tipo}
                        </span>
                      </TableCell>
                      <TableCell>
                        {fatura.origem} → {fatura.destino}
                      </TableCell>
                      <TableCell>
                        {fatura.valorpago.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        })}
                      </TableCell>
                      <TableCell>{fatura.cca}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            fatura.dentrodapolitica === "Sim"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {fatura.dentrodapolitica}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFaturaToView(fatura)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFaturaToEdit(fatura)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFaturaToDelete(fatura)}
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

      {/* Modals */}
      {faturaToView && (
        <VisualizarFaturaModal
          fatura={faturaToView}
          open={!!faturaToView}
          onClose={() => setFaturaToView(null)}
        />
      )}

      {faturaToEdit && (
        <EditarFaturaModal
          fatura={faturaToEdit}
          open={!!faturaToEdit}
          onClose={() => setFaturaToEdit(null)}
          onSave={() => {
            loadFaturas();
            setFaturaToEdit(null);
          }}
        />
      )}

      <AlertDialog open={!!faturaToDelete} onOpenChange={() => setFaturaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a fatura {faturaToDelete?.numerodefat}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConsultaFaturas;
