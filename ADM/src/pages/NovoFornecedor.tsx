import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
const fornecedorSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().min(1, "CNPJ é obrigatório").regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ deve estar no formato 00.000.000/0000-00"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  contatoNome: z.string().optional(),
  telefone: z.string().min(1, "Telefone é obrigatório").regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone deve estar no formato (99) 99999-9999")
});
type FornecedorFormData = z.infer<typeof fornecedorSchema>;
export default function NovoFornecedor() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      nome: "",
      cnpj: "",
      endereco: "",
      contatoNome: "",
      telefone: ""
    }
  });
  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 11) {
      return numeros.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
    }
    return valor;
  };
  const onSubmit = async (data: FornecedorFormData) => {
    setIsLoading(true);
    try {
      const {
        supabase
      } = await import("@/integrations/supabase/client");

      // Verificar duplicação por nome ou CNPJ
      const {
        data: existentes,
        error: erro_busca
      } = await supabase.from("fornecedores_alojamento").select("id, nome, cnpj").or(`nome.ilike.${data.nome},cnpj.eq.${data.cnpj}`);
      if (erro_busca) throw erro_busca;
      if (existentes && existentes.length > 0) {
        const duplicado = existentes[0];
        if (duplicado.nome.toLowerCase() === data.nome.toLowerCase()) {
          toast.error("Já existe um fornecedor cadastrado com este nome.");
        } else if (duplicado.cnpj === data.cnpj) {
          toast.error("Já existe um fornecedor cadastrado com este CNPJ.");
        } else {
          toast.error("Já existe um fornecedor cadastrado com este nome ou CNPJ.");
        }
        setIsLoading(false);
        return;
      }
      const payload = {
        nome: data.nome,
        cnpj: data.cnpj,
        endereco: data.endereco,
        contato_nome: data.contatoNome || null,
        telefone: data.telefone,
        status: "Ativo"
      };
      const {
        error: insert_error
      } = await supabase.from("fornecedores_alojamento").insert([payload]);
      if (insert_error) throw insert_error;
      toast.success("Fornecedor cadastrado com sucesso!");
      navigate("/fornecedores-alojamento");
    } catch (error) {
      toast.error("Erro ao cadastrar fornecedor");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    navigate("/fornecedores-alojamento");
  };
  return <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/fornecedores-alojamento")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lista
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Novo Fornecedor</h1>
            <p className="text-muted-foreground">Cadastrar novo fornecedor de alojamento</p>
          </div>
        </div>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Fornecedor</CardTitle>
            <CardDescription>
              Preencha as informações do fornecedor. Campos marcados com * são obrigatórios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField control={form.control} name="nome" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-destructive">Razão Social *
                    </FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do fornecedor" {...field} className={!field.value ? "border-destructive" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <FormField control={form.control} name="cnpj" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-destructive">CNPJ *</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0000-00" {...field} className={!field.value ? "border-destructive" : ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="telefone" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-destructive">Telefone *</FormLabel>
                        <FormControl>
                          <Input placeholder="(99) 99999-9999" {...field} onChange={e => {
                      const valorFormatado = formatarTelefone(e.target.value);
                      field.onChange(valorFormatado);
                    }} className={!field.value ? "border-destructive" : ""} maxLength={15} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <div className="md:col-span-2">
                    <FormField control={form.control} name="endereco" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-destructive">Endereço *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Endereço completo" {...field} className={!field.value ? "border-destructive" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <FormField control={form.control} name="contatoNome" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Contato (Nome)</FormLabel>
                        <FormControl>
                          <Input placeholder="Responsável comercial/operacional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <p className="text-sm text-muted-foreground mt-1">Padrão: <strong>Ativo</strong></p>
                  </div>
                </div>

                {/* Rodapé da página */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                    Cancelar e Voltar para Lista
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Salvando..." : "Salvar e Voltar para Lista de Fornecedores"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>;
}