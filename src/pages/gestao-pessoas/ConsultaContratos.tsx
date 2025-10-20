import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, FileSpreadsheet, FileText } from "lucide-react";
import { ContratoEmitido } from "@/types/gestao-pessoas/contrato";
import { mockContratos } from "@/data/gestao-pessoas/mockContratos";
import { StatusContratoBadge } from "@/components/gestao-pessoas/prestadores/StatusContratoBadge";
import { TipoContratoBadge } from "@/components/gestao-pessoas/prestadores/TipoContratoBadge";
import { VisualizarContratoModal } from "@/components/gestao-pessoas/prestadores/VisualizarContratoModal";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ConsultaContratos() {
  const [contratos, setContratos] = useState<ContratoEmitido[]>(() => {
    const stored = localStorage.getItem('contratos_emitidos');
    return stored ? JSON.parse(stored) : mockContratos;
  });

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [contratoSelecionado, setContratoSelecionado] = useState<ContratoEmitido | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const contratosFiltrados = useMemo(() => {
    let resultado = [...contratos];

    if (busca) {
      resultado = resultado.filter(c =>
        c.numero.toLowerCase().includes(busca.toLowerCase()) ||
        c.prestador.toLowerCase().includes(busca.toLowerCase()) ||
        c.servico.toLowerCase().includes(busca.toLowerCase()) ||
        c.empresa.toLowerCase().includes(busca.toLowerCase()) ||
        c.obra.toLowerCase().includes(busca.toLowerCase())
      );
    }

    if (filtroStatus !== "todos") {
      resultado = resultado.filter(c => c.status === filtroStatus);
    }

    if (filtroTipo !== "todos") {
      resultado = resultado.filter(c => c.tipo === filtroTipo);
    }

    return resultado;
  }, [contratos, busca, filtroStatus, filtroTipo]);

  const totalPaginas = Math.ceil(contratosFiltrados.length / itensPorPagina);
  const contratosPaginados = contratosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const handleVisualizar = (contrato: ContratoEmitido) => {
    setContratoSelecionado(contrato);
    setModalAberto(true);
  };

  const exportarExcel = () => {
    try {
      const headers = [
        'Número', 'Tipo', 'Prestador', 'CPF', 'CNPJ', 'Serviço', 
        'Valor', 'Empresa', 'Obra', 'Data emissão', 
        'Data início', 'Data término', 'Status'
      ];
      
      const rows = contratosFiltrados.map(c => {
        const tipoLabel = c.tipo === 'contrato' ? 'Contrato' : 
                         c.tipo === 'aditivo' ? 'Aditivo' : 'Distrato';
        return [
          c.numero,
          tipoLabel,
          c.prestador,
          c.cpf,
          c.cnpj,
          c.servico,
          c.valor,
          c.empresa,
          c.obra,
          new Date(c.dataemissao).toLocaleDateString('pt-BR'),
          new Date(c.datainicio).toLocaleDateString('pt-BR'),
          new Date(c.datafim).toLocaleDateString('pt-BR'),
          c.status.toUpperCase()
        ];
      });

      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Contratos');

      const fileName = `contratos_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success("Relatório exportado para Excel com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar para Excel");
      console.error(error);
    }
  };

  const exportarPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape' });

      doc.setFontSize(18);
      doc.text('CONSULTA DE CONTRATOS EMITIDOS', 14, 20);

      const headers = ['Número', 'Tipo', 'Prestador', 'Serviço', 'Valor', 'Empresa', 'Data início', 'Status'];
      const rows = contratosFiltrados.map(c => {
        const tipoLabel = c.tipo === 'contrato' ? 'Contrato' : 
                         c.tipo === 'aditivo' ? 'Aditivo' : 'Distrato';
        return [
          c.numero,
          tipoLabel,
          c.prestador,
          c.servico,
          c.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          c.empresa,
          new Date(c.datainicio).toLocaleDateString('pt-BR'),
          c.status.toUpperCase()
        ];
      });

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 66, 66] },
      });

      const fileName = `contratos_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      toast.success("Relatório exportado para PDF com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar para PDF");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Consulta de contratos emitidos</h1>
          <p className="text-muted-foreground">Visualize e gerencie os contratos de prestação de serviços</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros de busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Número, prestador, serviço..."
                    value={busca}
                    onChange={(e) => {
                      setBusca(e.target.value);
                      setPaginaAtual(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filtroStatus} onValueChange={(value) => {
                  setFiltroStatus(value);
                  setPaginaAtual(1);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="encerrado">Encerrado</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de contrato</Label>
                <Select value={filtroTipo} onValueChange={(value) => {
                  setFiltroTipo(value);
                  setPaginaAtual(1);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="aditivo">Aditivo</SelectItem>
                    <SelectItem value="distrato">Distrato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="outline" 
                onClick={() => {
                  setBusca("");
                  setFiltroStatus("todos");
                  setFiltroTipo("todos");
                  setPaginaAtual(1);
                }}
              >
                Limpar filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Contratos encontrados ({contratosFiltrados.length})</CardTitle>
              <div className="flex gap-2">
                <Button onClick={exportarExcel} variant="outline" size="sm" className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
                <Button onClick={exportarPDF} variant="outline" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prestador</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Obra</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Data início</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratosPaginados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                        Nenhum contrato encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    contratosPaginados.map((contrato) => (
                      <TableRow key={contrato.id}>
                        <TableCell className="font-medium">{contrato.numero}</TableCell>
                        <TableCell>
                          <TipoContratoBadge tipo={contrato.tipo} />
                        </TableCell>
                        <TableCell>{contrato.prestador}</TableCell>
                        <TableCell>{contrato.servico}</TableCell>
                        <TableCell>{contrato.empresa}</TableCell>
                        <TableCell>{contrato.obra}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {contrato.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>{new Date(contrato.datainicio).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <StatusContratoBadge status={contrato.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVisualizar(contrato)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPaginas > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {(paginaAtual - 1) * itensPorPagina + 1} a{" "}
                  {Math.min(paginaAtual * itensPorPagina, contratosFiltrados.length)} de{" "}
                  {contratosFiltrados.length} contratos
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtual === totalPaginas}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <VisualizarContratoModal
        contrato={contratoSelecionado}
        open={modalAberto}
        onOpenChange={setModalAberto}
      />
    </Layout>
  );
}
