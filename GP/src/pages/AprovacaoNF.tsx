import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Edit, FileSpreadsheet } from "lucide-react";
import { mockNotasFiscais } from "@/data/mockNotasFiscais";
import { NotaFiscal } from "@/types/nf";
import { StatusBadgeNF } from "@/components/nf/StatusBadgeNF";
import { VisualizarNFModal } from "@/components/nf/VisualizarNFModal";
import { EditarNFModal } from "@/components/nf/EditarNFModal";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

export default function AprovacaoNF() {
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>(mockNotasFiscais);
  const [filtroStatus, setFiltroStatus] = useState<string>("Todas");
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("Todos");
  const [filtroBusca, setFiltroBusca] = useState<string>("");
  const [filtroCCA, setFiltroCCA] = useState<string>("Todos");
  
  const [visualizarModal, setVisualizarModal] = useState(false);
  const [editarModal, setEditarModal] = useState(false);
  const [nfSelecionada, setNfSelecionada] = useState<NotaFiscal | null>(null);

  // Extrair períodos únicos para o filtro
  const periodosUnicos = Array.from(new Set(notasFiscais.map(nf => nf.periodocontabil))).sort();
  const ccasUnicos = Array.from(new Set(notasFiscais.map(nf => nf.cca))).sort();

  // Aplicar filtros
  const nfsFiltradas = notasFiscais.filter(nf => {
    const matchStatus = filtroStatus === "Todas" || nf.status === filtroStatus;
    const matchPeriodo = filtroPeriodo === "Todos" || nf.periodocontabil === filtroPeriodo;
    const matchCCA = filtroCCA === "Todos" || nf.cca === filtroCCA;
    const matchBusca = filtroBusca === "" || 
      nf.nomeempresa.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      nf.numero.toLowerCase().includes(filtroBusca.toLowerCase());
    
    return matchStatus && matchPeriodo && matchCCA && matchBusca;
  });

  const handleVisualizar = (nf: NotaFiscal) => {
    setNfSelecionada(nf);
    setVisualizarModal(true);
  };

  const handleEditar = (nf: NotaFiscal) => {
    if (nf.status === "Aprovado" || nf.status === "Reprovado") {
      toast.warning("Notas já aprovadas ou reprovadas não podem ser editadas");
      return;
    }
    setNfSelecionada(nf);
    setEditarModal(true);
  };

  const handleSalvarEdicao = (nfAtualizada: NotaFiscal) => {
    setNotasFiscais(prev => 
      prev.map(nf => nf.id === nfAtualizada.id ? nfAtualizada : nf)
    );
  };

  const handleDownload = (nf: NotaFiscal) => {
    toast.success(`Download da NF ${nf.numero} iniciado`);
  };

  const limparFiltros = () => {
    setFiltroStatus("Todas");
    setFiltroPeriodo("Todos");
    setFiltroCCA("Todos");
    setFiltroBusca("");
  };

  const exportarParaExcel = () => {
    const dadosExport = nfsFiltradas.map(nf => ({
      "Número NF": nf.numero,
      "Nome da Empresa": nf.nomeempresa,
      "Representante": nf.nomerepresentante,
      "Período Contábil": nf.periodocontabil,
      "CCA": nf.cca,
      "Data Emissão": new Date(nf.dataemissao).toLocaleDateString('pt-BR'),
      "Valor": nf.valor,
      "Status": nf.status,
      "Tipo Documento": nf.tipodocumento || "-",
      "Empresa Destino": nf.empresadestino || "-",
      "Número Credor": nf.numerocredor || "-",
      "Data Vencimento": nf.datavencimento ? new Date(nf.datavencimento).toLocaleDateString('pt-BR') : "-",
      "Plano Financeiro": nf.planofinanceiro || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(dadosExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notas Fiscais");
    
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    XLSX.writeFile(wb, `notas-fiscais-aprovacao-${dataAtual}.xlsx`);
    
    toast.success("Arquivo Excel exportado com sucesso");
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          Gestão de Pessoas &gt; Prestadores de Serviço &gt; Aprovação de NF
        </div>

        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Aprovação de Notas Fiscais</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie e aprove as notas fiscais emitidas
            </p>
          </div>
        </div>

        {/* Filtros */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Filtros</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Período Contábil</label>
                <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    {periodosUnicos.map(periodo => (
                      <SelectItem key={periodo} value={periodo}>{periodo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas">Todas</SelectItem>
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    <SelectItem value="Enviado">Enviado</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Reprovado">Reprovado</SelectItem>
                    <SelectItem value="Erro">Erro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">CCA</label>
                <Select value={filtroCCA} onValueChange={setFiltroCCA}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    {ccasUnicos.map(cca => (
                      <SelectItem key={cca} value={cca}>{cca}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Buscar Empresa/NF</label>
                <Input
                  placeholder="Digite para buscar..."
                  value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
              <Button variant="default" onClick={exportarParaExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar para Excel
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabela de Notas Fiscais */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Notas Fiscais</h2>
              <Badge variant="outline">
                Exibindo {nfsFiltradas.length} de {notasFiscais.length} registros
              </Badge>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número NF</TableHead>
                    <TableHead>Nome da Empresa</TableHead>
                    <TableHead>Representante</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>CCA</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nfsFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        Nenhuma nota fiscal encontrada com os filtros aplicados
                      </TableCell>
                    </TableRow>
                  ) : (
                    nfsFiltradas.map((nf) => (
                      <TableRow key={nf.id}>
                        <TableCell className="font-medium">{nf.numero}</TableCell>
                        <TableCell>{nf.nomeempresa}</TableCell>
                        <TableCell>{nf.nomerepresentante}</TableCell>
                        <TableCell>{nf.periodocontabil}</TableCell>
                        <TableCell>{nf.cca}</TableCell>
                        <TableCell>{new Date(nf.dataemissao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="font-semibold">{formatarValor(nf.valor)}</TableCell>
                        <TableCell>
                          <StatusBadgeNF status={nf.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleVisualizar(nf)}
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(nf)}
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditar(nf)}
                              title="Editar"
                              disabled={nf.status === "Aprovado" || nf.status === "Reprovado"}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>

      {/* Modais */}
      <VisualizarNFModal
        open={visualizarModal}
        onClose={() => setVisualizarModal(false)}
        notaFiscal={nfSelecionada}
      />

      <EditarNFModal
        open={editarModal}
        onClose={() => setEditarModal(false)}
        notaFiscal={nfSelecionada}
        onSave={handleSalvarEdicao}
      />
    </Layout>
  );
}
