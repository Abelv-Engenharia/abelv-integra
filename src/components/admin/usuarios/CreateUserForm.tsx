
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Profile, AuthUserCreateValues, authUserCreateSchema } from "@/types/users";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, User, Mail, Lock, Shield, Loader2 } from "lucide-react";
import { useCreateUser } from "@/hooks/useCreateUser";

interface CreateUserFormProps {
  profiles: Profile[];
  onSuccess?: () => void;
}

export const CreateUserForm = ({ profiles, onSuccess }: CreateUserFormProps) => {
  const { createUser, isCreating, error, isSuccess, reset } = useCreateUser();
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const form = useForm<AuthUserCreateValues>({
    resolver: zodResolver(authUserCreateSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      perfil: "",
    },
  });

  const watchedEmail = form.watch("email");

  // Verificar disponibilidade do email com debounce
  useEffect(() => {
    if (!watchedEmail || watchedEmail.length < 5) {
      setEmailAvailable(null);
      return;
    }

    const checkEmail = async () => {
      setCheckingEmail(true);
      try {
        // Simulação de verificação (você pode implementar uma verificação real aqui)
        await new Promise(resolve => setTimeout(resolve, 500));
        setEmailAvailable(true);
      } catch {
        setEmailAvailable(false);
      } finally {
        setCheckingEmail(false);
      }
    };

    const timeoutId = setTimeout(checkEmail, 800);
    return () => clearTimeout(timeoutId);
  }, [watchedEmail]);

  const handleSubmit = (data: AuthUserCreateValues) => {
    console.log("Submitting form with data:", data);
    createUser(data);
  };

  // Reset form on success
  useEffect(() => {
    if (isSuccess) {
      form.reset();
      setEmailAvailable(null);
      if (onSuccess) {
        setTimeout(onSuccess, 2000); // Aguardar um pouco para mostrar o sucesso
      }
    }
  }, [isSuccess, form, onSuccess]);

  // Reset error state when form changes
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        reset();
      }, 10000);
      return () => clearTimeout(timeoutId);
    }
  }, [error, reset]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Criar Novo Usuário
        </CardTitle>
        <CardDescription>
          Preencha as informações para criar um novo usuário no sistema
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Alert de informação */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            O usuário receberá um email de confirmação para ativar sua conta. 
            Certifique-se de que o email esteja correto.
          </AlertDescription>
        </Alert>

        {/* Alert de sucesso */}
        {isSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Usuário criado com sucesso! Um email de confirmação foi enviado.
            </AlertDescription>
          </Alert>
        )}

        {/* Alert de erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || "Erro ao criar usuário. Tente novamente."}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Campo Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nome Completo *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o nome completo do usuário" 
                      {...field} 
                      disabled={isCreating}
                      className="transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-mail *
                    {checkingEmail && <Loader2 className="h-3 w-3 animate-spin" />}
                    {emailAvailable === true && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="usuario@empresa.com" 
                      type="email"
                      {...field} 
                      disabled={isCreating}
                      className="transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Senha */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Senha *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Mínimo 6 caracteres" 
                      {...field} 
                      disabled={isCreating}
                      className="transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    A senha deve ter pelo menos 6 caracteres
                  </p>
                </FormItem>
              )}
            />

            {/* Campo Perfil */}
            <FormField
              control={form.control}
              name="perfil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Perfil de Acesso *
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isCreating || profiles.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="transition-all duration-200">
                        <SelectValue placeholder="Selecione o perfil de acesso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {profiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id.toString()}>
                          {profile.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {profiles.length === 0 && (
                    <p className="text-xs text-red-500">
                      Nenhum perfil disponível. Contate o administrador.
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setEmailAvailable(null);
                  reset();
                }}
                disabled={isCreating}
                className="flex-1"
              >
                Limpar Formulário
              </Button>
              
              <Button 
                type="submit" 
                disabled={isCreating || profiles.length === 0 || !form.formState.isValid}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando usuário...
                  </>
                ) : (
                  'Criar Usuário'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
