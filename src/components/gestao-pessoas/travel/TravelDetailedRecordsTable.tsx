import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";
import { TravelDetailedRecord, Agency, ServiceType } from "@/types/travel";

interface TravelDetailedRecordsTableProps {
  records: TravelDetailedRecord[];
}

export const TravelDetailedRecordsTable = ({ records }: TravelDetailedRecordsTableProps) => {
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [agencyFilter, setAgencyFilter] = useState<Agency | "all">("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | "all">("all");
  const [ccaFilter, setCcaFilter] = useState("");
  const [policyFilter, setPolicyFilter] = useState<"all" | "within" | "outside">("all");
  const [periodFilter, setPeriodFilter] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getServiceTypeBadge = (tipo: ServiceType) => {
    const colors = {
      'aereo': 'bg-blue-100 text-blue-800',
      'rodoviario': 'bg-green-100 text-green-800',
      'hospedagem': 'bg-purple-100 text-purple-800',
      'bagagem': 'bg-orange-100 text-orange-800',
      'cancelamento': 'bg-red-100 text-red-800',
      'reembolso': 'bg-yellow-100 text-yellow-800',
      'remarcacao aereo': 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <Badge className={colors[tipo] || 'bg-gray-100 text-gray-800'}>
        {tipo.toUpperCase()}
      </Badge>
    );
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === "" || 
      record.viajante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.cca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.numeroDeFat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAgency = agencyFilter === "all" || record.agencia === agencyFilter;
    const matchesServiceType = serviceTypeFilter === "all" || record.tipo === serviceTypeFilter;
    const matchesCca = ccaFilter === "" || record.cca.toLowerCase().includes(ccaFilter.toLowerCase());
    const matchesPolicy = policyFilter === "all" || 
      (policyFilter === "within" && record.dentroDaPolitica) ||
      (policyFilter === "outside" && !record.dentroDaPolitica);
    
    const matchesPeriod = periodFilter === "" || 
      record.dataEmissaoFat.includes(periodFilter) ||
      record.dataDaCompra.includes(periodFilter);

    return matchesSearch && matchesAgency && matchesServiceType && matchesCca && matchesPolicy && matchesPeriod;
  });

  const stats = {
    total: filteredRecords.length,
    totalValue: filteredRecords.reduce((sum, record) => sum + record.valorPago, 0),
    outsidePolicy: filteredRecords.filter(r => !r.dentroDaPolitica).length,
    outsidePolicyPercentage: filteredRecords.length > 0 ? 
      (filteredRecords.filter(r => !r.dentroDaPolitica).length / filteredRecords.length) * 100 : 0
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total de Registros</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Valor Total</div>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Fora da Política</div>
            <div className="text-2xl font-bold text-red-600">{stats.outsidePolicy}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">% Fora da Política</div>
            <div className="text-2xl font-bold text-red-600">{stats.outsidePolicyPercentage.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Avançados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Viajante, CCA, Nº Fatura..."
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
              <Label htmlFor="type-filter">Tipo</Label>
              <Select value={serviceTypeFilter} onValueChange={(value: ServiceType | "all") => setServiceTypeFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="aereo">Aéreo</SelectItem>
                  <SelectItem value="rodoviario">Rodoviário</SelectItem>
                  <SelectItem value="hospedagem">Hospedagem</SelectItem>
                  <SelectItem value="bagagem">Bagagem</SelectItem>
                  <SelectItem value="cancelamento">Cancelamento</SelectItem>
                  <SelectItem value="reembolso">Reembolso</SelectItem>
                  <SelectItem value="remarcacao aereo">Remarcação Aéreo</SelectItem>
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
              <Label htmlFor="policy-filter">Política</Label>
              <Select value={policyFilter} onValueChange={(value: "all" | "within" | "outside") => setPolicyFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="within">Dentro da Política</SelectItem>
                  <SelectItem value="outside">Fora da Política</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="period-filter">Período</Label>
              <Input
                id="period-filter"
                placeholder="AAAA-MM-DD"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Relatório Detalhado de Utilizações ({filteredRecords.length} registros)</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="min-w-[100px]">Data Emissão Fat</TableHead>
                  <TableHead className="min-w-[80px]">Agência</TableHead>
                  <TableHead className="min-w-[120px]">Número de Fat</TableHead>
                  <TableHead className="min-w-[100px]">Protocolo</TableHead>
                  <TableHead className="min-w-[100px]">Data da Compra</TableHead>
                  <TableHead className="min-w-[150px]">Viajante</TableHead>
                  <TableHead className="min-w-[100px]">Tipo</TableHead>
                  <TableHead className="min-w-[150px]">Hospedagem</TableHead>
                  <TableHead className="min-w-[120px]">Origem</TableHead>
                  <TableHead className="min-w-[120px]">Destino</TableHead>
                  <TableHead className="min-w-[100px]">Check-in</TableHead>
                  <TableHead className="min-w-[100px]">Check-out</TableHead>
                  <TableHead className="min-w-[120px]">Comprador</TableHead>
                  <TableHead className="min-w-[100px]">Valor Pago</TableHead>
                  <TableHead className="min-w-[150px]">Motivo/Evento</TableHead>
                  <TableHead className="min-w-[100px]">CCA</TableHead>
                  <TableHead className="min-w-[150px]">Descrição Centro de Custo</TableHead>
                  <TableHead className="min-w-[100px]">Antecedência</TableHead>
                  <TableHead className="min-w-[120px]">Cia Ida</TableHead>
                  <TableHead className="min-w-[120px]">Cia Volta</TableHead>
                  <TableHead className="min-w-[120px]">Possui Bagagem</TableHead>
                  <TableHead className="min-w-[120px]">Valor Pago de Bagagem</TableHead>
                  <TableHead className="min-w-[200px]">Observação</TableHead>
                  <TableHead className="min-w-[150px]">Quem Solicitou? (Fora da Política)</TableHead>
                  <TableHead className="min-w-[120px]">Dentro da Política</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} className="text-xs">
                    <TableCell className="font-medium">{formatDate(record.dataEmissaoFat)}</TableCell>
                    <TableCell>
                      <Badge variant={record.agencia === "Onfly" ? "default" : "secondary"}>
                        {record.agencia}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{record.numeroDeFat}</TableCell>
                    <TableCell>{record.protocolo}</TableCell>
                    <TableCell>{formatDate(record.dataDaCompra)}</TableCell>
                    <TableCell className="font-medium">{record.viajante}</TableCell>
                    <TableCell>{getServiceTypeBadge(record.tipo)}</TableCell>
                    <TableCell>{record.hospedagem || '-'}</TableCell>
                    <TableCell>{record.origem || '-'}</TableCell>
                    <TableCell>{record.destino || '-'}</TableCell>
                    <TableCell>{formatDate(record.checkIn)}</TableCell>
                    <TableCell>{formatDate(record.checkOut)}</TableCell>
                    <TableCell>{record.comprador}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(record.valorPago)}</TableCell>
                    <TableCell>{record.motivoEvento || '-'}</TableCell>
                    <TableCell className="font-medium">{record.cca}</TableCell>
                    <TableCell>{record.descricaoCentroDeCusto || '-'}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={record.antecedencia >= 7 ? "default" : "destructive"}>
                        {record.antecedencia} dias
                      </Badge>
                    </TableCell>
                    <TableCell>{record.ciaIda || '-'}</TableCell>
                    <TableCell>{record.ciaVolta || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={record.possuiBagagem === "Sim" ? "default" : "outline"}>
                        {record.possuiBagagem}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.valorPagoDeBagagem > 0 ? formatCurrency(record.valorPagoDeBagagem) : '-'}</TableCell>
                    <TableCell>{record.observacao || '-'}</TableCell>
                    <TableCell>{record.quemSolicitouForaPolitica || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={record.dentroDaPolitica ? "default" : "destructive"}>
                        {record.dentroDaPolitica ? "SIM" : "NÃO"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum registro encontrado com os filtros aplicados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};