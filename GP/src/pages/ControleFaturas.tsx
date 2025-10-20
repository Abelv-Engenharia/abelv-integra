import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, Filter, Download, Receipt, FileSpreadsheet, FileX, Plus } from "lucide-react";
import { Invoice, Agency, InvoiceStatus } from "@/types/travel";
import { useToast } from "@/hooks/use-toast";

const ControleFaturas = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      agencia: "Onfly",
      numeroFatura: "ONF-2024-001",
      dataEmissao: "2024-01-15",
      periodoApuracao: "Janeiro/2024",
      valorTotal: 15250.80,
      status: "Pago",
      cca: "CC-001-TI",
      pdfUrl: "/faturas/onf-2024-001.pdf"
    },
    {
      id: "2",
      agencia: "Biztrip",
      numeroFatura: "BZT-2024-002",
      dataEmissao: "2024-01-20",
      periodoApuracao: "Janeiro/2024",
      valorTotal: 8900.50,
      status: "Em Aprovação",
      cca: "CC-002-FIN"
    }
  ]);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [agencyFilter, setAgencyFilter] = useState<Agency | "all">("all");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [ccaFilter, setCcaFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");

  // Estados para novo cadastro
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    agencia: "" as Agency,
    numeroFatura: "",
    dataEmissao: "",
    periodoApuracao: "",
    valorTotal: 0,
    status: "Pendente" as InvoiceStatus,
    cca: ""
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadgeVariant = (status: InvoiceStatus) => {
    const variants = {
      'Pendente': 'secondary',
      'Em Aprovação': 'outline',
      'Pago': 'default',
      'Lançado no Sienge': 'secondary'
    };
    return variants[status] as any;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === "" || 
      invoice.numeroFatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.periodoApuracao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAgency = agencyFilter === "all" || invoice.agencia === agencyFilter;
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    const matchesCca = ccaFilter === "" || invoice.cca.toLowerCase().includes(ccaFilter.toLowerCase());
    const matchesPeriod = periodFilter === "" || invoice.periodoApuracao.toLowerCase().includes(periodFilter.toLowerCase());

    return matchesSearch && matchesAgency && matchesStatus && matchesCca && matchesPeriod;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Arquivo importado",
        description: `Fatura ${file.name} importada com sucesso`,
      });
    }
  };

  const handleAddInvoice = () => {
    if (!newInvoice.agencia || !newInvoice.numeroFatura || !newInvoice.dataEmissao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const invoice: Invoice = {
      id: Date.now().toString(),
      ...newInvoice
    };

    setInvoices(prev => [invoice, ...prev]);
    setNewInvoice({
      agencia: "" as Agency,
      numeroFatura: "",
      dataEmissao: "",
      periodoApuracao: "",
      valorTotal: 0,
      status: "Pendente",
      cca: ""
    });
    setIsAddingInvoice(false);
    
    toast({
      title: "Fatura adicionada",
      description: "Fatura cadastrada com sucesso",
    });
  };

  const totalStats = {
    totalFaturas: filteredInvoices.length,
    valorTotal: filteredInvoices.reduce((sum, inv) => sum + inv.valorTotal, 0),
    faturasPendentes: filteredInvoices.filter(inv => inv.status === "Pendente").length,
    faturasAprovacao: filteredInvoices.filter(inv => inv.status === "Em Aprovação").length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Receipt className="h-8 w-8 text-primary" />
                Controle de Faturas
              </h1>
              <p className="text-muted-foreground mt-1">
                Gestão e importação de faturas das agências de viagem
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".xlsx,.csv,.xml"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild>
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Fatura
                  </span>
                </Button>
              </label>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingInvoice(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Fatura
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Faturas</p>
                  <p className="text-2xl font-bold">{totalStats.totalFaturas}</p>
                </div>
                <Receipt className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalStats.valorTotal)}</p>
                </div>
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold">{totalStats.faturasPendentes}</p>
                </div>
                <FileX className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Em Aprovação</p>
                  <p className="text-2xl font-bold">{totalStats.faturasAprovacao}</p>
                </div>
                <Filter className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Form para Nova Fatura */}
        {isAddingInvoice && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Fatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="new-agencia">Agência *</Label>
                  <Select value={newInvoice.agencia} onValueChange={(value: Agency) => setNewInvoice(prev => ({ ...prev, agencia: value }))}>
                    <SelectTrigger className={!newInvoice.agencia ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a agência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Onfly">Onfly</SelectItem>
                      <SelectItem value="Biztrip">Biztrip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="new-numero">Número da Fatura *</Label>
                  <Input
                    id="new-numero"
                    value={newInvoice.numeroFatura}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, numeroFatura: e.target.value }))}
                    placeholder="Ex: ONF-2024-001"
                    className={!newInvoice.numeroFatura ? "border-red-500" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-data-emissao">Data de Emissão *</Label>
                  <Input
                    id="new-data-emissao"
                    type="date"
                    value={newInvoice.dataEmissao}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, dataEmissao: e.target.value }))}
                    className={!newInvoice.dataEmissao ? "border-red-500" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-periodo">Período de Apuração</Label>
                  <Input
                    id="new-periodo"
                    value={newInvoice.periodoApuracao}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, periodoApuracao: e.target.value }))}
                    placeholder="Ex: Janeiro/2024"
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-valor">Valor Total</Label>
                  <Input
                    id="new-valor"
                    type="number"
                    step="0.01"
                    value={newInvoice.valorTotal}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, valorTotal: parseFloat(e.target.value) || 0 }))}
                    placeholder="0,00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-cca">CCA</Label>
                  <Input
                    id="new-cca"
                    value={newInvoice.cca}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, cca: e.target.value }))}
                    placeholder="Ex: CC-001-TI"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddInvoice}>Adicionar Fatura</Button>
                <Button variant="outline" onClick={() => setIsAddingInvoice(false)}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nº fatura ou período..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="agency-filter">Agência</Label>
                <Select value={agencyFilter} onValueChange={(value: Agency | "all") => setAgencyFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Onfly">Onfly</SelectItem>
                    <SelectItem value="Biztrip">Biztrip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={(value: InvoiceStatus | "all") => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Aprovação">Em Aprovação</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Lançado no Sienge">Lançado no Sienge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cca-filter">CCA</Label>
                <Input
                  id="cca-filter"
                  placeholder="Filtrar por CCA..."
                  value={ccaFilter}
                  onChange={(e) => setCcaFilter(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="period-filter">Período</Label>
                <Input
                  id="period-filter"
                  placeholder="Ex: Janeiro/2024"
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Faturas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Faturas ({filteredInvoices.length})</CardTitle>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agência</TableHead>
                  <TableHead>Nº Fatura</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Período Apuração</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CCA</TableHead>
                  <TableHead>PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Badge variant={invoice.agencia === "Onfly" ? "default" : "secondary"}>
                        {invoice.agencia}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{invoice.numeroFatura}</TableCell>
                    <TableCell>{formatDate(invoice.dataEmissao)}</TableCell>
                    <TableCell>{invoice.periodoApuracao}</TableCell>
                    <TableCell>{formatCurrency(invoice.valorTotal)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{invoice.cca}</TableCell>
                    <TableCell>
                      {invoice.pdfUrl ? (
                        <Button variant="ghost" size="sm">
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ControleFaturas;