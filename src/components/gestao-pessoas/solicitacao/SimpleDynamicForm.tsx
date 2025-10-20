import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TipoServico, PrioridadeSolicitacao, TipoPassagem, Viajante, StatusSolicitacao } from "@/types/gestao-pessoas/solicitacao";
import { TransportSubcategorySelector, TransportSubcategory } from "./TransportSubcategorySelector";
import { cn } from "@/lib/utils";

interface SimpleDynamicFormProps {
  tipoServico: TipoServico | TipoServico[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// Interface para viajantes múltiplos
interface ViajanteDados {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: Date | undefined;
  telefone: string;
  email: string;
}

const baseSchema = z.object({
  solicitante: z.string().min(1, "Solicitante é obrigatório"),
  dataSolicitacao: z.date(),
  prioridade: z.nativeEnum(PrioridadeSolicitacao),
  centroCusto: z.string().min(1, "Centro de custo é obrigatório"),
  observacoes: z.string().optional(),
});

export function SimpleDynamicForm({ tipoServico, onSubmit, onCancel }: SimpleDynamicFormProps) {
  const [formData, setFormData] = useState<any>({
    solicitante: "",
    dataSolicitacao: new Date(),
    prioridade: PrioridadeSolicitacao.MEDIA,
    centroCusto: "",
    observacoes: "",
    viajantes: [{ nome: "", cpf: "", rg: "", dataNascimento: undefined, telefone: "", email: "" }],
  });

  const [errors, setErrors] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isMultiple, setIsMultiple] = useState(Array.isArray(tipoServico));
  const [selectedServices, setSelectedServices] = useState<TipoServico[]>(
    Array.isArray(tipoServico) ? tipoServico : [tipoServico]
  );
  const [selectedTransportSubcategory, setSelectedTransportSubcategory] = useState<TransportSubcategory>();

  const validateAndSubmit = () => {
    const newErrors: any = {};

    // Validações básicas
    if (!formData.centroCusto) {
      newErrors.centroCusto = "Centro de custo é obrigatório";
    }

    // Validações específicas por tipo
    if (tipoServico === TipoServico.VOUCHER_UBER || tipoServico === TipoServico.VELOE_GO) {
      if (!formData.valor || formData.valor <= 0) {
        newErrors.valor = "Valor deve ser maior que zero";
      }
      if (!formData.localPartida) {
        newErrors.localPartida = "Local de partida é obrigatório";
      }
      if (!formData.localDestino) {
        newErrors.localDestino = "Local de destino é obrigatório";
      }
    }

    if (tipoServico === TipoServico.LOCACAO_VEICULO) {
      if (!formData.tipoVeiculo) {
        newErrors.tipoVeiculo = "Tipo de veículo é obrigatório";
      }
      if (!formData.condutor) {
        newErrors.condutor = "Condutor é obrigatório";
      }
      if (!formData.termoResponsabilidade) {
        newErrors.termoResponsabilidade = "Termo de responsabilidade deve ser aceito";
      }
    }

    if (tipoServico === TipoServico.PASSAGENS) {
      if (!formData.tipoPassagem) {
        newErrors.tipoPassagem = "Tipo de passagem é obrigatório";
      }
      if (!formData.origem) {
        newErrors.origem = "Origem é obrigatória";
      }
      if (!formData.destino) {
        newErrors.destino = "Destino é obrigatório";
      }
    }

    if (tipoServico === TipoServico.HOSPEDAGEM) {
      if (!formData.hotel) {
        newErrors.hotel = "Hotel/Local é obrigatório";
      }
      if (!formData.dataInicio) {
        newErrors.dataInicio = "Data de início é obrigatória";
      }
      if (!formData.dataFim) {
        newErrors.dataFim = "Data de fim é obrigatória";
      }
      if (!formData.motivo) {
        newErrors.motivo = "Motivo é obrigatório";
      }
      
      // Validar viajantes
      if (!formData.viajantes || formData.viajantes.length === 0) {
        newErrors.viajantes = "Adicione pelo menos um viajante";
      } else {
        formData.viajantes.forEach((viajante: ViajanteDados, index: number) => {
          if (!viajante.nome || !viajante.cpf || !viajante.rg || 
              !viajante.telefone || !viajante.email) {
            newErrors[`viajante_${index}`] = `Complete todos os dados do Viajante ${index + 1}`;
          }
        });
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({ 
        ...formData, 
        tipoServico,
        status: StatusSolicitacao.EM_ANDAMENTO
      });
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const renderSpecificFields = () => {
    // Se é transporte, primeiro mostra o seletor de subcategoria
    if (tipoServico === TipoServico.VOUCHER_UBER && !selectedTransportSubcategory) {
      return (
        <TransportSubcategorySelector 
          onSelect={setSelectedTransportSubcategory}
          selectedSubcategory={selectedTransportSubcategory}
        />
      );
    }

    switch (tipoServico) {
      case TipoServico.VOUCHER_UBER:
        if (selectedTransportSubcategory === 'voucher_uber') {
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cca" className={errors.cca ? "text-destructive" : ""}>
                    CCA *
                  </Label>
                  <Input
                    id="cca"
                    value={formData.cca || ''}
                    onChange={(e) => updateFormData('cca', e.target.value)}
                    className={errors.cca ? "border-destructive" : ""}
                    placeholder="Código do centro de custo"
                  />
                  {errors.cca && <p className="text-sm text-destructive">{errors.cca}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor" className={errors.valor ? "text-destructive" : ""}>
                    Valor *
                  </Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor || ''}
                    onChange={(e) => updateFormData('valor', parseFloat(e.target.value))}
                    className={errors.valor ? "border-destructive" : ""}
                    placeholder="0,00"
                  />
                  {errors.valor && <p className="text-sm text-destructive">{errors.valor}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataUso" className={errors.dataUso ? "text-destructive" : ""}>
                  Data de Uso *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal w-full",
                        !formData.dataUso && "text-muted-foreground",
                        errors.dataUso && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dataUso ? format(formData.dataUso, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dataUso}
                      onSelect={(date) => updateFormData('dataUso', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dataUso && <p className="text-sm text-destructive">{errors.dataUso}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="localPartida" className={errors.localPartida ? "text-destructive" : ""}>
                    Local de Partida *
                  </Label>
                  <Input
                    id="localPartida"
                    value={formData.localPartida || ''}
                    onChange={(e) => updateFormData('localPartida', e.target.value)}
                    className={errors.localPartida ? "border-destructive" : ""}
                    placeholder="Endereço ou local de origem"
                  />
                  {errors.localPartida && <p className="text-sm text-destructive">{errors.localPartida}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localDestino" className={errors.localDestino ? "text-destructive" : ""}>
                    Local de Destino *
                  </Label>
                  <Input
                    id="localDestino"
                    value={formData.localDestino || ''}
                    onChange={(e) => updateFormData('localDestino', e.target.value)}
                    className={errors.localDestino ? "border-destructive" : ""}
                    placeholder="Endereço ou local de destino"
                  />
                  {errors.localDestino && <p className="text-sm text-destructive">{errors.localDestino}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo" className={errors.motivo ? "text-destructive" : ""}>
                  Motivo *
                </Label>
                <Textarea
                  id="motivo"
                  value={formData.motivo || ''}
                  onChange={(e) => updateFormData('motivo', e.target.value)}
                  className={errors.motivo ? "border-destructive" : ""}
                  placeholder="Justificativa para o voucher"
                  rows={3}
                />
                {errors.motivo && <p className="text-sm text-destructive">{errors.motivo}</p>}
              </div>
            </>
          );
        } else if (selectedTransportSubcategory === 'locacao_veiculo') {
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cca" className={errors.cca ? "text-destructive" : ""}>
                    CCA *
                  </Label>
                  <Input
                    id="cca"
                    value={formData.cca || ''}
                    onChange={(e) => updateFormData('cca', e.target.value)}
                    className={errors.cca ? "border-destructive" : ""}
                    placeholder="Código do centro de custo"
                  />
                  {errors.cca && <p className="text-sm text-destructive">{errors.cca}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeCondutor" className={errors.nomeCondutor ? "text-destructive" : ""}>
                    Nome do Condutor *
                  </Label>
                  <Input
                    id="nomeCondutor"
                    value={formData.nomeCondutor || ''}
                    onChange={(e) => updateFormData('nomeCondutor', e.target.value)}
                    className={errors.nomeCondutor ? "border-destructive" : ""}
                    placeholder="Nome completo do condutor"
                  />
                  {errors.nomeCondutor && <p className="text-sm text-destructive">{errors.nomeCondutor}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo" className={errors.motivo ? "text-destructive" : ""}>
                  Motivo *
                </Label>
                <Textarea
                  id="motivo"
                  value={formData.motivo || ''}
                  onChange={(e) => updateFormData('motivo', e.target.value)}
                  className={errors.motivo ? "border-destructive" : ""}
                  placeholder="Justificativa para a locação"
                  rows={3}
                />
                {errors.motivo && <p className="text-sm text-destructive">{errors.motivo}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataRetirada" className={errors.dataRetirada ? "text-destructive" : ""}>
                    Data de Retirada *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal w-full",
                          !formData.dataRetirada && "text-muted-foreground",
                          errors.dataRetirada && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dataRetirada ? format(formData.dataRetirada, "dd/MM/yyyy") : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dataRetirada}
                        onSelect={(date) => updateFormData('dataRetirada', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dataRetirada && <p className="text-sm text-destructive">{errors.dataRetirada}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodoLocacao" className={errors.periodoLocacao ? "text-destructive" : ""}>
                    Período da Locação *
                  </Label>
                  <Select onValueChange={(value) => updateFormData('periodoLocacao', value)}>
                    <SelectTrigger className={errors.periodoLocacao ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diaria">Diária</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.periodoLocacao && <p className="text-sm text-destructive">{errors.periodoLocacao}</p>}
                </div>
              </div>

              {formData.periodoLocacao === 'mensal' && (
                <div className="space-y-2">
                  <Label htmlFor="franquiaKm">Franquia de KM</Label>
                  <Input
                    id="franquiaKm"
                    type="number"
                    value={formData.franquiaKm || ''}
                    onChange={(e) => updateFormData('franquiaKm', parseInt(e.target.value))}
                    placeholder="Quilometragem incluída"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="localRetirada" className={errors.localRetirada ? "text-destructive" : ""}>
                  Local de Retirada *
                </Label>
                <Input
                  id="localRetirada"
                  value={formData.localRetirada || ''}
                  onChange={(e) => updateFormData('localRetirada', e.target.value)}
                  className={errors.localRetirada ? "border-destructive" : ""}
                  placeholder="Endereço para retirada do veículo"
                />
                {errors.localRetirada && <p className="text-sm text-destructive">{errors.localRetirada}</p>}
              </div>
            </>
          );
        } else if (selectedTransportSubcategory === 'cartao_abastecimento') {
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cca" className={errors.cca ? "text-destructive" : ""}>
                    CCA *
                  </Label>
                  <Input
                    id="cca"
                    value={formData.cca || ''}
                    onChange={(e) => updateFormData('cca', e.target.value)}
                    className={errors.cca ? "border-destructive" : ""}
                    placeholder="Código do centro de custo"
                  />
                  {errors.cca && <p className="text-sm text-destructive">{errors.cca}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeSolicitante" className={errors.nomeSolicitante ? "text-destructive" : ""}>
                    Nome do Solicitante *
                  </Label>
                  <Input
                    id="nomeSolicitante"
                    value={formData.nomeSolicitante || ''}
                    onChange={(e) => updateFormData('nomeSolicitante', e.target.value)}
                    className={errors.nomeSolicitante ? "border-destructive" : ""}
                    placeholder="Nome completo"
                  />
                  {errors.nomeSolicitante && <p className="text-sm text-destructive">{errors.nomeSolicitante}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoSolicitacao" className={errors.tipoSolicitacao ? "text-destructive" : ""}>
                  Tipo de Solicitação *
                </Label>
                <Select onValueChange={(value) => updateFormData('tipoSolicitacao', value)}>
                  <SelectTrigger className={errors.tipoSolicitacao ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recarga_adicional">Recarga Adicional</SelectItem>
                    <SelectItem value="cartao_novo">Cartão Novo</SelectItem>
                    <SelectItem value="bloqueio">Bloqueio</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoSolicitacao && <p className="text-sm text-destructive">{errors.tipoSolicitacao}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo" className={errors.motivo ? "text-destructive" : ""}>
                  Motivo *
                </Label>
                <Textarea
                  id="motivo"
                  value={formData.motivo || ''}
                  onChange={(e) => updateFormData('motivo', e.target.value)}
                  className={errors.motivo ? "border-destructive" : ""}
                  placeholder="Justificativa da solicitação"
                  rows={3}
                />
                {errors.motivo && <p className="text-sm text-destructive">{errors.motivo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data" className={errors.data ? "text-destructive" : ""}>
                  Data *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal w-full",
                        !formData.data && "text-muted-foreground",
                        errors.data && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.data ? format(formData.data, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.data}
                      onSelect={(date) => updateFormData('data', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.data && <p className="text-sm text-destructive">{errors.data}</p>}
              </div>

              {formData.tipoSolicitacao === 'recarga_adicional' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorAdicional">Valor Adicional</Label>
                    <Input
                      id="valorAdicional"
                      type="number"
                      step="0.01"
                      value={formData.valorAdicional || ''}
                      onChange={(e) => updateFormData('valorAdicional', parseFloat(e.target.value))}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kmVeiculo">KM do Veículo</Label>
                    <Input
                      id="kmVeiculo"
                      type="number"
                      value={formData.kmVeiculo || ''}
                      onChange={(e) => updateFormData('kmVeiculo', parseInt(e.target.value))}
                      placeholder="Quilometragem atual"
                    />
                  </div>
                </div>
              )}

              {(formData.tipoSolicitacao === 'recarga_adicional' || formData.tipoSolicitacao === 'bloqueio') && (
                <div className="space-y-2">
                  <Label htmlFor="placaAssociada">Placa Associada</Label>
                  <Input
                    id="placaAssociada"
                    value={formData.placaAssociada || ''}
                    onChange={(e) => updateFormData('placaAssociada', e.target.value.toUpperCase())}
                    placeholder="ABC-1234"
                    maxLength={8}
                  />
                </div>
              )}
            </>
          );
        }
        break;
      case TipoServico.VELOE_GO:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-destructive">Valor *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.valor || ""}
                onChange={(e) => updateFormData("valor", parseFloat(e.target.value) || 0)}
                className={errors.valor ? "border-destructive" : ""}
              />
              {errors.valor && <p className="text-sm text-destructive mt-1">{errors.valor}</p>}
            </div>

            <div>
              <Label className="text-destructive">Data de Uso *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      updateFormData("dataUso", date);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-destructive">Local de Partida *</Label>
              <Input
                placeholder="Digite o local de partida"
                value={formData.localPartida || ""}
                onChange={(e) => updateFormData("localPartida", e.target.value)}
                className={errors.localPartida ? "border-destructive" : ""}
              />
              {errors.localPartida && <p className="text-sm text-destructive mt-1">{errors.localPartida}</p>}
            </div>

            <div>
              <Label className="text-destructive">Local de Destino *</Label>
              <Input
                placeholder="Digite o local de destino"
                value={formData.localDestino || ""}
                onChange={(e) => updateFormData("localDestino", e.target.value)}
                className={errors.localDestino ? "border-destructive" : ""}
              />
              {errors.localDestino && <p className="text-sm text-destructive mt-1">{errors.localDestino}</p>}
            </div>
          </div>
        );

      case TipoServico.LOCACAO_VEICULO:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-destructive">Tipo de Veículo *</Label>
              <Select onValueChange={(value) => updateFormData("tipoVeiculo", value)}>
                <SelectTrigger className={errors.tipoVeiculo ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o tipo de veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carro-popular">Carro Popular</SelectItem>
                  <SelectItem value="carro-executivo">Carro Executivo</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="caminhonete">Caminhonete</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoVeiculo && <p className="text-sm text-destructive mt-1">{errors.tipoVeiculo}</p>}
            </div>

            <div>
              <Label className="text-destructive">Condutor Responsável *</Label>
              <Input
                placeholder="Nome completo do condutor"
                value={formData.condutor || ""}
                onChange={(e) => updateFormData("condutor", e.target.value)}
                className={errors.condutor ? "border-destructive" : ""}
              />
              {errors.condutor && <p className="text-sm text-destructive mt-1">{errors.condutor}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="termo"
                checked={formData.termoResponsabilidade || false}
                onCheckedChange={(checked) => updateFormData("termoResponsabilidade", checked)}
              />
              <Label htmlFor="termo" className="text-destructive">
                Aceito o Termo de Responsabilidade *
              </Label>
            </div>
            {errors.termoResponsabilidade && (
              <p className="text-sm text-destructive">{errors.termoResponsabilidade}</p>
            )}
          </div>
        );

      case TipoServico.PASSAGENS:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-destructive">Tipo de Passagem *</Label>
              <Select onValueChange={(value) => updateFormData("tipoPassagem", value)}>
                <SelectTrigger className={errors.tipoPassagem ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TipoPassagem.AEREA}>Aérea</SelectItem>
                  <SelectItem value={TipoPassagem.RODOVIARIA}>Rodoviária</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoPassagem && <p className="text-sm text-destructive mt-1">{errors.tipoPassagem}</p>}
            </div>

            <div>
              <Label className="text-destructive">CCA *</Label>
              <Input
                placeholder="Código do Centro de Custo"
                value={formData.cca || ""}
                onChange={(e) => updateFormData("cca", e.target.value)}
                className={errors.cca ? "border-destructive" : ""}
              />
              {errors.cca && <p className="text-sm text-destructive mt-1">{errors.cca}</p>}
            </div>

            <div>
              <Label className="text-destructive">Motivo da Viagem *</Label>
              <Input
                placeholder="Descreva o motivo da viagem"
                value={formData.motivo || ""}
                onChange={(e) => updateFormData("motivo", e.target.value)}
                className={errors.motivo ? "border-destructive" : ""}
              />
              {errors.motivo && <p className="text-sm text-destructive mt-1">{errors.motivo}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-destructive">Origem *</Label>
                <Input
                  placeholder="Cidade de origem"
                  value={formData.origem || ""}
                  onChange={(e) => updateFormData("origem", e.target.value)}
                  className={errors.origem ? "border-destructive" : ""}
                />
                {errors.origem && <p className="text-sm text-destructive mt-1">{errors.origem}</p>}
              </div>

              <div>
                <Label className="text-destructive">Destino *</Label>
                <Input
                  placeholder="Cidade de destino"
                  value={formData.destino || ""}
                  onChange={(e) => updateFormData("destino", e.target.value)}
                  className={errors.destino ? "border-destructive" : ""}
                />
                {errors.destino && <p className="text-sm text-destructive mt-1">{errors.destino}</p>}
              </div>
            </div>

            <div>
              <Label className="text-destructive">Data da Viagem *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dataViagem && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataViagem ? format(formData.dataViagem, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dataViagem}
                    onSelect={(date) => updateFormData("dataViagem", date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Dados dos Viajantes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-destructive">Dados dos Viajantes *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const novosViajantes = [...formData.viajantes, { nome: "", cpf: "", rg: "", dataNascimento: undefined, telefone: "", email: "" }];
                    updateFormData("viajantes", novosViajantes);
                  }}
                >
                  + Adicionar Viajante
                </Button>
              </div>
              
              {formData.viajantes?.map((viajante: ViajanteDados, index: number) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Viajante {index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const novosViajantes = formData.viajantes.filter((_: any, i: number) => i !== index);
                          updateFormData("viajantes", novosViajantes);
                        }}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-destructive">Nome Completo *</Label>
                      <Input
                        placeholder="Nome completo"
                        value={viajante.nome}
                        onChange={(e) => {
                          const novosViajantes = [...formData.viajantes];
                          novosViajantes[index].nome = e.target.value;
                          updateFormData("viajantes", novosViajantes);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-destructive">CPF *</Label>
                      <Input
                        placeholder="000.000.000-00"
                        value={viajante.cpf}
                        onChange={(e) => {
                          const novosViajantes = [...formData.viajantes];
                          novosViajantes[index].cpf = e.target.value;
                          updateFormData("viajantes", novosViajantes);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-destructive">RG *</Label>
                      <Input
                        placeholder="00.000.000-0"
                        value={viajante.rg}
                        onChange={(e) => {
                          const novosViajantes = [...formData.viajantes];
                          novosViajantes[index].rg = e.target.value;
                          updateFormData("viajantes", novosViajantes);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-destructive">Telefone *</Label>
                      <Input
                        placeholder="(11) 99999-9999"
                        value={viajante.telefone}
                        onChange={(e) => {
                          const novosViajantes = [...formData.viajantes];
                          novosViajantes[index].telefone = e.target.value;
                          updateFormData("viajantes", novosViajantes);
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-destructive">E-mail *</Label>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={viajante.email}
                        onChange={(e) => {
                          const novosViajantes = [...formData.viajantes];
                          novosViajantes[index].email = e.target.value;
                          updateFormData("viajantes", novosViajantes);
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="bagagem"
                checked={formData.precisaBagagem || false}
                onCheckedChange={(checked) => updateFormData("precisaBagagem", checked)}
              />
              <Label htmlFor="bagagem">Precisa de bagagem despachada</Label>
            </div>
          </div>
        );

      case TipoServico.HOSPEDAGEM:
        return (
          <div className="space-y-4">
            {/* Dados dos Viajantes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-destructive">Dados dos Viajantes *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const novosViajantes = [...formData.viajantes, { nome: "", cpf: "", rg: "", dataNascimento: undefined, telefone: "", email: "" }];
                    updateFormData("viajantes", novosViajantes);
                  }}
                >
                  + Adicionar Viajante
                </Button>
              </div>
              
              {formData.viajantes?.map((viajante: ViajanteDados, index: number) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Viajante {index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const novosViajantes = formData.viajantes.filter((_: any, i: number) => i !== index);
                          updateFormData("viajantes", novosViajantes);
                        }}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-destructive">Nome Completo *</Label>
                      <Input
                        placeholder="Nome completo"
                        value={viajante.nome}
                        onChange={(e) => {
                          const novosViajantes = [...formData.viajantes];
                          novosViajantes[index].nome = e.target.value;
                          updateFormData("viajantes", novosViajantes);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-destructive">CPF *</Label>
                      <Input
                        placeholder="000.000.000-00"
                        value={viajante.cpf}
                        onChange={(e) => {
                          const novosViajantes = [...formData.viajantes];
                          novosViajantes[index].cpf = e.target.value;
                          updateFormData("viajantes", novosViajantes);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-destructive">RG *</Label>
                      <Input
                        placeholder="00.000.000-0"
                        value={viajante.rg}
                        onChange={(e) => {
                          const novosViajantes = [...formData.viajantes];
                          novosViajantes[index].rg = e.target.value;
                          updateFormData("viajantes", novosViajantes);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-destructive">Telefone *</Label>
                      <Input
                        placeholder="(11) 99999-9999"
                        value={viajante.telefone}
                        onChange={(e) => {
                          const novosViajantes = [...formData.viajantes];
                          novosViajantes[index].telefone = e.target.value;
                          updateFormData("viajantes", novosViajantes);
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-destructive">E-mail *</Label>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={viajante.email}
                        onChange={(e) => {
                          const novosViajantes = [...formData.viajantes];
                          novosViajantes[index].email = e.target.value;
                          updateFormData("viajantes", novosViajantes);
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Label className="text-destructive">Hotel/Local *</Label>
              <Input
                placeholder="Nome do hotel ou local de hospedagem"
                value={formData.hotel || ""}
                onChange={(e) => updateFormData("hotel", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-destructive">Data de Início *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dataInicio && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dataInicio ? format(formData.dataInicio, "dd/MM/yyyy") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dataInicio}
                      onSelect={(date) => updateFormData("dataInicio", date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-destructive">Data de Fim *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dataFim && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dataFim ? format(formData.dataFim, "dd/MM/yyyy") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dataFim}
                      onSelect={(date) => updateFormData("dataFim", date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label className="text-destructive">Motivo da Hospedagem *</Label>
              <Input
                placeholder="Descreva o motivo da hospedagem"
                value={formData.motivo || ""}
                onChange={(e) => updateFormData("motivo", e.target.value)}
              />
            </div>
          </div>
        );

      case TipoServico.LOGISTICA:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-destructive">Data do Serviço *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dataServico && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataServico ? format(formData.dataServico, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dataServico}
                    onSelect={(date) => updateFormData("dataServico", date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-destructive">Motivo *</Label>
              <Input
                placeholder="Descreva o motivo do serviço"
                value={formData.motivo || ""}
                onChange={(e) => updateFormData("motivo", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-destructive">Tipo de Serviço *</Label>
              <Select onValueChange={(value) => updateFormData("tipoServicoLogistica", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="envio">Envio</SelectItem>
                  <SelectItem value="retirada">Retirada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-destructive">Peso Aproximado (kg) *</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={formData.pesoAproximado || ""}
                onChange={(e) => updateFormData("pesoAproximado", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label className="text-destructive">Remetente/Destinatário *</Label>
              <Input
                placeholder="Nome completo"
                value={formData.remetenteDestinatario || ""}
                onChange={(e) => updateFormData("remetenteDestinatario", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-destructive">Endereço Completo *</Label>
              <Textarea
                placeholder="Rua, número, bairro"
                value={formData.enderecoCompleto || ""}
                onChange={(e) => updateFormData("enderecoCompleto", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-destructive">CEP *</Label>
                <Input
                  placeholder="00000-000"
                  value={formData.cep || ""}
                  onChange={(e) => updateFormData("cep", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-destructive">Cidade *</Label>
                <Input
                  placeholder="Cidade"
                  value={formData.cidade || ""}
                  onChange={(e) => updateFormData("cidade", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-destructive">Estado *</Label>
                <Select onValueChange={(value) => updateFormData("estado", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="AL">AL</SelectItem>
                    <SelectItem value="AP">AP</SelectItem>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="BA">BA</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="DF">DF</SelectItem>
                    <SelectItem value="ES">ES</SelectItem>
                    <SelectItem value="GO">GO</SelectItem>
                    <SelectItem value="MA">MA</SelectItem>
                    <SelectItem value="MT">MT</SelectItem>
                    <SelectItem value="MS">MS</SelectItem>
                    <SelectItem value="MG">MG</SelectItem>
                    <SelectItem value="PA">PA</SelectItem>
                    <SelectItem value="PB">PB</SelectItem>
                    <SelectItem value="PR">PR</SelectItem>
                    <SelectItem value="PE">PE</SelectItem>
                    <SelectItem value="PI">PI</SelectItem>
                    <SelectItem value="RJ">RJ</SelectItem>
                    <SelectItem value="RN">RN</SelectItem>
                    <SelectItem value="RS">RS</SelectItem>
                    <SelectItem value="RO">RO</SelectItem>
                    <SelectItem value="RR">RR</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="SP">SP</SelectItem>
                    <SelectItem value="SE">SE</SelectItem>
                    <SelectItem value="TO">TO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>Formulário específico para este serviço será implementado em breve.</p>
          </div>
        );
    }
  };

  const getFormTitle = () => {
    if (tipoServico === TipoServico.VOUCHER_UBER) {
      if (!selectedTransportSubcategory) {
        return "Solicitação de Transporte";
      }
      switch (selectedTransportSubcategory) {
        case 'voucher_uber':
          return "Solicitação de Voucher Uber";
        case 'locacao_veiculo':
          return "Solicitação de Locação de Veículo";
        case 'cartao_abastecimento':
          return "Solicitação de Cartão de Abastecimento";
        default:
          return "Solicitação de Transporte";
      }
    }

    switch (tipoServico) {
      case TipoServico.LOCACAO_VEICULO:
        return "Solicitação de Locação de Veículo";
      case TipoServico.CARTAO_ABASTECIMENTO:
        return "Solicitação de Cartão de Abastecimento";
      case TipoServico.VELOE_GO:
        return "Solicitação de Veloe Go";
      case TipoServico.PASSAGENS:
        return "Solicitação de Passagens";
      case TipoServico.HOSPEDAGEM:
        return "Solicitação de Hospedagem";
      case TipoServico.LOGISTICA:
        return "Solicitação de Logística";
      case TipoServico.CORREIOS_LOGGI:
        return "Solicitação Correios/Loggi";
      default:
        return "Solicitação de Serviço";
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">
          {getFormTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Campos comuns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Solicitante</Label>
              <Input value={formData.solicitante} disabled className="bg-muted" />
            </div>

            <div>
              <Label className="text-destructive">Prioridade *</Label>
              <Select onValueChange={(value) => updateFormData("prioridade", value)} defaultValue={formData.prioridade}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PrioridadeSolicitacao.BAIXA}>Baixa</SelectItem>
                  <SelectItem value={PrioridadeSolicitacao.MEDIA}>Média</SelectItem>
                  <SelectItem value={PrioridadeSolicitacao.ALTA}>Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-destructive">Centro de Custo/Obra *</Label>
            <Select onValueChange={(value) => updateFormData("centroCusto", value)}>
              <SelectTrigger className={errors.centroCusto ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione o centro de custo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="obra-001">Obra 001 - Edifício Central</SelectItem>
                <SelectItem value="obra-002">Obra 002 - Complexo Industrial</SelectItem>
                <SelectItem value="administrativo">Administrativo</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
            {errors.centroCusto && <p className="text-sm text-destructive mt-1">{errors.centroCusto}</p>}
          </div>

          {/* Campos específicos por categoria */}
          {renderSpecificFields()}

          <div>
            <Label>Observações</Label>
            <Textarea
              placeholder="Digite observações adicionais (opcional)"
              className="min-h-[100px]"
              value={formData.observacoes || ""}
              onChange={(e) => updateFormData("observacoes", e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-4">
            {tipoServico === TipoServico.VOUCHER_UBER && selectedTransportSubcategory && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSelectedTransportSubcategory(undefined)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar à Seleção
              </Button>
            )}
            
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            
            <Button type="button" onClick={validateAndSubmit} className="bg-primary hover:bg-primary/90">
              Enviar Solicitação
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}