import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const fornecedorSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().min(1, "CNPJ é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  contato: z.string().min(1, "Contato é obrigatório"),
  capacidade: z.number().min(1, "Capacidade deve ser maior que 0"),
  valordiario: z.number().min(0, "Valor diário deve ser maior ou igual a 0"),
  vigencia: z.string().min(1, "Vigência é obrigatória"),
});

type FornecedorFormData = z.infer<typeof fornecedorSchema>;

interface NovoFornecedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NovoFornecedorModal = ({ open, onOpenChange }: NovoFornecedorModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      nome: "",
      cnpj: "",
      endereco: "",
      contato: "",
      capacidade: 0,
      valordiario: 0,
      vigencia: "",
    },
  });

  const onSubmit = async (data: FornecedorFormData) => {
    setIsLoading(true);
    try {
      // Aqui seria a integração com o banco de dados
      console.log("Dados do fornecedor:", data);
      
      toast.success("Fornecedor cadastrado com sucesso!");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao cadastrar fornecedor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Novo Fornecedor</SheetTitle>
          <SheetDescription>
            Cadastre um novo fornecedor de alojamento
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Nome *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome do fornecedor"
                      {...field}
                      className={!field.value ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">CNPJ *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00.000.000/0000-00"
                      {...field}
                      className={!field.value ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Endereço *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Endereço completo"
                      {...field}
                      className={!field.value ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Contato *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Telefone/WhatsApp"
                      {...field}
                      className={!field.value ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Capacidade *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="Número de pessoas"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={!field.value ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valordiario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Valor Diário *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={!field.value ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vigencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Vigência *</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      {...field}
                      className={!field.value ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};