import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function EmissaoAPR() {
  const { toast } = useToast();
  const [dataAnalise, setDataAnalise] = useState<Date>();
  const [formData, setFormData] = useState({
    local: "",
    atividade: "",
    responsavel: "",
    riscos: "",
    medidasControle: "",
    epis: "",
    observacoes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "APR gerada com sucesso",
      description: "O documento foi gerado e salvo no histórico"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Emissão de APR</h1>
          <p className="text-muted-foreground">Análise Preliminar de Risco</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Dados da APR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data da análise</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataAnalise ? format(dataAnalise, "PPP", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataAnalise}
                      onSelect={setDataAnalise}
                      locale={ptBR}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Input
                  id="local"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  placeholder="Digite o local da atividade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="atividade">Atividade</Label>
                <Textarea
                  id="atividade"
                  value={formData.atividade}
                  onChange={(e) => setFormData({ ...formData, atividade: e.target.value })}
                  placeholder="Descreva a atividade a ser realizada"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  placeholder="Nome do responsável"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riscos">Riscos identificados</Label>
                <Textarea
                  id="riscos"
                  value={formData.riscos}
                  onChange={(e) => setFormData({ ...formData, riscos: e.target.value })}
                  placeholder="Liste os riscos identificados"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medidasControle">Medidas de controle</Label>
                <Textarea
                  id="medidasControle"
                  value={formData.medidasControle}
                  onChange={(e) => setFormData({ ...formData, medidasControle: e.target.value })}
                  placeholder="Descreva as medidas de controle"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="epis">EPIs necessários</Label>
                <Textarea
                  id="epis"
                  value={formData.epis}
                  onChange={(e) => setFormData({ ...formData, epis: e.target.value })}
                  placeholder="Liste os EPIs necessários"
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
                Gerar APR
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
                <h2 className="text-2xl font-bold">ANÁLISE PRELIMINAR DE RISCO</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {dataAnalise ? format(dataAnalise, "dd/MM/yyyy", { locale: ptBR }) : "Data não definida"}
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <strong>Local:</strong> {formData.local || "-"}
                </div>
                <div>
                  <strong>Atividade:</strong>
                  <p className="mt-1 whitespace-pre-line">{formData.atividade || "-"}</p>
                </div>
                <div>
                  <strong>Responsável:</strong> {formData.responsavel || "-"}
                </div>
                <div>
                  <strong>Riscos identificados:</strong>
                  <p className="mt-1 whitespace-pre-line">{formData.riscos || "-"}</p>
                </div>
                <div>
                  <strong>Medidas de controle:</strong>
                  <p className="mt-1 whitespace-pre-line">{formData.medidasControle || "-"}</p>
                </div>
                <div>
                  <strong>EPIs necessários:</strong>
                  <p className="mt-1 whitespace-pre-line">{formData.epis || "-"}</p>
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
          <CardTitle>Histórico de APRs geradas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Nenhuma APR gerada ainda</p>
        </CardContent>
      </Card>
    </div>
  );
}
