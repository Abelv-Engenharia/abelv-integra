
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

// Mock data
const inspecaoOptions = [
  { value: "DDS", label: "Diálogo Diário de Segurança (DDS)" },
  { value: "IB", label: "Inspeção de Barricada" },
  { value: "IT", label: "Inspeção de Trabalho em Altura" },
  { value: "IES", label: "Inspeção de Equipamentos de Segurança" },
  { value: "ISA", label: "Inspeção de Sistema Anti-queda" },
];

// Mock data para inspeções
const mockInspecoes = [
  {
    id: 1,
    cca: "CCA 001",
    dataInspecao: new Date(2025, 0, 10),
    responsavel: "João Silva",
    funcao: "Técnico de Segurança",
    inspecao: "DDS",
    status: "A REALIZAR",
    desviosIdentificados: 0
  },
  {
    id: 2,
    cca: "CCA 002",
    dataInspecao: new Date(2025, 0, 15),
    responsavel: "Maria Oliveira",
    funcao: "Engenheira de Segurança",
    inspecao: "IT",
    status: "REALIZADA NÃO PROGRAMADA",
    desviosIdentificados: 3
  },
  {
    id: 3,
    cca: "CCA 003",
    dataInspecao: new Date(2024, 11, 20),
    responsavel: "Carlos Santos",
    funcao: "Supervisor de Segurança",
    inspecao: "IES",
    status: "REALIZADA",
    desviosIdentificados: 2
  },
  {
    id: 4,
    cca: "CCA 001",
    dataInspecao: new Date(2024, 11, 25),
    responsavel: "Ana Costa",
    funcao: "Analista de Segurança",
    inspecao: "IB",
    status: "NÃO REALIZADA",
    desviosIdentificados: 0
  },
  {
    id: 5,
    cca: "CCA 002",
    dataInspecao: new Date(2024, 11, 30),
    responsavel: "Pedro Souza",
    funcao: "Técnico de Segurança",
    inspecao: "ISA",
    status: "CANCELADA",
    desviosIdentificados: 0
  }
];

// Schema para validação do formulário de atualização
const formSchema = z.object({
  inspecao: z.string({
    required_error: "A inspeção é obrigatória.",
  }),
  desviosIdentificados: z.number()
    .int("O número de desvios deve ser um número inteiro.")
    .min(0, "O número de desvios não pode ser negativo."),
  status: z.string({
    required_error: "O status da inspeção é obrigatório.",
  }),
});

// Função para renderizar o ícone de acordo com o status
const getStatusIcon = (status: string) => {
  switch (status) {
    case "REALIZADA":
      return <ShieldCheck className="h-5 w-5" />;
    case "REALIZADA NÃO PROGRAMADA":
      return <ShieldCheck className="h-5 w-5" />;
    case "A REALIZAR":
      return <Shield className="h-5 w-5" />;
    case "NÃO REALIZADA":
      return <ShieldAlert className="h-5 w-5" />;
    case "CANCELADA":
      return <ShieldX className="h-5 w-5" />;
    default:
      return <Shield className="h-5 w-5" />;
  }
};

// Função para renderizar a cor da badge de acordo com o status
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "REALIZADA":
      return "bg-green-500 hover:bg-green-600";
    case "REALIZADA NÃO PROGRAMADA":
      return "bg-blue-500 hover:bg-blue-600";
    case "A REALIZAR":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "NÃO REALIZADA":
      return "bg-red-500 hover:bg-red-600";
    case "CANCELADA":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "";
  }
};

const InspecoesAcompanhamento = () => {
  const { toast } = useToast();
  const [inspecoes, setInspecoes] = useState(mockInspecoes);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedInspecao, setSelectedInspecao] = useState<any>(null);

  // Form para atualização de inspeção
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inspecao: "",
      desviosIdentificados: 0,
      status: "",
    },
  });

  // Abrir dialog para atualizar status
  const handleUpdateStatus = (inspecao: any) => {
    setSelectedInspecao(inspecao);
    form.reset({
      inspecao: inspecao.inspecao,
      desviosIdentificados: inspecao.desviosIdentificados,
      status: inspecao.status,
    });
    setIsUpdateDialogOpen(true);
  };

  // Fechar dialog
  const handleCloseDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedInspecao(null);
  };

  // Salvar alterações da inspeção
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (selectedInspecao) {
      // Atualiza o estado local
      const updatedInspecoes = inspecoes.map(insp => {
        if (insp.id === selectedInspecao.id) {
          return {
            ...insp,
            inspecao: data.inspecao,
            desviosIdentificados: data.desviosIdentificados,
            status: data.status,
          };
        }
        return insp;
      });
      
      setInspecoes(updatedInspecoes);
      
      // Aqui seria o código para atualizar no backend
      
      // Exibe mensagem de sucesso
      toast({
        title: "Sucesso!",
        description: "Status da inspeção atualizado com sucesso.",
      });
      
      // Fecha o dialog
      handleCloseDialog();
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Acompanhamento de Inspeções</h2>
          <p className="text-muted-foreground">
            Visualize e atualize o status das inspeções cadastradas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inspecoes.map((inspecao) => (
            <Card key={inspecao.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{inspecao.cca}</CardTitle>
                  <Badge className={getStatusBadgeClass(inspecao.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(inspecao.status)}
                      {inspecao.status}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">{format(inspecao.dataInspecao, "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Responsável:</span>
                    <span className="font-medium">{inspecao.responsavel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Função:</span>
                    <span className="font-medium">{inspecao.funcao}</span>
                  </div>
                  {inspecao.status !== "A REALIZAR" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Desvios:</span>
                      <span className="font-medium">{inspecao.desviosIdentificados}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleUpdateStatus(inspecao)}
                >
                  Atualizar Status
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Dialog para atualização de status */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Atualizar Status da Inspeção</DialogTitle>
            </DialogHeader>
            {selectedInspecao && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Informações não editáveis */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>CCA</FormLabel>
                      <Input value={selectedInspecao.cca} disabled />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <Input value={format(selectedInspecao.dataInspecao, "dd/MM/yyyy")} disabled />
                    </FormItem>
                  </div>
                  
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <Input value={selectedInspecao.responsavel} disabled />
                  </FormItem>

                  {/* Campos editáveis */}
                  <FormField
                    control={form.control}
                    name="inspecao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspeção programada</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de inspeção" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inspecaoOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                    name="desviosIdentificados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desvios identificados</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="REALIZADA">Realizada</SelectItem>
                            <SelectItem value="NÃO REALIZADA">Não realizada</SelectItem>
                            <SelectItem value="CANCELADA">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={handleCloseDialog}>
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar alterações</Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InspecoesAcompanhamento;
