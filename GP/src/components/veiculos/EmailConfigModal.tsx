import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Clock, AlertTriangle } from "lucide-react";

interface EmailConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailConfigModal({ open, onOpenChange }: EmailConfigModalProps) {
  const [emailGestor, setEmailGestor] = useState("gestor@empresa.com");
  const [prazo1Aviso, setPrazo1Aviso] = useState("1");
  const [prazo2Aviso, setPrazo2Aviso] = useState("3");
  const [prazo3Aviso, setPrazo3Aviso] = useState("7");

  const handleSave = () => {
    console.log("Configurações salvas:", {
      emailGestor,
      prazos: { primeiro: prazo1Aviso, segundo: prazo2Aviso, terceiro: prazo3Aviso }
    });
    alert("Configurações de e-mail salvas com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configuração de E-mails - Checklist
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configurações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emailGestor">E-mail do Gestor Responsável</Label>
                <Input
                  id="emailGestor"
                  type="email"
                  placeholder="gestor@empresa.com"
                  value={emailGestor}
                  onChange={(e) => setEmailGestor(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Receberá alertas após 3ª tentativa sem resposta
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sistema de Cobranças */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sistema de Cobranças Automáticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prazo1">1º Aviso (dias)</Label>
                  <Input
                    id="prazo1"
                    type="number"
                    value={prazo1Aviso}
                    onChange={(e) => setPrazo1Aviso(e.target.value)}
                  />
                  <Badge variant="outline" className="mt-1">
                    Imediato
                  </Badge>
                </div>
                <div>
                  <Label htmlFor="prazo2">2º Aviso (dias)</Label>
                  <Input
                    id="prazo2"
                    type="number"
                    value={prazo2Aviso}
                    onChange={(e) => setPrazo2Aviso(e.target.value)}
                  />
                  <Badge variant="secondary" className="mt-1">
                    Lembrete
                  </Badge>
                </div>
                <div>
                  <Label htmlFor="prazo3">3º Aviso (dias)</Label>
                  <Input
                    id="prazo3"
                    type="number"
                    value={prazo3Aviso}
                    onChange={(e) => setPrazo3Aviso(e.target.value)}
                  />
                  <Badge variant="destructive" className="mt-1">
                    Urgente
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Fluxo de Cobrança */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Fluxo de Cobrança
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">1º</Badge>
                    <span>Enviado {prazo1Aviso} dia(s) após identificar como pendente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">2º</Badge>
                    <span>Enviado {prazo2Aviso} dias após o 1º aviso sem resposta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">3º</Badge>
                    <span>Último lembrete {prazo3Aviso} dias após o 2º aviso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <Badge variant="outline" className="text-orange-600">
                      Alerta Gestor
                    </Badge>
                    <span>Enviado após 3ª cobrança sem resposta</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates de E-mail */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template de E-mail</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="template">Mensagem Padrão</Label>
                <Textarea
                  id="template"
                  placeholder="Olá {condutor}, você possui um checklist pendente para o veículo {placa}. Por favor, acesse o sistema e preencha até {dataLimite}."
                  rows={4}
                  defaultValue="Olá {condutor}, você possui um checklist pendente para o veículo {placa}. Por favor, acesse o sistema e preencha até {dataLimite}."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use {"{condutor}"}, {"{placa}"}, {"{dataLimite}"} para personalizar a mensagem
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}