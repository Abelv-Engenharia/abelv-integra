import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText, Download, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface EPI {
  id: string;
  descricao: string;
  ca: string;
  quantidade: string;
  dataEntrega: Date | undefined;
}

export default function FichaEPI() {
  const { toast } = useToast();
  const [dataEmissao, setDataEmissao] = useState<Date>();
  const [formData, setFormData] = useState({
    funcionario: "",
    matricula: "",
    funcao: "",
    setor: "",
    empresa: "",
    observacoes: ""
  });
  const [epis, setEpis] = useState<EPI[]>([]);
  const [novoEPI, setNovoEPI] = useState({
    descricao: "",
    ca: "",
    quantidade: "",
    dataEntrega: undefined as Date | undefined
  });

  const adicionarEPI = () => {
    if (!novoEPI.descricao) {
      toast({
        title: "Descrição obrigatória",
        description: "Digite a descrição do EPI",
        variant: "destructive"
      });
      return;
    }

    const epi: EPI = {
      id: Math.random().toString(),
      ...novoEPI
    };

    setEpis([...epis, epi]);
    setNovoEPI({ descricao: "", ca: "", quantidade: "", dataEntrega: undefined });
  };

  const removerEPI = (id: string) => {
    setEpis(epis.filter(e => e.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ficha de EPI gerada",
      description: "O documento foi gerado e salvo no histórico"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ficha de epi</h1>
          <p className="text-muted-foreground">Controle de entrega de equipamentos de proteção individual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dados do funcionário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Data de emissão</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataEmissao ? format(dataEmissao, "PPP", { locale: ptBR }) : "Selecione a data"}
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
                  <Label htmlFor="funcionario">Funcionário</Label>
                  <Input
                    id="funcionario"
                    value={formData.funcionario}
                    onChange={(e) => setFormData({ ...formData, funcionario: e.target.value })}
                    placeholder="Nome completo do funcionário"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="matricula">Matrícula</Label>
                    <Input
                      id="matricula"
                      value={formData.matricula}
                      onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                      placeholder="Matrícula"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="funcao">Função</Label>
                    <Input
                      id="funcao"
                      value={formData.funcao}
                      onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                      placeholder="Função"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="setor">Setor</Label>
                    <Input
                      id="setor"
                      value={formData.setor}
                      onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                      placeholder="Setor"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa">Empresa</Label>
                    <Input
                      id="empresa"
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      placeholder="Empresa"
                    />
                  </div>
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
                  Gerar ficha de epi
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar EPIs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do EPI</Label>
                <Input
                  id="descricao"
                  value={novoEPI.descricao}
                  onChange={(e) => setNovoEPI({ ...novoEPI, descricao: e.target.value })}
                  placeholder="Ex: Capacete de segurança"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ca">Número do CA</Label>
                  <Input
                    id="ca"
                    value={novoEPI.ca}
                    onChange={(e) => setNovoEPI({ ...novoEPI, ca: e.target.value })}
                    placeholder="Ex: 12345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    value={novoEPI.quantidade}
                    onChange={(e) => setNovoEPI({ ...novoEPI, quantidade: e.target.value })}
                    placeholder="Ex: 1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Data de entrega</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {novoEPI.dataEntrega ? format(novoEPI.dataEntrega, "PPP", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={novoEPI.dataEntrega}
                      onSelect={(date) => setNovoEPI({ ...novoEPI, dataEntrega: date })}
                      locale={ptBR}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button onClick={adicionarEPI} className="w-full" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar EPI
              </Button>

              {epis.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>EPIs adicionados ({epis.length})</Label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {epis.map((epi) => (
                      <div key={epi.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{epi.descricao}</p>
                          <p className="text-xs text-muted-foreground">
                            CA: {epi.ca} • Qtd: {epi.quantidade} • {epi.dataEntrega ? format(epi.dataEntrega, "dd/MM/yyyy") : "-"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerEPI(epi.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview do documento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-muted/20 min-h-[600px]">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">FICHA DE CONTROLE DE EPI</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {dataEmissao ? format(dataEmissao, "dd/MM/yyyy", { locale: ptBR }) : "Data não definida"}
                </p>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div>
                  <strong>Funcionário:</strong> {formData.funcionario || "-"}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Matrícula:</strong> {formData.matricula || "-"}
                  </div>
                  <div>
                    <strong>Função:</strong> {formData.funcao || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Setor:</strong> {formData.setor || "-"}
                  </div>
                  <div>
                    <strong>Empresa:</strong> {formData.empresa || "-"}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">EPIs entregues</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Descrição</th>
                      <th className="text-left py-2">CA</th>
                      <th className="text-left py-2">Qtd</th>
                      <th className="text-left py-2">Data</th>
                      <th className="text-left py-2">Assinatura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {epis.length > 0 ? (
                      epis.map((epi) => (
                        <tr key={epi.id} className="border-b">
                          <td className="py-3">{epi.descricao}</td>
                          <td className="py-3">{epi.ca}</td>
                          <td className="py-3">{epi.quantidade}</td>
                          <td className="py-3">{epi.dataEntrega ? format(epi.dataEntrega, "dd/MM/yyyy") : "-"}</td>
                          <td className="py-3"></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          Nenhum EPI adicionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {formData.observacoes && (
                <div className="border-t pt-4 mt-4">
                  <strong>Observações:</strong>
                  <p className="mt-1 whitespace-pre-line text-xs">{formData.observacoes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de fichas de epi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Nenhuma ficha de EPI gerada ainda</p>
        </CardContent>
      </Card>
    </div>
  );
}
