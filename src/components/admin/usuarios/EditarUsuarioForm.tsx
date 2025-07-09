
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Profile } from "@/types/users";

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

  return (
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
  );
};
