import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaturaIntegra } from "@/types/travel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

const faturaSchema = z.object({
  dataemissaofat: z.string().min(1, "Campo obrigatório"),
  agencia: z.string().min(1, "Campo obrigatório"),
  numerodefat: z.string().min(1, "Campo obrigatório"),
  protocolo: z.string().min(1, "Campo obrigatório"),
  datadacompra: z.string().min(1, "Campo obrigatório"),
  viajante: z.string().min(1, "Campo obrigatório"),
  tipo: z.string().min(1, "Campo obrigatório"),
  hospedagem: z.string().optional(),
  origem: z.string().min(1, "Campo obrigatório"),
  destino: z.string().min(1, "Campo obrigatório"),
  checkin: z.string().optional(),
  checkout: z.string().optional(),
  comprador: z.string().min(1, "Campo obrigatório"),
  valorpago: z.string().min(1, "Campo obrigatório"),
  motivoevento: z.string().min(1, "Campo obrigatório"),
  cca: z.string().min(1, "Campo obrigatório"),
  centrodecusto: z.string().min(1, "Campo obrigatório"),
  antecedencia: z.string().optional(),
  ciaida: z.string().optional(),
  ciavolta: z.string().optional(),
  possuibagagem: z.string().min(1, "Campo obrigatório"),
  valorpagodebagagem: z.string().optional(),
  observacao: z.string().optional(),
  quemsolicitouforapolitica: z.string().optional(),
  dentrodapolitica: z.string().min(1, "Campo obrigatório"),
  codconta: z.string().optional(),
  contafinanceira: z.string().optional(),
});

type FaturaFormData = z.infer<typeof faturaSchema>;

interface NovaFaturaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const NovaFaturaModal = ({ open, onClose, onSave }: NovaFaturaModalProps) => {
  const [openSections, setOpenSections] = useState({
    hospedagem: true,
    aereo: true,
    financeiro: true,
    adicional: false,
  });

  const form = useForm<FaturaFormData>({
    resolver: zodResolver(faturaSchema),
    defaultValues: {
      dataemissaofat: "",
      agencia: "",
      numerodefat: "",
      protocolo: "",
      datadacompra: "",
      viajante: "",
      tipo: "",
      hospedagem: "",
      origem: "",
      destino: "",
      checkin: "",
      checkout: "",
      comprador: "",
      valorpago: "",
      motivoevento: "",
      cca: "",
      centrodecusto: "",
      antecedencia: "",
      ciaida: "",
      ciavolta: "",
      possuibagagem: "Não",
      valorpagodebagagem: "",
      observacao: "",
      quemsolicitouforapolitica: "",
      dentrodapolitica: "Sim",
      codconta: "",
      contafinanceira: "",
    },
  });

  const watchTipo = form.watch("tipo");
  const watchDataCompra = form.watch("datadacompra");
  const watchCheckin = form.watch("checkin");
  const watchDentroPolicy = form.watch("dentrodapolitica");

  useEffect(() => {
    if (watchDataCompra && watchCheckin) {
      const diff = new Date(watchCheckin).getTime() - new Date(watchDataCompra).getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      form.setValue("antecedencia", days >= 0 ? days.toString() : "0");
    }
  }, [watchDataCompra, watchCheckin, form]);

  const onSubmit = (data: FaturaFormData) => {
    const faturas: FaturaIntegra[] = JSON.parse(
      localStorage.getItem("faturas_integra") || "[]"
    );

    const newFatura: FaturaIntegra = {
      id: Date.now().toString(),
      dataemissaofat: data.dataemissaofat,
      agencia: data.agencia,
      numerodefat: data.numerodefat,
      protocolo: data.protocolo,
      datadacompra: data.datadacompra,
      viajante: data.viajante,
      tipo: data.tipo,
      hospedagem: data.hospedagem,
      origem: data.origem,
      destino: data.destino,
      checkin: data.checkin,
      checkout: data.checkout,
      comprador: data.comprador,
      valorpago: parseFloat(data.valorpago),
      motivoevento: data.motivoevento,
      cca: data.cca,
      centrodecusto: data.centrodecusto,
      antecedencia: data.antecedencia ? parseInt(data.antecedencia) : undefined,
      ciaida: data.ciaida,
      ciavolta: data.ciavolta,
      possuibagagem: data.possuibagagem,
      valorpagodebagagem: data.valorpagodebagagem ? parseFloat(data.valorpagodebagagem) : undefined,
      observacao: data.observacao,
      quemsolicitouforapolitica: data.quemsolicitouforapolitica,
      dentrodapolitica: data.dentrodapolitica,
      codconta: data.codconta,
      contafinanceira: data.contafinanceira,
    };

    faturas.push(newFatura);
    localStorage.setItem("faturas_integra", JSON.stringify(faturas));
    toast.success("Fatura cadastrada com sucesso");
    form.reset();
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Fatura</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados da Fatura */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados da Fatura</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dataemissaofat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Emissão <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agência <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Onfly">Onfly</SelectItem>
                          <SelectItem value="Biztrip">Biztrip</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numerodefat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número Fatura <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="protocolo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protocolo <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dados da Viagem */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados da Viagem</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="datadacompra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Compra <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="viajante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Viajante <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Aéreo">Aéreo</SelectItem>
                          <SelectItem value="Hotel">Hotel</SelectItem>
                          <SelectItem value="Ônibus">Ônibus</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comprador"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comprador <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="origem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origem <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destino"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destino <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Hospedagem (condicional) */}
            {watchTipo === "Hotel" && (
              <Collapsible
                open={openSections.hospedagem}
                onOpenChange={(open) => setOpenSections({ ...openSections, hospedagem: open })}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h3 className="font-semibold text-lg">Hospedagem</h3>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="hospedagem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Hospedagem</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="checkin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check-in</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="checkout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check-out</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Dados Aéreos (condicional) */}
            {watchTipo === "Aéreo" && (
              <Collapsible
                open={openSections.aereo}
                onOpenChange={(open) => setOpenSections({ ...openSections, aereo: open })}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h3 className="font-semibold text-lg">Dados Aéreos</h3>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ciaida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cia Ida</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ciavolta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cia Volta</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="possuibagagem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Possui Bagagem <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sim">Sim</SelectItem>
                              <SelectItem value="Não">Não</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="valorpagodebagagem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Bagagem</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Dados Financeiros */}
            <Collapsible
              open={openSections.financeiro}
              onOpenChange={(open) => setOpenSections({ ...openSections, financeiro: open })}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-lg">Dados Financeiros</h3>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="valorpago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Pago <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CCA <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="centrodecusto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centro Custo <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codconta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cód. Conta</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contafinanceira"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Conta Financeira</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Informações Adicionais */}
            <Collapsible
              open={openSections.adicional}
              onOpenChange={(open) => setOpenSections({ ...openSections, adicional: open })}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-lg">Informações Adicionais</h3>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="motivoevento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo/Evento <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="antecedencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Antecedência (dias)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dentrodapolitica"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dentro Política <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sim">Sim</SelectItem>
                            <SelectItem value="Não">Não</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchDentroPolicy === "Não" && (
                    <FormField
                      control={form.control}
                      name="quemsolicitouforapolitica"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quem Solicitou</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="observacao"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Observação</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
