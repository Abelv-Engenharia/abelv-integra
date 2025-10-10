import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCCAs } from "@/hooks/useCCAs";

const itemSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  unidade: z.string().min(1, "Unidade é obrigatória"),
  quantidade: z.number().min(0.01, "Quantidade deve ser maior que zero"),
});

const envioSchema = z.object({
  cca: z.number().int("CCA deve ser um número inteiro"),
  almoxarifado_origem: z.string().min(1, "Almoxarifado de origem é obrigatório"),
  fornecedor_destino: z.string().min(1, "Fornecedor de destino é obrigatório"),
  data_movimento: z.date({ required_error: "Data do movimento é obrigatória" }),
  observacao: z.string().optional(),
  arquivo: z.any().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;
type EnvioFormData = z.infer<typeof envioSchema>;

interface Item extends ItemFormData {
  id: string;
}

const EstoqueNovoEnvioBeneficiamento = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const { data: ccas, isLoading: isLoadingCcas } = useCCAs();

  const form = useForm<EnvioFormData>({
    resolver: zodResolver(envioSchema),
    defaultValues: {
      cca: 0,
      almoxarifado_origem: "",
      fornecedor_destino: "",
      observacao: "",
    },
  });

  const itemForm = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      descricao: "",
      unidade: "",
      quantidade: 0,
    },
  });

  const onSubmit = (data: EnvioFormData) => {
    if (items.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item à requisição",
        variant: "destructive",
      });
      return;
    }

    console.log("Dados do envio:", data);
    console.log("Itens:", items);
    toast({
      title: "Sucesso",
      description: "Envio para beneficiamento cadastrado com sucesso!",
    });
    navigate("/suprimentos/estoque/beneficiamento/envio-beneficiamento");
  };

  const handleAddItem = (data: ItemFormData) => {
    const newItem: Item = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    setItems([...items, newItem]);
    itemForm.reset();
    setIsAddingItem(false);
    toast({
      title: "Item adicionado",
      description: "Item adicionado à requisição com sucesso",
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 3 * 1024 * 1024; // 3MB
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      
      if (file.size > maxSize) {
        toast({
          title: "Erro",
          description: "Arquivo deve ter no máximo 3MB",
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Erro",
          description: "Apenas arquivos PDF, PNG, JPEG e JPG são aceitos",
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }

      form.setValue("arquivo", file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/suprimentos/estoque/beneficiamento/envio-beneficiamento")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Envio Para Beneficiamento</h1>
          <p className="text-muted-foreground">
            Cadastre um novo envio de materiais para beneficiamento
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Do Envio</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cca" className={!form.watch("cca") ? "text-destructive" : ""}>
                Cca *
              </Label>
              <Select 
                value={form.watch("cca")?.toString() || ""} 
                onValueChange={(value) => form.setValue("cca", parseInt(value))}
                disabled={isLoadingCcas}
              >
                <SelectTrigger className={!form.watch("cca") ? "border-destructive" : ""}>
                  <SelectValue placeholder={isLoadingCcas ? "Carregando..." : "Selecione o CCA"} />
                </SelectTrigger>
                <SelectContent>
                  {ccas?.map((cca) => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.cca && (
                <p className="text-sm text-destructive">{form.formState.errors.cca.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className={!form.watch("almoxarifado_origem") ? "text-destructive" : ""}>
                Almoxarifado De Origem *
              </Label>
              <Select value={form.watch("almoxarifado_origem")} onValueChange={(value) => form.setValue("almoxarifado_origem", value)}>
                <SelectTrigger className={!form.watch("almoxarifado_origem") ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o almoxarifado de origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.almoxarifado_origem && (
                <p className="text-sm text-destructive">{form.formState.errors.almoxarifado_origem.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className={!form.watch("fornecedor_destino") ? "text-destructive" : ""}>
                Fornecedor De Destino *
              </Label>
              <Select value={form.watch("fornecedor_destino")} onValueChange={(value) => form.setValue("fornecedor_destino", value)}>
                <SelectTrigger className={!form.watch("fornecedor_destino") ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o fornecedor de destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empresa_a">Empresa A</SelectItem>
                  <SelectItem value="empresa_b">Empresa B</SelectItem>
                  <SelectItem value="empresa_c">Empresa C</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.fornecedor_destino && (
                <p className="text-sm text-destructive">{form.formState.errors.fornecedor_destino.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className={!form.watch("data_movimento") ? "text-destructive" : ""}>
                Data Do Movimento *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("data_movimento") && "text-muted-foreground border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("data_movimento") ? (
                      format(form.watch("data_movimento"), "dd/MM/yyyy")
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("data_movimento")}
                    onSelect={(date) => form.setValue("data_movimento", date || new Date())}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.data_movimento && (
                <p className="text-sm text-destructive">{form.formState.errors.data_movimento.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                {...form.register("observacao")}
                placeholder="Observações sobre o envio (opcional)"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="arquivo">Arquivo De Envio (Máx. 3Mb - Pdf, Png, Jpeg, Jpg)</Label>
              <Input
                id="arquivo"
                type="file"
                accept=".pdf,.png,.jpeg,.jpg"
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Itens Da Requisição</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingItem(true)}
                disabled={isAddingItem}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAddingItem && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Novo Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="descricao" className={!itemForm.watch("descricao") ? "text-destructive" : ""}>
                        Descrição *
                      </Label>
                      <Input
                        id="descricao"
                        {...itemForm.register("descricao")}
                        className={!itemForm.watch("descricao") ? "border-destructive" : ""}
                        placeholder="Descrição do item"
                      />
                      {itemForm.formState.errors.descricao && (
                        <p className="text-sm text-destructive">{itemForm.formState.errors.descricao.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unidade" className={!itemForm.watch("unidade") ? "text-destructive" : ""}>
                        Unidade *
                      </Label>
                      <Input
                        id="unidade"
                        {...itemForm.register("unidade")}
                        className={!itemForm.watch("unidade") ? "border-destructive" : ""}
                        placeholder="Ex: kg, un, m"
                      />
                      {itemForm.formState.errors.unidade && (
                        <p className="text-sm text-destructive">{itemForm.formState.errors.unidade.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantidade" className={itemForm.watch("quantidade") <= 0 ? "text-destructive" : ""}>
                        Quantidade *
                      </Label>
                      <Input
                        id="quantidade"
                        type="number"
                        step="0.01"
                        {...itemForm.register("quantidade", { valueAsNumber: true })}
                        className={itemForm.watch("quantidade") <= 0 ? "border-destructive" : ""}
                        placeholder="0.00"
                      />
                      {itemForm.formState.errors.quantidade && (
                        <p className="text-sm text-destructive">{itemForm.formState.errors.quantidade.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-3 flex gap-2">
                      <Button type="button" onClick={itemForm.handleSubmit(handleAddItem)}>Adicionar</Button>
                      <Button type="button" variant="outline" onClick={() => setIsAddingItem(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {items.length > 0 ? (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="grid grid-cols-3 gap-4 flex-1">
                      <div>
                        <span className="font-medium">Descrição:</span>
                        <p>{item.descricao}</p>
                      </div>
                      <div>
                        <span className="font-medium">Unidade:</span>
                        <p>{item.unidade}</p>
                      </div>
                      <div>
                        <span className="font-medium">Quantidade:</span>
                        <p>{item.quantidade.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum item adicionado ainda
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Cadastrar Envio
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/suprimentos/estoque/beneficiamento/envio-beneficiamento")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EstoqueNovoEnvioBeneficiamento;