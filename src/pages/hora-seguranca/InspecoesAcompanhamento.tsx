
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
import { InspecaoAcompanhamentoCard } from "@/components/hora-seguranca/InspecaoAcompanhamentoCard";
import { useUserCCAs } from "@/hooks/useUserCCAs";

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
  const [busca, setBusca] = useState("");
  const { toast } = useToast();
  const [ccas, setCcas] = useState<{ id: number; codigo: string; nome: string }[]>([]);
  const { data: userCCAs = [] } = useUserCCAs();

  // Load all CCA info for mapping IDs to labels
  useEffect(() => {
    supabase.from("ccas").select("id,codigo,nome").order("codigo").then(({ data }) => {
      setCcas(data || []);
    });
  }, []);

  // Load inspections filtered by user's allowed CCAs
  useEffect(() => {
    const loadInspections = async () => {
      setIsLoading(true);
      
      if (userCCAs.length === 0) {
        setInspecoes([]);
        setIsLoading(false);
        return;
      }

      // Filtrar por CCAs permitidos
      const ccaIds = userCCAs.map(cca => cca.id);
      
      const { data, error } = await supabase
        .from("execucao_hsa")
        .select("*, cca:ccas(id, codigo, nome)")
        .in('cca_id', ccaIds)
        .order("data", { ascending: false });

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
    };

    loadInspections();
  }, [userCCAs, toast]);

  // Função auxiliar: filtra inspeções conforme o texto de busca
  const filtrarInspecoes = (lista: any[], termo: string) => {
    if (!termo.trim()) return lista;
    const t = termo.toLocaleLowerCase();
    return lista.filter((insp) => {
      const ccaStr = insp.cca?.codigo + " - " + insp.cca?.nome;
      const responsavel = insp.responsavel_inspecao || "";
      const funcao = insp.funcao || "";
      const status = insp.status || "";
      return (
        ccaStr?.toLocaleLowerCase().includes(t) ||
        responsavel.toLocaleLowerCase().includes(t) ||
        funcao.toLocaleLowerCase().includes(t) ||
        status.toLocaleLowerCase().includes(t)
      );
    });
  };

  const inspecoesFiltradas = filtrarInspecoes(inspecoes, busca);

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

  // Verificar se o usuário tem permissão para acessar
  if (userCCAs.length === 0) {
    return (
      <div className="container mx-auto py-4">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Acompanhamento de Inspeções HSA</h2>
        <div className="text-yellow-600">
          Você não possui permissão para visualizar dados de nenhum CCA.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <h2 className="text-2xl font-bold tracking-tight mb-4">Acompanhamento de Inspeções HSA</h2>
      {/* Campo de busca */}
      <div className="mb-3 flex items-center max-w-md">
        <Input
          value={busca}
          placeholder="Buscar por CCA, responsável, função ou status..."
          onChange={e => setBusca(e.target.value)}
          className="text-xs h-8"
        />
      </div>
      {isLoading ? (
        <div>Carregando inspeções...</div>
      ) : inspecoesFiltradas.length === 0 ? (
        <div className="text-gray-500">Nenhuma inspeção encontrada.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {inspecoesFiltradas.map((inspecao) => (
            <InspecaoAcompanhamentoCard
              key={inspecao.id}
              inspecao={inspecao}
              onUpdateStatus={openUpdateDialog}
              onDelete={handleDelete}
            />
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
                    <Input value={selectedInspecao.cca?.codigo} disabled />
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
                  <Button variant="outline" type="button" onClick={() => setUpdateDialogOpen(false)} className="text-[12px] h-8 px-3">
                    Cancelar
                  </Button>
                  <Button type="submit" className="text-[12px] h-8 px-3">Salvar alterações</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
