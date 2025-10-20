import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download } from "lucide-react";
import { TravelRecord, Agency, ServiceType, ReservationStatus, AirTicket, BusTicket, Hotel } from "@/types/gestao-pessoas/travel";

interface TravelRecordsTableProps {
  records: TravelRecord[];
}

export const TravelRecordsTable = ({ records }: TravelRecordsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [agencyFilter, setAgencyFilter] = useState<Agency | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");

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

  const getStatusBadgeVariant = (status: ReservationStatus) => {
    switch (status) {
      case 'Confirmada':
        return 'default';
      case 'Cancelada':
        return 'destructive';
      case 'Pendente':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getServiceValue = (record: TravelRecord): number => {
    switch (record.serviceType) {
      case 'hospedagem':
        return (record as Hotel).totalValue;
      default:
        return (record as AirTicket | BusTicket).ticketValue;
    }
  };

  const getServiceDetails = (record: TravelRecord): string => {
    switch (record.serviceType) {
      case 'aereo':
        return `${(record as AirTicket).airline} - ${(record as AirTicket).origin} → ${(record as AirTicket).destination}`;
      case 'rodoviario':
        return `${(record as BusTicket).transportCompany} - ${(record as BusTicket).origin} → ${(record as BusTicket).destination}`;
      case 'hospedagem':
        return `${(record as Hotel).hotelName} - ${(record as Hotel).city}, ${(record as Hotel).state}`;
      default:
        return '';
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.cpf.includes(searchTerm) ||
                         record.costCenter.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAgency = agencyFilter === "all" || record.agency === agencyFilter;
    const matchesService = serviceFilter === "all" || record.serviceType === serviceFilter;
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesAgency && matchesService && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Registros de Viagem</span>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por colaborador, CPF ou centro de custo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={agencyFilter} onValueChange={(value) => setAgencyFilter(value as Agency | "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Agência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Agências</SelectItem>
              <SelectItem value="Onfly">Onfly</SelectItem>
              <SelectItem value="Biztrip">Biztrip</SelectItem>
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={(value) => setServiceFilter(value as ServiceType | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Serviços</SelectItem>
              <SelectItem value="aereo">Aéreo</SelectItem>
              <SelectItem value="rodoviario">Rodoviário</SelectItem>
              <SelectItem value="hospedagem">Hospedagem</SelectItem>
              <SelectItem value="bagagem">Bagagem</SelectItem>
              <SelectItem value="cancelamento">Cancelamento</SelectItem>
              <SelectItem value="reembolso">Reembolso</SelectItem>
              <SelectItem value="remarcacao aereo">Remarcação Aérea</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReservationStatus | "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="Confirmada">Confirmada</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Agência</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>Data Solicitação</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.employeeName}</div>
                        <div className="text-sm text-muted-foreground">{record.cpf}</div>
                        <div className="text-sm text-muted-foreground">{record.costCenter}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.agency === 'Onfly' ? 'default' : 'secondary'}>
                        {record.agency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{record.serviceType}</div>
                      <div className="text-sm text-muted-foreground">
                        Solicitante: {record.requester}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{getServiceDetails(record)}</div>
                    </TableCell>
                    <TableCell>{formatDate(record.requestDate)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(getServiceValue(record))}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};