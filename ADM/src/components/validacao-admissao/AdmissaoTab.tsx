import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

const admissaoSchema = z.object({
  cca_codigo: z.string().min(1, "CCA obrigatório"),
  cca_nome: z.string().min(1, "Nome da obra obrigatório"),
  funcao: z.string().min(1, "Função obrigatória"),
  cbo: z.string().optional(),
  regime: z.enum(["Hora", "Mês"]),
  valor_hora: z.number().optional(),
  salario_mensal: z.number().optional(),
  salario_projetado: z.number().optional(),
  jornada: z.string().min(1, "Jornada obrigatória"),
  data_admissao: z.string().min(1, "Data de admissão obrigatória"),
  observacoes_dp: z.string().optional(),
});

type AdmissaoFormData = z.infer<typeof admissaoSchema>;

interface AdmissaoTabProps {
  validacaoId: string | null;
  onComplete: (ok: boolean) => void;
}

export default function AdmissaoTab({ validacaoId, onComplete }: AdmissaoTabProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [ccas, setCcas] = useState<{ codigo: string; nome: string }[]>([]);
  const [funcoes, setFuncoes] = useState<{ nome: string; cbo: string }[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);

  const form = useForm<AdmissaoFormData>({
    resolver: zodResolver(admissaoSchema),
    defaultValues: {
      regime: "Mês",
      jornada: "08:00-17:00"
    }
  });

  const regime = form.watch("regime");
  const valorHora = form.watch("valor_hora");

  // Buscar CCAs e Funções do Nydhus
  useEffect(() => {
    const carregarDadosNydhus = async () => {
      setCarregandoDados(true);
      
      const [ccasData, funcoesData] = await Promise.all([
        supabase.from('nydhus_ccas').select('codigo, nome').eq('ativo', true).order('codigo'),
        supabase.from('nydhus_funcoes').select('nome, cbo').eq('ativo', true).order('nome')
      ]);
      
      if (ccasData.data) setCcas(ccasData.data);
      if (funcoesData.data) setFuncoes(funcoesData.data);
      
      setCarregandoDados(false);
    };
    
    carregarDadosNydhus();
  }, []);

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
          form.reset({
            cca_codigo: data.cca_codigo || "",
            cca_nome: data.cca_nome || "",
            funcao: data.funcao || "",
            cbo: data.cbo || "",
            regime: (data.regime as "Hora" | "Mês") || "Mês",
            valor_hora: data.valor_hora || undefined,
            salario_mensal: data.salario_mensal || undefined,
            salario_projetado: data.salario_projetado || undefined,
            jornada: data.jornada || "08:00-17:00",
            data_admissao: data.data_admissao || "",
            observacoes_dp: data.observacoes_dp || "",
          });
          onComplete(data.admissao_ok || false);
        }
      };
      carregarDados();
    } else {
      // Se validacaoId for null, limpar o formulário
      form.reset({
        regime: "Mês",
        jornada: "08:00-17:00"
      });
      onComplete(false);
    }
  }, [validacaoId]);

  // Calcular salário projetado automaticamente
  useEffect(() => {
    if (regime === "Hora" && valorHora) {
      const projetado = valorHora * 220;
      form.setValue("salario_projetado", projetado);
    }
  }, [regime, valorHora, form]);

  const validarDados = async (formData: AdmissaoFormData) => {
    if (!validacaoId) {
      toast({ title: "Erro", description: "Salve os dados do colaborador primeiro (Aba 1)", variant: "destructive" });
      return;
    }

    // Validar data de admissão
    if (new Date(formData.data_admissao) < new Date()) {
      toast({ title: "Aviso", description: "Data de admissão é passada" });
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('validacao_admissao')
        .update({
          ...formData,
          admissao_ok: true
        })
        .eq('id', validacaoId);

      if (error) throw error;

      onComplete(true);
      toast({ title: "Sucesso ✓", description: "Dados de admissão validados! Prossiga para as próximas abas." });
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(validarDados)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados de Admissão</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cca_codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Código CCA *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      const ccaSelecionado = ccas.find(c => c.codigo === value);
                      if (ccaSelecionado) {
                        form.setValue("cca_nome", ccaSelecionado.nome);
                      }
                    }} 
                    value={field.value}
                    disabled={carregandoDados}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={carregandoDados ? "Carregando CCAs..." : "Selecione o CCA"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ccas.map((cca) => (
                        <SelectItem key={cca.codigo} value={cca.codigo}>
                          {cca.codigo} - {cca.nome}
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
              name="cca_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Nome da Obra *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled placeholder="Auto-preenchido ao selecionar CCA" />
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
                  <FormLabel className="text-destructive">Função *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      const funcaoSelecionada = funcoes.find(f => f.nome === value);
                      if (funcaoSelecionada) {
                        form.setValue("cbo", funcaoSelecionada.cbo);
                      }
                    }} 
                    value={field.value}
                    disabled={carregandoDados}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={carregandoDados ? "Carregando funções..." : "Selecione a função"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {funcoes.map((funcao) => (
                        <SelectItem key={funcao.nome} value={funcao.nome}>
                          {funcao.nome}
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
              name="cbo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CBO (Auto)</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regime"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-destructive">Regime *</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Hora" id="hora" />
                        <label htmlFor="hora">Hora</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Mês" id="mes" />
                        <label htmlFor="mes">Mês</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {regime === "Hora" ? (
              <>
                <FormField
                  control={form.control}
                  name="valor_hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-destructive">Valor/hora (R$) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salario_projetado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salário Projetado (220h)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          value={field.value ? `R$ ${field.value.toFixed(2)}` : ""}
                          disabled 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <FormField
                control={form.control}
                name="salario_mensal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-destructive">Salário Mensal (R$) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="jornada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Jornada *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 08:00-17:00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_admissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-destructive">Data de Admissão *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes_dp"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
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

        <Button type="submit" disabled={loading || carregandoDados}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {loading ? "Validando..." : "Validar Dados"}
        </Button>
      </form>
    </Form>
  );
}
