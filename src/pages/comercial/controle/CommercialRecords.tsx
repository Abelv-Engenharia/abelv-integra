import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Search, AlertCircle, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { commercialMockData, segmentoOptions, statusOptions, vendedorOptions } from "@/data/commercialMockData";
import { CommercialFilters, CommercialSpreadsheet as CommercialSpreadsheetType } from "@/types/commercial";
import { useToast } from "@/hooks/use-toast";
const CommercialRecords = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [data, setData] = useState<CommercialSpreadsheetType[]>(commercialMockData);
  const [filters, setFilters] = useState<CommercialFilters>({});
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Contemplado':
        return 'default';
      case 'On Hold':
        return 'secondary';
      case 'Perdido':
        return 'destructive';
      case 'Cancelado':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  const handleDelete = (id: string, pc: string) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    toast({
      title: "Registro excluído",
      description: `Proposta ${pc} foi removida com sucesso.`
    });
  };
  const filteredData = data.filter(item => {
    const itemYear = item.dataSaidaProposta.split('/')[2];
    return (!filters.pc || item.pc.includes(filters.pc)) && (!filters.cliente || item.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) && (!filters.segmento || item.segmento === filters.segmento) && (!filters.status || item.status === filters.status) && (!filters.vendedor || item.vendedor === filters.vendedor) && (!filters.dataInicio || new Date(item.dataSaidaProposta.split('/').reverse().join('-')) >= new Date(filters.dataInicio)) && (!filters.ano || itemYear === filters.ano);
  });
  const clearFilters = () => {
    setFilters({});
  };

  // Verifica se os campos de consolidação estão preenchidos
  const isConsolidationComplete = (item: CommercialSpreadsheetType) => {
    if (item.status !== 'Contemplado') return true;
    return !!(item.dataassinaturacontratoreal && item.dataterminocontratoprevista && item.dataentregaorcamentoexecutivoprevista && item.dataentregaorcamentoexecutivoreal);
  };
  return <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/comercial/controle/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Consulta de Proposta
          </h1>
            <p className="text-muted-foreground mt-2">Visualização e gerenciamento de propostas comerciais</p>
          </div>
        </div>

        {/* Filtros de Pesquisa */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtros de Pesquisa
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">PC</label>
                <Input placeholder="Digite o PC" value={filters.pc || ''} onChange={e => setFilters({
                ...filters,
                pc: e.target.value
              })} />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Cliente</label>
                <Input placeholder="Nome do cliente" value={filters.cliente || ''} onChange={e => setFilters({
                ...filters,
                cliente: e.target.value
              })} />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Segmento</label>
                <Select value={filters.segmento || 'all'} onValueChange={value => setFilters({
                ...filters,
                segmento: value === 'all' ? '' : value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {segmentoOptions.map(segmento => <SelectItem key={segmento} value={segmento}>{segmento}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select value={filters.status || 'all'} onValueChange={value => setFilters({
                ...filters,
                status: value === 'all' ? '' : value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {statusOptions.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Vendedor</label>
                <Select value={filters.vendedor || 'all'} onValueChange={value => setFilters({
                ...filters,
                vendedor: value === 'all' ? '' : value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {vendedorOptions.map(vendedor => <SelectItem key={vendedor} value={vendedor}>{vendedor}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Data Início</label>
                <Input type="date" value={filters.dataInicio || ''} onChange={e => setFilters({
                ...filters,
                dataInicio: e.target.value
              })} />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Ano</label>
                <Select value={filters.ano || 'all'} onValueChange={value => setFilters({
                ...filters,
                ano: value === 'all' ? '' : value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        {filteredData.length > 0 && <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total de Registros</p>
                  <p className="text-2xl font-bold">{filteredData.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(filteredData.reduce((sum, item) => sum + item.valorVenda, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contemplados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredData.filter(item => item.status === 'Contemplado').length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Perdidos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredData.filter(item => item.status === 'Perdido').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>}

        {/* Tabela de Registros */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Propostas Emitidas ({filteredData.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/comercial/controle/dashboard")} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Detalhes da Consolidação
                </Button>
                <Link to="/comercial/controle/cadastro">
                  <Button size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Novo Registro
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">PC</TableHead>
                    <TableHead className="font-semibold">Cliente</TableHead>
                    <TableHead className="font-semibold">Obra</TableHead>
                    <TableHead className="font-semibold">Segmento</TableHead>
                    <TableHead className="font-semibold">Vendedor</TableHead>
                    <TableHead className="font-semibold">Valor de Venda</TableHead>
                    <TableHead className="font-semibold">(%) Margem Abelv</TableHead>
                    <TableHead className="font-semibold">(R$) Margem Abelv</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Data de Saída</TableHead>
                    <TableHead className="font-semibold">Revisão</TableHead>
                    <TableHead className="font-semibold">Orç. Duplicado</TableHead>
                    <TableHead className="w-[120px] font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? <TableRow>
                      <TableCell colSpan={13} className="text-center text-muted-foreground py-8">
                        Nenhum registro encontrado com os filtros aplicados.
                      </TableCell>
                    </TableRow> : filteredData.map(item => {
                  const needsConsolidation = !isConsolidationComplete(item);
                  return <TableRow key={item.id} className={`hover:bg-muted/50 ${needsConsolidation ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}`}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {item.pc}
                              {needsConsolidation && <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />}
                            </div>
                          </TableCell>
                        <TableCell>{item.cliente}</TableCell>
                        <TableCell>{item.obra}</TableCell>
                        <TableCell>
                          <span className="text-sm">{item.segmento}</span>
                        </TableCell>
                        <TableCell>{item.vendedor}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(item.valorVenda)}</TableCell>
                        <TableCell className="font-medium text-blue-600">
                          {item.margemPercentual.toFixed(1)}%
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(item.margemValor)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.dataSaidaProposta}</TableCell>
                        <TableCell className="text-center">{item.numeroRevisao}</TableCell>
                        <TableCell>
                          <Badge variant={item.orcamentoDuplicado === 'Sim' ? 'destructive' : 'secondary'}>
                            {item.orcamentoDuplicado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {item.status === 'Contemplado' && <Link to={`/comercial/controle/consolidacao/${item.id}`}>
                                <Button variant={needsConsolidation ? "default" : "ghost"} size="sm" title={needsConsolidation ? "Preencher dados de consolidação" : "Ver detalhes da consolidação"} className={needsConsolidation ? "bg-yellow-600 hover:bg-yellow-700" : ""}>
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>}
                            <Link to={`/comercial/controle/editar/${item.id}`}>
                              <Button variant="ghost" size="sm" title="Editar registro">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id, item.pc)} title="Excluir registro" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>;
                })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>;
};
export default CommercialRecords;