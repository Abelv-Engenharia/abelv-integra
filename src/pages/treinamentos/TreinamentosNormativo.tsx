import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { listaTreinamentosNormativosService } from "@/services/treinamentos/listaTreinamentosNormativosService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface TreinamentoIndividual {
  treinamento_id: string;
  tipo: "Formação" | "Reciclagem";
  data_realizacao: string;
  data_validade: string;
  certificado_url?: string;
  certificado_file?: File | null;
}

interface TreinamentoNormativoForm {
  cca_id: string;
  funcionario_id: string;
  treinamentos: TreinamentoIndividual[];
}

const TreinamentosNormativo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [selectedCcaId, setSelectedCcaId] = useState<string>("");
  const { data: userCCAs = [] } = useUserCCAs();

  // Carregar treinamentos normativos usando useQuery com debugging
  const { data: treinamentosDisponiveis = [], isLoading: isLoadingTreinamentos, error: errorTreinamentos } = useQuery({
    queryKey: ['lista-treinamentos-normativos'],
    queryFn: async () => {
      console.log('Buscando treinamentos normativos...');
      try {
        const result = await listaTreinamentosNormativosService.getAll();
        console.log('Treinamentos encontrados:', result);
        return result;
      } catch (error) {
        console.error('Erro ao buscar treinamentos:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 0, // Sempre buscar dados frescos para debug
  });

  // Log de debug para acompanhar o estado
  useEffect(() => {
    console.log('Estado dos treinamentos:', {
      isLoading: isLoadingTreinamentos,
      error: errorTreinamentos,
      data: treinamentosDisponiveis,
      length: treinamentosDisponiveis?.length
    });
  }, [isLoadingTreinamentos, errorTreinamentos, treinamentosDisponiveis]);

  // Ordenar CCAs do menor para o maior
  const sortedCCAs = [...userCCAs].sort((a, b) => a.codigo.localeCompare(b.codigo, undefined, { numeric: true }));

  const form = useForm<TreinamentoNormativoForm>({
    defaultValues: {
      cca_id: "",
      funcionario_id: "",
      treinamentos: [{
        treinamento_id: "",
        tipo: "Formação",
        data_realizacao: "",
        data_validade: "",
        certificado_url: "",
        certificado_file: null,
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "treinamentos"
  });

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

  // Função para calcular data de validade
  const calcularDataValidade = (treinamentoId: string, dataRealizacao: string) => {
    if (treinamentoId && dataRealizacao && treinamentosDisponiveis.length > 0) {
      const treinamentoSelecionado = treinamentosDisponiveis.find(t => t.id === treinamentoId);
      
      if (treinamentoSelecionado && treinamentoSelecionado.validade_dias) {
        // Criar data sem problemas de fuso horário
        const [ano, mes, dia] = dataRealizacao.split('-');
        const dataRealizacaoObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        const dataValidade = new Date(dataRealizacaoObj);
        dataValidade.setDate(dataValidade.getDate() + treinamentoSelecionado.validade_dias);
        
        // Formatando para YYYY-MM-DD para o input date
        const year = dataValidade.getFullYear();
        const month = String(dataValidade.getMonth() + 1).padStart(2, '0');
        const day = String(dataValidade.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    return '';
  };

  const handleCcaChange = (ccaId: string) => {
    setSelectedCcaId(ccaId);
    form.setValue('cca_id', ccaId);
    form.setValue('funcionario_id', ''); // Reset funcionário quando mudar CCA
  };

  const adicionarTreinamento = () => {
    append({
      treinamento_id: "",
      tipo: "Formação",
      data_realizacao: "",
      data_validade: "",
      certificado_url: "",
      certificado_file: null,
    });
  };

  const removerTreinamento = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
      
      form.setValue(`treinamentos.${index}.certificado_file`, file);
    }
  };

  const uploadCertificado = async (file: File, treinamentoId: string): Promise<string | null> => {
    try {
      console.log('Iniciando upload do certificado...');
      
      // Obter dados para nomenclatura
      const funcionarioSelecionado = funcionarios.find(f => f.id === form.getValues('funcionario_id'));
      const treinamentoSelecionado = treinamentosDisponiveis.find(t => t.id === treinamentoId);
      
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
      const nomeBaseTreinamento = treinamentoSelecionado.nome.split(' -')[0].trim();
      
      // Sanitizar nome do arquivo removendo caracteres especiais
      const sanitizeFileName = (str: string) => {
        return str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-zA-Z0-9_\-]/g, '_') // Substitui caracteres especiais por underscore
          .replace(/_+/g, '_') // Remove underscores duplos
          .replace(/^_|_$/g, ''); // Remove underscores no início e fim
      };

      // Criar nomenclatura sanitizada
      const fileExt = file.name.split('.').pop();
      const nomeArquivoSanitizado = `${sanitizeFileName(nomeBaseTreinamento)}_${sanitizeFileName(funcionarioSelecionado.matricula)}_${sanitizeFileName(funcionarioSelecionado.nome)}.${fileExt}`;
      
      console.log('Nome do arquivo sanitizado:', nomeArquivoSanitizado);
      console.log('Tamanho do arquivo:', file.size);

      // Tentar fazer upload para o bucket certificados-treinamentos-normativos
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('certificados-treinamentos-normativos')
        .upload(nomeArquivoSanitizado, file, {
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
        .getPublicUrl(nomeArquivoSanitizado);

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
      console.log('Iniciando processamento de múltiplos treinamentos...');
      
      const treinamentosParaInserir = [];

      // Processar cada treinamento
      for (let i = 0; i < data.treinamentos.length; i++) {
        const treinamento = data.treinamentos[i];
        let certificadoUrl = treinamento.certificado_url;

        // Upload do certificado se houver arquivo
        if (treinamento.certificado_file) {
          console.log(`Fazendo upload do certificado ${i + 1}...`);
          certificadoUrl = await uploadCertificado(treinamento.certificado_file, treinamento.treinamento_id);
          if (!certificadoUrl) {
            setIsLoading(false);
            return;
          }
        }

        // Criar data sem problemas de fuso horário para cálculo do status
        const [anoValidade, mesValidade, diaValidade] = treinamento.data_validade.split('-');
        const dataValidade = new Date(parseInt(anoValidade), parseInt(mesValidade) - 1, parseInt(diaValidade));
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Reset para início do dia
        dataValidade.setHours(0, 0, 0, 0); // Reset para início do dia
        
        const diasParaVencimento = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 3600 * 24));

        let status = "Válido";
        if (diasParaVencimento < 0) {
          status = "Vencido";
        } else if (diasParaVencimento <= 30) {
          status = "Próximo ao vencimento";
        }

        treinamentosParaInserir.push({
          funcionario_id: data.funcionario_id,
          treinamento_id: treinamento.treinamento_id,
          tipo: treinamento.tipo,
          data_realizacao: treinamento.data_realizacao,
          data_validade: treinamento.data_validade,
          certificado_url: certificadoUrl,
          status: status,
          arquivado: false,
        });
      }

      console.log('Inserindo dados no banco...');
      const { error } = await supabase
        .from('treinamentos_normativos')
        .insert(treinamentosParaInserir);

      if (error) {
        console.error('Erro ao inserir no banco:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: `${data.treinamentos.length} treinamento(s) normativo(s) registrado(s) com sucesso!`,
      });

      form.reset({
        cca_id: "",
        funcionario_id: "",
        treinamentos: [{
          treinamento_id: "",
          tipo: "Formação",
          data_realizacao: "",
          data_validade: "",
          certificado_url: "",
          certificado_file: null,
        }],
      });
      setSelectedCcaId("");
    } catch (error) {
      console.error('Erro ao salvar treinamentos normativos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar os treinamentos normativos",
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
                            {sortedCCAs.map((cca) => (
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

                {/* Treinamentos - Lista dinâmica */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Treinamentos</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={adicionarTreinamento}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar Treinamento
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <Card key={field.id} className="relative">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Treinamento {index + 1}</CardTitle>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removerTreinamento(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`treinamentos.${index}.treinamento_id`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Treinamento realizado</FormLabel>
                                <Select 
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    // Calcular data de validade automaticamente
                                    const dataRealizacao = form.getValues(`treinamentos.${index}.data_realizacao`);
                                    if (dataRealizacao) {
                                      const dataValidade = calcularDataValidade(value, dataRealizacao);
                                      if (dataValidade) {
                                        form.setValue(`treinamentos.${index}.data_validade`, dataValidade);
                                      }
                                    }
                                  }}
                                  value={field.value}
                                  disabled={isLoadingTreinamentos}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={
                                        isLoadingTreinamentos 
                                          ? "Carregando treinamentos..." 
                                          : errorTreinamentos 
                                            ? "Erro ao carregar treinamentos"
                                            : treinamentosDisponiveis.length === 0
                                              ? "Nenhum treinamento disponível"
                                              : "Selecione o treinamento"
                                      } />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {treinamentosDisponiveis.length > 0 ? (
                                      treinamentosDisponiveis.map((treinamento) => (
                                        <SelectItem key={treinamento.id} value={treinamento.id}>
                                          {treinamento.nome}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="no-options" disabled>
                                        {isLoadingTreinamentos ? "Carregando..." : "Nenhum treinamento encontrado"}
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                                {errorTreinamentos && (
                                  <p className="text-sm text-red-600 mt-1">
                                    Erro ao carregar treinamentos. Verifique o console para mais detalhes.
                                  </p>
                                )}
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`treinamentos.${index}.tipo`}
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

                        {/* Datas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`treinamentos.${index}.data_realizacao`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Data da realização</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    {...field} 
                                    onChange={(e) => {
                                      field.onChange(e);
                                      // Calcular data de validade automaticamente
                                      const treinamentoId = form.getValues(`treinamentos.${index}.treinamento_id`);
                                      if (treinamentoId) {
                                        const dataValidade = calcularDataValidade(treinamentoId, e.target.value);
                                        if (dataValidade) {
                                          form.setValue(`treinamentos.${index}.data_validade`, dataValidade);
                                        }
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`treinamentos.${index}.data_validade`}
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

                        {/* Upload de certificado */}
                        <div className="space-y-2">
                          <FormLabel>Anexar certificado (PDF, JPG, PNG - máx. 2MB)</FormLabel>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, index)}
                              className="flex-1"
                            />
                            <Upload className="h-4 w-4 text-muted-foreground" />
                          </div>
                          {form.watch(`treinamentos.${index}.certificado_file`) && (
                            <p className="text-sm text-muted-foreground">
                              Arquivo selecionado: {(form.watch(`treinamentos.${index}.certificado_file`) as File)?.name}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Apenas arquivos PDF, JPG, PNG, máximo 2MB. Nome será automaticamente formatado como: TREINAMENTO_MATRÍCULA_NOME COMPLETO
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" asChild>
                  <Link to="/treinamentos/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Voltar
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={adicionarTreinamento}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Treinamento
                  </Button>
                  <Button type="submit" disabled={isLoading} size="sm">
                    {isLoading ? "Salvando..." : "Salvar registro"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinamentosNormativo;
