
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { KeyRound } from "lucide-react";
import { User, Profile } from "@/types/users";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const editarUsuarioSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  perfil: z.string().min(1, "Selecione um perfil"),
  status: z.boolean(),
});

type EditarUsuarioFormData = z.infer<typeof editarUsuarioSchema>;

interface EditarUsuarioFormProps {
  user: User;
  perfis: Profile[];
  onSubmit: (data: EditarUsuarioFormData) => void;
  isSubmitting: boolean;
}

export const EditarUsuarioForm = ({ user, perfis, onSubmit, isSubmitting }: EditarUsuarioFormProps) => {
  const [selectedPerfil, setSelectedPerfil] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EditarUsuarioFormData>({
    resolver: zodResolver(editarUsuarioSchema),
    defaultValues: {
      nome: user.nome,
      email: user.email,
      perfil: "",
      status: user.status === "Ativo",
    }
  });

  const statusValue = watch("status");

  useEffect(() => {
    // Encontrar o perfil ID baseado no nome
    const perfilEncontrado = perfis.find(p => p.nome === user.perfil);
    if (perfilEncontrado) {
      const perfilId = perfilEncontrado.id.toString();
      setSelectedPerfil(perfilId);
      setValue("perfil", perfilId);
    }
    
    // Definir o status inicial
    const userActive = user.status === "Ativo";
    setIsActive(userActive);
    setValue("status", userActive);
  }, [user.perfil, user.status, perfis, setValue]);

  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked);
    setValue("status", checked);
  };

  const handleFormSubmit = (data: EditarUsuarioFormData) => {
    onSubmit(data);
  };

  const handlePasswordReset = async () => {
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
          userId: user.id,
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
    <div className="space-y-6">
      {/* Formulário de Informações do Usuário */}
      <div>
        <h3 className="text-sm font-medium mb-3">Informações Básicas</h3>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              {...register("nome")}
              placeholder="Digite o nome completo"
              disabled={isSubmitting}
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Digite o e-mail"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="perfil">Perfil</Label>
            <Select
              value={selectedPerfil}
              onValueChange={(value) => {
                setSelectedPerfil(value);
                setValue("perfil", value);
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um perfil" />
              </SelectTrigger>
              <SelectContent>
                {perfis.map((perfil) => (
                  <SelectItem key={perfil.id} value={perfil.id.toString()}>
                    {perfil.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.perfil && (
              <p className="text-sm text-destructive">{errors.perfil.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status do Usuário</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={isActive}
                onCheckedChange={handleStatusChange}
                disabled={isSubmitting}
              />
              <Label htmlFor="status" className="text-sm">
                {isActive ? "Ativo" : "Inativo"}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Usuários inativos não conseguem fazer login no sistema
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>

      <Separator />

      {/* Seção de Redefinir Senha */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <KeyRound className="h-4 w-4" />
          Redefinir Senha de Acesso
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword">Nova Senha</Label>
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
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
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
  );
};
