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
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface TreinamentoNormativoForm {
  cca_id: string;
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
  const [selectedCcaId, setSelectedCcaId] = useState<string>("");
  const { data: userCCAs = [] } = useUserCCAs();

  const form = useForm<TreinamentoNormativoForm>({
    defaultValues: {
      cca_id: "",
      funcionario_id: "",
      treinamento_id: "",
      tipo: "Formação",
      data_realizacao: "",
      data_validade: "",
      certificado_url: "",
    },
  });

  useEffect(() => {
    const loadTreinamentos = async () => {
      try {
        const treinamentos = await listaTreinamentosNormativosService.getAll();
        setTreinamentosDisponiveis(treinamentos);
      } catch (error) {
        console.error('Erro ao carregar treinamentos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os treinamentos",
          variant: "destructive",
        });
      }
    };

    loadTreinamentos();
  }, []);

  useEffect(() => {
    const loadFuncionarios = async () => {
      if (!selectedCcaId) {
        setFuncionarios([]);
        return;
      }

      try {
        const { data: funcionariosData, error } = await supabase
          .from('funcionarios')
          .select('id, nome, matricula, funcao')
          .eq('cca_id', parseInt(selectedCcaId))
          .eq('ativo', true)
          .order('nome');

        if (error) {
          console.error('Erro ao carregar funcionários:', error);
        } else {
          setFuncionarios(funcionariosData || []);
        }
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
      }
    };

    loadFuncionarios();
  }, [selectedCcaId]);

  // Efeito para calcular automaticamente a data de validade
  useEffect(() => {
    const treinamentoId = form.watch("treinamento_id");
    const dataRealizacao = form.watch("data_realizacao");

    if (treinamentoId && dataRealizacao) {
      const treinamentoSelecionado = treinamentosDisponiveis.find(t => t.id === treinamentoId);
      
      if (treinamentoSelecionado && treinamentoSelecionado.validade_dias) {
        const dataRealizacaoObj = new Date(dataRealizacao);
        const dataValidade = new Date(dataRealizacaoObj);
        dataValidade.setDate(dataValidade.getDate() + treinamentoSelecionado.validade_dias);
        
        // Formatando para YYYY-MM-DD para o input date
        const dataValidadeFormatada = dataValidade.toISOString().split('T')[0];
        form.setValue('data_validade', dataValidadeFormatada);
      }
    }
  }, [form.watch("treinamento_id"), form.watch("data_realizacao"), treinamentosDisponiveis, form]);

  const handleCcaChange = (ccaId: string) => {
    setSelectedCcaId(ccaId);
    form.setValue('cca_id', ccaId);
    form.setValue('funcionario_id', ''); // Reset funcionário quando mudar CCA
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo e tamanho do arquivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 2 * 1024 * 1024; // 2MB
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Erro",
          description: "Tipo de arquivo não permitido. Use PDF, JPG, JPEG ou PNG.",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Máximo permitido: 2MB.",
          variant: "destructive",
        });
        return;
      }
      
      setCertificadoFile(file);
    }
  };

  const uploadCertificado = async (file: File): Promise<string | null> => {
    try {
      console.log('Iniciando upload do certificado...');
      
      // Obter dados para nomenclatura
      const funcionarioSelecionado = funcionarios.find(f => f.id === form.getValues('funcionario_id'));
      const treinamentoSelecionado = treinamentosDisponiveis.find(t => t.id === form.getValues('treinamento_id'));
      
      if (!funcionarioSelecionado || !treinamentoSelecionado) {
        console.error('Funcionário ou treinamento não encontrado para nomenclatura');
        toast({
          title: "Erro",
          description: "Dados do funcionário ou treinamento não encontrados.",
          variant: "destructive",
        });
        return null;
      }

      // Extrair nome do treinamento até o hífen (ou nome completo se não houver hífen)
      const nomeBase = treinamentoSelecionado.nome.split(' -')[0].trim().replace(/[^a-zA-Z0-9]/g, '_');
      const nomeFunc = funcionarioSelecionado.nome.replace(/\s+/g, '_').toUpperCase().replace(/[^a-zA-Z0-9_]/g, '');
      
      // Criar nomenclatura: NOME_TREINAMENTO_MATRICULA_FUNCIONÁRIO
      const fileExt = file.name.split('.').pop();
      const fileName = `${nomeBase}_${funcionarioSelecionado.matricula}_${nomeFunc}.${fileExt}`;
      const filePath = fileName;

      console.log('Nome do arquivo:', fileName);
      console.log('Tamanho do arquivo:', file.size);

      // Tentar fazer upload para o bucket certificados-treinamentos-normativos
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('certificados-treinamentos-normativos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        toast({
          title: "Erro no upload",
          description: `Erro ao fazer upload: ${uploadError.message}`,
          variant: "destructive",
        });
        return null;
      }

      console.log('Upload realizado com sucesso:', uploadData);

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('certificados-treinamentos-normativos')
        .getPublicUrl(filePath);

      console.log('URL pública gerada:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Exceção ao fazer upload do certificado:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao fazer upload do certificado. Tente novamente.",
        variant: "destructive",
      });
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
        console.log('Fazendo upload do certificado...');
        certificadoUrl = await uploadCertificado(certificadoFile);
        if (!certificadoUrl) {
          setIsLoading(false);
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

      console.log('Inserindo dados no banco...');
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

      if (error) {
        console.error('Erro ao inserir no banco:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Treinamento normativo registrado com sucesso!",
      });

      form.reset();
      setCertificadoFile(null);
      setSelectedCcaId("");
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
        <h1 className="text-3xl font-bold tracking-tight">Registro de Treinamentos Normativos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Treinamento Normativo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Preencha os campos abaixo para registrar um treinamento normativo
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                {/* Primeira linha - CCA */}
                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="cca_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CCA</FormLabel>
                        <Select onValueChange={handleCcaChange} value={selectedCcaId}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o CCA" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {userCCAs.map((cca) => (
                              <SelectItem key={cca.id} value={cca.id.toString()}>
                                {cca.codigo} - {cca.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Segunda linha - Funcionário, Função e Matrícula */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="funcionario_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funcionário</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={!selectedCcaId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedCcaId ? "Selecione o funcionário" : "Selecione o CCA primeiro"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {funcionarios.map((funcionario) => (
                              <SelectItem key={funcionario.id} value={funcionario.id}>
                                {funcionario.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Função</FormLabel>
                    <div className="mt-2 p-2 border rounded-md bg-muted min-h-[40px] flex items-center">
                      {selectedCcaId && form.watch("funcionario_id") ? (
                        funcionarios.find(f => f.id === form.watch("funcionario_id"))?.funcao || "---"
                      ) : "---"}
                    </div>
                  </div>

                  <div>
                    <FormLabel>Matrícula</FormLabel>
                    <div className="mt-2 p-2 border rounded-md bg-muted min-h-[40px] flex items-center">
                      {selectedCcaId && form.watch("funcionario_id") ? (
                        funcionarios.find(f => f.id === form.watch("funcionario_id"))?.matricula || "---"
                      ) : "---"}
                    </div>
                  </div>
                </div>

                {/* Terceira linha - Treinamento e Tipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="treinamento_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treinamento realizado</FormLabel>
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
                        <FormLabel>Tipo de treinamento</FormLabel>
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
                </div>

                {/* Quarta linha - Datas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="data_realizacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da realização</FormLabel>
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
                        <FormLabel>Data de validade (calculada automaticamente)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} readOnly className="bg-muted" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Quinta linha - Upload de certificado */}
                <div className="space-y-2">
                  <FormLabel>Anexar certificado (PDF, JPG, PNG - máx. 2MB)</FormLabel>
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
                  <p className="text-xs text-muted-foreground">
                    Apenas arquivos PDF, JPG, PNG, máximo 2MB. Nome será automaticamente formatado como: TREINAMENTO_MATRÍCULA_FUNCIONÁRIO
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" asChild>
                  <Link to="/treinamentos/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Voltar
                  </Link>
                </Button>
                <Button type="submit" disabled={isLoading} size="sm">
                  {isLoading ? "Salvando..." : "Salvar registro"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinamentosNormativo;
