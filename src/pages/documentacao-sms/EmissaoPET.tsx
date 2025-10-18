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

export default function EmissaoPET() {
  const { toast } = useToast();
  const [dataEmissao, setDataEmissao] = useState<Date>();
  const [dataValidade, setDataValidade] = useState<Date>();
  const [formData, setFormData] = useState({
    numero: "",
    local: "",
    atividade: "",
    responsavel: "",
    empresa: "",
    espacoConfinado: "",
    riscos: "",
    medidasSeguranca: "",
    equipamentos: "",
    observacoes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "PET gerada com sucesso",
      description: "O documento foi gerado e salvo no histórico"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Emissão de PET</h1>
          <p className="text-muted-foreground">Permissão de Entrada e Trabalho</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Dados da PET
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número da PET</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    placeholder="Ex: PET-001/2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label>Validade</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataValidade ? format(dataValidade, "PPP", { locale: ptBR }) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataValidade}
                        onSelect={setDataValidade}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="espacoConfinado">Espaço confinado</Label>
                <Input
                  id="espacoConfinado"
                  value={formData.espacoConfinado}
                  onChange={(e) => setFormData({ ...formData, espacoConfinado: e.target.value })}
                  placeholder="Identificação do espaço confinado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Input
                  id="local"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  placeholder="Localização"
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
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medidasSeguranca">Medidas de segurança</Label>
                <Textarea
                  id="medidasSeguranca"
                  value={formData.medidasSeguranca}
                  onChange={(e) => setFormData({ ...formData, medidasSeguranca: e.target.value })}
                  placeholder="Descreva as medidas de segurança"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipamentos">Equipamentos necessários</Label>
                <Textarea
                  id="equipamentos"
                  value={formData.equipamentos}
                  onChange={(e) => setFormData({ ...formData, equipamentos: e.target.value })}
                  placeholder="Liste os equipamentos necessários"
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
                Gerar PET
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
                <h2 className="text-2xl font-bold">PERMISSÃO DE ENTRADA E TRABALHO</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  PET Nº {formData.numero || "-"}
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Data de emissão:</strong> {dataEmissao ? format(dataEmissao, "dd/MM/yyyy") : "-"}
                  </div>
                  <div>
                    <strong>Validade:</strong> {dataValidade ? format(dataValidade, "dd/MM/yyyy") : "-"}
                  </div>
                </div>
                <div>
                  <strong>Empresa:</strong> {formData.empresa || "-"}
                </div>
                <div>
                  <strong>Espaço confinado:</strong> {formData.espacoConfinado || "-"}
                </div>
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
                  <strong>Medidas de segurança:</strong>
                  <p className="mt-1 whitespace-pre-line">{formData.medidasSeguranca || "-"}</p>
                </div>
                <div>
                  <strong>Equipamentos necessários:</strong>
                  <p className="mt-1 whitespace-pre-line">{formData.equipamentos || "-"}</p>
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
          <CardTitle>Histórico de PETs geradas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Nenhuma PET gerada ainda</p>
        </CardContent>
      </Card>
    </div>
  );
}
