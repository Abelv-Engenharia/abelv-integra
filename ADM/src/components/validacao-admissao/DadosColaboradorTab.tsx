import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, CheckCircle2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ESTADOS_BR = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const NACIONALIDADES = [
  "Brasileira",
  "Angolana",
  "Argentina",
  "Boliviana",
  "Cabo-verdiana",
  "Chilena",
  "Colombiana",
  "Equatoriana",
  "Guianense",
  "Haitiana",
  "Paraguaia",
  "Peruana",
  "Portuguesa",
  "Senegalesa",
  "Uruguaia",
  "Venezuelana"
];

const GRAUS_INSTRUCAO = [
  "Analfabeto",
  "Fundamental Incompleto",
  "Fundamental Completo",
  "Médio Incompleto",
  "Médio Completo",
  "Superior Incompleto",
  "Superior Completo",
  "Pós-graduação",
  "Mestrado",
  "Doutorado"
];

const APOSENTADO_OPTIONS = ["Sim", "Não"];

const CIDADES_POR_ESTADO: Record<string, string[]> = {
  "AC": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó"],
  "AL": ["Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo", "União dos Palmares"],
  "AP": ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão"],
  "AM": ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari"],
  "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Ilhéus"],
  "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"],
  "DF": ["Brasília"],
  "ES": ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares"],
  "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia"],
  "MA": ["São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias"],
  "MT": ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"],
  "MS": ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"],
  "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  "PA": ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal"],
  "PB": ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux"],
  "PR": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  "PE": ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina"],
  "PI": ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano"],
  "RJ": ["Rio de Janeiro", "Niterói", "Campos dos Goytacazes", "Petrópolis", "Duque de Caxias"],
  "RN": ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba"],
  "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
  "RO": ["Porto Velho", "Ji-Paraná", "Ariquemes", "Cacoal", "Vilhena"],
  "RR": ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre", "Mucajaí"],
  "SC": ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma"],
  "SP": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "São José dos Campos", "Guarulhos", "Osasco"],
  "SE": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "Estância"],
  "TO": ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins"]
};

const dadosSchema = z.object({
  // Dados Pessoais
  cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
  nome_completo: z.string().min(3, "Nome obrigatório"),
  rg: z.string().optional(),
  data_nascimento: z.string().optional(),
  sexo: z.enum(["M", "F", "Outro"]).optional(),
  estado_civil: z.enum(["Solteiro", "Casado", "Divorciado", "Viúvo", "União Estável"]),
  raca: z.string().optional().or(z.literal("")).nullable(),
  nacionalidade: z.string().min(1, "Nacionalidade obrigatória"),
  pais: z.string().optional(),
  naturalidade_cidade: z.string().optional(),
  naturalidade_uf: z.string().optional(),
  estado_nascimento: z.string().optional(),
  grau_instrucao: z.string().optional(),
  curso: z.string().optional(),
  nome_mae: z.string().optional(),
  nome_pai: z.string().optional(),
  aposentado: z.string().optional(),

  // Endereço
  cep: z.string().length(8, "CEP deve ter 8 dígitos"),
  logradouro: z.string().min(1, "Logradouro obrigatório"),
  numero: z.string().min(1, "Número obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro obrigatório"),
  cidade: z.string().min(1, "Cidade obrigatória"),
  uf: z.string().length(2, "UF deve ter 2 caracteres"),

  // Necessidades Especiais
  nec_fisica: z.boolean().optional().nullable(),
  nec_visual: z.boolean().optional().nullable(),
  nec_auditiva: z.boolean().optional().nullable(),
  nec_mental: z.boolean().optional().nullable(),
  nec_intelectual: z.boolean().optional().nullable(),
  nec_reabilitado: z.boolean().optional().nullable(),
  nec_observacoes: z.string().optional().or(z.literal("")).nullable(),

  // Contatos
  telefone_residencial: z.string().optional(),
  telefone_comercial: z.string().optional().or(z.literal("")).nullable(),
  celular: z.string().min(10, "Celular obrigatório"),

  // RG
  rg_orgao_emissor: z.string().optional(),

  // CTPS
  ctps: z.string().optional().or(z.literal("")).nullable(),
  ctps_serie: z.string().optional(),
  ctps_estado_emissor: z.string().optional(),
  ctps_data_emissao: z.string().optional().or(z.literal("")).nullable(),

  // PIS
  pis: z.string().optional(),
  pis_data_emissao: z.string().optional(),

  // Título de Eleitor
  titulo_eleitor: z.string().optional(),
  titulo_zona: z.string().optional(),
  titulo_secao: z.string().optional(),
  titulo_cidade: z.string().optional(),
  titulo_estado: z.string().optional(),

  // CNH
  cnh: z.string().optional(),

  // Outros Documentos
  reservista: z.string().optional(),
  sus: z.string().optional(),
}).refine((data) => {
  if (data.naturalidade_uf && !data.naturalidade_cidade) {
    return false;
  }
  return true;
}, {
  message: "Cidade obrigatória quando UF estiver preenchida",
  path: ["naturalidade_cidade"],
});

type DadosFormData = z.infer<typeof dadosSchema>;

interface DadosColaboradorTabProps {
  validacaoId: string | null;
  setValidacaoId: (id: string) => void;
  onComplete: (ok: boolean) => void;
  onLimparTudo?: () => void;
}

export default function DadosColaboradorTab({ validacaoId, setValidacaoId, onComplete, onLimparTudo }: DadosColaboradorTabProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [buscandoCPF, setBuscandoCPF] = useState(false);
  const [cpfEncontrado, setCpfEncontrado] = useState(false);

  const form = useForm<DadosFormData>({
    resolver: zodResolver(dadosSchema),
    defaultValues: {
      cpf: "",
      nome_completo: "",
      estado_civil: "Solteiro",
      nacionalidade: "",
      pais: "Brasil",
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      celular: "",
      nec_fisica: false,
      nec_visual: false,
      nec_auditiva: false,
      nec_mental: false,
      nec_intelectual: false,
      nec_reabilitado: false,
    }
  });

  const [cidadesDisponiveis, setCidadesDisponiveis] = useState<string[]>([]);
  const naturalidadeUf = form.watch("naturalidade_uf");

  // Atualizar cidades disponíveis quando UF mudar
  useEffect(() => {
    if (naturalidadeUf) {
      setCidadesDisponiveis(CIDADES_POR_ESTADO[naturalidadeUf] || []);
      // Limpar cidade quando UF mudar
      form.setValue("naturalidade_cidade", "");
    } else {
      setCidadesDisponiveis([]);
    }
  }, [naturalidadeUf]);

  // Carregar dados se já existir validacaoId, ou limpar se for null
  useEffect(() => {
    if (validacaoId) {
      const carregarDados = async () => {
        const { data, error } = await supabase
          .from('validacao_admissao')
          .select('*')
          .eq('id', validacaoId)
          .single();

        if (data && !error) {
          form.reset(data as any);
          setCpfEncontrado(true);
          onComplete(data.dados_ok || false);
        }
      };
      carregarDados();
    } else {
      // Se validacaoId for null, limpar completamente
      form.reset({
        cpf: "",
        nome_completo: "",
        estado_civil: "Solteiro",
        nacionalidade: "",
        pais: "Brasil",
        cep: "",
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        uf: "",
        celular: "",
        nec_fisica: false,
        nec_visual: false,
        nec_auditiva: false,
        nec_mental: false,
        nec_intelectual: false,
        nec_reabilitado: false,
      });
      setCpfEncontrado(false);
      onComplete(false);
    }
  }, [validacaoId]);

  // Monitorar campo CPF para busca automática
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'cpf' && value.cpf?.length === 11) {
        buscarDadosPorCPF(value.cpf);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Buscar dados por CPF
  const buscarDadosPorCPF = async (cpf: string) => {
    if (cpf.length !== 11) {
      setCpfEncontrado(false);
      return;
    }
    
    setBuscandoCPF(true);
    try {
      const { data, error } = await supabase
        .from('validacao_admissao')
        .select('*')
        .eq('cpf', cpf)
        .maybeSingle();
      
      if (data && !error) {
        // Auto-preencher todos os campos do formulário
        form.reset(data as any);
        
        // Atualizar validacaoId
        if (data.id) {
          setValidacaoId(data.id);
        }
        
        setCpfEncontrado(true);
        
        // Mostrar toast informativo
        toast({ 
          title: "Dados encontrados!", 
          description: `Colaborador ${data.nome_completo || 'cadastrado'} encontrado no sistema`,
          duration: 5000
        });
      } else {
        setCpfEncontrado(false);
      }
    } catch (error) {
      console.error('Erro ao buscar CPF:', error);
      setCpfEncontrado(false);
    } finally {
      setBuscandoCPF(false);
    }
  };

  const buscarCEP = async (cep: string) => {
    if (cep.length !== 8) return;
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        form.setValue('logradouro', data.logradouro || '');
        form.setValue('bairro', data.bairro || '');
        form.setValue('cidade', data.localidade || '');
        form.setValue('uf', data.uf || '');
        toast({ title: "CEP encontrado", description: "Endereço preenchido automaticamente" });
      } else {
        toast({ title: "CEP não encontrado", variant: "destructive" });
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const limparCampos = () => {
    form.reset({
      cpf: "",
      nome_completo: "",
      estado_civil: "Solteiro",
      nacionalidade: "",
      pais: "Brasil",
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      celular: "",
      nec_fisica: false,
      nec_visual: false,
      nec_auditiva: false,
      nec_mental: false,
      nec_intelectual: false,
      nec_reabilitado: false,
    });
    setCpfEncontrado(false);
    
    // Chama função do pai que limpa TODAS as abas
    if (onLimparTudo) {
      onLimparTudo();
    }
  };

  const salvarEEnviarNydhus = async (formData: DadosFormData) => {
    // Validar data de nascimento
    if (formData.data_nascimento && new Date(formData.data_nascimento) > new Date()) {
      toast({ title: "Data de nascimento inválida", description: "Não pode ser futura", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const upsertData: any = {
        ...formData,
        dados_ok: true,
        nydhus_sync_at: new Date().toISOString()
      };
      
      if (validacaoId) {
        upsertData.id = validacaoId;
      }

      const { data, error } = await supabase
        .from('validacao_admissao')
        .upsert(upsertData, { onConflict: 'cpf' })
        .select()
        .single();

      if (error) throw error;

      setValidacaoId(data.id);
      onComplete(true);
      toast({ title: "Sucesso", description: "Dados salvos e enviados ao Nydhus!" });
    } catch (error: any) {
      if (error.message?.includes('duplicate key')) {
        toast({ title: "CPF já cadastrado", variant: "destructive" });
      } else {
        toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(salvarEEnviarNydhus)} className="space-y-6">
        {/* Card 1: DADOS PESSOAIS */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">CPF *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        maxLength={11} 
                        placeholder="Somente números"
                        onChange={(e) => {
                          const valor = e.target.value.replace(/\D/g, '');
                          field.onChange(valor);
                        }}
                      />
                      {buscandoCPF && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      )}
                      {!buscandoCPF && cpfEncontrado && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <Badge variant="default" className="gap-1 text-xs">
                            <CheckCircle2 className="h-3 w-3" />
                            Encontrado
                          </Badge>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome_completo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Nome Completo *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_nascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado_civil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Estado Civil *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Solteiro">Solteiro</SelectItem>
                      <SelectItem value="Casado">Casado</SelectItem>
                      <SelectItem value="Divorciado">Divorciado</SelectItem>
                      <SelectItem value="Viúvo">Viúvo</SelectItem>
                      <SelectItem value="União Estável">União Estável</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="raca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raça</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nacionalidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Nacionalidade *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NACIONALIDADES.map((nac) => (
                        <SelectItem key={nac} value={nac}>{nac}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="naturalidade_uf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naturalidade (UF)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ESTADOS_BR.map((estado) => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="naturalidade_cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naturalidade (Cidade)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!naturalidadeUf}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={naturalidadeUf ? "Selecione a cidade" : "Selecione UF primeiro"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cidadesDisponiveis.map((cidade) => (
                        <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado_nascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de Nascimento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ESTADOS_BR.map((estado) => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grau_instrucao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grau de Instrução</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GRAUS_INSTRUCAO.map((grau) => (
                        <SelectItem key={grau} value={grau}>{grau}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="curso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome_mae"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Mãe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome_pai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Pai</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aposentado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aposentado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {APOSENTADO_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Card 2: ENDEREÇO */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">Endereço</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">CEP *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      maxLength={8} 
                      onBlur={(e) => buscarCEP(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logradouro"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-destructive">Logradouro *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Número *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Bairro *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Cidade *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">UF *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ESTADOS_BR.map((estado) => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Card 3: NECESSIDADES ESPECIAIS */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">Necessidades Especiais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="nec_fisica"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Física</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nec_visual"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Visual</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nec_auditiva"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Auditiva</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nec_mental"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Mental</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nec_intelectual"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Intelectual</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nec_reabilitado"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Reabilitado</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="nec_observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Card 4: CONTATOS */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">Contatos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <FormField
              control={form.control}
              name="telefone_residencial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone Residencial</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone_comercial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone Comercial</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="celular"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Celular *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Card 5: RG */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">RG</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <FormField
              control={form.control}
              name="rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do RG</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rg_orgao_emissor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Órgão Emissor</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: SSP/SP" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rg_orgao_emissor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Órgão Emissor</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: SSP" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
        </Card>

        {/* Card 6: CTPS */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">CTPS</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
            <FormField
              control={form.control}
              name="ctps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número CTPS</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ctps_serie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Série</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ctps_estado_emissor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Emissor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ESTADOS_BR.map((estado) => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ctps_data_emissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Emissão</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Card 7: PIS */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">PIS</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <FormField
              control={form.control}
              name="pis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número PIS</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pis_data_emissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Emissão</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Card 8: TÍTULO DE ELEITOR */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">Título de Eleitor</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <FormField
              control={form.control}
              name="titulo_eleitor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Título</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titulo_zona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zona</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titulo_secao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seção</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titulo_cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titulo_estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ESTADOS_BR.map((estado) => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Card 9: CNH */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">CNH</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <FormField
              control={form.control}
              name="cnh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número CNH</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
        </Card>

        {/* Card 10: OUTROS DOCUMENTOS */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">Outros Documentos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <FormField
              control={form.control}
              name="reservista"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificado de Reservista</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cartão SUS</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={limparCampos}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpar campos
          </Button>
          
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Salvar & Enviar ao Nydhus
          </Button>
        </div>
      </form>
    </Form>
  );
}
