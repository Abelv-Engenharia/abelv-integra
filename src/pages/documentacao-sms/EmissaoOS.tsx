import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function EmissaoOS() {
  const { toast } = useToast();
  const [dataEmissao, setDataEmissao] = useState<Date>();
  const [formData, setFormData] = useState({
    numero: "",
    solicitante: "",
    setor: "",
    descricao: "",
    prioridade: "",
    responsavel: "",
    materiais: "",
    ferramentas: "",
    procedimentos: "",
    observacoes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ordem de serviço gerada",
      description: "O documento foi gerado e salvo no histórico"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Emissão de ordem de serviço</h1>
          <p className="text-muted-foreground">Ordem de serviço de segurança</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Dados da ordem de serviço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número da OS</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    placeholder="Ex: OS-001/2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data de emissão</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataEmissao ? format(dataEmissao, "PPP", { locale: ptBR }) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataEmissao}
                        onSelect={setDataEmissao}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="solicitante">Solicitante</Label>
                  <Input
                    id="solicitante"
                    value={formData.solicitante}
                    onChange={(e) => setFormData({ ...formData, solicitante: e.target.value })}
                    placeholder="Nome do solicitante"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setor">Setor</Label>
                  <Input
                    id="setor"
                    value={formData.setor}
                    onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                    placeholder="Setor solicitante"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do serviço</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o serviço a ser executado"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Input
                    id="prioridade"
                    value={formData.prioridade}
                    onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                    placeholder="Baixa / Média / Alta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    placeholder="Responsável pela execução"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="materiais">Materiais necessários</Label>
                <Textarea
                  id="materiais"
                  value={formData.materiais}
                  onChange={(e) => setFormData({ ...formData, materiais: e.target.value })}
                  placeholder="Liste os materiais necessários"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ferramentas">Ferramentas necessárias</Label>
                <Textarea
                  id="ferramentas"
                  value={formData.ferramentas}
                  onChange={(e) => setFormData({ ...formData, ferramentas: e.target.value })}
                  placeholder="Liste as ferramentas necessárias"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedimentos">Procedimentos de segurança</Label>
                <Textarea
                  id="procedimentos"
                  value={formData.procedimentos}
                  onChange={(e) => setFormData({ ...formData, procedimentos: e.target.value })}
                  placeholder="Descreva os procedimentos de segurança"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais"
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Gerar ordem de serviço
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview do documento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-muted/20 min-h-[600px]">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">ORDEM DE SERVIÇO</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  OS Nº {formData.numero || "-"}
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <strong>Data de emissão:</strong> {dataEmissao ? format(dataEmissao, "dd/MM/yyyy") : "-"}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Solicitante:</strong> {formData.solicitante || "-"}
                  </div>
                  <div>
                    <strong>Setor:</strong> {formData.setor || "-"}
                  </div>
                </div>
                <div>
                  <strong>Descrição do serviço:</strong>
                  <p className="mt-1 whitespace-pre-line">{formData.descricao || "-"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Prioridade:</strong> {formData.prioridade || "-"}
                  </div>
                  <div>
                    <strong>Responsável:</strong> {formData.responsavel || "-"}
                  </div>
                </div>
                <div>
                  <strong>Materiais necessários:</strong>
                  <p className="mt-1 whitespace-pre-line">{formData.materiais || "-"}</p>
                </div>
                <div>
                  <strong>Ferramentas necessárias:</strong>
                  <p className="mt-1 whitespace-pre-line">{formData.ferramentas || "-"}</p>
                </div>
                <div>
                  <strong>Procedimentos de segurança:</strong>
                  <p className="mt-1 whitespace-pre-line">{formData.procedimentos || "-"}</p>
                </div>
                {formData.observacoes && (
                  <div>
                    <strong>Observações:</strong>
                    <p className="mt-1 whitespace-pre-line">{formData.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de ordens de serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Nenhuma ordem de serviço gerada ainda</p>
        </CardContent>
      </Card>
    </div>
  );
}
