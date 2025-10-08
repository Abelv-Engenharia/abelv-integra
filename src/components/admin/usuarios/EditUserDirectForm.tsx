import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

const editUserDirectSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

type EditUserDirectValues = z.infer<typeof editUserDirectSchema>;

interface EditUserDirectFormProps {
  user: {
    id: string;
    nome: string;
    email: string;
  };
  onSubmit: (data: { id: string; nome: string; email: string }) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const EditUserDirectForm = ({ 
  user,
  onSubmit,
  onCancel,
  isSubmitting 
}: EditUserDirectFormProps) => {
  const [success, setSuccess] = useState(false);

  const form = useForm<EditUserDirectValues>({
    resolver: zodResolver(editUserDirectSchema),
    defaultValues: {
      nome: user.nome || "",
      email: user.email || "",
    },
  });

  const handleFormSubmit = async (values: EditUserDirectValues) => {
    const result = await onSubmit({
      id: user.id,
      nome: values.nome,
      email: values.email,
    });
    
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onCancel();
      }, 2000);
    }
  };

  if (success) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Usuário atualizado com sucesso!</h3>
            <p className="text-muted-foreground">
              Redirecionando...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              {...form.register("nome")}
              placeholder="Digite o nome completo"
            />
            {form.formState.errors.nome && (
              <p className="text-sm text-destructive">{form.formState.errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="Digite o email"
              disabled
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={!form.formState.isValid || isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
};
