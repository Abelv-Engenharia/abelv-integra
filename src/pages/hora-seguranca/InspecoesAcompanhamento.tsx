import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Trash2, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const statusOptions: string[] = ["REALIZADA", "NÃO REALIZADA", "CANCELADA"];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "REALIZADA":
      return <ShieldCheck className="h-5 w-5" />;
    case "REALIZADA (NÃO PROGRAMADA)":
      return <ShieldCheck className="h-5 w-5 text-orange-500" />;
    case "A REALIZAR":
      return <Shield className="h-5 w-5" />;
    case "NÃO REALIZADA":
      return <ShieldAlert className="h-5 w-5 text-red-500" />;
    case "CANCELADA":
      return <ShieldX className="h-5 w-5 text-gray-500" />;
    default:
      return <Shield className="h-5 w-5" />;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "REALIZADA":
      return "bg-green-500 hover:bg-green-600";
    case "REALIZADA (NÃO PROGRAMADA)":
      return "bg-orange-500 hover:bg-orange-600";
    case "A REALIZAR":
      return "bg-blue-500 hover:bg-blue-600";
    case "NÃO REALIZADA":
      return "bg-red-500 hover:bg-red-600";
    case "CANCELADA":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "";
  }
};

const formSchema = z.object({
  status: z.enum(["REALIZADA", "NÃO REALIZADA", "CANCELADA"], {
    required_error: "O status da inspeção é obrigatório.",
  }),
  desviosIdentificados: z.number().int().min(0).default(0),
});

export default function InspecoesAcompanhamento() {
  const [inspecoes, setInspecoes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInspecao, setSelectedInspecao] = useState<any | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load all inspections
  useEffect(() => {
    setIsLoading(true);
    supabase
      .from("execucao_hsa")
      .select("*")
      .order("data", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast({
            title: "Erro ao carregar inspeções",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
        } else {
          setInspecoes(data || []);
          setIsLoading(false);
        }
      });
  }, []);

  // Excluir inspeção
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("execucao_hsa").delete().eq("id", id);
    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setInspecoes((prev) => prev.filter((insp) => insp.id !== id));
    toast({
      title: "Inspeção excluída",
      description: "A inspeção foi removida com sucesso.",
    });
  };

  // Atualiza o status da inspeção
  const updateForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "REALIZADA",
      desviosIdentificados: 0,
    },
  });

  const openUpdateDialog = (inspecao: any) => {
    setSelectedInspecao(inspecao);
    updateForm.reset({
      status: (inspecao.status === "REALIZADA (NÃO PROGRAMADA)")
        ? "REALIZADA"
        : (inspecao.status || "REALIZADA"),
      desviosIdentificados: inspecao.desvios_identificados || 0,
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdate = async (values: z.infer<typeof formSchema>) => {
    if (!selectedInspecao) return;
    const { error } = await supabase
      .from("execucao_hsa")
      .update({
        status: values.status,
        desvios_identificados: values.desviosIdentificados,
      })
      .eq("id", selectedInspecao.id);
    if (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setInspecoes((prev) =>
      prev.map((insp) =>
        insp.id === selectedInspecao.id
          ? { ...insp, status: values.status, desvios_identificados: values.desviosIdentificados }
          : insp
      )
    );
    toast({
      title: "Status atualizado!",
      description: "O status da inspeção foi alterado.",
    });
    setUpdateDialogOpen(false);
    setSelectedInspecao(null);
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Acompanhamento de Inspeções HSA</h2>
      {isLoading ? (
        <div>Carregando inspeções...</div>
      ) : inspecoes.length === 0 ? (
        <div className="text-gray-500">Nenhuma inspeção cadastrada encontrada.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {inspecoes.map((inspecao) => (
            <Card key={inspecao.id} className="animate-fade-in relative">
              {/* Status badge canto superior direito */}
              <div className="absolute right-4 top-4 z-10">
                <Badge className={getStatusBadgeClass(inspecao.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(inspecao.status)}
                    <span>
                      {inspecao.status === "REALIZADA (NÃO PROGRAMADA)" ? "REALIZADA (NÃO PROG.)" : inspecao.status}
                    </span>
                  </div>
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex flex-col gap-1 min-h-0">
                  <div>
                    {/* Código + nome do CCA */}
                    <span className="font-bold">{inspecao.cca}</span>
                    {inspecao.cca_nome && (
                      <span className="ml-2 text-base font-normal">{inspecao.cca_nome}</span>
                    )}
                  </div>
                  {/* Data logo abaixo da indicação do CCA */}
                  <span className="font-light text-xs mt-1">
                    {inspecao.data ? format(new Date(inspecao.data), "dd/MM/yyyy") : "--"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-0">
                <div>
                  <span className="font-medium">Responsável:</span>{" "}
                  {inspecao.responsavel_inspecao}
                </div>
                <div>
                  <span className="font-medium">Função:</span>{" "}
                  {inspecao.funcao}
                </div>
                <div>
                  <span className="font-medium">Inspeção programada:</span>{" "}
                  {inspecao.inspecao_programada}
                </div>
                <div>
                  <span className="font-medium">Desvios identificados:</span>{" "}
                  {inspecao.desvios_identificados ?? 0}
                </div>
              </CardContent>
              {/* Botões canto inferior esquerdo, menores */}
              <CardFooter className="pt-0 px-6 pb-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUpdateDialog(inspecao)}
                    className="flex items-center gap-2 px-2 py-1 h-8 text-xs"
                  >
                    <Pencil className="w-4 h-4" />
                    Atualizar Status
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2 px-2 py-1 h-8 text-xs"
                    onClick={() => handleDelete(inspecao.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Atualizar Status da Inspeção</DialogTitle>
          </DialogHeader>
          {selectedInspecao && (
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel>CCA</FormLabel>
                    <Input value={selectedInspecao.cca} disabled />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <Input value={selectedInspecao.data ? format(new Date(selectedInspecao.data), "dd/MM/yyyy") : ""} disabled />
                  </FormItem>
                </div>
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <Input value={selectedInspecao.responsavel_inspecao} disabled />
                </FormItem>
                <FormField
                  control={updateForm.control}
                  name="desviosIdentificados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desvios identificados</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map(opt => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setUpdateDialogOpen(false)}>
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
  );
}
