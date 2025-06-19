import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { listaTreinamentosNormativosService } from "@/services/treinamentos/listaTreinamentosNormativosService";
import { FuncionarioAutocomplete } from "@/components/admin/funcionarios/FuncionarioAutocomplete";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface TreinamentoNormativoForm {
  funcionario_id: string;
  treinamento_id: string;
  tipo: "Formação" | "Reciclagem";
  data_realizacao: string;
  data_validade: string;
  certificado_url?: string;
}

const TreinamentosNormativo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [treinamentosDisponiveis, setTreinamentosDisponiveis] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [certificadoFile, setCertificadoFile] = useState<File | null>(null);
  const { data: userCCAs = [] } = useUserCCAs();

  const form = useForm<TreinamentoNormativoForm>({
    defaultValues: {
      funcionario_id: "",
      treinamento_id: "",
      tipo: "Formação",
      data_realizacao: "",
      data_validade: "",
      certificado_url: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar treinamentos normativos disponíveis
        const treinamentos = await listaTreinamentosNormativosService.getAll();
        setTreinamentosDisponiveis(treinamentos);

        // Carregar funcionários apenas dos CCAs permitidos
        if (userCCAs.length > 0) {
          const userCCAIds = userCCAs.map(cca => cca.id);
          const { data: funcionariosData, error } = await supabase
            .from('funcionarios')
            .select('id, nome, matricula, funcao, cca_id')
            .in('cca_id', userCCAIds)
            .eq('ativo', true)
            .order('nome');

          if (error) {
            console.error('Erro ao carregar funcionários:', error);
          } else {
            setFuncionarios(funcionariosData || []);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [userCCAs]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCertificadoFile(file);
    }
  };

  const uploadCertificado = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `certificados/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('treinamentos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('treinamentos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload do certificado:', error);
      return null;
    }
  };

  const onSubmit = async (data: TreinamentoNormativoForm) => {
    if (userCCAs.length === 0) {
      toast({
        title: "Erro",
        description: "Você não possui acesso a nenhum CCA",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let certificadoUrl = data.certificado_url;

      // Upload do certificado se houver arquivo
      if (certificadoFile) {
        certificadoUrl = await uploadCertificado(certificadoFile);
        if (!certificadoUrl) {
          toast({
            title: "Erro",
            description: "Não foi possível fazer upload do certificado",
            variant: "destructive",
          });
          return;
        }
      }

      // Calcular status baseado na data de validade
      const hoje = new Date();
      const dataValidade = new Date(data.data_validade);
      const diasParaVencimento = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 3600 * 24));

      let status = "Válido";
      if (diasParaVencimento < 0) {
        status = "Vencido";
      } else if (diasParaVencimento <= 30) {
        status = "Próximo ao vencimento";
      }

      const { error } = await supabase
        .from('treinamentos_normativos')
        .insert({
          funcionario_id: data.funcionario_id,
          treinamento_id: data.treinamento_id,
          tipo: data.tipo,
          data_realizacao: data.data_realizacao,
          data_validade: data.data_validade,
          certificado_url: certificadoUrl,
          status: status,
          arquivado: false,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Treinamento normativo registrado com sucesso!",
      });

      form.reset();
      setCertificadoFile(null);
    } catch (error) {
      console.error('Erro ao salvar treinamento normativo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar o treinamento normativo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (userCCAs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" asChild>
            <Link to="/treinamentos/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Treinamentos Normativos</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Você não possui acesso a nenhum CCA.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link to="/treinamentos/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Treinamentos Normativos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Treinamento Normativo</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="funcionario_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funcionário</FormLabel>
                      <FormControl>
                        <FuncionarioAutocomplete
                          funcionarios={funcionarios}
                          onSelect={(funcionario) => field.onChange(funcionario.id)}
                          className=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treinamento_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treinamento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o treinamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {treinamentosDisponiveis.map((treinamento) => (
                            <SelectItem key={treinamento.id} value={treinamento.id}>
                              {treinamento.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Formação">Formação</SelectItem>
                          <SelectItem value="Reciclagem">Reciclagem</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_realizacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Realização</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_validade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Validade</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Certificado (opcional)</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {certificadoFile && (
                    <p className="text-sm text-muted-foreground">
                      Arquivo selecionado: {certificadoFile.name}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Registrando..." : "Registrar Treinamento"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinamentosNormativo;
