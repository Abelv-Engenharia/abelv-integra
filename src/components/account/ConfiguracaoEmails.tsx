import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRelatoriosDisponiveis } from "@/hooks/useRelatoriosDisponiveis";
import EmailTestPanel from "./EmailTestPanel";
import EmailQueueStatus from "./EmailQueueStatus";

interface ConfiguracaoEmail {
  id: string;
  assunto: string;
  destinatarios: string[];
  mensagem: string;
  periodicidade: string;
  dia_semana: string | null;
  hora_envio: string;
  ativo: boolean;
  tipo_relatorio: string | null;
  periodo_dias: number | null;
  anexo_url: string | null;
  cca_id: number | null;
}

const ConfiguracaoEmailsForm = ({
  configuracao,
  onClose,
}: {
  configuracao?: ConfiguracaoEmail;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [assunto, setAssunto] = useState(configuracao?.assunto || "");
  const [destinatarios, setDestinatarios] = useState(
    configuracao?.destinatarios.join(", ") || ""
  );
  const [mensagem, setMensagem] = useState(configuracao?.mensagem || "");
  const [periodicidade, setPeriodicidade] = useState(
    configuracao?.periodicidade || "diario"
  );
  const [diaSemana, setDiaSemana] = useState(configuracao?.dia_semana || null);
  const [horaEnvio, setHoraEnvio] = useState(configuracao?.hora_envio || "08:00");
  const [ativo, setAtivo] = useState<boolean>(configuracao?.ativo ?? true);
  const [tipoRelatorio, setTipoRelatorio] = useState(configuracao?.tipo_relatorio || null);
  const [periodoDias, setPeriodoDias] = useState(configuracao?.periodo_dias || 30);
  const [anexoUrl, setAnexoUrl] = useState(configuracao?.anexo_url || null);
  const [ccaId, setCcaId] = useState<number | null>(configuracao?.cca_id || null);
  const [loading, setLoading] = useState(false);

  const { relatorios } = useRelatoriosDisponiveis();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const destinatariosArray = destinatarios
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    const dataToSubmit = {
      assunto,
      destinatarios: destinatariosArray,
      mensagem,
      periodicidade,
      dia_semana: periodicidade === "semanal" ? diaSemana : null,
      hora_envio: horaEnvio,
      ativo,
      tipo_relatorio: tipoRelatorio,
      periodo_dias: tipoRelatorio ? periodoDias : null,
      anexo_url: anexoUrl,
      cca_id: ccaId,
    };

    try {
      if (configuracao) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from("configuracoes_emails")
          .update(dataToSubmit)
          .eq("id", configuracao.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Configuração de email atualizada com sucesso!",
        });
      } else {
        // Criar nova configuração
        const { error } = await supabase
          .from("configuracoes_emails")
          .insert([dataToSubmit]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Configuração de email criada com sucesso!",
        });
      }

      // Invalidate cache and refetch
      await queryClient.invalidateQueries({ queryKey: ["configuracoes-emails"] });
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        title: "Erro",
        description:
          error.message || "Não foi possível salvar a configuração do email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="assunto">Assunto</Label>
        <Input
          type="text"
          id="assunto"
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="destinatarios">Destinatários (separados por vírgula)</Label>
        <Input
          type="email"
          id="destinatarios"
          value={destinatarios}
          onChange={(e) => setDestinatarios(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="mensagem">Mensagem</Label>
        <Textarea
          id="mensagem"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={5}
          required
        />
      </div>

      <div>
        <Label htmlFor="periodicidade">Periodicidade</Label>
        <Select value={periodicidade} onValueChange={setPeriodicidade}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a periodicidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="diario">Diário</SelectItem>
            <SelectItem value="semanal">Semanal</SelectItem>
            <SelectItem value="quinzenal">Quinzenal</SelectItem>
            <SelectItem value="mensal">Mensal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {periodicidade === "semanal" && (
        <div>
          <Label htmlFor="diaSemana">Dia da Semana</Label>
          <Select value={diaSemana || ""} onValueChange={setDiaSemana}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o dia da semana" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="domingo">Domingo</SelectItem>
              <SelectItem value="segunda">Segunda</SelectItem>
              <SelectItem value="terca">Terça</SelectItem>
              <SelectItem value="quarta">Quarta</SelectItem>
              <SelectItem value="quinta">Quinta</SelectItem>
              <SelectItem value="sexta">Sexta</SelectItem>
              <SelectItem value="sabado">Sábado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="horaEnvio">Hora de Envio</Label>
        <Input
          type="time"
          id="horaEnvio"
          value={horaEnvio}
          onChange={(e) => setHoraEnvio(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="tipoRelatorio">Tipo de Relatório (Opcional)</Label>
        <Select value={tipoRelatorio || ""} onValueChange={(value) => setTipoRelatorio(value === "" ? null : value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Nenhum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum</SelectItem>
            {relatorios.map((relatorio) => (
              <SelectItem key={relatorio.value} value={relatorio.value}>
                {relatorio.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {tipoRelatorio && (
        <div>
          <Label htmlFor="periodoDias">Período do Relatório (em dias)</Label>
          <Input
            type="number"
            id="periodoDias"
            value={periodoDias}
            onChange={(e) => setPeriodoDias(Number(e.target.value))}
            required
            min="1"
            max="365"
          />
        </div>
      )}

      <div>
        <Label htmlFor="anexoUrl">URL do Anexo (Opcional)</Label>
        <Input
          type="url"
          id="anexoUrl"
          value={anexoUrl || ""}
          onChange={(e) => setAnexoUrl(e.target.value === "" ? null : e.target.value)}
          placeholder="URL do arquivo para anexar"
        />
      </div>

      <div>
        <Label htmlFor="ccaId">CCA ID (Opcional)</Label>
        <Input
          type="number"
          id="ccaId"
          value={ccaId || ""}
          onChange={(e) => setCcaId(e.target.value === "" ? null : Number(e.target.value))}
          placeholder="ID do CCA"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="ativo">Ativo</Label>
        <Switch id="ativo" checked={ativo} onCheckedChange={setAtivo} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};

const ConfiguracaoEmails = () => {
  const [open, setOpen] = useState(false);
  const [selectedConfiguracao, setSelectedConfiguracao] = useState<
    ConfiguracaoEmail | null
  >(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: configuracoes, isLoading } = useQuery({
    queryKey: ["configuracoes-emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configuracoes_emails")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as ConfiguracaoEmail[];
    }
  });

  const handleEdit = (configuracao: ConfiguracaoEmail) => {
    setSelectedConfiguracao(configuracao);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir esta configuração de email?"
      )
    )
      return;

    try {
      const { error } = await supabase
        .from("configuracoes_emails")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configuração de email excluída com sucesso!",
      });

      // Invalidate cache and refetch
      await queryClient.invalidateQueries({ queryKey: ["configuracoes-emails"] });
    } catch (error: any) {
      console.error("Erro ao excluir configuração:", error);
      toast({
        title: "Erro",
        description:
          error.message || "Não foi possível excluir a configuração do email.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuração de E-mails</h1>
        <p className="text-muted-foreground">
          Configure envios automáticos de e-mails com relatórios personalizados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmailQueueStatus />
        <EmailTestPanel />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Configurações</CardTitle>
          <CardDescription>
            Gerencie as configurações de envio de e-mails automáticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => {
              setSelectedConfiguracao(null);
              setOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Configuração
            </Button>
          </div>

          {isLoading ? (
            <div>Carregando configurações...</div>
          ) : !configuracoes || configuracoes.length === 0 ? (
            <div>Nenhuma configuração encontrada.</div>
          ) : (
            <div className="grid gap-4">
              {configuracoes.map((configuracao) => (
                <Card key={configuracao.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {configuracao.assunto}
                    </CardTitle>
                    <Settings className="w-4 h-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        <strong>Destinatários:</strong>{" "}
                        {configuracao.destinatarios.join(", ")}
                      </p>
                      <p>
                        <strong>Periodicidade:</strong> {configuracao.periodicidade}
                        {configuracao.dia_semana &&
                          ` (${configuracao.dia_semana})`}
                      </p>
                      <p>
                        <strong>Hora de Envio:</strong> {configuracao.hora_envio}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {configuracao.ativo ? (
                          <Badge variant="outline">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(configuracao)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(configuracao.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle>
                {selectedConfiguracao ? "Editar" : "Adicionar"} Configuração de
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConfiguracaoEmailsForm
                configuracao={selectedConfiguracao || undefined}
                onClose={() => {
                  setOpen(false);
                  setSelectedConfiguracao(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConfiguracaoEmails;
