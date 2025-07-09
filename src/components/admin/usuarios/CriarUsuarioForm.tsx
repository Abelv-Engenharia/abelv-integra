
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Profile } from "@/types/users";

const criarUsuarioSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  perfil: z.string().min(1, "Selecione um perfil"),
});

type CriarUsuarioFormData = z.infer<typeof criarUsuarioSchema>;

interface CriarUsuarioFormProps {
  perfis: Profile[];
  onSubmit: (data: CriarUsuarioFormData) => void;
  isSubmitting: boolean;
}

export const CriarUsuarioForm = ({ perfis, onSubmit, isSubmitting }: CriarUsuarioFormProps) => {
  const [selectedPerfil, setSelectedPerfil] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm<CriarUsuarioFormData>({
    resolver: zodResolver(criarUsuarioSchema),
  });

  const handleFormSubmit = async (data: CriarUsuarioFormData) => {
    console.log("Formulário enviado com dados:", data);
    
    // Validação adicional
    if (!data.perfil) {
      console.error("Perfil não selecionado");
      return;
    }

    try {
      await onSubmit(data);
      console.log("Usuário criado com sucesso, resetando formulário");
      reset();
      setSelectedPerfil("");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
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
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Digite a senha (mínimo 6 caracteres)"
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="perfil">Perfil</Label>
        <Select
          value={selectedPerfil}
          onValueChange={(value) => {
            console.log("Perfil selecionado:", value);
            setSelectedPerfil(value);
            setValue("perfil", value, { shouldValidate: true });
          }}
          disabled={isSubmitting || perfis.length === 0}
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
        {perfis.length === 0 && (
          <p className="text-sm text-yellow-600">Carregando perfis...</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setSelectedPerfil("");
          }}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || perfis.length === 0}
        >
          {isSubmitting ? "Criando..." : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
};
