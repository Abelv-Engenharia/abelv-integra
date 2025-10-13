import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authUserCreateDirectSchema, type AuthUserCreateDirectValues } from "@/types/users";
import { CheckCircle2 } from "lucide-react";

interface CreateUserDirectFormProps {
  onSuccess?: () => void;
  onSubmit: (data: AuthUserCreateDirectValues) => Promise<boolean>;
  isSubmitting: boolean;
}

export const CreateUserDirectForm = ({ 
  onSuccess, 
  onSubmit,
  isSubmitting 
}: CreateUserDirectFormProps) => {
  const [success, setSuccess] = useState(false);

  const form = useForm<AuthUserCreateDirectValues>({
    resolver: zodResolver(authUserCreateDirectSchema),
    defaultValues: {
      nome: "",
      email: "",
    },
  });

  const handleFormSubmit = async (values: AuthUserCreateDirectValues) => {
    const result = await onSubmit(values);
    
    if (result) {
      setSuccess(true);
      form.reset();
      
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Usuário criado com sucesso!</h3>
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
          onClick={() => form.reset()}
          disabled={isSubmitting}
        >
          Limpar Formulário
        </Button>
        <Button 
          type="submit" 
          disabled={!form.formState.isValid || isSubmitting}
        >
          {isSubmitting ? "Criando..." : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
};
