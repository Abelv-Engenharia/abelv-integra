import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { TipoServico, TipoPassagem } from "@/types/solicitacao";
import { cn } from "@/lib/utils";
interface ServiceSpecificFieldsProps {
  tipoServico: TipoServico;
  formData: any;
  updateFormData: (service: TipoServico, field: string, value: any) => void;
  errors: any;
}
export function ServiceSpecificFields({
  tipoServico,
  formData,
  updateFormData,
  errors
}: ServiceSpecificFieldsProps) {
  const updateField = (field: string, value: any) => {
    updateFormData(tipoServico, field, value);
  };
  switch (tipoServico) {
    case TipoServico.VOUCHER_UBER:
      return <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`valor-${tipoServico}`} className={errors?.valor ? "text-destructive" : ""}>Valor *</Label>
              <Input id={`valor-${tipoServico}`} type="number" step="0.01" value={formData?.valor || ''} onChange={e => updateField('valor', parseFloat(e.target.value))} className={errors?.valor ? "border-destructive" : ""} placeholder="0,00" />
              {errors?.valor && <p className="text-sm text-destructive">{errors.valor}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`dataUso-${tipoServico}`} className={errors?.dataUso ? "text-destructive" : ""}>
                Data de Uso *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal w-full", !formData?.dataUso && "text-muted-foreground", errors?.dataUso && "border-destructive")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData?.dataUso ? format(formData.dataUso, "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData?.dataUso} onSelect={date => updateField('dataUso', date)} initialFocus />
                </PopoverContent>
              </Popover>
              {errors?.dataUso && <p className="text-sm text-destructive">{errors.dataUso}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`localPartida-${tipoServico}`} className={errors?.localPartida ? "text-destructive" : ""}>
                Local de Partida *
              </Label>
              <Input id={`localPartida-${tipoServico}`} value={formData?.localPartida || ''} onChange={e => updateField('localPartida', e.target.value)} className={errors?.localPartida ? "border-destructive" : ""} placeholder="Endereço de origem" />
              {errors?.localPartida && <p className="text-sm text-destructive">{errors.localPartida}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`localDestino-${tipoServico}`} className={errors?.localDestino ? "text-destructive" : ""}>
                Local de Destino *
              </Label>
              <Input id={`localDestino-${tipoServico}`} value={formData?.localDestino || ''} onChange={e => updateField('localDestino', e.target.value)} className={errors?.localDestino ? "border-destructive" : ""} placeholder="Endereço de destino" />
              {errors?.localDestino && <p className="text-sm text-destructive">{errors.localDestino}</p>}
            </div>
          </div>
        </div>;
    case TipoServico.PASSAGENS:
      return <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`tipoPassagem-${tipoServico}`} className={errors?.tipoPassagem ? "text-destructive" : ""}>
              Tipo de Passagem *
            </Label>
            <Select value={formData?.tipoPassagem} onValueChange={value => updateField('tipoPassagem', value)}>
              <SelectTrigger className={errors?.tipoPassagem ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TipoPassagem.AEREA}>Aérea</SelectItem>
                <SelectItem value={TipoPassagem.RODOVIARIA}>Rodoviária</SelectItem>
              </SelectContent>
            </Select>
            {errors?.tipoPassagem && <p className="text-sm text-destructive">{errors.tipoPassagem}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`origem-${tipoServico}`} className={errors?.origem ? "text-destructive" : ""}>
                Origem *
              </Label>
              <Input id={`origem-${tipoServico}`} value={formData?.origem || ''} onChange={e => updateField('origem', e.target.value)} className={errors?.origem ? "border-destructive" : ""} placeholder="Cidade de origem" />
              {errors?.origem && <p className="text-sm text-destructive">{errors.origem}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`destino-${tipoServico}`} className={errors?.destino ? "text-destructive" : ""}>
                Destino *
              </Label>
              <Input id={`destino-${tipoServico}`} value={formData?.destino || ''} onChange={e => updateField('destino', e.target.value)} className={errors?.destino ? "border-destructive" : ""} placeholder="Cidade de destino" />
              {errors?.destino && <p className="text-sm text-destructive">{errors.destino}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`dataIda-${tipoServico}`} className={errors?.dataIda ? "text-destructive" : ""}>
                Data de Ida *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal w-full", !formData?.dataIda && "text-muted-foreground", errors?.dataIda && "border-destructive")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData?.dataIda ? format(formData.dataIda, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData?.dataIda} onSelect={date => updateField('dataIda', date)} initialFocus />
                </PopoverContent>
              </Popover>
              {errors?.dataIda && <p className="text-sm text-destructive">{errors.dataIda}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`dataVolta-${tipoServico}`}>Data de Volta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal w-full", !formData?.dataVolta && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData?.dataVolta ? format(formData.dataVolta, "dd/MM/yyyy") : "Opcional"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData?.dataVolta} onSelect={date => updateField('dataVolta', date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Dados dos Viajantes */}
          {(() => {
            // Inicializar viajantes se não existir
            if (!formData.viajantes || formData.viajantes.length === 0) {
              updateField('viajantes', [{ 
                nome: "", 
                cpf: "", 
                rg: "", 
                dataNascimento: undefined, 
                telefone: "", 
                email: "" 
              }]);
            }

            const viajantes = formData.viajantes || [];

            const addViajante = () => {
              const newViajantes = [...viajantes, { 
                nome: "", 
                cpf: "", 
                rg: "", 
                dataNascimento: undefined, 
                telefone: "", 
                email: "" 
              }];
              updateField('viajantes', newViajantes);
            };

            const removeViajante = (index: number) => {
              const newViajantes = viajantes.filter((_: any, i: number) => i !== index);
              updateField('viajantes', newViajantes);
            };

            const updateViajante = (index: number, field: string, value: any) => {
              const newViajantes = [...viajantes];
              newViajantes[index] = { ...newViajantes[index], [field]: value };
              updateField('viajantes', newViajantes);
            };

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Dados dos Viajantes *</Label>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={addViajante}
                  >
                    + Adicionar Viajante
                  </Button>
                </div>

                {viajantes.map((viajante: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Viajante {index + 1}</h4>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeViajante(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            Remover
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`viajante-nome-${index}`} className={errors?.[`viajantes.${index}.nome`] ? "text-destructive" : ""}>
                            Nome Completo *
                          </Label>
                          <Input
                            id={`viajante-nome-${index}`}
                            value={viajante.nome || ""}
                            onChange={(e) => updateViajante(index, 'nome', e.target.value)}
                            className={errors?.[`viajantes.${index}.nome`] ? "border-destructive" : ""}
                            placeholder="Nome completo"
                          />
                          {errors?.[`viajantes.${index}.nome`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.nome`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`viajante-cpf-${index}`} className={errors?.[`viajantes.${index}.cpf`] ? "text-destructive" : ""}>
                            CPF *
                          </Label>
                          <Input
                            id={`viajante-cpf-${index}`}
                            value={viajante.cpf || ""}
                            onChange={(e) => updateViajante(index, 'cpf', e.target.value)}
                            className={errors?.[`viajantes.${index}.cpf`] ? "border-destructive" : ""}
                            placeholder="000.000.000-00"
                          />
                          {errors?.[`viajantes.${index}.cpf`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.cpf`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`viajante-rg-${index}`} className={errors?.[`viajantes.${index}.rg`] ? "text-destructive" : ""}>
                            RG *
                          </Label>
                          <Input
                            id={`viajante-rg-${index}`}
                            value={viajante.rg || ""}
                            onChange={(e) => updateViajante(index, 'rg', e.target.value)}
                            className={errors?.[`viajantes.${index}.rg`] ? "border-destructive" : ""}
                            placeholder="00.000.000-0"
                          />
                          {errors?.[`viajantes.${index}.rg`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.rg`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`viajante-dataNascimento-${index}`} className={errors?.[`viajantes.${index}.dataNascimento`] ? "text-destructive" : ""}>
                            Data de Nascimento *
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id={`viajante-dataNascimento-${index}`}
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  errors?.[`viajantes.${index}.dataNascimento`] && "border-destructive",
                                  !viajante.dataNascimento && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {viajante.dataNascimento ? format(viajante.dataNascimento, "PPP", { locale: ptBR }) : "Selecione a data"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={viajante.dataNascimento}
                                onSelect={(date) => updateViajante(index, 'dataNascimento', date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {errors?.[`viajantes.${index}.dataNascimento`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.dataNascimento`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`viajante-telefone-${index}`} className={errors?.[`viajantes.${index}.telefone`] ? "text-destructive" : ""}>
                            Telefone *
                          </Label>
                          <Input
                            id={`viajante-telefone-${index}`}
                            value={viajante.telefone || ""}
                            onChange={(e) => updateViajante(index, 'telefone', e.target.value)}
                            className={errors?.[`viajantes.${index}.telefone`] ? "border-destructive" : ""}
                            placeholder="(00) 00000-0000"
                          />
                          {errors?.[`viajantes.${index}.telefone`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.telefone`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`viajante-email-${index}`} className={errors?.[`viajantes.${index}.email`] ? "text-destructive" : ""}>
                            E-mail *
                          </Label>
                          <Input
                            id={`viajante-email-${index}`}
                            type="email"
                            value={viajante.email || ""}
                            onChange={(e) => updateViajante(index, 'email', e.target.value)}
                            className={errors?.[`viajantes.${index}.email`] ? "border-destructive" : ""}
                            placeholder="email@exemplo.com"
                          />
                          {errors?.[`viajantes.${index}.email`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.email`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })()}
        </div>;
    case TipoServico.HOSPEDAGEM:
      return <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`cidadeDestino-${tipoServico}`} className={errors?.cidadeDestino ? "text-destructive" : ""}>
              Cidade de Destino *
            </Label>
            <Input id={`cidadeDestino-${tipoServico}`} value={formData?.cidadeDestino || ''} onChange={e => updateField('cidadeDestino', e.target.value)} className={errors?.cidadeDestino ? "border-destructive" : ""} placeholder="Cidade" />
            {errors?.cidadeDestino && <p className="text-sm text-destructive">{errors.cidadeDestino}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`checkIn-${tipoServico}`} className={errors?.checkIn ? "text-destructive" : ""}>
                Check-in *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal w-full", !formData?.checkIn && "text-muted-foreground", errors?.checkIn && "border-destructive")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData?.checkIn ? format(formData.checkIn, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData?.checkIn} onSelect={date => updateField('checkIn', date)} initialFocus />
                </PopoverContent>
              </Popover>
              {errors?.checkIn && <p className="text-sm text-destructive">{errors.checkIn}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`checkOut-${tipoServico}`} className={errors?.checkOut ? "text-destructive" : ""}>
                Check-out *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal w-full", !formData?.checkOut && "text-muted-foreground", errors?.checkOut && "border-destructive")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData?.checkOut ? format(formData.checkOut, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData?.checkOut} onSelect={date => updateField('checkOut', date)} initialFocus />
                </PopoverContent>
              </Popover>
              {errors?.checkOut && <p className="text-sm text-destructive">{errors.checkOut}</p>}
            </div>
          </div>

          {/* Dados dos Viajantes */}
          {(() => {
            // Inicializar viajantes se não existir
            if (!formData.viajantes || formData.viajantes.length === 0) {
              updateField('viajantes', [{ 
                nome: "", 
                cpf: "", 
                rg: "", 
                dataNascimento: undefined, 
                telefone: "", 
                email: "" 
              }]);
            }

            const viajantes = formData.viajantes || [];

            const addViajante = () => {
              const newViajantes = [...viajantes, { 
                nome: "", 
                cpf: "", 
                rg: "", 
                dataNascimento: undefined, 
                telefone: "", 
                email: "" 
              }];
              updateField('viajantes', newViajantes);
            };

            const removeViajante = (index: number) => {
              const newViajantes = viajantes.filter((_: any, i: number) => i !== index);
              updateField('viajantes', newViajantes);
            };

            const updateViajante = (index: number, field: string, value: any) => {
              const newViajantes = [...viajantes];
              newViajantes[index] = { ...newViajantes[index], [field]: value };
              updateField('viajantes', newViajantes);
            };

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Dados dos Viajantes *</Label>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={addViajante}
                  >
                    + Adicionar Viajante
                  </Button>
                </div>

                {viajantes.map((viajante: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Viajante {index + 1}</h4>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeViajante(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            Remover
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`viajante-hospede-nome-${index}`} className={errors?.[`viajantes.${index}.nome`] ? "text-destructive" : ""}>
                            Nome Completo *
                          </Label>
                          <Input
                            id={`viajante-hospede-nome-${index}`}
                            value={viajante.nome || ""}
                            onChange={(e) => updateViajante(index, 'nome', e.target.value)}
                            className={errors?.[`viajantes.${index}.nome`] ? "border-destructive" : ""}
                            placeholder="Nome completo"
                          />
                          {errors?.[`viajantes.${index}.nome`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.nome`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`viajante-hospede-cpf-${index}`} className={errors?.[`viajantes.${index}.cpf`] ? "text-destructive" : ""}>
                            CPF *
                          </Label>
                          <Input
                            id={`viajante-hospede-cpf-${index}`}
                            value={viajante.cpf || ""}
                            onChange={(e) => updateViajante(index, 'cpf', e.target.value)}
                            className={errors?.[`viajantes.${index}.cpf`] ? "border-destructive" : ""}
                            placeholder="000.000.000-00"
                          />
                          {errors?.[`viajantes.${index}.cpf`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.cpf`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`viajante-hospede-rg-${index}`} className={errors?.[`viajantes.${index}.rg`] ? "text-destructive" : ""}>
                            RG *
                          </Label>
                          <Input
                            id={`viajante-hospede-rg-${index}`}
                            value={viajante.rg || ""}
                            onChange={(e) => updateViajante(index, 'rg', e.target.value)}
                            className={errors?.[`viajantes.${index}.rg`] ? "border-destructive" : ""}
                            placeholder="00.000.000-0"
                          />
                          {errors?.[`viajantes.${index}.rg`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.rg`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`viajante-hospede-dataNascimento-${index}`} className={errors?.[`viajantes.${index}.dataNascimento`] ? "text-destructive" : ""}>
                            Data de Nascimento *
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id={`viajante-hospede-dataNascimento-${index}`}
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  errors?.[`viajantes.${index}.dataNascimento`] && "border-destructive",
                                  !viajante.dataNascimento && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {viajante.dataNascimento ? format(viajante.dataNascimento, "PPP", { locale: ptBR }) : "Selecione a data"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={viajante.dataNascimento}
                                onSelect={(date) => updateViajante(index, 'dataNascimento', date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {errors?.[`viajantes.${index}.dataNascimento`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.dataNascimento`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`viajante-hospede-telefone-${index}`} className={errors?.[`viajantes.${index}.telefone`] ? "text-destructive" : ""}>
                            Telefone *
                          </Label>
                          <Input
                            id={`viajante-hospede-telefone-${index}`}
                            value={viajante.telefone || ""}
                            onChange={(e) => updateViajante(index, 'telefone', e.target.value)}
                            className={errors?.[`viajantes.${index}.telefone`] ? "border-destructive" : ""}
                            placeholder="(00) 00000-0000"
                          />
                          {errors?.[`viajantes.${index}.telefone`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.telefone`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`viajante-hospede-email-${index}`} className={errors?.[`viajantes.${index}.email`] ? "text-destructive" : ""}>
                            E-mail *
                          </Label>
                          <Input
                            id={`viajante-hospede-email-${index}`}
                            type="email"
                            value={viajante.email || ""}
                            onChange={(e) => updateViajante(index, 'email', e.target.value)}
                            className={errors?.[`viajantes.${index}.email`] ? "border-destructive" : ""}
                            placeholder="email@exemplo.com"
                          />
                          {errors?.[`viajantes.${index}.email`] && (
                            <p className="text-sm text-destructive">{errors[`viajantes.${index}.email`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })()}
        </div>;
    case TipoServico.LOCACAO_VEICULO:
      return <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`tipoVeiculo-${tipoServico}`} className={errors?.tipoVeiculo ? "text-destructive" : ""}>
                Tipo de Veículo *
              </Label>
              <Select value={formData?.tipoVeiculo} onValueChange={value => updateField('tipoVeiculo', value)}>
                <SelectTrigger className={errors?.tipoVeiculo ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economico">Econômico</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="executivo">Executivo</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                </SelectContent>
              </Select>
              {errors?.tipoVeiculo && <p className="text-sm text-destructive">{errors.tipoVeiculo}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`condutor-${tipoServico}`} className={errors?.condutor ? "text-destructive" : ""}>
                Condutor *
              </Label>
              <Input id={`condutor-${tipoServico}`} value={formData?.condutor || ''} onChange={e => updateField('condutor', e.target.value)} className={errors?.condutor ? "border-destructive" : ""} placeholder="Nome do condutor" />
              {errors?.condutor && <p className="text-sm text-destructive">{errors.condutor}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`dataRetirada-${tipoServico}`} className={errors?.dataRetirada ? "text-destructive" : ""}>
                Data de Retirada *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal w-full", !formData?.dataRetirada && "text-muted-foreground", errors?.dataRetirada && "border-destructive")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData?.dataRetirada ? format(formData.dataRetirada, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData?.dataRetirada} onSelect={date => updateField('dataRetirada', date)} initialFocus />
                </PopoverContent>
              </Popover>
              {errors?.dataRetirada && <p className="text-sm text-destructive">{errors.dataRetirada}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`dataDevolucao-${tipoServico}`} className={errors?.dataDevolucao ? "text-destructive" : ""}>
                Data de Devolução *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal w-full", !formData?.dataDevolucao && "text-muted-foreground", errors?.dataDevolucao && "border-destructive")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData?.dataDevolucao ? format(formData.dataDevolucao, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData?.dataDevolucao} onSelect={date => updateField('dataDevolucao', date)} initialFocus />
                </PopoverContent>
              </Popover>
              {errors?.dataDevolucao && <p className="text-sm text-destructive">{errors.dataDevolucao}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`localRetirada-${tipoServico}`} className={errors?.localRetirada ? "text-destructive" : ""}>
              Local de Retirada *
            </Label>
            <Input id={`localRetirada-${tipoServico}`} value={formData?.localRetirada || ''} onChange={e => updateField('localRetirada', e.target.value)} className={errors?.localRetirada ? "border-destructive" : ""} placeholder="Endereço para retirada" />
            {errors?.localRetirada && <p className="text-sm text-destructive">{errors.localRetirada}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id={`termoResponsabilidade-${tipoServico}`} checked={formData?.termoResponsabilidade || false} onCheckedChange={checked => updateField('termoResponsabilidade', checked)} />
            <Label htmlFor={`termoResponsabilidade-${tipoServico}`} className={cn("text-sm font-normal cursor-pointer", errors?.termoResponsabilidade && "text-destructive")}>
              Aceito o termo de responsabilidade *
            </Label>
          </div>
          {errors?.termoResponsabilidade && <p className="text-sm text-destructive">{errors.termoResponsabilidade}</p>}
        </div>;
    case TipoServico.LOGISTICA:
      return <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`tipoEnvio-${tipoServico}`} className={errors?.tipoEnvio ? "text-destructive" : ""}>
              Tipo de Envio *
            </Label>
            <Select value={formData?.tipoEnvio} onValueChange={value => updateField('tipoEnvio', value)}>
              <SelectTrigger className={errors?.tipoEnvio ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="documento">Documento</SelectItem>
                <SelectItem value="pacote">Pacote</SelectItem>
                <SelectItem value="carga">Carga</SelectItem>
              </SelectContent>
            </Select>
            {errors?.tipoEnvio && <p className="text-sm text-destructive">{errors.tipoEnvio}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`enderecoColeta-${tipoServico}`} className={errors?.enderecoColeta ? "text-destructive" : ""}>
              Endereço de Coleta *
            </Label>
            <Input id={`enderecoColeta-${tipoServico}`} value={formData?.enderecoColeta || ''} onChange={e => updateField('enderecoColeta', e.target.value)} className={errors?.enderecoColeta ? "border-destructive" : ""} placeholder="Endereço completo" />
            {errors?.enderecoColeta && <p className="text-sm text-destructive">{errors.enderecoColeta}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`enderecoEntrega-${tipoServico}`} className={errors?.enderecoEntrega ? "text-destructive" : ""}>
              Endereço de Entrega *
            </Label>
            <Input id={`enderecoEntrega-${tipoServico}`} value={formData?.enderecoEntrega || ''} onChange={e => updateField('enderecoEntrega', e.target.value)} className={errors?.enderecoEntrega ? "border-destructive" : ""} placeholder="Endereço completo" />
            {errors?.enderecoEntrega && <p className="text-sm text-destructive">{errors.enderecoEntrega}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`descricaoItem-${tipoServico}`} className={errors?.descricaoItem ? "text-destructive" : ""}>
              Descrição do Item *
            </Label>
            <Textarea id={`descricaoItem-${tipoServico}`} value={formData?.descricaoItem || ''} onChange={e => updateField('descricaoItem', e.target.value)} className={errors?.descricaoItem ? "border-destructive" : ""} placeholder="Descreva o item" rows={3} />
            {errors?.descricaoItem && <p className="text-sm text-destructive">{errors.descricaoItem}</p>}
          </div>
        </div>;
    
    case TipoServico.CARTAO_ABASTECIMENTO:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Solicitação */}
          <div className="space-y-2">
            <Label htmlFor={`tipoSolicitacao-${tipoServico}`} className={errors?.tipoSolicitacao ? "text-destructive" : ""}>
              Tipo de Solicitação <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData?.tipoSolicitacao || ''}
              onValueChange={(value) => updateField('tipoSolicitacao', value)}
            >
              <SelectTrigger 
                id={`tipoSolicitacao-${tipoServico}`}
                className={errors?.tipoSolicitacao ? 'border-destructive' : ''}
              >
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novo">Novo Cartão</SelectItem>
                <SelectItem value="recarga">Recarga</SelectItem>
                <SelectItem value="cancelamento">Cancelamento</SelectItem>
              </SelectContent>
            </Select>
            {errors?.tipoSolicitacao && (
              <p className="text-sm text-destructive">{errors.tipoSolicitacao}</p>
            )}
          </div>

          {/* Placa do Veículo */}
          <div className="space-y-2">
            <Label htmlFor={`placa-${tipoServico}`} className={errors?.placa ? "text-destructive" : ""}>
              Placa do Veículo <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`placa-${tipoServico}`}
              value={formData?.placa || ''}
              onChange={(e) => updateField('placa', e.target.value.toUpperCase())}
              placeholder="ABC-1234"
              maxLength={8}
              className={errors?.placa ? 'border-destructive' : ''}
            />
            {errors?.placa && (
              <p className="text-sm text-destructive">{errors.placa}</p>
            )}
          </div>

          {/* Valor Adicional */}
          <div className="space-y-2">
            <Label htmlFor={`valorAdicional-${tipoServico}`}>
              Valor Adicional
            </Label>
            <Input
              id={`valorAdicional-${tipoServico}`}
              type="number"
              step="0.01"
              value={formData?.valorAdicional || ''}
              onChange={(e) => updateField('valorAdicional', parseFloat(e.target.value))}
              placeholder="0.00"
              className={errors?.valorAdicional ? 'border-destructive' : ''}
            />
            {errors?.valorAdicional && (
              <p className="text-sm text-destructive">{errors.valorAdicional}</p>
            )}
          </div>

          {/* Motivo */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`motivo-${tipoServico}`} className={errors?.motivo ? "text-destructive" : ""}>
              Motivo <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id={`motivo-${tipoServico}`}
              value={formData?.motivo || ''}
              onChange={(e) => updateField('motivo', e.target.value)}
              placeholder="Descreva o motivo da solicitação"
              rows={3}
              className={errors?.motivo ? 'border-destructive' : ''}
            />
            {errors?.motivo && (
              <p className="text-sm text-destructive">{errors.motivo}</p>
            )}
          </div>
        </div>
      );
    
    default:
      return null;
  }
}