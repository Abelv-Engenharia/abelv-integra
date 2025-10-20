import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save } from "lucide-react";
import { Agency, ServiceType, ReservationStatus, PaymentMethod, TravelRecord } from "@/types/gestao-pessoas/travel";
import { toast } from "@/hooks/use-toast";

interface TravelFormProps {
  onAdd: (record: TravelRecord) => void;
}

export const TravelForm = ({ onAdd }: TravelFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('aereo');
  
  const [formData, setFormData] = useState({
    agency: 'Onfly' as Agency,
    employeeName: '',
    cpf: '',
    costCenter: '',
    requester: '',
    requestDate: new Date().toISOString().split('T')[0],
    status: 'Pendente' as ReservationStatus,
    // Service-specific fields
    airline: '',
    transportCompany: '',
    hotelName: '',
    ticketNumber: '',
    origin: '',
    destination: '',
    city: '',
    state: '',
    departureDate: '',
    returnDate: '',
    travelDate: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfNights: 1,
    ticketValue: 0,
    totalValue: 0,
    paymentMethod: 'Cartão Corporativo' as PaymentMethod,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseRecord = {
      id: Date.now().toString(),
      agency: formData.agency,
      serviceType,
      employeeName: formData.employeeName,
      cpf: formData.cpf,
      costCenter: formData.costCenter,
      requester: formData.requester,
      requestDate: formData.requestDate,
      status: formData.status,
    };

    let record: TravelRecord;

    if (serviceType === 'aereo') {
      record = {
        ...baseRecord,
        serviceType: 'aereo',
        airline: formData.airline,
        ticketNumber: formData.ticketNumber,
        origin: formData.origin,
        destination: formData.destination,
        departureDate: formData.departureDate,
        returnDate: formData.returnDate || undefined,
        ticketValue: formData.ticketValue,
        paymentMethod: formData.paymentMethod,
      };
    } else if (serviceType === 'rodoviario') {
      record = {
        ...baseRecord,
        serviceType: 'rodoviario',
        transportCompany: formData.transportCompany,
        ticketNumber: formData.ticketNumber,
        origin: formData.origin,
        destination: formData.destination,
        travelDate: formData.travelDate,
        ticketValue: formData.ticketValue,
        paymentMethod: formData.paymentMethod,
      };
    } else {
      record = {
        ...baseRecord,
        serviceType: 'hospedagem',
        hotelName: formData.hotelName,
        city: formData.city,
        state: formData.state,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfNights: formData.numberOfNights,
        totalValue: formData.totalValue,
        paymentMethod: formData.paymentMethod,
      };
    }

    onAdd(record);
    setIsOpen(false);
    
    // Reset form
    setFormData({
      agency: 'Onfly',
      employeeName: '',
      cpf: '',
      costCenter: '',
      requester: '',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      airline: '',
      transportCompany: '',
      hotelName: '',
      ticketNumber: '',
      origin: '',
      destination: '',
      city: '',
      state: '',
      departureDate: '',
      returnDate: '',
      travelDate: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfNights: 1,
      ticketValue: 0,
      totalValue: 0,
      paymentMethod: 'Cartão Corporativo',
    });

    toast({
      title: "Reserva adicionada",
      description: "A reserva foi adicionada com sucesso.",
    });
  };

  const renderServiceSpecificFields = () => {
    switch (serviceType) {
      case 'aereo':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline">Companhia Aérea</Label>
                <Input
                  id="airline"
                  value={formData.airline}
                  onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                  placeholder="Ex: LATAM"
                />
              </div>
              <div>
                <Label htmlFor="ticketNumber">Número do Bilhete</Label>
                <Input
                  id="ticketNumber"
                  value={formData.ticketNumber}
                  onChange={(e) => setFormData({ ...formData, ticketNumber: e.target.value })}
                  placeholder="Ex: 1234567890"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">Origem</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Ex: São Paulo - SP"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="Ex: Rio de Janeiro - RJ"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departureDate">Data de Embarque</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="returnDate">Data de Retorno (Opcional)</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="ticketValue">Valor da Passagem</Label>
              <Input
                id="ticketValue"
                type="number"
                step="0.01"
                value={formData.ticketValue}
                onChange={(e) => setFormData({ ...formData, ticketValue: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
          </>
        );

      case 'rodoviario':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transportCompany">Empresa de Transporte</Label>
                <Input
                  id="transportCompany"
                  value={formData.transportCompany}
                  onChange={(e) => setFormData({ ...formData, transportCompany: e.target.value })}
                  placeholder="Ex: Viação Cometa"
                />
              </div>
              <div>
                <Label htmlFor="ticketNumber">Número do Bilhete</Label>
                <Input
                  id="ticketNumber"
                  value={formData.ticketNumber}
                  onChange={(e) => setFormData({ ...formData, ticketNumber: e.target.value })}
                  placeholder="Ex: 1234567890"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">Origem</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Ex: São Paulo - SP"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="Ex: Rio de Janeiro - RJ"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="travelDate">Data da Viagem</Label>
              <Input
                id="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="ticketValue">Valor da Passagem</Label>
              <Input
                id="ticketValue"
                type="number"
                step="0.01"
                value={formData.ticketValue}
                onChange={(e) => setFormData({ ...formData, ticketValue: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
          </>
        );

      case 'hospedagem':
        return (
          <>
            <div>
              <Label htmlFor="hotelName">Nome do Hotel</Label>
              <Input
                id="hotelName"
                value={formData.hotelName}
                onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                placeholder="Ex: Hotel Copacabana Palace"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ex: Rio de Janeiro"
                />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Ex: RJ"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="checkInDate">Data de Check-in</Label>
                <Input
                  id="checkInDate"
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="checkOutDate">Data de Check-out</Label>
                <Input
                  id="checkOutDate"
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="numberOfNights">Nº de Diárias</Label>
                <Input
                  id="numberOfNights"
                  type="number"
                  min="1"
                  value={formData.numberOfNights}
                  onChange={(e) => setFormData({ ...formData, numberOfNights: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="totalValue">Valor Total</Label>
              <Input
                id="totalValue"
                type="number"
                step="0.01"
                value={formData.totalValue}
                onChange={(e) => setFormData({ ...formData, totalValue: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="mb-6">
        <Plus className="h-4 w-4 mr-2" />
        Nova Reserva
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Nova Reserva de Viagem</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="agency">Agência</Label>
              <Select value={formData.agency} onValueChange={(value: Agency) => setFormData({ ...formData, agency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Onfly">Onfly</SelectItem>
                  <SelectItem value="Biztrip">Biztrip</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="serviceType">Tipo de Serviço</Label>
              <Select value={serviceType} onValueChange={(value: ServiceType) => setServiceType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Passagem Aérea">Passagem Aérea</SelectItem>
                  <SelectItem value="Passagem Rodoviária">Passagem Rodoviária</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status da Reserva</Label>
              <Select value={formData.status} onValueChange={(value: ReservationStatus) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confirmada">Confirmada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeName" className={!formData.employeeName.trim() ? "text-destructive" : ""}>
                Nome do Colaborador *
              </Label>
              <Input
                id="employeeName"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                placeholder="Ex: João Silva"
                className={!formData.employeeName.trim() ? "border-destructive" : ""}
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf" className={!formData.cpf.trim() ? "text-destructive" : ""}>
                CPF *
              </Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                className={!formData.cpf.trim() ? "border-destructive" : ""}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costCenter" className={!formData.costCenter.trim() ? "text-destructive" : ""}>
                Centro de Custo / Obra *
              </Label>
              <Input
                id="costCenter"
                value={formData.costCenter}
                onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                placeholder="Ex: CC-001"
                className={!formData.costCenter.trim() ? "border-destructive" : ""}
                required
              />
            </div>
            <div>
              <Label htmlFor="requester" className={!formData.requester.trim() ? "text-destructive" : ""}>
                Solicitante *
              </Label>
              <Input
                id="requester"
                value={formData.requester}
                onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                placeholder="Ex: Maria Santos"
                className={!formData.requester.trim() ? "border-destructive" : ""}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="requestDate">Data da Solicitação</Label>
            <Input
              id="requestDate"
              type="date"
              value={formData.requestDate}
              onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
              required
            />
          </div>

          {/* Service-specific fields */}
          {renderServiceSpecificFields()}

          <div>
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Select value={formData.paymentMethod} onValueChange={(value: PaymentMethod) => setFormData({ ...formData, paymentMethod: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cartão Corporativo">Cartão Corporativo</SelectItem>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Boleto">Boleto</SelectItem>
                <SelectItem value="Nota Fiscal">Nota Fiscal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Salvar Reserva
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};