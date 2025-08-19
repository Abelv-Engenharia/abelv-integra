
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { KeyRound } from "lucide-react";
import { Profile, User, UserFormValues, userFormSchema } from "@/types/users";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profiles: Profile[];
  selectedUser: User | null;
  onSubmit: (data: UserFormValues) => void;
}

export const EditUserDialog = ({
  open,
  onOpenChange,
  profiles,
  selectedUser,
  onSubmit,
}: EditUserDialogProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { toast } = useToast();

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      perfil: "",
    },
  });
  
  // Update form when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      userForm.reset({
        nome: selectedUser.nome,
        email: selectedUser.email,
        perfil: selectedUser.perfil,
      });
    } else {
      userForm.reset({
        nome: "",
        email: "",
        perfil: "",
      });
    }
    // Reset password fields when user changes
    setNewPassword("");
    setConfirmPassword("");
  }, [selectedUser, userForm]);

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      userForm.reset();
      setNewPassword("");
      setConfirmPassword("");
    }
    onOpenChange(open);
  };

  const handleSubmit = (data: UserFormValues) => {
    onSubmit(data);
  };

  const handlePasswordReset = async () => {
    if (!selectedUser) {
      toast({
        title: "Erro",
        description: "Nenhum usuário selecionado",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    setIsResettingPassword(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Erro",
          description: "Sessão não encontrada",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`https://xexgdtlctyuycohzhmuu.supabase.co/functions/v1/reset-user-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword: newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao redefinir senha');
      }

      toast({
        title: "Sucesso",
        description: "Senha redefinida com sucesso",
      });

      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao redefinir senha",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário e defina uma nova senha se necessário.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações do Usuário */}
          <div>
            <h3 className="text-sm font-medium mb-3">Informações Básicas</h3>
            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={userForm.control}
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
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um perfil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {profiles.map((profile) => (
                            <SelectItem key={profile.id} value={profile.nome}>
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
                    onClick={() => handleOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>

          <Separator />

          {/* Redefinir Senha */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Redefinir Senha de Acesso
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="text-sm font-medium">Nova Senha</label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Digite a nova senha (min. 6 caracteres)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Nova Senha</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite novamente a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">
                  ⚠️ Esta ação redefinirá a senha do usuário. O usuário precisará usar a nova senha no próximo login.
                </p>
              </div>
              <Button
                type="button"
                onClick={handlePasswordReset}
                disabled={!newPassword || !confirmPassword || isResettingPassword}
                className="w-full"
                variant="secondary"
              >
                {isResettingPassword ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
