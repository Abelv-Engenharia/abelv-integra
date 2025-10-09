import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { empresaSiengeService, EmpresaSienge, UpdateEmpresaSiengeInput } from "@/services/admin/empresaSiengeService";
import EmpresaSiengeFormFields from "./EmpresaSiengeFormFields";

const formSchema = z.object({
  id_sienge: z.number({ required_error: "Id sienge é obrigatório" }),
  name: z.string().min(1, "Nome é obrigatório"),
  tradeName: z.string().optional(),
  cnpj: z.string().optional(),
});

interface EditEmpresaSiengeDialogProps {
  empresa: EmpresaSienge;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditEmpresaSiengeDialog({
  empresa,
  open,
  onOpenChange,
  onSuccess,
}: EditEmpresaSiengeDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_sienge: empresa.id_sienge,
      name: empresa.name,
      tradeName: empresa.tradeName || "",
      cnpj: empresa.cnpj || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const input: UpdateEmpresaSiengeInput = {
        id_sienge: values.id_sienge,
        name: values.name,
        tradeName: values.tradeName || undefined,
        cnpj: values.cnpj || undefined,
      };
      await empresaSiengeService.update(empresa.id, input);
      toast({
        title: "Empresa atualizada com sucesso",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar empresa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar empresa sienge</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EmpresaSiengeFormFields form={form} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
