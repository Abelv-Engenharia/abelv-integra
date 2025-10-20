import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface EnvioTabProps {
  validacaoId: string | null;
  flags: {
    dados_ok: boolean;
    admissao_ok: boolean;
    ajuda_ok: boolean;
    aso_ok: boolean;
  };
}

export default function EnvioTab({ validacaoId, flags }: EnvioTabProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [destinatariosPara, setDestinatariosPara] = useState("fabricia.silva@abelv.com.br, lucas.camargo@abelv.com.br");
  const [destinatariosCC, setDestinatariosCC] = useState("");
  const [validacao, setValidacao] = useState<any>(null);

  const podeEnviar = Object.values(flags).every(f => f);

  // Carregar dados da validação
  useEffect(() => {
    if (validacaoId) {
      const carregarDados = async () => {
        const { data, error } = await supabase
          .from('validacao_admissao')
          .select('*')
          .eq('id', validacaoId)
          .single();

        if (data && !error) {
          setValidacao(data);
        }
      };
      carregarDados();
    }
  }, [validacaoId]);

  const gerarCorpoEmail = (validacao: any) => {
    const regimeSalarioTexto = validacao.regime === 'Hora'
      ? `R$ ${validacao.valor_hora?.toFixed(2)}/h (proj. mês: R$ ${validacao.salario_projetado?.toFixed(2)})`
      : `R$ ${validacao.salario_mensal?.toFixed(2)}/mês`;

    let blocoAjuda = '';
    if (validacao.havera_ajuda) {
      blocoAjuda = `
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;"/>
        <p><b>Ajuda de Custo (informativa)</b><br/>
        ${validacao.tipo_ajuda} – R$ ${validacao.valor_dia_ajuda?.toFixed(2)}/dia – 
        Período ${validacao.periodo_inicio ? format(new Date(validacao.periodo_inicio), 'dd/MM/yyyy') : ''} a ${validacao.periodo_fim ? format(new Date(validacao.periodo_fim), 'dd/MM/yyyy') : ''} – 
        ${validacao.dias_calculados} dia(s) – 
        <b>Total Previsto R$ ${validacao.total_ajuda?.toFixed(2)}</b>
        </p>
      `;
    }

    return `
      <p>Bom dia, prezados!</p>
      <p>Por gentileza, realizar a admissão abaixo para o dia <b>${validacao.data_admissao ? format(new Date(validacao.data_admissao), 'dd/MM/yyyy') : ''}</b>:</p>

      <p><b>CCA:</b><br/>${validacao.cca_nome}<br/>${validacao.cca_codigo}</p>
      <p><b>Nome:</b><br/>${validacao.nome_completo}</p>
      <p><b>Função:</b><br/>${validacao.funcao}${validacao.cbo ? ` | CBO ${validacao.cbo}` : ''}</p>
      <p><b>Horário:</b><br/>${validacao.jornada}</p>
      <p><b>Regime/Salário:</b><br/>${regimeSalarioTexto}</p>
      <p><b>Observações:</b><br/>${validacao.observacoes_dp || '—'}</p>

      ${blocoAjuda}

      <p>Documentos: anexos (ASO${validacao.havera_ajuda ? ' + planilha ajuda de custo' : ''}).</p>
      <p>Desde já, agradeço.<br/>Coordenação Administrativa – Abelv Engenharia</p>
    `;
  };

  const enviarEmail = async () => {
    if (!podeEnviar) {
      toast({ title: "Erro", description: "Complete todas as abas antes de enviar", variant: "destructive" });
      return;
    }

    if (!validacaoId || !validacao) {
      toast({ title: "Erro", description: "Dados não encontrados", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const assunto = `[${validacao.cca_codigo}] Solicitação de Admissão – ${validacao.nome_completo} – ${format(new Date(validacao.data_admissao), 'dd/MM/yyyy')}`;
      
      const anexos = [];
      
      if (validacao.aso_pdf_url) {
        anexos.push({ nome: 'ASO.pdf', url: validacao.aso_pdf_url });
      }

      // Anexar Planilha de Ajuda de Custo
      if (validacao.havera_ajuda && validacao.planilha_xlsx_url) {
        const nomeArquivoXlsx = `Ajuda_Custo_${validacao.nome_completo.replace(/\s+/g, '_')}.xlsx`;
        anexos.push({ nome: nomeArquivoXlsx, url: validacao.planilha_xlsx_url });
      }

      // Chamar edge function
      const { error: functionError } = await supabase.functions.invoke('enviar-email-admissao', {
        body: {
          para: destinatariosPara.split(',').map(e => e.trim()),
          cc: destinatariosCC ? destinatariosCC.split(',').map(e => e.trim()) : [],
          assunto: assunto,
          corpo_html: gerarCorpoEmail(validacao),
          anexos: anexos
        }
      });

      if (functionError) throw functionError;

      // Registrar log
      await supabase.from('log_envio_dp').insert({
        validacao_id: validacaoId,
        usuario_nome: 'Admin Sistema',
        destinatarios_para: destinatariosPara.split(',').map(e => e.trim()),
        destinatarios_cc: destinatariosCC ? destinatariosCC.split(',').map(e => e.trim()) : [],
        assunto: assunto,
        anexos: anexos,
        status: 'enviado'
      });

      // Marcar como enviado
      await supabase
        .from('validacao_admissao')
        .update({ 
          enviado: true,
          data_envio: new Date().toISOString(),
          usuario_envio: 'Admin Sistema',
          destinatarios_para: destinatariosPara.split(',').map(e => e.trim()),
          destinatarios_cc: destinatariosCC ? destinatariosCC.split(',').map(e => e.trim()) : []
        })
        .eq('id', validacaoId);

      toast({ title: "Sucesso", description: "E-mail enviado com sucesso para o DP!" });
    } catch (error: any) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Status das Validações</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            {flags.dados_ok ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            <span className="text-sm">Dados Colaborador</span>
          </div>
          <div className="flex items-center gap-2">
            {flags.admissao_ok ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            <span className="text-sm">Admissão</span>
          </div>
          <div className="flex items-center gap-2">
            {flags.ajuda_ok ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            <span className="text-sm">Ajuda de Custo</span>
          </div>
          <div className="flex items-center gap-2">
            {flags.aso_ok ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            <span className="text-sm">ASO</span>
          </div>
        </CardContent>
      </Card>

      {!podeEnviar && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Complete todas as abas anteriores antes de enviar
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Destinatários do E-mail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Para: *</label>
            <Input
              value={destinatariosPara}
              onChange={(e) => setDestinatariosPara(e.target.value)}
              placeholder="emails separados por vírgula"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">CC: (opcional)</label>
            <Input
              value={destinatariosCC}
              onChange={(e) => setDestinatariosCC(e.target.value)}
              placeholder="emails separados por vírgula"
            />
          </div>
        </CardContent>
      </Card>

      {validacao && podeEnviar && (
        <Card>
          <CardHeader>
            <CardTitle>Preview do E-mail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">
                Assunto: [{validacao.cca_codigo}] Solicitação de Admissão – {validacao.nome_completo} – {validacao.data_admissao ? format(new Date(validacao.data_admissao), 'dd/MM/yyyy') : ''}
              </p>
              <div 
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: gerarCorpoEmail(validacao) }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Button 
        onClick={enviarEmail} 
        disabled={!podeEnviar || loading}
        size="lg"
        className="w-full md:w-auto"
      >
        <Send className="mr-2 h-4 w-4" />
        Enviar E-mail para DP
      </Button>
    </div>
  );
}
