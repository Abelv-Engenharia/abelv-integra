import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUpload } from "@/components/ui/file-upload";
import { EmailInput } from "@/components/ui/email-input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Edit3 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ConfiguracaoEmail {
  id?: string;
  assunto: string;
  destinatarios: string[];
  mensagem: string;
  anexo_url?: string;
  relatorio_id?: string;
  periodicidade: 'diario' | 'semanal' | 'quinzenal' | 'mensal';
  dia_semana?: string;
  hora_envio: string;
  ativo: boolean;
}

const ConfiguracaoEmails = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoEmail[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ConfiguracaoEmail | null>(null);
  const [deleteConfig, setDeleteConfig] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const initialFormData: ConfiguracaoEmail = {
    assunto: "",
    destinatarios: [],
    mensagem: "",
    anexo_url: "",
    relatorio_id: "",
    periodicidade: "diario",
    dia_semana: "",
    hora_envio: "09:00",
    ativo: true,
  };

  const [formData, setFormData] = useState<ConfiguracaoEmail>(initialFormData);

  const diasSemana = [
    { value: "domingo", label: "Domingo" },
    { value: "segunda", label: "Segunda-feira" },
    { value: "terca", label: "Terça-feira" },
    { value: "quarta", label: "Quarta-feira" },
    { value: "quinta", label: "Quinta-feira" },
    { value: "sexta", label: "Sexta-feira" },
    { value: "sabado", label: "Sábado" },
  ];

  const loadConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from("configuracoes_emails")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      setConfiguracoes((data || []) as ConfiguracaoEmail[]);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações de e-mail",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadConfiguracoes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        dia_semana: formData.periodicidade === "semanal" ? formData.dia_semana : null,
      };

      if (editingConfig?.id) {
        const { error } = await supabase
          .from("configuracoes_emails")
          .update(dataToSave)
          .eq("id", editingConfig.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Configuração atualizada com sucesso",
        });
      } else {
        const { error } = await supabase
          .from("configuracoes_emails")
          .insert([dataToSave]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Configuração criada com sucesso",
        });
      }

      setFormData(initialFormData);
      setShowForm(false);
      setEditingConfig(null);
      loadConfiguracoes();
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: ConfiguracaoEmail) => {
    setEditingConfig(config);
    setFormData(config);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("configuracoes_emails")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configuração excluída com sucesso",
      });

      loadConfiguracoes();
    } catch (error) {
      console.error("Erro ao excluir configuração:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a configuração",
        variant: "destructive",
      });
    }
    setDeleteConfig(null);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setShowForm(false);
    setEditingConfig(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configuração de E-mails</h2>
          <p className="text-muted-foreground">
            Configure o envio automático de e-mails com base em relatórios
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Configuração
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingConfig ? "Editar Configuração" : "Nova Configuração"}
            </CardTitle>
            <CardDescription>
              Configure os detalhes do envio automático de e-mails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto do E-mail *</Label>
                  <Input
                    id="assunto"
                    value={formData.assunto}
                    onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora_envio">Horário de Envio *</Label>
                  <Input
                    id="hora_envio"
                    type="time"
                    value={formData.hora_envio}
                    onChange={(e) => setFormData({ ...formData, hora_envio: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Destinatários *</Label>
                <EmailInput
                  emails={formData.destinatarios}
                  onEmailsChange={(emails) => setFormData({ ...formData, destinatarios: emails })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagem">Mensagem do E-mail *</Label>
                <Textarea
                  id="mensagem"
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Anexo (opcional)</Label>
                <FileUpload
                  currentFile={formData.anexo_url}
                  onFileUpload={(url) => setFormData({ ...formData, anexo_url: url })}
                  onRemove={() => setFormData({ ...formData, anexo_url: "" })}
                />
              </div>

              <div className="space-y-3">
                <Label>Periodicidade *</Label>
                <RadioGroup
                  value={formData.periodicidade}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    periodicidade: value as ConfiguracaoEmail['periodicidade'],
                    dia_semana: value === 'semanal' ? formData.dia_semana : ''
                  })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="diario" id="diario" />
                    <Label htmlFor="diario">Diário</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="semanal" id="semanal" />
                    <Label htmlFor="semanal">Semanal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quinzenal" id="quinzenal" />
                    <Label htmlFor="quinzenal">Quinzenal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mensal" id="mensal" />
                    <Label htmlFor="mensal">Mensal</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.periodicidade === "semanal" && (
                <div className="space-y-2">
                  <Label htmlFor="dia_semana">Dia da Semana</Label>
                  <Select
                    value={formData.dia_semana}
                    onValueChange={(value) => setFormData({ ...formData, dia_semana: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {diasSemana.map((dia) => (
                        <SelectItem key={dia.value} value={dia.value}>
                          {dia.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
                <Label htmlFor="ativo">Ativo</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : editingConfig ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {configuracoes.map((config) => (
          <Card key={config.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{config.assunto}</h3>
                    <Switch checked={config.ativo} disabled />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {config.destinatarios.join(", ")}
                  </p>
                  <p className="text-sm">
                    <strong>Periodicidade:</strong> {config.periodicidade}
                    {config.dia_semana && ` (${config.dia_semana})`}
                  </p>
                  <p className="text-sm">
                    <strong>Horário:</strong> {config.hora_envio}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(config)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfig(config.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteConfig} onOpenChange={() => setDeleteConfig(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta configuração de e-mail? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfig && handleDelete(deleteConfig)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConfiguracaoEmails;