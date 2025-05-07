
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
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
import { 
  Profile, 
  AuthUserCreateValues, 
  authUserCreateSchema 
} from "@/types/users";
import { createAuthUser, updateUserRole } from "@/services/authAdminService";

interface CreateAuthUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profiles: Profile[];
  onSuccess: () => void;
}

export const CreateAuthUserDialog = ({
  open,
  onOpenChange,
  profiles,
  onSuccess,
}: CreateAuthUserDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const form = useForm<AuthUserCreateValues>({
    resolver: zodResolver(authUserCreateSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      perfil: "",
    },
  });
  
  const onSubmit = async (data: AuthUserCreateValues) => {
    setErrorMessage(null);
    try {
      setIsSubmitting(true);
      
      console.log("Criando usuário:", data);
      
      // Step 1: Create the user in Supabase Auth
      const authResult = await createAuthUser(
        data.email, 
        data.password,
        { nome: data.nome }
      );
      
      if (!authResult?.user?.id) {
        throw new Error("Falha ao criar usuário");
      }
      
      console.log("Usuário criado, atribuindo perfil:", authResult.user.id, data.perfil);
      
      // Step 2: Assign the role to the user
      await updateUserRole(authResult.user.id, parseInt(data.perfil));
      
      toast({
        title: "Usuário criado",
        description: `Usuário ${data.email} foi criado com sucesso.`,
      });
      
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      
      let errorMsg = "Ocorreu um erro ao criar o usuário.";
      
      // Extract error message
      if (error instanceof Error) {
        errorMsg = error.message;
        
        // Check for common error patterns from Supabase
        if (errorMsg.includes("User already registered")) {
          errorMsg = "Este email já está registrado no sistema.";
        } else if (errorMsg.includes("invalid password")) {
          errorMsg = "A senha não atende aos requisitos mínimos.";
        }
      }
      
      setErrorMessage(errorMsg);
      
      toast({
        title: "Erro ao criar usuário",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form and error state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setErrorMessage(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>
        
        {errorMessage && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="usuario@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="perfil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil de Acesso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
