import React, { useState } from 'react';
import { Mail, Send, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface EmailAutomaticoProps {
  formularioId: string;
  obraConfig: {
    supervisores: string[];
    engenheiros: string[];
    administracao: string[];
    template_d45: string;
    template_d30: string;
  };
  dadosFormulario: any;
  onEnvioEmail?: (dados: any) => void;
}

const FormularioEmailAutomatico: React.FC<EmailAutomaticoProps> = ({
  formularioId,
  obraConfig,
  dadosFormulario,
  onEnvioEmail
}) => {
  const { toast } = useToast();
  const [tipoAlerta, setTipoAlerta] = useState<'D-45' | 'D-30' | 'Imediato'>('Imediato');
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState('');
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  const calcularDataEnvio = () => {
    const dataFolga = new Date(dadosFormulario.data_inicio);
    const hoje = new Date();
    
    switch (tipoAlerta) {
      case 'D-45':
        const d45 = new Date(dataFolga);
        d45.setDate(d45.getDate() - 45);
        return d45;
      case 'D-30':
        const d30 = new Date(dataFolga);
        d30.setDate(d30.getDate() - 30);
        return d30;
      default:
        return hoje;
    }
  };

  const gerarTemplateEmail = () => {
    const dataEnvio = calcularDataEnvio();
    const template = tipoAlerta === 'D-45' ? obraConfig.template_d45 : obraConfig.template_d30;
    
    return `
      ${template}
      
      DADOS DA SOLICITAÇÃO:
      
      Colaborador: ${dadosFormulario.nome_colaborador}
      Matrícula: ${dadosFormulario.matricula}
      Obra: ${dadosFormulario.obra_projeto}
      CCA: ${dadosFormulario.cca}
      
      Período de Folga: ${dadosFormulario.data_inicio} a ${dadosFormulario.data_fim}
      Destino: ${dadosFormulario.cidade_destino}/${dadosFormulario.uf_destino}
      
      Itinerário IDA: ${dadosFormulario.ida_data} - ${dadosFormulario.ida_origem} → ${dadosFormulario.ida_destino}
      Itinerário VOLTA: ${dadosFormulario.volta_data} - ${dadosFormulario.volta_origem} → ${dadosFormulario.volta_destino}
      
      ${dadosFormulario.observacoes_rota ? `Observações: ${dadosFormulario.observacoes_rota}` : ''}
      
      Status da Compra: ${dadosFormulario.status_compra}
      ${dadosFormulario.voucher_localizador ? `Localizador: ${dadosFormulario.voucher_localizador}` : ''}
      
      ${mensagemPersonalizada}
      
      Documento PDF em anexo.
      
      ---
      Sistema automatizado - Controle de Folgas de Campo
      Protocolo: ${formularioId}
      Enviado em: ${new Date().toLocaleString('pt-BR')}
    `;
  };

  const obterDestinatarios = () => {
    return [
      ...obraConfig.supervisores,
      ...obraConfig.engenheiros,
      ...obraConfig.administracao
    ].filter(Boolean);
  };

  const enviarEmailAutomatico = async () => {
    setEnviandoEmail(true);
    
    try {
      const dadosEnvio = {
        tipo_alerta: tipoAlerta,
        destinatarios: obterDestinatarios(),
        assunto: `[${tipoAlerta}] Solicitação de Passagem - ${dadosFormulario.nome_colaborador}`,
        corpo_email: gerarTemplateEmail(),
        anexos: [`formulario_${formularioId}.pdf`],
        data_programada: calcularDataEnvio(),
        protocolo: formularioId
      };

      // Simular envio (aqui seria integração real com serviço de email)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onEnvioEmail?.(dadosEnvio);
      
      toast({
        title: "Email programado com sucesso",
        description: `Alerta ${tipoAlerta} programado para ${dadosEnvio.destinatarios.length} destinatários`,
      });
      
    } catch (error) {
      toast({
        title: "Erro ao programar email",
        description: "Falha na programação do envio automático",
        variant: "destructive"
      });
    } finally {
      setEnviandoEmail(false);
    }
  };

  const getStatusIcon = () => {
    switch (tipoAlerta) {
      case 'D-45':
        return <Clock className="h-4 w-4" />;
      case 'D-30':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Envio Automático por Email
        </CardTitle>
        <CardDescription>
          Configuração de envio seguindo o fluxo automático da obra
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Tipo de Alerta */}
        <div>
          <label className="text-sm font-medium">Tipo de Alerta</label>
          <Select value={tipoAlerta} onValueChange={(value: any) => setTipoAlerta(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Imediato">Envio Imediato</SelectItem>
              <SelectItem value="D-45">D-45 (45 dias antes da folga)</SelectItem>
              <SelectItem value="D-30">D-30 (30 dias antes da folga)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Destinatários */}
        <div>
          <label className="text-sm font-medium">Destinatários Automáticos</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {obterDestinatarios().map((destinatario, index) => (
              <Badge key={index} variant="outline">
                {destinatario}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configuração mantida conforme parametrização da obra
          </p>
        </div>

        {/* Data Programada */}
        <div className="bg-muted/50 p-3 rounded">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">
              Data Programada: {calcularDataEnvio().toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Mensagem Personalizada */}
        <div>
          <label className="text-sm font-medium">Mensagem Adicional (Opcional)</label>
          <Textarea
            value={mensagemPersonalizada}
            onChange={(e) => setMensagemPersonalizada(e.target.value)}
            placeholder="Adicione uma mensagem personalizada que será incluída no email..."
            className="min-h-20"
          />
        </div>

        {/* Preview do Template */}
        <div>
          <label className="text-sm font-medium">Preview do Email</label>
          <div className="bg-muted/50 p-3 rounded text-xs max-h-32 overflow-y-auto">
            <pre className="whitespace-pre-wrap">
              {gerarTemplateEmail().substring(0, 300)}...
            </pre>
          </div>
        </div>

        {/* Botão de Envio */}
        <Button 
          onClick={enviarEmailAutomatico} 
          disabled={enviandoEmail}
          className="w-full flex items-center gap-2"
        >
          {enviandoEmail ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              Programando Envio...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Programar Envio Automático
            </>
          )}
        </Button>

      </CardContent>
    </Card>
  );
};

export default FormularioEmailAutomatico;