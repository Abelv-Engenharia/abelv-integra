import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceSpecificFields } from "./ServiceSpecificFields";
import { TransportSubcategorySelector, TransportSubcategory } from "./TransportSubcategorySelector";
import { TipoServico, PrioridadeSolicitacao, StatusSolicitacao, categoriesInfo } from "@/types/gestao-pessoas/solicitacao";
import { Plane, Car, Building, Package } from "lucide-react";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface MultipleServiceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  solicitante: string;
}

export function MultipleServiceForm({ onSubmit, onCancel, solicitante }: MultipleServiceFormProps) {
  const { data: ccas, isLoading: isLoadingCCAs } = useUserCCAs();
  
  const [selectedServices, setSelectedServices] = useState<TipoServico[]>([]);
  const [currentStep, setCurrentStep] = useState<'selection' | 'form'>('selection');
  
  // Dados comuns
  const [commonData, setCommonData] = useState({
    solicitante: solicitante,
    prioridade: PrioridadeSolicitacao.MEDIA,
    centroCusto: "",
    observacoes: "",
  });

  // Dados específicos de cada serviço
  const [servicesData, setServicesData] = useState<Record<TipoServico, any>>({} as any);
  
  // Subcategoria de transporte selecionada
  const [transportSubcategory, setTransportSubcategory] = useState<TransportSubcategory | undefined>();
  
  // Erros de validação
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (solicitante) {
      updateCommonData('solicitante', solicitante);
    }
  }, [solicitante]);

  const getTransportTipoServico = (): TipoServico => {
    if (!transportSubcategory) return TipoServico.VOUCHER_UBER;
    
    const subcategoryMap: Record<TransportSubcategory, TipoServico> = {
      'voucher_uber': TipoServico.VOUCHER_UBER,
      'locacao_veiculo': TipoServico.LOCACAO_VEICULO,
      'cartao_abastecimento': TipoServico.CARTAO_ABASTECIMENTO
    };
    
    return subcategoryMap[transportSubcategory];
  };

  const handleServiceToggle = (service: TipoServico) => {
    setSelectedServices(prev => {
      const isRemoving = prev.includes(service);
      
      // Se estiver removendo transporte, limpar subcategoria
      if (isRemoving && (service === TipoServico.VOUCHER_UBER || 
                         service === TipoServico.LOCACAO_VEICULO || 
                         service === TipoServico.CARTAO_ABASTECIMENTO)) {
        setTransportSubcategory(undefined);
      }
      
      return isRemoving 
        ? prev.filter(s => s !== service)
        : [...prev, service];
    });
  };

  const handleProceedToForm = () => {
    if (selectedServices.length === 0) return;
    setCurrentStep('form');
  };

  const updateCommonData = (field: string, value: any) => {
    setCommonData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const updateServiceData = (service: TipoServico, field: string, value: any) => {
    setServicesData(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }));
    
    if (errors[`${service}.${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${service}.${field}`];
      setErrors(newErrors);
    }
  };

  const validateAndSubmit = () => {
    const newErrors: any = {};

    // Validar campos comuns
    if (!commonData.solicitante) {
      newErrors.solicitante = "Solicitante é obrigatório";
    }
    if (!commonData.centroCusto) {
      newErrors.centroCusto = "CCA é obrigatório";
    }

    // Validar se transporte foi selecionado mas subcategoria não
    const hasTransport = selectedServices.some(s => 
      s === TipoServico.VOUCHER_UBER || 
      s === TipoServico.LOCACAO_VEICULO || 
      s === TipoServico.CARTAO_ABASTECIMENTO
    );
    
    if (hasTransport && !transportSubcategory) {
      newErrors.transportSubcategory = "Selecione um tipo de transporte";
    }

    // Validar campos específicos de cada serviço
    selectedServices.forEach(service => {
      const data = servicesData[service] || {};
      
      switch (service) {
        case TipoServico.VOUCHER_UBER:
          if (!data.valor || data.valor <= 0) {
            newErrors[`${service}.valor`] = "Valor é obrigatório";
          }
          if (!data.dataUso) {
            newErrors[`${service}.dataUso`] = "Data de uso é obrigatória";
          }
          if (!data.localPartida) {
            newErrors[`${service}.localPartida`] = "Local de partida é obrigatório";
          }
          if (!data.localDestino) {
            newErrors[`${service}.localDestino`] = "Local de destino é obrigatório";
          }
          break;

        case TipoServico.PASSAGENS:
          if (!data.tipoPassagem) {
            newErrors[`${service}.tipoPassagem`] = "Tipo de passagem é obrigatório";
          }
          if (!data.origem) {
            newErrors[`${service}.origem`] = "Origem é obrigatória";
          }
          if (!data.destino) {
            newErrors[`${service}.destino`] = "Destino é obrigatório";
          }
          if (!data.dataIda) {
            newErrors[`${service}.dataIda`] = "Data de ida é obrigatória";
          }
          
          // Validar viajantes
          if (!data.viajantes || data.viajantes.length === 0) {
            newErrors[`${service}.viajantes`] = "É necessário adicionar pelo menos um viajante";
          } else {
            data.viajantes.forEach((viajante: any, index: number) => {
              if (!viajante.nome || viajante.nome.trim() === "") {
                newErrors[`${service}.viajantes.${index}.nome`] = "Nome é obrigatório";
              }
              if (!viajante.cpf || viajante.cpf.trim() === "") {
                newErrors[`${service}.viajantes.${index}.cpf`] = "CPF é obrigatório";
              }
              if (!viajante.rg || viajante.rg.trim() === "") {
                newErrors[`${service}.viajantes.${index}.rg`] = "RG é obrigatório";
              }
              if (!viajante.dataNascimento) {
                newErrors[`${service}.viajantes.${index}.dataNascimento`] = "Data de nascimento é obrigatória";
              }
              if (!viajante.telefone || viajante.telefone.trim() === "") {
                newErrors[`${service}.viajantes.${index}.telefone`] = "Telefone é obrigatório";
              }
              if (!viajante.email || viajante.email.trim() === "") {
                newErrors[`${service}.viajantes.${index}.email`] = "E-mail é obrigatório";
              }
            });
          }
          break;

        case TipoServico.HOSPEDAGEM:
          if (!data.cidadeDestino) {
            newErrors[`${service}.cidadeDestino`] = "Cidade de destino é obrigatória";
          }
          if (!data.checkIn) {
            newErrors[`${service}.checkIn`] = "Data de check-in é obrigatória";
          }
          if (!data.checkOut) {
            newErrors[`${service}.checkOut`] = "Data de check-out é obrigatória";
          }
          
          // Validar viajantes
          if (!data.viajantes || data.viajantes.length === 0) {
            newErrors[`${service}.viajantes`] = "É necessário adicionar pelo menos um viajante";
          } else {
            data.viajantes.forEach((viajante: any, index: number) => {
              if (!viajante.nome || viajante.nome.trim() === "") {
                newErrors[`${service}.viajantes.${index}.nome`] = "Nome é obrigatório";
              }
              if (!viajante.cpf || viajante.cpf.trim() === "") {
                newErrors[`${service}.viajantes.${index}.cpf`] = "CPF é obrigatório";
              }
              if (!viajante.rg || viajante.rg.trim() === "") {
                newErrors[`${service}.viajantes.${index}.rg`] = "RG é obrigatório";
              }
              if (!viajante.dataNascimento) {
                newErrors[`${service}.viajantes.${index}.dataNascimento`] = "Data de nascimento é obrigatória";
              }
              if (!viajante.telefone || viajante.telefone.trim() === "") {
                newErrors[`${service}.viajantes.${index}.telefone`] = "Telefone é obrigatório";
              }
              if (!viajante.email || viajante.email.trim() === "") {
                newErrors[`${service}.viajantes.${index}.email`] = "E-mail é obrigatório";
              }
            });
          }
          break;

        case TipoServico.LOCACAO_VEICULO:
          if (!data.tipoVeiculo) {
            newErrors[`${service}.tipoVeiculo`] = "Tipo de veículo é obrigatório";
          }
          if (!data.condutor) {
            newErrors[`${service}.condutor`] = "Condutor é obrigatório";
          }
          if (!data.dataRetirada) {
            newErrors[`${service}.dataRetirada`] = "Data de retirada é obrigatória";
          }
          if (!data.dataDevolucao) {
            newErrors[`${service}.dataDevolucao`] = "Data de devolução é obrigatória";
          }
          if (!data.localRetirada) {
            newErrors[`${service}.localRetirada`] = "Local de retirada é obrigatório";
          }
          if (!data.termoResponsabilidade) {
            newErrors[`${service}.termoResponsabilidade`] = "Termo de responsabilidade é obrigatório";
          }
          break;

        case TipoServico.LOGISTICA:
          if (!data.tipoEnvio) {
            newErrors[`${service}.tipoEnvio`] = "Tipo de envio é obrigatório";
          }
          if (!data.enderecoColeta) {
            newErrors[`${service}.enderecoColeta`] = "Endereço de coleta é obrigatório";
          }
          if (!data.enderecoEntrega) {
            newErrors[`${service}.enderecoEntrega`] = "Endereço de entrega é obrigatório";
          }
          if (!data.descricaoItem) {
            newErrors[`${service}.descricaoItem`] = "Descrição do item é obrigatória";
          }
          break;

        case TipoServico.CARTAO_ABASTECIMENTO:
          if (!data.tipoSolicitacao) {
            newErrors[`${service}.tipoSolicitacao`] = "Tipo de solicitação é obrigatório";
          }
          if (!data.placa) {
            newErrors[`${service}.placa`] = "Placa do veículo é obrigatória";
          }
          if (!data.motivo) {
            newErrors[`${service}.motivo`] = "Motivo é obrigatório";
          }
          break;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const finalData = {
        ...commonData,
        servicosSelecionados: selectedServices,
        dadosServicos: servicesData,
        isCombined: true,
        status: StatusSolicitacao.EM_ANDAMENTO
      };
      onSubmit(finalData);
    }
  };

  const getServiceIcon = (service: TipoServico) => {
    switch (service) {
      case TipoServico.PASSAGENS:
        return Plane;
      case TipoServico.VOUCHER_UBER:
      case TipoServico.LOCACAO_VEICULO:
        return Car;
      case TipoServico.HOSPEDAGEM:
        return Building;
      case TipoServico.LOGISTICA:
        return Package;
      default:
        return Package;
    }
  };

  if (currentStep === 'form') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Solicitação Combinada</h2>
            <p className="text-muted-foreground">Preencha os dados para os serviços selecionados</p>
          </div>
          <div className="flex gap-2">
            {selectedServices.map(service => {
              const category = categoriesInfo.find(c => c.id === service);
              const Icon = getServiceIcon(service);
              return (
                <Badge key={service} variant="secondary" className="gap-1">
                  <Icon className="h-3 w-3" />
                  {category?.title}
                </Badge>
              );
            })}
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => setCurrentStep('selection')}
          className="mb-4"
        >
          ← Voltar à Seleção
        </Button>

        {/* Campos Comuns */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="solicitante">
                Solicitante
              </Label>
              <Input 
                id="solicitante"
                value={commonData.solicitante}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade *</Label>
                <Select 
                  value={commonData.prioridade} 
                  onValueChange={(value) => updateCommonData('prioridade', value as PrioridadeSolicitacao)}
                >
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

              <div className="space-y-2">
                <Label htmlFor="centroCusto" className={errors.centroCusto ? "text-destructive" : ""}>
                  CCA *
                </Label>
                <Select 
                  value={commonData.centroCusto} 
                  onValueChange={(value) => updateCommonData('centroCusto', value)}
                  disabled={isLoadingCCAs}
                >
                  <SelectTrigger className={errors.centroCusto ? "border-destructive" : ""}>
                    <SelectValue placeholder={isLoadingCCAs ? "Carregando CCAs..." : "Selecione o CCA"} />
                  </SelectTrigger>
                  <SelectContent>
                    {ccas?.map((cca) => (
                      <SelectItem key={cca.id} value={cca.id.toString()}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.centroCusto && <p className="text-sm text-destructive">{errors.centroCusto}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={commonData.observacoes}
                onChange={(e) => updateCommonData('observacoes', e.target.value)}
                placeholder="Informações adicionais sobre a solicitação"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cards de serviços específicos */}
        <div className="space-y-4">
          {selectedServices.map(service => {
            const category = categoriesInfo.find(c => c.id === service);
            const Icon = getServiceIcon(service);
            const serviceErrors = Object.keys(errors)
              .filter(key => key.startsWith(`${service}.`))
              .reduce((acc, key) => {
                const field = key.replace(`${service}.`, '');
                acc[field] = errors[key];
                return acc;
              }, {} as any);

            const isTransportService = service === TipoServico.VOUCHER_UBER || 
                                      service === TipoServico.LOCACAO_VEICULO || 
                                      service === TipoServico.CARTAO_ABASTECIMENTO;
            
            return (
              <Card key={service}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {isTransportService ? "Transporte" : category?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Se for transporte, mostrar seletor de subcategoria primeiro */}
                  {isTransportService && (
                    <>
                      <TransportSubcategorySelector
                        selectedSubcategory={transportSubcategory}
                        onSelect={setTransportSubcategory}
                      />
                      {errors.transportSubcategory && (
                        <p className="text-sm text-destructive text-center">{errors.transportSubcategory}</p>
                      )}
                    </>
                  )}

                  {/* Mostrar campos específicos apenas se não for transporte OU se já tiver subcategoria selecionada */}
                  {(!isTransportService || transportSubcategory) && (
                    <ServiceSpecificFields
                      tipoServico={isTransportService ? getTransportTipoServico() : service}
                      formData={servicesData[service] || {}}
                      updateFormData={updateServiceData}
                      errors={serviceErrors}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Botões de ação únicos */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={validateAndSubmit}>
            Enviar Solicitação
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Solicitação Combinada
        </h2>
        <p className="text-muted-foreground">
          Selecione múltiplos serviços para uma única solicitação
        </p>
      </div>

      {/* Seleção de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoriesInfo.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedServices.includes(category.id);
          
          return (
            <Card 
              key={category.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => handleServiceToggle(category.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Checkbox 
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold">{category.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Serviços Selecionados */}
      {selectedServices.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Serviços Selecionados</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map(service => {
                    const category = categoriesInfo.find(c => c.id === service);
                    const Icon = getServiceIcon(service);
                    return (
                      <Badge key={service} variant="default" className="gap-1">
                        <Icon className="h-3 w-3" />
                        {category?.title}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <Button onClick={handleProceedToForm}>
                Prosseguir →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}