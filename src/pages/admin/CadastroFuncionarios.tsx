
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Form schema using zod
const funcionarioFormSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  funcao: z.string().min(2, "A função deve ter pelo menos 2 caracteres"),
  matricula: z.string().min(2, "A matrícula deve ter pelo menos 2 caracteres"),
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF deve ter no máximo 14 caracteres")
    .refine(
      (cpf) => {
        // Remove any non-digit characters
        const cleanCpf = cpf.replace(/\D/g, "");
        return cleanCpf.length === 11;
      },
      {
        message: "CPF deve ter 11 dígitos",
      }
    ),
});

type FuncionarioFormValues = z.infer<typeof funcionarioFormSchema>;

const CadastroFuncionarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Initialize form with default values
  const form = useForm<FuncionarioFormValues>({
    resolver: zodResolver(funcionarioFormSchema),
    defaultValues: {
      nome: "",
      funcao: "",
      matricula: "",
      cpf: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FuncionarioFormValues) => {
    setIsSubmitting(true);
    try {
      // Format CPF for display (XXX.XXX.XXX-XX)
      const formattedCpf = data.cpf
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      
      // In a real app, this would save data to the backend along with the photo
      console.log("Funcionario data to submit:", data);
      console.log("Photo file:", photoFile);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Funcionário cadastrado com sucesso",
        description: `${data.nome} foi cadastrado como ${data.funcao}`,
      });
      
      // Reset form or navigate back
      form.reset();
      setPhotoPreview(null);
      setPhotoFile(null);
    } catch (error) {
      console.error("Error submitting funcionario data:", error);
      toast({
        title: "Erro ao cadastrar funcionário",
        description: "Ocorreu um erro ao cadastrar o funcionário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Cadastro de Funcionários</h1>
        <p className="text-muted-foreground">
          Cadastre um novo funcionário no sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Funcionário</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center sm:items-start mb-6">
                <FormLabel className="mb-2">Foto</FormLabel>
                <Avatar className="size-32 mb-3">
                  <AvatarImage src={photoPreview || ""} />
                  <AvatarFallback>
                    <UserRound className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    <Upload className="h-4 w-4" />
                    Selecionar imagem
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  {photoPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoFile(null);
                      }}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="funcao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite a função do funcionário"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a matrícula" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar funcionário"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroFuncionarios;
