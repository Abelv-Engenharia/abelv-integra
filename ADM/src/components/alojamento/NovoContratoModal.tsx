import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { toast } from "sonner";
import { Upload } from "lucide-react";

const contratoSchema = z.object({
  projeto: z.string().min(1, "Projeto é obrigatório"),
  numeroContrato: z.string().min(1, "Número do contrato é obrigatório"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataTermino: z.string().min(1, "Data de término é obrigatória"),
  valorDiario: z.number().min(0, "Valor diário deve ser maior ou igual a 0"),
  observacoes: z.string().optional(),
  arquivo: z.any().optional()
}).refine(data => {
  if (data.dataInicio && data.dataTermino) {
    return new Date(data.dataTermino) >= new Date(data.dataInicio);
  }
  return true;
}, {
  message: "Data de término deve ser maior ou igual à data de início",
  path: ["dataTermino"]
});

type ContratoFormData = z.infer<typeof contratoSchema>;

interface NovoContratoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorId: number;
  valorPadrao: number;
}

// Projetos mockados
const projetos = [
  { id: 1, nome: "Obra Norte" },
  { id: 2, nome: "Obra Sul" },
  { id: 3, nome: "Obra Leste" },
  { id: 4, nome: "Obra Oeste" }
];

export const NovoContratoModal = ({ 
  open, 
  onOpenChange, 
  fornecedorId, 
  valorPadrao 
}: NovoContratoModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      projeto: "",
      numeroContrato: "",
      dataInicio: "",
      dataTermino: "",
      valorDiario: valorPadrao,
      observacoes: "",
    },
  });

  const onSubmit = async (data: ContratoFormData) => {
    setIsLoading(true);
    try {
      // Validar arquivo obrigatório
      if (!selectedFile) {
        toast.error("Arquivo do contrato é obrigatório");
        return;
      }

      // Validar formato do arquivo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Formato de arquivo não permitido. Use PDF ou DOC/DOCX");
        return;
      }

      // Validar tamanho do arquivo (20MB)
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 20MB");
        return;
      }

      // Gerar versão automaticamente (mock)
      const versao = "1.0";

      console.log("Dados do contrato:", {
        ...data,
        fornecedorId,
        arquivo: selectedFile,
        versao
      });
      
      toast.success(`Contrato ${data.numeroContrato} criado com sucesso! Versão: ${versao}`);
      form.reset();
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao criar contrato");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Novo Contrato</SheetTitle>
          <SheetDescription>
            Adicionar novo contrato ao fornecedor
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="projeto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Projeto *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione o projeto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projetos.map((projeto) => (
                        <SelectItem key={projeto.id} value={projeto.nome}>
                          {projeto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numeroContrato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Nº do Contrato *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: CT-2024-001"
                      {...field}
                      className={!field.value ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-destructive">Data de Início *</FormLabel>
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

              <FormField
                control={form.control}
                name="dataTermino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-destructive">Data de Término *</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="valorDiario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Valor Diário Negociado (R$) *</FormLabel>
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

            <div>
              <label className="text-sm font-medium text-destructive">Arquivo Contrato *</label>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="dropzone-file" 
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 ${!selectedFile ? 'border-destructive' : 'border-border'}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                      {selectedFile ? (
                        <p className="text-sm text-muted-foreground">
                          {selectedFile.name}
                        </p>
                      ) : (
                        <>
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Clique para enviar</span>
                          </p>
                          <p className="text-xs text-muted-foreground">PDF ou DOC (máx. 20MB)</p>
                        </>
                      )}
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais (opcional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Versão:</strong> Será gerada automaticamente (incrementa a cada novo contrato para o mesmo projeto)
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar e Voltar para Detalhe do Fornecedor
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Salvando..." : "Salvar e Voltar para Detalhe do Fornecedor"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};