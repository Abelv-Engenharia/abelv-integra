import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Ruler } from "lucide-react";
import { z } from "zod";

const unidadeMedidaSchema = z.object({
  codigo: z.number().int().positive("Código deve ser um número positivo"),
  simbolo: z.string().trim().min(1, "Símbolo é obrigatório").max(8, "Símbolo deve ter no máximo 8 caracteres"),
  descricao: z.string().trim().min(1, "Descrição é obrigatória").max(100, "Descrição deve ter no máximo 100 caracteres"),
});

type UnidadeMedida = {
  id: string;
  codigo: number;
  simbolo: string;
  descricao: string;
  ativo: boolean;
};

type FormData = {
  codigo: string;
  simbolo: string;
  descricao: string;
};

export default function AdminUnidadesMedidas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UnidadeMedida | null>(null);
  const [formData, setFormData] = useState<FormData>({
    codigo: "",
    simbolo: "",
    descricao: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const { data: unidades, isLoading } = useQuery({
    queryKey: ["unidades_medidas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_medidas")
        .select("*")
        .eq("ativo", true)
        .order("codigo", { ascending: true });

      if (error) throw error;
      return data as UnidadeMedida[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { codigo: number; simbolo: string; descricao: string }) => {
      const { error } = await supabase.from("unidades_medidas").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades_medidas"] });
      toast({
        title: "Sucesso",
        description: "Unidade de medida criada com sucesso",
      });
      closeDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar unidade de medida",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { codigo: number; simbolo: string; descricao: string };
    }) => {
      const { error } = await supabase.from("unidades_medidas").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades_medidas"] });
      toast({
        title: "Sucesso",
        description: "Unidade de medida atualizada com sucesso",
      });
      closeDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar unidade de medida",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("unidades_medidas").update({ ativo: false }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades_medidas"] });
      toast({
        title: "Sucesso",
        description: "Unidade de medida removida com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover unidade de medida",
        variant: "destructive",
      });
    },
  });

  const validateForm = (): boolean => {
    try {
      unidadeMedidaSchema.parse({
        codigo: parseInt(formData.codigo),
        simbolo: formData.simbolo,
        descricao: formData.descricao,
      });
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const data = {
      codigo: parseInt(formData.codigo),
      simbolo: formData.simbolo.trim(),
      descricao: formData.descricao.trim(),
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({ codigo: "", simbolo: "", descricao: "" });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: UnidadeMedida) => {
    setEditingItem(item);
    setFormData({
      codigo: item.codigo.toString(),
      simbolo: item.simbolo,
      descricao: item.descricao,
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({ codigo: "", simbolo: "", descricao: "" });
    setFormErrors({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta unidade de medida?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Ruler className="h-8 w-8" />
            Unidades de Medidas
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie as unidades de medidas do sistema</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Unidade
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Unidades</CardTitle>
          <CardDescription>Unidades de medidas cadastradas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : !unidades || unidades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma unidade de medida cadastrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Símbolo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unidades.map((unidade) => (
                  <TableRow key={unidade.id}>
                    <TableCell className="font-medium">{unidade.codigo}</TableCell>
                    <TableCell>{unidade.simbolo}</TableCell>
                    <TableCell>{unidade.descricao}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(unidade)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(unidade.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar Unidade de Medida" : "Nova Unidade de Medida"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Atualize as informações da unidade de medida"
                : "Preencha os dados para criar uma nova unidade de medida"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="codigo">
                Código <span className="text-destructive">*</span>
              </Label>
              <Input
                id="codigo"
                type="number"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className={formErrors.codigo ? "border-destructive" : ""}
              />
              {formErrors.codigo && (
                <p className="text-sm text-destructive mt-1">{formErrors.codigo}</p>
              )}
            </div>

            <div>
              <Label htmlFor="simbolo">
                Símbolo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="simbolo"
                maxLength={8}
                value={formData.simbolo}
                onChange={(e) => setFormData({ ...formData, simbolo: e.target.value })}
                className={formErrors.simbolo ? "border-destructive" : ""}
                placeholder="Ex: m, kg, l"
              />
              {formErrors.simbolo && (
                <p className="text-sm text-destructive mt-1">{formErrors.simbolo}</p>
              )}
            </div>

            <div>
              <Label htmlFor="descricao">
                Descrição <span className="text-destructive">*</span>
              </Label>
              <Input
                id="descricao"
                maxLength={100}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className={formErrors.descricao ? "border-destructive" : ""}
                placeholder="Ex: Metro, Quilograma, Litro"
              />
              {formErrors.descricao && (
                <p className="text-sm text-destructive mt-1">{formErrors.descricao}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
