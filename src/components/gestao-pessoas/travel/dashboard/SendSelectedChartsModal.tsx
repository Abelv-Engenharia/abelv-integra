import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TravelDashboardData } from "@/types/gestao-pessoas/travel";
import { toast } from "sonner";
import { FileDown, Mail } from "lucide-react";

// TODO: Buscar destinatários reais do banco de dados
const mockEmailRecipients = {
  gestoresObra: [] as string[],
  administradores: [] as string[]
};

interface SendSelectedChartsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardData: TravelDashboardData;
  preSelectedCCA?: string;
}

export const SendSelectedChartsModal = ({ 
  open, 
  onOpenChange, 
  dashboardData,
  preSelectedCCA 
}: SendSelectedChartsModalProps) => {
  const [currentTab, setCurrentTab] = useState("secoes");
  
  // Seções selecionadas
  const [selectedSections, setSelectedSections] = useState({
    resumoGeral: true,
    reservasPorModal: true,
    antecedenciaMedia: true,
    cancelamentos: true,
    tempoAprovacao: true,
    detalhesAereo: false,
    detalhesHotel: false,
    detalhesRodoviario: false,
    analiseCCA: preSelectedCCA ? true : false
  });

  // CCAs selecionados
  const [selectedCCAs, setSelectedCCAs] = useState<string[]>(
    preSelectedCCA ? [preSelectedCCA] : []
  );

  // Destinatários
  const [sendToGestores, setSendToGestores] = useState(true);
  const [sendToAdmins, setSendToAdmins] = useState(false);
  const [additionalEmails, setAdditionalEmails] = useState("");

  // Personalização
  const [subject, setSubject] = useState(
    `Dashboard de Viagens - ${new Date(dashboardData.periodo.inicio).toLocaleDateString('pt-BR')} a ${new Date(dashboardData.periodo.fim).toLocaleDateString('pt-BR')}`
  );
  const [message, setMessage] = useState(
    "Segue em anexo o relatório de gestão de viagens do período selecionado."
  );

  const handleSelectAll = () => {
    setSelectedSections({
      resumoGeral: true,
      reservasPorModal: true,
      antecedenciaMedia: true,
      cancelamentos: true,
      tempoAprovacao: true,
      detalhesAereo: true,
      detalhesHotel: true,
      detalhesRodoviario: true,
      analiseCCA: true
    });
  };

  const handleClearAll = () => {
    setSelectedSections({
      resumoGeral: false,
      reservasPorModal: false,
      antecedenciaMedia: false,
      cancelamentos: false,
      tempoAprovacao: false,
      detalhesAereo: false,
      detalhesHotel: false,
      detalhesRodoviario: false,
      analiseCCA: false
    });
  };

  const handleToggleCCA = (cca: string) => {
    setSelectedCCAs(prev => 
      prev.includes(cca) 
        ? prev.filter(c => c !== cca)
        : [...prev, cca]
    );
  };

  const handleSelectAllCCAs = () => {
    setSelectedCCAs(dashboardData.analisePorCCA.map(cca => cca.cca));
  };

  const selectedSectionsCount = Object.values(selectedSections).filter(Boolean).length;

  const validateAndSend = () => {
    if (selectedSectionsCount === 0) {
      toast.error("Selecione ao menos uma seção para enviar");
      return;
    }

    if (!sendToGestores && !sendToAdmins && !additionalEmails.trim()) {
      toast.error("Selecione ao menos um destinatário");
      return;
    }

    if (selectedSections.analiseCCA && selectedCCAs.length === 0) {
      toast.error("Selecione ao menos um CCA para incluir na análise");
      return;
    }

    if (!subject.trim()) {
      toast.error("Informe um assunto para o email");
      return;
    }

    // Simular envio
    toast.success("Email enviado com sucesso!", {
      description: `Enviado para ${sendToGestores ? 'gestores' : ''} ${sendToAdmins ? 'administradores' : ''}`
    });

    onOpenChange(false);
  };

  const handleDownloadPDF = () => {
    toast.success("Download iniciado", {
      description: "O PDF será gerado em breve"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Dashboard por Email</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="secoes">Seções ({selectedSectionsCount})</TabsTrigger>
            <TabsTrigger value="ccas" disabled={!selectedSections.analiseCCA}>
              CCAs ({selectedCCAs.length})
            </TabsTrigger>
            <TabsTrigger value="destinatarios">Destinatários</TabsTrigger>
            <TabsTrigger value="personalizacao">Personalização</TabsTrigger>
          </TabsList>

          <TabsContent value="secoes" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Selecionar Tudo
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                Limpar Seleção
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="resumoGeral" 
                  checked={selectedSections.resumoGeral}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, resumoGeral: checked as boolean }))
                  }
                />
                <Label htmlFor="resumoGeral">Cards de Resumo Geral</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reservasPorModal" 
                  checked={selectedSections.reservasPorModal}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, reservasPorModal: checked as boolean }))
                  }
                />
                <Label htmlFor="reservasPorModal">Gráfico de Reservas por Modal</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="antecedenciaMedia" 
                  checked={selectedSections.antecedenciaMedia}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, antecedenciaMedia: checked as boolean }))
                  }
                />
                <Label htmlFor="antecedenciaMedia">Gráfico de Antecedência Média</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cancelamentos" 
                  checked={selectedSections.cancelamentos}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, cancelamentos: checked as boolean }))
                  }
                />
                <Label htmlFor="cancelamentos">Gráfico de Cancelamentos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tempoAprovacao" 
                  checked={selectedSections.tempoAprovacao}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, tempoAprovacao: checked as boolean }))
                  }
                />
                <Label htmlFor="tempoAprovacao">Tabela de Tempo de Aprovação</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="detalhesAereo" 
                  checked={selectedSections.detalhesAereo}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, detalhesAereo: checked as boolean }))
                  }
                />
                <Label htmlFor="detalhesAereo">Detalhes Aéreo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="detalhesHotel" 
                  checked={selectedSections.detalhesHotel}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, detalhesHotel: checked as boolean }))
                  }
                />
                <Label htmlFor="detalhesHotel">Detalhes Hotel</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="detalhesRodoviario" 
                  checked={selectedSections.detalhesRodoviario}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, detalhesRodoviario: checked as boolean }))
                  }
                />
                <Label htmlFor="detalhesRodoviario">Detalhes Rodoviário</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="analiseCCA" 
                  checked={selectedSections.analiseCCA}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, analiseCCA: checked as boolean }))
                  }
                />
                <Label htmlFor="analiseCCA">Análise por CCA</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ccas" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={handleSelectAllCCAs}>
                Selecionar Todos os CCAs
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedCCAs([])}>
                Limpar Seleção
              </Button>
            </div>

            <div className="space-y-3">
              {dashboardData.analisePorCCA.map(cca => (
                <div key={cca.cca} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cca-${cca.cca}`}
                    checked={selectedCCAs.includes(cca.cca)}
                    onCheckedChange={() => handleToggleCCA(cca.cca)}
                  />
                  <Label htmlFor={`cca-${cca.cca}`}>
                    {cca.cca} - {cca.descricao}
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="destinatarios" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gestores" 
                  checked={sendToGestores}
                  onCheckedChange={(checked) => setSendToGestores(checked as boolean)}
                />
                <Label htmlFor="gestores">Gestores da Obra</Label>
              </div>
              {sendToGestores && (
                <div className="ml-6 text-sm text-muted-foreground">
                  {mockEmailRecipients.gestoresObra.map(email => (
                    <div key={email}>• {email}</div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="admins" 
                  checked={sendToAdmins}
                  onCheckedChange={(checked) => setSendToAdmins(checked as boolean)}
                />
                <Label htmlFor="admins">Administradores</Label>
              </div>
              {sendToAdmins && (
                <div className="ml-6 text-sm text-muted-foreground">
                  {mockEmailRecipients.administradores.map(email => (
                    <div key={email}>• {email}</div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="additional">Emails Adicionais (separados por vírgula ou quebra de linha)</Label>
                <Textarea 
                  id="additional"
                  placeholder="email1@empresa.com, email2@empresa.com"
                  value={additionalEmails}
                  onChange={(e) => setAdditionalEmails(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personalizacao" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto do Email</Label>
                <Input 
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Assunto do email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem Personalizada</Label>
                <Textarea 
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Digite uma mensagem personalizada"
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Preview do Email</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Para:</strong> {
                    [
                      sendToGestores ? "Gestores da Obra" : "",
                      sendToAdmins ? "Administradores" : "",
                      additionalEmails ? "Emails Adicionais" : ""
                    ].filter(Boolean).join(", ")
                  }</p>
                  <p><strong>Assunto:</strong> {subject}</p>
                  <p><strong>Seções incluídas:</strong> {selectedSectionsCount}</p>
                  {selectedSections.analiseCCA && (
                    <p><strong>CCAs incluídos:</strong> {selectedCCAs.length}</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
          <Button onClick={validateAndSend}>
            <Mail className="mr-2 h-4 w-4" />
            Enviar Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
