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

interface Participante {
  id: string;
  nome: string;
  matricula: string;
  funcao: string;
}

export default function ListaPresenca() {
  const { toast } = useToast();
  const [dataEvento, setDataEvento] = useState<Date>();
  const [formData, setFormData] = useState({
    titulo: "",
    local: "",
    horario: "",
    instrutor: ""
  });
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [novoParticipante, setNovoParticipante] = useState({
    nome: "",
    matricula: "",
    funcao: ""
  });

  const adicionarParticipante = () => {
    if (!novoParticipante.nome) {
      toast({
        title: "Nome obrigatório",
        description: "Digite o nome do participante",
        variant: "destructive"
      });
      return;
    }

    const participante: Participante = {
      id: Math.random().toString(),
      ...novoParticipante
    };

    setParticipantes([...participantes, participante]);
    setNovoParticipante({ nome: "", matricula: "", funcao: "" });
  };

  const removerParticipante = (id: string) => {
    setParticipantes(participantes.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Lista de presença gerada",
      description: "O documento foi gerado e salvo no histórico"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lista de presença</h1>
          <p className="text-muted-foreground">Geração de lista de presença para treinamentos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dados do evento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do evento</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Treinamento NR-35"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data do evento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataEvento ? format(dataEvento, "PPP", { locale: ptBR }) : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataEvento}
                        onSelect={setDataEvento}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horario">Horário</Label>
                    <Input
                      id="horario"
                      value={formData.horario}
                      onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                      placeholder="Ex: 08:00 às 12:00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="local">Local</Label>
                    <Input
                      id="local"
                      value={formData.local}
                      onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                      placeholder="Local do evento"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instrutor">Instrutor</Label>
                  <Input
                    id="instrutor"
                    value={formData.instrutor}
                    onChange={(e) => setFormData({ ...formData, instrutor: e.target.value })}
                    placeholder="Nome do instrutor"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Gerar lista de presença
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar participantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={novoParticipante.nome}
                  onChange={(e) => setNovoParticipante({ ...novoParticipante, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={novoParticipante.matricula}
                    onChange={(e) => setNovoParticipante({ ...novoParticipante, matricula: e.target.value })}
                    placeholder="Matrícula"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funcao">Função</Label>
                  <Input
                    id="funcao"
                    value={novoParticipante.funcao}
                    onChange={(e) => setNovoParticipante({ ...novoParticipante, funcao: e.target.value })}
                    placeholder="Função"
                  />
                </div>
              </div>

              <Button onClick={adicionarParticipante} className="w-full" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar participante
              </Button>

              {participantes.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>Participantes ({participantes.length})</Label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {participantes.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{p.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.matricula} • {p.funcao}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerParticipante(p.id)}
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
                <h2 className="text-2xl font-bold">LISTA DE PRESENÇA</h2>
                <p className="text-lg font-semibold mt-2">{formData.titulo || "-"}</p>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div>
                  <strong>Data:</strong> {dataEvento ? format(dataEvento, "dd/MM/yyyy", { locale: ptBR }) : "-"}
                </div>
                <div>
                  <strong>Horário:</strong> {formData.horario || "-"}
                </div>
                <div>
                  <strong>Local:</strong> {formData.local || "-"}
                </div>
                <div>
                  <strong>Instrutor:</strong> {formData.instrutor || "-"}
                </div>
              </div>

              <div className="border-t pt-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">#</th>
                      <th className="text-left py-2">Nome</th>
                      <th className="text-left py-2">Matrícula</th>
                      <th className="text-left py-2">Função</th>
                      <th className="text-left py-2">Assinatura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantes.length > 0 ? (
                      participantes.map((p, index) => (
                        <tr key={p.id} className="border-b">
                          <td className="py-3">{index + 1}</td>
                          <td className="py-3">{p.nome}</td>
                          <td className="py-3">{p.matricula}</td>
                          <td className="py-3">{p.funcao}</td>
                          <td className="py-3"></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          Nenhum participante adicionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de listas de presença</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Nenhuma lista de presença gerada ainda</p>
        </CardContent>
      </Card>
    </div>
  );
}
