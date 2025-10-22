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

interface EditarPrestadorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prestador: PrestadorPJ;
}

export function EditarPrestadorModal({ open, onOpenChange, prestador }: EditarPrestadorModalProps) {
  const updatePrestadorMutation = useUpdatePrestadorPJ();
  const [formData, setFormData] = useState<any>({});
  const [dataNascimento, setDataNascimento] = useState<Date>();
  const [dataInicioContrato, setDataInicioContrato] = useState<Date>();

  useEffect(() => {
    if (prestador) {
      // Map PrestadorPJ properties to form data with lowercase field names
      setFormData({
        ...prestador,
        ajudacusto: prestador.ajudaCusto,
        ajudaaluguel: prestador.ajudaAluguel,
        tempocontrato: prestador.tempoContrato,
      });
      
      if (prestador.dataNascimento) {
        setDataNascimento(new Date(prestador.dataNascimento));
      }
      
      if (prestador.dataInicioContrato) {
        setDataInicioContrato(new Date(prestador.dataInicioContrato));
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

  const handleSave = async () => {
    try {
      const updatedPrestador = {
        ...formData,
        // Map back to camelCase for PrestadorPJ interface
        ajudaCusto: formData.ajudacusto || 0,
        ajudaAluguel: formData.ajudaaluguel || 0,
        tempoContrato: formData.tempocontrato || 'padrao',
        dataNascimento: dataNascimento ? format(dataNascimento, "yyyy-MM-dd") : null,
        dataInicioContrato: dataInicioContrato ? format(dataInicioContrato, "yyyy-MM-dd") : null,
      };

      await updatePrestadorMutation.mutateAsync({
        id: prestador.id,
        ...updatedPrestador
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar prestador.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Prestador</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-150px)] pr-4">
          <div className="space-y-6">
            {/* Dados da Empresa */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Dados da Empresa</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="razaosocial">Razão Social *</Label>
                  <Input
                    id="razaosocial"
                    value={formData.razaosocial || ""}
                    onChange={(e) => handleChange("razaosocial", e.target.value)}
                  />
                </div>
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
              </div>

              <div>
                <Label htmlFor="descricaoatividade">Descrição da Atividade</Label>
                <Textarea
                  id="descricaoatividade"
                  value={formData.descricaoatividade || ""}
                  onChange={(e) => handleChange("descricaoatividade", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Baixo</SelectItem>
                      <SelectItem value="2">2 - Médio</SelectItem>
                      <SelectItem value="3">3 - Alto</SelectItem>
                      <SelectItem value="4">4 - Muito Alto</SelectItem>
                    </SelectContent>
                  </Select>
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

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco || ""}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone || ""}
                    onChange={(e) => handleChange("telefone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contabancaria">Chave PIX</Label>
                  <Input
                    id="contabancaria"
                    value={formData.contabancaria || ""}
                    onChange={(e) => handleChange("contabancaria", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Dados do Representante Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Dados do Representante Legal</h3>
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Data de Nascimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataNascimento && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataNascimento ? format(dataNascimento, "dd/MM/yyyy") : "Selecione"}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefonerepresentante">Telefone</Label>
                  <Input
                    id="telefonerepresentante"
                    value={formData.telefonerepresentante || ""}
                    onChange={(e) => handleChange("telefonerepresentante", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emailrepresentante">Email</Label>
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
                />
              </div>
            </div>

            {/* Condições Financeiras */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Condições Financeiras</h3>
              <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) => handleChange("valorprestacaoservico", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="tempocontrato">Tempo de Contrato</Label>
                  <Input
                    id="tempocontrato"
                    value={formData.tempocontrato || ""}
                    onChange={(e) => handleChange("tempocontrato", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ccaobra">CCA Obra</Label>
                  <Input
                    id="ccaobra"
                    value={formData.ccaobra || ""}
                    onChange={(e) => handleChange("ccaobra", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ajudacusto">Ajuda de Custo</Label>
                  <Input
                    id="ajudacusto"
                    value={formData.ajudacusto || ""}
                    onChange={(e) => handleChange("ajudacusto", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ajudaaluguel">Ajuda de Aluguel</Label>
                  <Input
                    id="ajudaaluguel"
                    value={formData.ajudaaluguel || ""}
                    onChange={(e) => handleChange("ajudaaluguel", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auxilioconveniomedico"
                      checked={formData.auxilioconveniomedico || false}
                      onCheckedChange={(checked) => handleChange("auxilioconveniomedico", checked)}
                    />
                    <Label htmlFor="auxilioconveniomedico">Auxílio Convênio Médico</Label>
                  </div>
                  {formData.auxilioconveniomedico && (
                    <Input
                      placeholder="Valor"
                      value={formData.valorauxilioconveniomedico || ""}
                      onChange={(e) => handleChange("valorauxilioconveniomedico", e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="valerefeicao">Vale Refeição</Label>
                  <Input
                    id="valerefeicao"
                    value={formData.valerefeicao || ""}
                    onChange={(e) => handleChange("valerefeicao", e.target.value)}
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
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
