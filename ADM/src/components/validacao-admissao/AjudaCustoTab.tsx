import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet } from "lucide-react";
import { differenceInDays, eachDayOfInterval, isWeekend } from 'date-fns';
import * as XLSX from 'xlsx';

interface AjudaCustoTabProps {
  validacaoId: string | null;
  onComplete: (ok: boolean) => void;
}

export default function AjudaCustoTab({ validacaoId, onComplete }: AjudaCustoTabProps) {
  const { toast } = useToast();
  const [haveraAjuda, setHaveraAjuda] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calculado, setCalculado] = useState({
    periodo_inicio: "",
    periodo_fim: "",
    dias: 0,
    total: 0
  });

  const form = useForm({
    defaultValues: {
      valor_dia_ajuda: 0,
      tipo_ajuda: "Proporcional",
      regra_ajuda: "fim_mes",
      regra_dias: 30,
      somar_dias_uteis: true
    }
  });

  const valorDia = form.watch("valor_dia_ajuda");
  const tipoAjuda = form.watch("tipo_ajuda");
  const regraAjuda = form.watch("regra_ajuda");
  const regraDias = form.watch("regra_dias");
  const somarDiasUteis = form.watch("somar_dias_uteis");

  // Carregar dados se já existir, ou limpar se for null
  useEffect(() => {
    if (validacaoId) {
      const carregarDados = async () => {
        const { data, error } = await supabase
          .from('validacao_admissao')
          .select('*')
          .eq('id', validacaoId)
          .single();

        if (data && !error) {
          setHaveraAjuda(data.havera_ajuda || false);
          if (data.havera_ajuda) {
            form.reset({
              valor_dia_ajuda: data.valor_dia_ajuda || 0,
              tipo_ajuda: data.tipo_ajuda || "Proporcional",
              regra_ajuda: data.regra_ajuda || "fim_mes",
              regra_dias: data.regra_dias || 30,
              somar_dias_uteis: data.somar_dias_uteis !== false
            });
          }
          onComplete(data.ajuda_ok || false);
        }
      };
      carregarDados();
    } else {
      // Se validacaoId for null, limpar tudo
      setHaveraAjuda(false);
      form.reset({
        valor_dia_ajuda: 0,
        tipo_ajuda: "Proporcional",
        regra_ajuda: "fim_mes",
        regra_dias: 30,
        somar_dias_uteis: true
      });
      setCalculado({
        periodo_inicio: "",
        periodo_fim: "",
        dias: 0,
        total: 0
      });
      onComplete(false);
    }
  }, [validacaoId]);

  // Calcular automaticamente
  useEffect(() => {
    if (!validacaoId || !haveraAjuda) return;

    const calcular = async () => {
      const { data } = await supabase
        .from('validacao_admissao')
        .select('data_admissao')
        .eq('id', validacaoId)
        .single();

      if (!data?.data_admissao) return;

      const dataInicio = new Date(data.data_admissao);
      let dataFim: Date;

      if (regraAjuda === "fim_mes") {
        dataFim = new Date(dataInicio.getFullYear(), dataInicio.getMonth() + 1, 0);
      } else {
        dataFim = new Date(dataInicio);
        dataFim.setDate(dataFim.getDate() + (regraDias || 0));
      }

      let dias: number;

      if (somarDiasUteis) {
        const todasDatas = eachDayOfInterval({ start: dataInicio, end: dataFim });
        dias = todasDatas.filter(data => !isWeekend(data)).length;
      } else {
        dias = differenceInDays(dataFim, dataInicio) + 1;
      }

      const total = (valorDia || 0) * dias;

      setCalculado({
        periodo_inicio: dataInicio.toISOString().split('T')[0],
        periodo_fim: dataFim.toISOString().split('T')[0],
        dias,
        total
      });
    };

    calcular();
  }, [validacaoId, haveraAjuda, regraAjuda, regraDias, somarDiasUteis, valorDia]);

  const gerarPlanilha = async () => {
    if (!validacaoId) {
      toast({ title: "Erro", description: "Salve os dados primeiro", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: validacao } = await supabase
        .from('validacao_admissao')
        .select('*')
        .eq('id', validacaoId)
        .single();

      if (!validacao) throw new Error("Validação não encontrada");

      const planilhaData = [{
        'Colaborador': validacao.nome_completo,
        'CPF': validacao.cpf,
        'CCA': validacao.cca_codigo,
        'Data Início': new Date(calculado.periodo_inicio).toLocaleDateString('pt-BR'),
        'Data Fim': new Date(calculado.periodo_fim).toLocaleDateString('pt-BR'),
        'Regra': tipoAjuda,
        'Dias': calculado.dias,
        'Valor/dia (R$)': (valorDia || 0).toFixed(2),
        'Total (R$)': calculado.total.toFixed(2),
        'Observações': validacao.observacoes_dp || ''
      }];

      const ws = XLSX.utils.json_to_sheet(planilhaData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Ajuda de Custo');

      // Gerar arquivo como Blob
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `Ajuda_de_Custo_${validacao.nome_completo.replace(/\s+/g, '_')}_${validacao.cca_codigo}_${new Date().toISOString().slice(0,7).replace('-', '')}.xlsx`;
      
      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('validacao-admissao')
        .upload(`ajuda-custo/${validacaoId}/${fileName}`, blob, {
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('validacao-admissao')
        .getPublicUrl(`ajuda-custo/${validacaoId}/${fileName}`);

      // Baixar localmente também (mantém funcionalidade atual)
      XLSX.writeFile(wb, fileName);

      // Salvar URL pública no banco
      await supabase
        .from('validacao_admissao')
        .update({ 
          havera_ajuda: true,
          valor_dia_ajuda: valorDia,
          tipo_ajuda: tipoAjuda,
          regra_ajuda: regraAjuda,
          regra_dias: regraDias,
          somar_dias_uteis: somarDiasUteis,
          periodo_inicio: calculado.periodo_inicio,
          periodo_fim: calculado.periodo_fim,
          dias_calculados: calculado.dias,
          total_ajuda: calculado.total,
          planilha_xlsx_url: publicUrl,
          ajuda_ok: true 
        })
        .eq('id', validacaoId);

      onComplete(true);
      toast({ title: "Sucesso ✓", description: "Planilha gerada e salva! Disponível para envio ao DP." });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const marcarSemAjuda = async () => {
    if (!validacaoId) return;

    await supabase
      .from('validacao_admissao')
      .update({ havera_ajuda: false, ajuda_ok: true })
      .eq('id', validacaoId);

    onComplete(true);
    toast({ title: "Sucesso", description: "Marcado como sem ajuda de custo" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajuda de Custo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Switch checked={haveraAjuda} onCheckedChange={setHaveraAjuda} />
            <label>Haverá ajuda de custo?</label>
          </div>

          {haveraAjuda ? (
            <Form {...form}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valor_dia_ajuda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-destructive">Valor/dia (R$) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo_ajuda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Proporcional">Proporcional</SelectItem>
                          <SelectItem value="Fixa">Fixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regra_ajuda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regra</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fim_mes">Até fim do mês</SelectItem>
                          <SelectItem value="x_dias">X dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {regraAjuda === "x_dias" && (
                  <FormField
                    control={form.control}
                    name="regra_dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de dias</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="somar_dias_uteis"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 md:col-span-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Somar só dias úteis</FormLabel>
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Valores Calculados:</h4>
                  <p>Período: {calculado.periodo_inicio && new Date(calculado.periodo_inicio).toLocaleDateString('pt-BR')} a {calculado.periodo_fim && new Date(calculado.periodo_fim).toLocaleDateString('pt-BR')}</p>
                  <p>Dias: {calculado.dias}</p>
                  <p className="font-bold">Total: R$ {calculado.total.toFixed(2)}</p>
                </div>
              </div>
            </Form>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        {haveraAjuda ? (
          <Button onClick={gerarPlanilha} disabled={loading || !valorDia}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Gerar Planilha (.xlsx)
          </Button>
        ) : (
          <Button onClick={marcarSemAjuda}>
            Confirmar: Sem Ajuda de Custo
          </Button>
        )}
      </div>
    </div>
  );
}
