import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { empresaSiengeService, CreateEmpresaSiengeInput } from "@/services/admin/empresaSiengeService";
import EmpresaSiengeFormFields from "./EmpresaSiengeFormFields";

const formSchema = z.object({
  id_sienge: z.number({ required_error: "Id sienge é obrigatório" }),
  name: z.string().min(1, "Nome é obrigatório"),
  tradeName: z.string().optional(),
  cnpj: z.string().optional(),
});

interface CreateEmpresaSiengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateEmpresaSiengeDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateEmpresaSiengeDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_sienge: undefined,
      name: "",
      tradeName: "",
      cnpj: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const input: CreateEmpresaSiengeInput = {
        id_sienge: values.id_sienge,
        name: values.name,
        tradeName: values.tradeName || undefined,
        cnpj: values.cnpj || undefined,
      };
      await empresaSiengeService.create(input);
      toast({
        title: "Empresa criada com sucesso",
      });
      form.reset();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao criar empresa",
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
          <DialogTitle>Criar empresa sienge</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EmpresaSiengeFormFields form={form} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
