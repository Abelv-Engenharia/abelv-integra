import { useParams, useNavigate, Link } from "react-router-dom";
import { useOSById, useUpdateOS } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";

export default function EditarOS() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: os, isLoading } = useOSById(id);
  const { data: ccas = [] } = useUserCCAs();
  const updateOSMutation = useUpdateOS();

  const [formData, setFormData] = useState({
    cca_id: "",
    cliente: "",
    solicitante_nome: "",
    disciplina: "",
    descricao: "",
    data_compromissada: "",
    valor_orcamento: "",
  });

  useEffect(() => {
    if (os) {
      setFormData({
        cca_id: os.cca_id?.toString() || "",
        cliente: os.cliente || "",
        solicitante_nome: os.solicitante_nome || "",
        disciplina: os.disciplina || "",
        descricao: os.descricao || "",
        data_compromissada: os.data_compromissada || "",
        valor_orcamento: os.valor_orcamento?.toString() || "",
      });
    }
  }, [os]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cca_id || !formData.cliente || !formData.solicitante_nome || !formData.disciplina || !formData.descricao || !formData.data_compromissada) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    updateOSMutation.mutate(
      {
        id: id!,
        data: {
          cca_id: parseInt(formData.cca_id),
          cliente: formData.cliente,
          solicitante_nome: formData.solicitante_nome,
          disciplina: formData.disciplina,
          descricao: formData.descricao,
          data_compromissada: formData.data_compromissada,
          valor_orcamento: formData.valor_orcamento ? parseFloat(formData.valor_orcamento) : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("OS atualizada com sucesso!");
          navigate("/engenharia-matricial/os-abertas");
        },
        onError: (error) => {
          console.error("Erro ao atualizar OS:", error);
          toast.error("Erro ao atualizar OS. Tente novamente.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!os) {
    return (
      <div className="container mx-auto p-6">
        <p>OS não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/engenharia-matricial/os-abertas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar OS</h1>
          <p className="text-muted-foreground">OS Nº {os.numero}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da OS</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cca_id" className={!formData.cca_id ? "text-red-600" : ""}>
                  CCA *
                </Label>
                <Select value={formData.cca_id} onValueChange={(value) => setFormData({ ...formData, cca_id: value })}>
                  <SelectTrigger className={!formData.cca_id ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o CCA" />
                  </SelectTrigger>
                  <SelectContent>
                    {ccas.map((cca) => (
                      <SelectItem key={cca.id} value={cca.id.toString()}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente" className={!formData.cliente ? "text-red-600" : ""}>
                  Cliente *
                </Label>
                <Input
                  id="cliente"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  className={!formData.cliente ? "border-red-500" : ""}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solicitante_nome" className={!formData.solicitante_nome ? "text-red-600" : ""}>
                  Solicitante *
                </Label>
                <Input
                  id="solicitante_nome"
                  value={formData.solicitante_nome}
                  onChange={(e) => setFormData({ ...formData, solicitante_nome: e.target.value })}
                  className={!formData.solicitante_nome ? "border-red-500" : ""}
                  placeholder="Nome do solicitante"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disciplina" className={!formData.disciplina ? "text-red-600" : ""}>
                  Disciplina *
                </Label>
                <Select value={formData.disciplina} onValueChange={(value) => setFormData({ ...formData, disciplina: value })}>
                  <SelectTrigger className={!formData.disciplina ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="eletrica">Elétrica</SelectItem>
                    <SelectItem value="mecanica">Mecânica</SelectItem>
                    <SelectItem value="hidraulica">Hidráulica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_compromissada" className={!formData.data_compromissada ? "text-red-600" : ""}>
                  Data compromissada *
                </Label>
                <Input
                  id="data_compromissada"
                  type="date"
                  value={formData.data_compromissada}
                  onChange={(e) => setFormData({ ...formData, data_compromissada: e.target.value })}
                  className={!formData.data_compromissada ? "border-red-500" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_orcamento">Valor SAO</Label>
                <Input
                  id="valor_orcamento"
                  type="number"
                  step="0.01"
                  value={formData.valor_orcamento}
                  onChange={(e) => setFormData({ ...formData, valor_orcamento: e.target.value })}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className={!formData.descricao ? "text-red-600" : ""}>
                Descrição *
              </Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className={!formData.descricao ? "border-red-500" : ""}
                placeholder="Descreva a ordem de serviço"
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/engenharia-matricial/os-abertas")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateOSMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Salvar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
