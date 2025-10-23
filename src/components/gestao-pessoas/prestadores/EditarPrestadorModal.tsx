import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdatePrestadorPJ, PrestadorPJ } from "@/hooks/gestao-pessoas/usePrestadoresPJ";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EditarPrestadorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prestador: PrestadorPJ;
}

export function EditarPrestadorModal({ open, onOpenChange, prestador }: EditarPrestadorModalProps) {
  const updatePrestadorMutation = useUpdatePrestadorPJ();
  
  // Buscar CCAs ativos
  const { data: ccas } = useQuery({
    queryKey: ['ccas-ativos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('codigo');
      if (error) throw error;
      return data || [];
    }
  });

  const [formData, setFormData] = useState<any>({});
  const [dataNascimento, setDataNascimento] = useState<Date | undefined>();
  const [dataInicioContrato, setDataInicioContrato] = useState<Date | undefined>();
  const [dataInicioContratoDeterminado, setDataInicioContratoDeterminado] = useState<Date | undefined>();
  const [dataFimContratoDeterminado, setDataFimContratoDeterminado] = useState<Date | undefined>();

  useEffect(() => {
    if (prestador) {
      setFormData({
        razaosocial: prestador.razaoSocial || "",
        cnpj: prestador.cnpj ? formatCNPJ(prestador.cnpj) : "",
        descricaoatividade: prestador.descricaoAtividade || "",
        numerocnae: prestador.numeroCnae || "",
        grauderisco: prestador.grauDeRisco?.toString() || "",
        endereco: prestador.endereco || "",
        telefone: prestador.telefone || "",
        email: prestador.email || "",
        contabancaria: prestador.contaBancaria || "",
        numerocredorsienge: prestador.numeroCredorSienge || "",
        nomecompleto: prestador.nomeCompleto || "",
        cpf: prestador.cpf || "",
        rg: prestador.rg || "",
        registrofuncional: prestador.registroFuncional || "",
        telefonerepresentante: prestador.telefoneRepresentante || "",
        emailrepresentante: prestador.emailRepresentante || "",
        enderecorepresentante: prestador.enderecoRepresentante || "",
        servico: prestador.servico || "",
        valorprestacaoservico: prestador.valorPrestacaoServico ? formatarMoedaDoBanco(prestador.valorPrestacaoServico) : "",
        tipocontrato: prestador.tempoContrato || "padrao",
        ajudacusto: prestador.ajudaCusto ? formatarMoedaDoBanco(prestador.ajudaCusto) : "",
        ajudaaluguel: prestador.ajudaAluguel ? formatarMoedaDoBanco(prestador.ajudaAluguel) : "",
        valerefeicao: prestador.valeRefeicao ? formatarMoedaDoBanco(prestador.valeRefeicao) : "",
        valorauxilioconveniomedico: prestador.valorAuxilioConvenioMedico ? formatarMoedaDoBanco(prestador.valorAuxilioConvenioMedico) : "",
        valorcafemanha: prestador.valorCafeManha ? formatarMoedaDoBanco(prestador.valorCafeManha) : "",
        valorcafetarde: prestador.valorCafeTarde ? formatarMoedaDoBanco(prestador.valorCafeTarde) : "",
        valoralmoco: prestador.valorAlmoco ? formatarMoedaDoBanco(prestador.valorAlmoco) : "",
        veiculo: prestador.veiculo || false,
        celular: prestador.celular || false,
        alojamento: prestador.alojamento || false,
        folgacampo: prestador.folgaCampo || "",
        periodoferias: prestador.periodoFerias || "",
        quantidadediasferias: prestador.quantidadeDiasFerias?.toString() || "",
        ccaobra: prestador.ccaId?.toString() || "",
      });
      
      if (prestador.dataNascimento) {
        const dateStr = prestador.dataNascimento.split('T')[0];
        const [year, month, day] = dateStr.split('-');
        setDataNascimento(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
      }
      
      if (prestador.dataInicioContrato) {
        const dateStr = prestador.dataInicioContrato.split('T')[0];
        const [year, month, day] = dateStr.split('-');
        setDataInicioContrato(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
      }

      if (prestador.dataInicioContratoDeterminado) {
        const dateStr = prestador.dataInicioContratoDeterminado.split('T')[0];
        const [year, month, day] = dateStr.split('-');
        setDataInicioContratoDeterminado(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
      }

      if (prestador.dataFimContratoDeterminado) {
        const dateStr = prestador.dataFimContratoDeterminado.split('T')[0];
        const [year, month, day] = dateStr.split('-');
        setDataFimContratoDeterminado(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
      }
    }
  }, [prestador]);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const formatarMoedaDoBanco = (valor: number): string => {
    if (!valor) return '';
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatarMoeda = (valor: string | number): string => {
    const numeros = valor.toString().replace(/\D/g, '');
    if (!numeros) return '';
    const numero = Number(numeros) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const extrairValorNumerico = (valorFormatado: string): string => {
    return valorFormatado.replace(/[R$\s.]/g, '').replace(',', '.');
  };

  const handleSave = async () => {
    try {
      const updatedPrestador = {
        razaoSocial: formData.razaosocial,
        cnpj: formData.cnpj.replace(/\D/g, ""),
        descricaoAtividade: formData.descricaoatividade || null,
        numeroCnae: formData.numerocnae || null,
        grauDeRisco: formData.grauderisco || null,
        endereco: formData.endereco || null,
        telefone: formData.telefone?.replace(/\D/g, "") || null,
        email: formData.email || null,
        contaBancaria: formData.contabancaria || null,
        numeroCredorSienge: formData.numerocredorsienge || null,
        nomeCompleto: formData.nomecompleto,
        cpf: formData.cpf.replace(/\D/g, ""),
        dataNascimento: dataNascimento ? dataNascimento.toISOString() : null,
        rg: formData.rg || null,
        registroFuncional: formData.registrofuncional || null,
        telefoneRepresentante: formData.telefonerepresentante?.replace(/\D/g, "") || null,
        emailRepresentante: formData.emailrepresentante || null,
        enderecoRepresentante: formData.enderecorepresentante || null,
        servico: formData.servico || null,
        valorPrestacaoServico: formData.valorprestacaoservico ? parseFloat(extrairValorNumerico(formData.valorprestacaoservico)) : 0,
        dataInicioContrato: dataInicioContrato ? dataInicioContrato.toISOString() : null,
        tempoContrato: formData.tipocontrato,
        dataInicioContratoDeterminado: dataInicioContratoDeterminado ? dataInicioContratoDeterminado.toISOString() : null,
        dataFimContratoDeterminado: dataFimContratoDeterminado ? dataFimContratoDeterminado.toISOString() : null,
        ajudaCusto: formData.ajudacusto ? parseFloat(extrairValorNumerico(formData.ajudacusto)) : 0,
        ajudaAluguel: formData.ajudaaluguel ? parseFloat(extrairValorNumerico(formData.ajudaaluguel)) : 0,
        valeRefeicao: formData.valerefeicao ? parseFloat(extrairValorNumerico(formData.valerefeicao)) : 0,
        valorAuxilioConvenioMedico: formData.valorauxilioconveniomedico ? parseFloat(extrairValorNumerico(formData.valorauxilioconveniomedico)) : 0,
        valorCafeManha: formData.valorcafemanha ? parseFloat(extrairValorNumerico(formData.valorcafemanha)) : 0,
        valorCafeTarde: formData.valorcafetarde ? parseFloat(extrairValorNumerico(formData.valorcafetarde)) : 0,
        valorAlmoco: formData.valoralmoco ? parseFloat(extrairValorNumerico(formData.valoralmoco)) : 0,
        auxilioConvenioMedico: formData.valorauxilioconveniomedico && parseFloat(extrairValorNumerico(formData.valorauxilioconveniomedico)) > 0,
        cafeManha: formData.valorcafemanha && parseFloat(extrairValorNumerico(formData.valorcafemanha)) > 0,
        cafeTarde: formData.valorcafetarde && parseFloat(extrairValorNumerico(formData.valorcafetarde)) > 0,
        almoco: formData.valoralmoco && parseFloat(extrairValorNumerico(formData.valoralmoco)) > 0,
        veiculo: formData.veiculo,
        celular: formData.celular,
        alojamento: formData.alojamento,
        folgaCampo: formData.folgacampo || null,
        periodoFerias: formData.periodoferias || null,
        quantidadeDiasFerias: formData.quantidadediasferias ? parseInt(formData.quantidadediasferias) : null,
        ccaId: formData.ccaobra ? parseInt(formData.ccaobra) : null,
      };

      await updatePrestadorMutation.mutateAsync({
        id: prestador.id,
        ...updatedPrestador
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar prestador:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Prestador</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-150px)] pr-4">
          <div className="space-y-6">
            {/* Dados da Empresa */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Dados da Empresa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj || ""}
                    onChange={(e) => {
                      const formatted = formatCNPJ(e.target.value);
                      if (formatted.length <= 18) {
                        handleChange("cnpj", formatted);
                      }
                    }}
                    maxLength={18}
                  />
                </div>

                <div>
                  <Label htmlFor="razaosocial">Razão Social *</Label>
                  <Input
                    id="razaosocial"
                    value={formData.razaosocial || ""}
                    onChange={(e) => handleChange("razaosocial", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricaoatividade">Descrição da Atividade</Label>
                <Textarea
                  id="descricaoatividade"
                  value={formData.descricaoatividade || ""}
                  onChange={(e) => handleChange("descricaoatividade", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numerocnae">Número de CNAE</Label>
                  <Input
                    id="numerocnae"
                    value={formData.numerocnae || ""}
                    onChange={(e) => handleChange("numerocnae", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="grauderisco">Grau de Risco</Label>
                  <Select
                    value={formData.grauderisco || ""}
                    onValueChange={(value) => handleChange("grauderisco", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grau de risco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Baixo</SelectItem>
                      <SelectItem value="2">2 - Médio</SelectItem>
                      <SelectItem value="3">3 - Alto</SelectItem>
                      <SelectItem value="4">4 - Muito Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco || ""}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone || ""}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      handleChange("telefone", formatted);
                    }}
                    maxLength={15}
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contabancaria">Chave PIX</Label>
                  <Input
                    id="contabancaria"
                    value={formData.contabancaria || ""}
                    onChange={(e) => handleChange("contabancaria", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="numerocredorsienge">Nº Credor Sienge</Label>
                  <Input
                    id="numerocredorsienge"
                    value={formData.numerocredorsienge || ""}
                    onChange={(e) => handleChange("numerocredorsienge", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Dados do Representante Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Dados do Representante Legal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomecompleto">Nome Completo *</Label>
                  <Input
                    id="nomecompleto"
                    value={formData.nomecompleto || ""}
                    onChange={(e) => handleChange("nomecompleto", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf || ""}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      if (formatted.length <= 14) {
                        handleChange("cpf", formatted);
                      }
                    }}
                    maxLength={14}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Data de Nascimento</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={dataNascimento ? format(dataNascimento, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          const [year, month, day] = value.split('-');
                          setDataNascimento(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
                        } else {
                          setDataNascimento(undefined);
                        }
                      }}
                      max={format(new Date(), "yyyy-MM-dd")}
                      min="1900-01-01"
                      className="flex-1"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataNascimento}
                          onSelect={setDataNascimento}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    value={formData.rg || ""}
                    onChange={(e) => handleChange("rg", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="registrofuncional">Registro Funcional</Label>
                  <Input
                    id="registrofuncional"
                    value={formData.registrofuncional || ""}
                    onChange={(e) => handleChange("registrofuncional", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefonerepresentante">Telefone</Label>
                  <Input
                    id="telefonerepresentante"
                    value={formData.telefonerepresentante || ""}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      handleChange("telefonerepresentante", formatted);
                    }}
                    maxLength={15}
                  />
                </div>

                <div>
                  <Label htmlFor="emailrepresentante">E-mail</Label>
                  <Input
                    id="emailrepresentante"
                    type="email"
                    value={formData.emailrepresentante || ""}
                    onChange={(e) => handleChange("emailrepresentante", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="enderecorepresentante">Endereço</Label>
                <Textarea
                  id="enderecorepresentante"
                  value={formData.enderecorepresentante || ""}
                  onChange={(e) => handleChange("enderecorepresentante", e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </div>

            {/* Condições Financeiras */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Condições Financeiras</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servico">Serviço</Label>
                  <Input
                    id="servico"
                    value={formData.servico || ""}
                    onChange={(e) => handleChange("servico", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="valorprestacaoservico">Valor Prestação de Serviço</Label>
                  <Input
                    id="valorprestacaoservico"
                    value={formData.valorprestacaoservico || ""}
                    onChange={(e) => {
                      const formatted = formatarMoeda(e.target.value);
                      handleChange("valorprestacaoservico", formatted);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Data Início Contrato</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataInicioContrato && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataInicioContrato ? format(dataInicioContrato, "dd/MM/yyyy") : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataInicioContrato}
                        onSelect={setDataInicioContrato}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="tipocontrato">Tipo de Contrato</Label>
                  <Select
                    value={formData.tipocontrato || "padrao"}
                    onValueChange={(value) => handleChange("tipocontrato", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="padrao">Prazo Indeterminado</SelectItem>
                      <SelectItem value="determinado">Prazo Determinado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.tipocontrato === "determinado" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Data Início</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataInicioContratoDeterminado && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataInicioContratoDeterminado ? format(dataInicioContratoDeterminado, "dd/MM/yyyy") : "Selecione"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataInicioContratoDeterminado}
                          onSelect={setDataInicioContratoDeterminado}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Data Fim</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataFimContratoDeterminado && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataFimContratoDeterminado ? format(dataFimContratoDeterminado, "dd/MM/yyyy") : "Selecione"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataFimContratoDeterminado}
                          onSelect={setDataFimContratoDeterminado}
                          disabled={(date) => dataInicioContratoDeterminado ? date < dataInicioContratoDeterminado : false}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ajudacusto">Ajuda de Custo</Label>
                  <Input
                    id="ajudacusto"
                    placeholder="R$ 0,00"
                    value={formData.ajudacusto || ""}
                    onChange={(e) => {
                      const formatted = formatarMoeda(e.target.value);
                      handleChange("ajudacusto", formatted);
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="ajudaaluguel">Ajuda Aluguel</Label>
                  <Input
                    id="ajudaaluguel"
                    placeholder="R$ 0,00"
                    value={formData.ajudaaluguel || ""}
                    onChange={(e) => {
                      const formatted = formatarMoeda(e.target.value);
                      handleChange("ajudaaluguel", formatted);
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="valerefeicao">Vale Refeição</Label>
                  <Input
                    id="valerefeicao"
                    placeholder="R$ 0,00"
                    value={formData.valerefeicao || ""}
                    onChange={(e) => {
                      const formatted = formatarMoeda(e.target.value);
                      handleChange("valerefeicao", formatted);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="valorauxilioconveniomedico">Auxílio Convênio Médico</Label>
                  <Input
                    id="valorauxilioconveniomedico"
                    placeholder="R$ 0,00"
                    value={formData.valorauxilioconveniomedico || ""}
                    onChange={(e) => {
                      const formatted = formatarMoeda(e.target.value);
                      handleChange("valorauxilioconveniomedico", formatted);
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="valorcafemanha">Café da Manhã</Label>
                  <Input
                    id="valorcafemanha"
                    placeholder="R$ 0,00"
                    value={formData.valorcafemanha || ""}
                    onChange={(e) => {
                      const formatted = formatarMoeda(e.target.value);
                      handleChange("valorcafemanha", formatted);
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="valorcafetarde">Café da Tarde</Label>
                  <Input
                    id="valorcafetarde"
                    placeholder="R$ 0,00"
                    value={formData.valorcafetarde || ""}
                    onChange={(e) => {
                      const formatted = formatarMoeda(e.target.value);
                      handleChange("valorcafetarde", formatted);
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="valoralmoco">Almoço</Label>
                  <Input
                    id="valoralmoco"
                    placeholder="R$ 0,00"
                    value={formData.valoralmoco || ""}
                    onChange={(e) => {
                      const formatted = formatarMoeda(e.target.value);
                      handleChange("valoralmoco", formatted);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Benefícios Adicionais</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="veiculo"
                    checked={formData.veiculo || false}
                    onCheckedChange={(checked) => handleChange("veiculo", checked)}
                  />
                  <Label htmlFor="veiculo">Veículo</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="celular"
                    checked={formData.celular || false}
                    onCheckedChange={(checked) => handleChange("celular", checked)}
                  />
                  <Label htmlFor="celular">Celular</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alojamento"
                    checked={formData.alojamento || false}
                    onCheckedChange={(checked) => handleChange("alojamento", checked)}
                  />
                  <Label htmlFor="alojamento">Alojamento</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="folgacampo">Folga Campo</Label>
                  <Input
                    id="folgacampo"
                    value={formData.folgacampo || ""}
                    onChange={(e) => handleChange("folgacampo", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="periodoferias">Período de Férias</Label>
                  <Input
                    id="periodoferias"
                    value={formData.periodoferias || ""}
                    onChange={(e) => handleChange("periodoferias", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="quantidadediasferias">Qtd. Dias de Férias</Label>
                  <Input
                    id="quantidadediasferias"
                    type="number"
                    value={formData.quantidadediasferias || ""}
                    onChange={(e) => handleChange("quantidadediasferias", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ccaobra">CCA/Obra</Label>
                <Select
                  value={formData.ccaobra || ""}
                  onValueChange={(value) => handleChange("ccaobra", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CCA/Obra" />
                  </SelectTrigger>
                  <SelectContent>
                    {ccas?.map((cca) => (
                      <SelectItem key={cca.id} value={cca.id.toString()}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updatePrestadorMutation.isPending}
          >
            {updatePrestadorMutation.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
