
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Profile, AuthUserCreateValues, authUserCreateSchema } from "@/types/users";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useCreateUser } from "@/hooks/useCreateUser";

interface ImprovedCreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profiles: Profile[];
}

export const ImprovedCreateUserDialog = ({
  open,
  onOpenChange,
  profiles,
}: ImprovedCreateUserDialogProps) => {
  const { createUser, isCreating, error, isSuccess, reset } = useCreateUser();
  const [showSuccess, setShowSuccess] = useState(false);

  const userForm = useForm<AuthUserCreateValues>({
    resolver: zodResolver(authUserCreateSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      perfil: "",
    },
  });
  
  const handleSubmit = (data: AuthUserCreateValues) => {
    createUser(data);
  };
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      userForm.reset();
      setShowSuccess(false);
      reset();
    }
  }, [open, userForm, reset]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      userForm.reset();
      // Close dialog after showing success message
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    }
  }, [isSuccess, userForm, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>

        {/* Alert de sucesso */}
        {showSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Usuário criado com sucesso! Email de confirmação enviado.
            </AlertDescription>
          </Alert>
        )}

        {/* Alert de erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || "Erro ao criar usuário"}
            </AlertDescription>
          </Alert>
        )}

        {!showSuccess && (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                O usuário receberá um email de confirmação para ativar sua conta.
              </AlertDescription>
            </Alert>

            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={userForm.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome do usuário" 
                          {...field} 
                          disabled={isCreating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@example.com" 
                          type="email"
                          {...field} 
                          disabled={isCreating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={userForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Mínimo 6 caracteres" 
                          {...field} 
                          disabled={isCreating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={userForm.control}
                  name="perfil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil de Acesso</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isCreating}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um perfil" />
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
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    disabled={isCreating}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isCreating || profiles.length === 0}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      'Criar Usuário'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
