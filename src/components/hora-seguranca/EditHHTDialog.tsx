
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateHorasTrabalhadas } from "@/services/hora-seguranca/horasTrabalhadasService";

const editHHTSchema = z.object({
  horas_trabalhadas: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    {
      message: "Horas trabalhadas deve ser um número maior que zero",
    }
  ),
  observacoes: z.string().optional(),
});

type EditHHTFormValues = z.infer<typeof editHHTSchema>;

interface EditHHTDialogProps {
  hht: {
    id: string;
    mes: number;
    ano: number;
    horas_trabalhadas: number;
    observacoes?: string;
    codigo: string;
    nome: string;
  };
  onSuccess: () => void;
}

export function EditHHTDialog({ hht, onSuccess }: EditHHTDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EditHHTFormValues>({
    resolver: zodResolver(editHHTSchema),
    defaultValues: {
      horas_trabalhadas: hht.horas_trabalhadas.toString(),
      observacoes: hht.observacoes || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        horas_trabalhadas: hht.horas_trabalhadas.toString(),
        observacoes: hht.observacoes || "",
      });
    }
  }, [open, hht, form]);

  const onSubmit = async (data: EditHHTFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateHorasTrabalhadas(hht.id, {
        horas_trabalhadas: parseFloat(data.horas_trabalhadas),
        observacoes: data.observacoes || undefined,
      });

      if (result) {
        toast({
          title: "Registro atualizado com sucesso",
          description: `HHT do CCA ${hht.codigo} - ${hht.nome} foi atualizado`,
        });
        setOpen(false);
        onSuccess();
      } else {
        toast({
          title: "Erro ao atualizar registro",
          description: "Ocorreu um erro ao atualizar o registro de HHT",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating HHT:", error);
      toast({
        title: "Erro ao atualizar registro",
        description: "Ocorreu um erro ao atualizar o registro de HHT",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar HHT</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            <strong>CCA:</strong> {hht.codigo} - {hht.nome}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Período:</strong> {hht.mes}/{hht.ano}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="horas_trabalhadas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horas Trabalhadas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Digite o número de horas trabalhadas"
                      step="0.01"
                      min="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre o registro"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
