import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Building2, Download, FileText, Search } from "lucide-react";
import * as XLSX from 'xlsx';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useReceitaWS } from "@/hooks/gestao-pessoas/useReceitaWS";
import { useCreatePrestadorPJ } from "@/hooks/gestao-pessoas/usePrestadoresPJ";
const cadastroSchema = z.object({
  razaosocial: z.string().min(1, "Razão social é obrigatória"),
  cnpj: z.string().min(14, "CNPJ é obrigatório"),
  descricaoatividade: z.string().optional(),
  numerocnae: z.string().optional(),
  grauderisco: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  contabancaria: z.string().optional(),
  numerocredorsienge: z.string().optional(),
  nomecompleto: z.string().min(1, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF é obrigatório"),
  datanascimento: z.date().optional(),
  rg: z.string().optional(),
  registrofuncional: z.string().optional(),
  telefonerepresentante: z.string().optional(),
  emailrepresentante: z.string().email("E-mail inválido").optional().or(z.literal("")),
  enderecorepresentante: z.string().optional(),
  // Condições Financeiras
  servico: z.string().optional(),
  valorprestacaoservico: z.string().optional(),
  datainiciocontrato: z.date().optional(),
  tipocontrato: z.enum(["padrao", "determinado"]).default("padrao"),
  datainiciocontratodeterminado: z.date().optional(),
  datafimcontratodeterminado: z.date().optional(),
  ajudacusto: z.string().optional(),
  auxilioconveniomedico: z.boolean().default(false),
  valorauxilioconveniomedico: z.string().optional(),
  ajudaaluguel: z.string().optional(),
  valerefeicao: z.string().optional(),
  cafemanha: z.boolean().default(false),
  valorcafemanha: z.string().optional(),
  cafetarde: z.boolean().default(false),
  valorcafetarde: z.string().optional(),
  almoco: z.boolean().default(false),
  valoralmoco: z.string().optional(),
  veiculo: z.boolean().default(false),
  celular: z.boolean().default(false),
  alojamento: z.boolean().default(false),
  folgacampo: z.string().optional(),
  periodoferias: z.string().optional(),
  quantidadediasferias: z.string().optional(),
  ccaobra: z.string().optional(),
  contratofile: z.any().optional()
});
type CadastroFormData = z.infer<typeof cadastroSchema>;
// Dados mock para a tabela de demonstrativo
const mockDemonstrativo = [{
  codigo: "001",
  nome: "João da Silva",
  obra: "Obra Centro",
  funcao: "Pedreiro",
  nomeempresa: "Construtora ABC Ltda",
  cpf: "123.456.789-00",
  datanascimento: "15/03/1985",
  admissao: "01/01/2024",
  salario: 2500.00,
  premiacaonexa: 250.00,
  ajudacustoobra: 300.00,
  multasdescontos: 0.00,
  ajudaaluguel: 400.00,
  descontoconvenio: 150.00,
  reembolsoconvenio: 0.00,
  valornf: 3300.00
}, {
  codigo: "002",
  nome: "Maria Santos",
  obra: "Obra Norte",
  funcao: "Eletricista",
  nomeempresa: "Elétrica XYZ Ltda",
  cpf: "987.654.321-00",
  datanascimento: "22/07/1990",
  admissao: "15/01/2024",
  salario: 2800.00,
  premiacaonexa: 280.00,
  ajudacustoobra: 350.00,
  multasdescontos: 50.00,
  ajudaaluguel: 450.00,
  descontoconvenio: 180.00,
  reembolsoconvenio: 0.00,
  valornf: 3630.00
}];
export default function CadastroPessoaJuridica() {
  const [cadastrosCnpj, setCadastrosCnpj] = useState<Set<string>>(new Set());
  const [cadastrosCpf, setCadastrosCpf] = useState<Set<string>>(new Set());
  const [inputDataNascimento, setInputDataNascimento] = useState<string>("");
  const [inputDataInicioContrato, setInputDataInicioContrato] = useState<string>("");
  const {
    buscarCNPJ,
    loading: loadingCNPJ
  } = useReceitaWS();
  
  const createPrestador = useCreatePrestadorPJ();

  // Buscar usuários ativos do sistema
  const {
    data: usuarios,
    isLoading: isLoadingUsuarios
  } = useQuery({
    queryKey: ['usuarios-ativos-sistema'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('profiles').select('id, nome, email').eq('ativo', true).order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Buscar CCAs ativos
  const {
    data: ccas,
    isLoading: isLoadingCcas
  } = useQuery({
    queryKey: ['ccas-ativos'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('ccas').select('id, codigo, nome').eq('ativo', true).order('codigo');
      if (error) throw error;
      return data || [];
    }
  });
  const form = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      razaosocial: "",
      cnpj: "",
      descricaoatividade: "",
      numerocnae: "",
      grauderisco: "",
      endereco: "",
      telefone: "",
      email: "",
      contabancaria: "",
      numerocredorsienge: "",
      nomecompleto: "",
      cpf: "",
      rg: "",
      registrofuncional: "",
      telefonerepresentante: "",
      emailrepresentante: "",
      enderecorepresentante: "",
      // Condições Financeiras
      servico: "",
      valorprestacaoservico: "",
      tipocontrato: "padrao",
      ajudacusto: "",
      auxilioconveniomedico: false,
      valorauxilioconveniomedico: "",
      ajudaaluguel: "",
      valerefeicao: "",
      cafemanha: false,
      valorcafemanha: "",
      cafetarde: false,
      valorcafetarde: "",
      almoco: false,
      valoralmoco: "",
      veiculo: false,
      celular: false,
      alojamento: false,
      folgacampo: "",
      periodoferias: "",
      quantidadediasferias: "",
      ccaobra: "",
      contratofile: null
    }
  });
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };
  const formatarData = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return numbers.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    } else {
      return numbers.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3").slice(0, 10);
    }
  };
  const parseDataString = (dataStr: string): Date | undefined => {
    if (!dataStr || dataStr.length !== 10) return undefined;
    const [dia, mes, ano] = dataStr.split('/').map(Number);
    if (!dia || !mes || !ano) return undefined;
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900) return undefined;
    const data = new Date(ano, mes - 1, dia);
    if (data.getDate() !== dia || data.getMonth() !== mes - 1) return undefined;
    return data;
  };
  const formatarMoeda = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    if (!numeros) return '';
    const numero = Number(numeros) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  const extrairValorNumerico = (valorFormatado: string): string => {
    return valorFormatado.replace(/[R$\s.]/g, '').replace(',', '.');
  };
  const handleBuscarCNPJ = async () => {
    const cnpj = form.getValues("cnpj");
    const cnpjNumbers = cnpj.replace(/\D/g, "");
    if (cnpjNumbers.length !== 14) {
      toast({
        title: "Erro",
        description: "Digite um CNPJ válido com 14 dígitos",
        variant: "destructive"
      });
      return;
    }
    const dados = await buscarCNPJ(cnpjNumbers);
    if (dados) {
      console.log('🔍 Dados recebidos da API:', {
        grauderisco: dados.grauderisco,
        email: dados.email,
        numerocnae: dados.numerocnae
      });
      form.setValue("razaosocial", dados.razaosocial);
      form.setValue("descricaoatividade", dados.descricaoatividade);
      form.setValue("numerocnae", dados.numerocnae);
      form.setValue("endereco", dados.endereco);

      // Forçar atualização do Select de Grau de Risco
      if (dados.grauderisco) {
        form.setValue("grauderisco", dados.grauderisco, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        console.log('✅ Grau de risco setado:', dados.grauderisco);
      } else {
        console.log('⚠️ Grau de risco não encontrado para este CNAE');
        toast({
          title: "Atenção",
          description: "Grau de risco não encontrado para este CNAE. Selecione manualmente.",
          variant: "default"
        });
      }

      // Tratar e-mail
      if (dados.email) {
        form.setValue("email", dados.email);
      } else {
        console.log('⚠️ E-mail não disponível na Receita Federal');
      }
      toast({
        title: "Sucesso",
        description: "Dados da empresa encontrados e preenchidos!"
      });
    }
  };
  const onSubmit = async (data: CadastroFormData) => {
    const cnpjNumbers = data.cnpj.replace(/\D/g, "");
    const cpfNumbers = data.cpf.replace(/\D/g, "");
    
    // Verificar se CNPJ já existe no banco de dados
    const { data: cnpjExistente, error: cnpjError } = await supabase
      .from('prestadores_pj')
      .select('cnpj')
      .eq('cnpj', cnpjNumbers)
      .maybeSingle();
    
    if (cnpjError) {
      console.error('Erro ao verificar CNPJ:', cnpjError);
    }
    
    if (cnpjExistente) {
      toast({
        title: "Erro",
        description: "Este CNPJ já está cadastrado no sistema",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar se CPF já existe no banco de dados
    const { data: cpfExistente, error: cpfError } = await supabase
      .from('prestadores_pj')
      .select('cpf')
      .eq('cpf', cpfNumbers)
      .maybeSingle();
    
    if (cpfError) {
      console.error('Erro ao verificar CPF:', cpfError);
    }
    
    if (cpfExistente) {
      toast({
        title: "Erro",
        description: "Este CPF já está cadastrado no sistema",
        variant: "destructive"
      });
      return;
    }

    // Mapear dados do formulário para o formato do banco (camelCase)
    const prestadorData = {
      razaoSocial: data.razaosocial,
      cnpj: cnpjNumbers,
      descricaoAtividade: data.descricaoatividade || null,
      numeroCnae: data.numerocnae || null,
      grauDeRisco: data.grauderisco || null,
      endereco: data.endereco || null,
      telefone: data.telefone?.replace(/\D/g, "") || null,
      email: data.email || null,
      contaBancaria: data.contabancaria || null,
      numeroCredorSienge: data.numerocredorsienge || null,
      nomeCompleto: data.nomecompleto,
      cpf: cpfNumbers,
      dataNascimento: data.datanascimento ? data.datanascimento.toISOString() : null,
      rg: data.rg || null,
      registroFuncional: data.registrofuncional || null,
      telefoneRepresentante: data.telefonerepresentante?.replace(/\D/g, "") || null,
      emailRepresentante: data.emailrepresentante || null,
      enderecoRepresentante: data.enderecorepresentante || null,
      servico: data.servico || null,
      valorPrestacaoServico: data.valorprestacaoservico ? parseFloat(extrairValorNumerico(data.valorprestacaoservico)) : 0,
      dataInicioContrato: data.datainiciocontrato ? data.datainiciocontrato.toISOString() : null,
      tempoContrato: data.tipocontrato,
      dataInicioContratoDeterminado: data.datainiciocontratodeterminado ? data.datainiciocontratodeterminado.toISOString() : null,
      dataFimContratoDeterminado: data.datafimcontratodeterminado ? data.datafimcontratodeterminado.toISOString() : null,
      ajudaCusto: data.ajudacusto ? parseFloat(extrairValorNumerico(data.ajudacusto)) : 0,
      auxilioConvenioMedico: data.auxilioconveniomedico,
      valorAuxilioConvenioMedico: data.valorauxilioconveniomedico ? parseFloat(extrairValorNumerico(data.valorauxilioconveniomedico)) : 0,
      ajudaAluguel: data.ajudaaluguel ? parseFloat(extrairValorNumerico(data.ajudaaluguel)) : 0,
      valeRefeicao: data.valerefeicao ? parseFloat(extrairValorNumerico(data.valerefeicao)) : 0,
      cafeManha: data.cafemanha,
      valorCafeManha: data.valorcafemanha ? parseFloat(extrairValorNumerico(data.valorcafemanha)) : 0,
      cafeTarde: data.cafetarde,
      valorCafeTarde: data.valorcafetarde ? parseFloat(extrairValorNumerico(data.valorcafetarde)) : 0,
      almoco: data.almoco,
      valorAlmoco: data.valoralmoco ? parseFloat(extrairValorNumerico(data.valoralmoco)) : 0,
      veiculo: data.veiculo,
      celular: data.celular,
      alojamento: data.alojamento,
      folgaCampo: data.folgacampo || null,
      periodoFerias: data.periodoferias || null,
      quantidadeDiasFerias: data.quantidadediasferias ? parseInt(data.quantidadediasferias) : null,
      ccaId: data.ccaobra ? parseInt(data.ccaobra) : null,
      ccaCodigo: null,
      ccaNome: null,
      chavePix: null,
      contratoUrl: null,
      contratoNome: null,
      ativo: true
    };

    // Salvar no banco
    createPrestador.mutate(prestadorData, {
      onSuccess: () => {
        setCadastrosCnpj(prev => new Set(prev).add(cnpjNumbers));
        setCadastrosCpf(prev => new Set(prev).add(cpfNumbers));
        form.reset();
      }
    });
  };
  const onCancel = () => {
    form.reset();
    toast({
      title: "Cancelado",
      description: "Formulário limpo com sucesso"
    });
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(mockDemonstrativo.map(item => ({
      'Código': item.codigo,
      'Nome': item.nome,
      'Obra': item.obra,
      'Função': item.funcao,
      'Nome da Empresa': item.nomeempresa,
      'CPF': item.cpf,
      'Data de Nascimento': item.datanascimento,
      'Admissão': item.admissao,
      'Salário': item.salario,
      'Premiação Nexa Parada': item.premiacaonexa,
      'Ajuda de Custo Obra': item.ajudacustoobra,
      'Multas e Descontos': item.multasdescontos,
      'Ajuda de Aluguel': item.ajudaaluguel,
      'Desconto de Convênio': item.descontoconvenio,
      'Reembolso Convênio': item.reembolsoconvenio,
      'Valor NF': item.valornf
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Demonstrativo');
    XLSX.writeFile(workbook, 'demonstrativo-prestacao-servico.xlsx');
    toast({
      title: "Sucesso",
      description: "Arquivo Excel exportado com sucesso!"
    });
  };
  const {
    errors
  } = form.formState;
  return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cadastro de Pessoa Jurídica</h1>
          <p className="text-muted-foreground">Cadastro completo de empresas prestadoras de serviço</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Informações básicas da empresa prestadora de serviço</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField control={form.control} name="cnpj" render={({
              field
            }) => <FormItem>
                    <FormLabel className={cn(errors.cnpj && "text-destructive")}>
                      CNPJ *
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="00.000.000/0000-00" className={cn(errors.cnpj && "border-destructive")} {...field} onChange={e => {
                    const formatted = formatCNPJ(e.target.value);
                    if (formatted.length <= 18) {
                      field.onChange(formatted);
                    }
                  }} maxLength={18} />
                      </FormControl>
                      <Button type="button" variant="outline" size="icon" onClick={handleBuscarCNPJ} disabled={loadingCNPJ} title="Buscar dados da Receita Federal">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="razaosocial" render={({
              field
            }) => <FormItem>
                    <FormLabel className={cn(errors.razaosocial && "text-destructive")}>
                      Razão Social *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a razão social" className={cn(errors.razaosocial && "border-destructive")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="descricaoatividade" render={({
              field
            }) => <FormItem>
                    <FormLabel>Descrição da Atividade</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva a atividade principal da empresa" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="numerocnae" render={({
                field
              }) => <FormItem>
                      <FormLabel>Número de CNAE</FormLabel>
                      <FormControl>
                        <Input placeholder="0000-0/00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="grauderisco" render={({
                field
              }) => <FormItem>
                      <FormLabel>Grau de Risco</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o grau de risco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Baixo</SelectItem>
                          <SelectItem value="2">2 - Médio</SelectItem>
                          <SelectItem value="3">3 - Alto</SelectItem>
                          <SelectItem value="4">4 - Muito Alto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <FormField control={form.control} name="endereco" render={({
              field
            }) => <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Digite o endereço completo" className="min-h-[60px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="telefone" render={({
                field
              }) => <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} onChange={e => {
                    const formatted = formatPhone(e.target.value);
                    field.onChange(formatted);
                  }} maxLength={15} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

                <FormField control={form.control} name="email" render={({
                field
              }) => <FormItem>
                    <FormLabel>E-mail Pessoal</FormLabel>
                    <FormControl>
                      <Input placeholder="exemplo@empresa.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="numerocredorsienge" render={({
                field
              }) => <FormItem>
                      <FormLabel>Nº de Credor Sienge</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o número de credor Sienge" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="contabancaria" render={({
                field
              }) => <FormItem>
                      <FormLabel>Chave Pix</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a chave pix" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>
            </CardContent>
          </Card>

          {/* Dados do Representante Legal */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Representante Legal</CardTitle>
              <CardDescription>Informações do responsável legal pela empresa</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="nomecompleto" render={({
                field
              }) => <FormItem>
                      <FormLabel className={cn(errors.nomecompleto && "text-destructive")}>
                        Nome Completo *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" className={cn(errors.nomecompleto && "border-destructive")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="cpf" render={({
                field
              }) => <FormItem>
                      <FormLabel className={cn(errors.cpf && "text-destructive")}>
                        CPF *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" className={cn(errors.cpf && "border-destructive")} {...field} onChange={e => {
                    const formatted = formatCPF(e.target.value);
                    if (formatted.length <= 14) {
                      field.onChange(formatted);
                    }
                  }} maxLength={14} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="datanascimento" render={({
                field
              }) => <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input placeholder="DD/MM/AAAA" value={inputDataNascimento || (field.value ? format(field.value, "dd/MM/yyyy") : "")} onChange={e => {
                      const formatted = formatarData(e.target.value);
                      setInputDataNascimento(formatted);
                      const parsedDate = parseDataString(formatted);
                      if (parsedDate) {
                        field.onChange(parsedDate);
                      }
                    }} onBlur={() => {
                      if (!parseDataString(inputDataNascimento)) {
                        setInputDataNascimento("");
                      }
                    }} maxLength={10} className="pr-10" />
                        </FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" type="button">
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={date => {
                        field.onChange(date);
                        setInputDataNascimento(date ? format(date, "dd/MM/yyyy") : "");
                      }} disabled={date => date > new Date() || date < new Date("1900-01-01")} initialFocus className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="rg" render={({
                field
              }) => <FormItem>
                      <FormLabel>RG</FormLabel>
                      <FormControl>
                        <Input placeholder="00.000.000-0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="registrofuncional" render={({
                field
              }) => <FormItem>
                      <FormLabel>Registro Funcional</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o registro funcional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="telefonerepresentante" render={({
                field
              }) => <FormItem>
                      <FormLabel>Telefone do Representante</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} onChange={e => {
                    const formatted = formatPhone(e.target.value);
                    if (formatted.length <= 15) {
                      field.onChange(formatted);
                    }
                  }} maxLength={15} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="emailrepresentante" render={({
                field
              }) => <FormItem>
                      <FormLabel>Usuário do Sistema</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingUsuarios}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingUsuarios ? "Carregando usuários..." : usuarios && usuarios.length > 0 ? "Selecione um usuário" : "Nenhum usuário disponível"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {usuarios?.map(usuario => <SelectItem key={usuario.id} value={usuario.email || ''}>
                              {usuario.nome} {usuario.email ? `(${usuario.email})` : ''}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <FormField control={form.control} name="enderecorepresentante" render={({
              field
            }) => <FormItem>
                    <FormLabel>Endereço do Representante</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Digite o endereço completo do representante" className="min-h-[60px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </CardContent>
          </Card>

          {/* Condições Financeiras - Dados do Contrato */}
          <Card>
            <CardHeader>
              <CardTitle>Condições Contratuais </CardTitle>
              <CardDescription>Informações sobre valores e benefícios do contrato</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField control={form.control} name="servico" render={({
              field
            }) => <FormItem>
                    <FormLabel>Função</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o tipo de serviço prestado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="valorprestacaoservico" render={({
                field
              }) => <FormItem>
                      <FormLabel>Valor da Prestação de Serviço</FormLabel>
                      <FormControl>
                        <Input placeholder="R$ 0,00" value={field.value} onChange={e => {
                    const formatted = formatarMoeda(e.target.value);
                    field.onChange(formatted);
                  }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="datainiciocontrato" render={({
                field
              }) => <FormItem>
                      <FormLabel>Data de Início do Contrato</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input placeholder="DD/MM/AAAA" value={inputDataInicioContrato || (field.value ? format(field.value, "dd/MM/yyyy") : "")} onChange={e => {
                      const formatted = formatarData(e.target.value);
                      setInputDataInicioContrato(formatted);
                      const parsedDate = parseDataString(formatted);
                      if (parsedDate) {
                        field.onChange(parsedDate);
                      }
                    }} onBlur={() => {
                      if (!parseDataString(inputDataInicioContrato)) {
                        setInputDataInicioContrato("");
                      }
                    }} maxLength={10} className="pr-10" />
                        </FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" type="button">
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={date => {
                        field.onChange(date);
                        setInputDataInicioContrato(date ? format(date, "dd/MM/yyyy") : "");
                      }} initialFocus className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <FormField control={form.control} name="tipocontrato" render={({
              field
            }) => <FormItem>
                      <FormLabel>Tipo de Contrato</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="padrao">Padrão</SelectItem>
                          <SelectItem value="determinado">Determinado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

              {form.watch("tipocontrato") === "determinado" && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="datainiciocontratodeterminado" render={({
                field
              }) => <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="datafimcontratodeterminado" render={({
                field
              }) => <FormItem>
                        <FormLabel>Data de Término</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>} />
                </div>}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="ajudacusto" render={({
                field
              }) => <FormItem>
                      <FormLabel>Ajuda de Custo</FormLabel>
                      <FormControl>
                        <Input placeholder="R$ 0,00" value={field.value} onChange={e => {
                    const formatted = formatarMoeda(e.target.value);
                    field.onChange(formatted);
                  }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="ajudaaluguel" render={({
                field
              }) => <FormItem>
                      <FormLabel>Ajuda Aluguel</FormLabel>
                      <FormControl>
                        <Input placeholder="R$ 0,00" value={field.value} onChange={e => {
                    const formatted = formatarMoeda(e.target.value);
                    field.onChange(formatted);
                  }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="valerefeicao" render={({
                field
              }) => <FormItem>
                      <FormLabel>Vale Refeição</FormLabel>
                      <FormControl>
                        <Input placeholder="R$ 0,00" value={field.value} onChange={e => {
                    const formatted = formatarMoeda(e.target.value);
                    field.onChange(formatted);
                  }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField control={form.control} name="valorauxilioconveniomedico" render={({
                field
              }) => <FormItem>
                      <FormLabel>Auxílio Convênio Médico</FormLabel>
                      <FormControl>
                        <Input placeholder="R$ 0,00" value={field.value} onChange={e => {
                    const formatted = formatarMoeda(e.target.value);
                    field.onChange(formatted);
                  }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="valorcafemanha" render={({
                field
              }) => <FormItem>
                      <FormLabel>Café da Manhã</FormLabel>
                      <FormControl>
                        <Input placeholder="R$ 0,00" value={field.value} onChange={e => {
                    const formatted = formatarMoeda(e.target.value);
                    field.onChange(formatted);
                  }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="valorcafetarde" render={({
                field
              }) => <FormItem>
                      <FormLabel>Café da Tarde</FormLabel>
                      <FormControl>
                        <Input placeholder="R$ 0,00" value={field.value} onChange={e => {
                    const formatted = formatarMoeda(e.target.value);
                    field.onChange(formatted);
                  }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="valoralmoco" render={({
                field
              }) => <FormItem>
                      <FormLabel>Almoço</FormLabel>
                      <FormControl>
                        <Input placeholder="R$ 0,00" value={field.value} onChange={e => {
                    const formatted = formatarMoeda(e.target.value);
                    field.onChange(formatted);
                  }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField control={form.control} name="veiculo" render={({
                field
              }) => <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Veículo</FormLabel>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="celular" render={({
                field
              }) => <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Celular</FormLabel>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="alojamento" render={({
                field
              }) => <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Alojamento</FormLabel>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="folgacampo" render={({
                field
              }) => <FormItem>
                      <FormLabel>Folga de Campo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 15x15, 20x10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>
              <FormField control={form.control} name="ccaobra" render={({
              field
            }) => <FormItem>
                      <FormLabel>CCA</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingCcas}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingCcas ? "Carregando CCAs..." : ccas && ccas.length > 0 ? "Selecione um CCA" : "Nenhum CCA disponível"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ccas?.map(cca => <SelectItem key={cca.id} value={cca.id.toString()}>
                              {cca.codigo} - {cca.nome}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </Form>

      {/* Demonstrativo de Prestação de Serviço */}
      
    </div>;
}