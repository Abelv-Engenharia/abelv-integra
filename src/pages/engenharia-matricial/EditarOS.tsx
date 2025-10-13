import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useOSById, useUpdateOS } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { useUsuariosEngenhariaMatricial } from "@/hooks/useUsuariosEngenhariaMatricial";

const EditarOS = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: os, isLoading } = useOSById(id);
  const { data: ccasDisponiveis, isLoading: isLoadingCCAs } = useUserCCAs();
  const { usuarios: usuariosEM, isLoading: isLoadingUsuarios } = useUsuariosEngenhariaMatricial();
  const updateOSMutation = useUpdateOS();

  const [formData, setFormData] = useState({
    cca: "",
    disciplina: "",
    disciplinasEnvolvidas: [] as string[],
    familiaSAO: "",
    descricao: "",
    dataCompromissada: "",
    valorOrcamento: "",
    anexos: [] as File[],
    responsavelEM: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (os) {
      setFormData({
        cca: os.cca_id?.toString() || "",
        disciplina: os.disciplina || "",
        disciplinasEnvolvidas: os.disciplinas_envolvidas || [],
        familiaSAO: os.familia_sao || "",
        descricao: os.descricao || "",
        dataCompromissada: os.data_compromissada || "",
        valorOrcamento: os.valor_orcamento?.toString() || "",
        anexos: [],
        responsavelEM: os.responsavel_em_id || "",
      });
    }
  }, [os]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Filtrar usuários por disciplina selecionada
  const usuariosFiltrados = formData.disciplina
    ? usuariosEM?.filter((usuario) => {
        if (formData.disciplina === "eletrica") {
          return usuario.disciplina_preferida === "ELETRICA" || usuario.disciplina_preferida === "AMBAS";
        } else if (formData.disciplina === "mecanica") {
          return usuario.disciplina_preferida === "MECANICA" || usuario.disciplina_preferida === "AMBAS";
        }
        return false;
      })
    : [];

  const handleDisciplinaChange = (disciplina: string, checked: boolean) => {
    setFormData((prev) => {
      const disciplinasEnvolvidas = checked
        ? [...prev.disciplinasEnvolvidas, disciplina]
        : prev.disciplinasEnvolvidas.filter((d) => d !== disciplina);

      return {
        ...prev,
        disciplinasEnvolvidas,
      };
    });

    // Limpar erro quando houver mudança
    if (errors.disciplinasEnvolvidas) {
      setErrors((prev) => ({
        ...prev,
        disciplinasEnvolvidas: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cca) {
      newErrors.cca = "CCA é obrigatório";
    }

    if (!formData.disciplina) {
      newErrors.disciplina = "Disciplina é obrigatória";
    }

    if (!formData.responsavelEM) {
      newErrors.responsavelEM = "Responsável EM é obrigatório";
    }

    if (!formData.disciplinasEnvolvidas || formData.disciplinasEnvolvidas.length === 0) {
      newErrors.disciplinasEnvolvidas = "Pelo menos uma disciplina deve ser selecionada";
    }

    if (!formData.familiaSAO) {
      newErrors.familiaSAO = "Família (SAO) é obrigatória";
    }

    if (!formData.descricao) {
      newErrors.descricao = "Descrição é obrigatória";
    }

    if (!formData.dataCompromissada) {
      newErrors.dataCompromissada = "Data compromissada é obrigatória";
    } else {
      const dataCompromissada = new Date(formData.dataCompromissada);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (dataCompromissada < hoje) {
        newErrors.dataCompromissada = "Data compromissada não pode ser anterior à data atual";
      }
    }

    if (!formData.valorOrcamento) {
      newErrors.valorOrcamento = "Valor SAO é obrigatório";
    } else if (parseFloat(formData.valorOrcamento) <= 0) {
      newErrors.valorOrcamento = "Valor SAO deve ser maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Erro na validação",
        description: "Por favor, corrija os campos em vermelho.",
        variant: "destructive",
      });
      return;
    }

    updateOSMutation.mutate(
      {
        id: id!,
        data: {
          cca_id: parseInt(formData.cca),
          disciplina: formData.disciplina,
          disciplinas_envolvidas: formData.disciplinasEnvolvidas,
          familia_sao: formData.familiaSAO,
          descricao: formData.descricao,
          valor_orcamento: parseFloat(formData.valorOrcamento),
          data_compromissada: formData.dataCompromissada,
          responsavel_em_id: formData.responsavelEM,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: "OS atualizada com sucesso!",
          });
          navigate("/engenharia-matricial/os-abertas");
        },
        onError: (error) => {
          console.error("Erro ao atualizar OS:", error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar OS. Tente novamente.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      anexos: [...prev.anexos, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      anexos: prev.anexos.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!os) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p>OS não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Link to="/engenharia-matricial/os-abertas">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editar Ordem de Serviço</h1>
          <p className="text-muted-foreground">OS Nº {os.numero} - Atualize os dados da OS</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Básicos</CardTitle>
            <CardDescription>Informações principais da Ordem de Serviço</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cca" className={errors.cca ? "text-destructive" : ""}>
                  CCA *
                </Label>
                <Select value={formData.cca} onValueChange={(value) => handleInputChange("cca", value)} disabled={isLoadingCCAs}>
                  <SelectTrigger className={errors.cca ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione o CCA" />
                  </SelectTrigger>
                  <SelectContent>
                    {ccasDisponiveis?.map((cca) => (
                      <SelectItem key={cca.id} value={cca.id.toString()}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cca && <p className="text-sm text-destructive">{errors.cca}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeSolicitante">
                  Solicitante
                </Label>
                <Input
                  id="nomeSolicitante"
                  value={os.solicitante_nome || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Especificações Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle>Especificações Técnicas</CardTitle>
            <CardDescription>Definições técnicas da OS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className={errors.disciplina ? "text-destructive" : ""}>Disciplina *</Label>
              <RadioGroup
                value={formData.disciplina}
                onValueChange={(value) => handleInputChange("disciplina", value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="eletrica" id="eletrica" />
                  <Label htmlFor="eletrica">Elétrica</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mecanica" id="mecanica" />
                  <Label htmlFor="mecanica">Mecânica</Label>
                </div>
              </RadioGroup>
              {errors.disciplina && <p className="text-sm text-destructive">{errors.disciplina}</p>}
            </div>

            {formData.disciplina && (
              <div className="space-y-2">
                <Label htmlFor="responsavelEM" className={errors.responsavelEM ? "text-destructive" : ""}>
                  Engenheiro Matricial Responsável *
                </Label>
                <Select
                  value={formData.responsavelEM}
                  onValueChange={(value) => handleInputChange("responsavelEM", value)}
                  disabled={isLoadingUsuarios}
                >
                  <SelectTrigger className={errors.responsavelEM ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuariosFiltrados?.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.usuario_id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{usuario.nome}</span>
                          <span className="text-xs text-muted-foreground">{usuario.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.responsavelEM && <p className="text-sm text-destructive">{errors.responsavelEM}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label className={errors.disciplinasEnvolvidas ? "text-destructive" : ""}>Disciplinas envolvidas *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
                {[
                  "Mecânica",
                  "Tubulação",
                  "Hidráulica",
                  "Combate a Incêndio",
                  "Elétrica",
                  "Instrumentação",
                  "Sistemas Especiais",
                  "HVAC",
                  "Civil",
                  "Equipamentos",
                ].map((disciplina) => (
                  <div key={disciplina} className="flex items-center space-x-2">
                    <Checkbox
                      id={disciplina}
                      checked={formData.disciplinasEnvolvidas.includes(disciplina)}
                      onCheckedChange={(checked) => handleDisciplinaChange(disciplina, checked as boolean)}
                    />
                    <Label htmlFor={disciplina} className="text-sm font-normal cursor-pointer">
                      {disciplina}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.disciplinasEnvolvidas && (
                <p className="text-sm text-destructive">{errors.disciplinasEnvolvidas}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="familiaSAO" className={errors.familiaSAO ? "text-destructive" : ""}>
                Família (SAO) *
              </Label>
              <Input
                id="familiaSAO"
                placeholder="Ex: Instalação elétrica industrial"
                value={formData.familiaSAO}
                onChange={(e) => handleInputChange("familiaSAO", e.target.value)}
                className={errors.familiaSAO ? "border-destructive" : ""}
              />
              {errors.familiaSAO && <p className="text-sm text-destructive">{errors.familiaSAO}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className={errors.descricao ? "text-destructive" : ""}>
                Descrição do serviço *
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descreva brevemente o serviço solicitado, incluindo expectativa de recebimento do retorno..."
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                className={errors.descricao ? "border-destructive" : ""}
                rows={4}
              />
              {errors.descricao && <p className="text-sm text-destructive">{errors.descricao}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataCompromissada" className={errors.dataCompromissada ? "text-destructive" : ""}>
                Data compromissada *
              </Label>
              <Input
                id="dataCompromissada"
                type="date"
                value={formData.dataCompromissada}
                onChange={(e) => handleInputChange("dataCompromissada", e.target.value)}
                className={errors.dataCompromissada ? "border-destructive" : ""}
              />
              <p className="text-sm text-muted-foreground">
                Data limite para atendimento da OS pela Engenharia Matricial
              </p>
              {errors.dataCompromissada && <p className="text-sm text-destructive">{errors.dataCompromissada}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Valores */}
        <Card>
          <CardHeader>
            <CardTitle>Valores</CardTitle>
            <CardDescription>Informações financeiras da OS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorOrcamento" className={errors.valorOrcamento ? "text-destructive" : ""}>
                  Valor SAO (custo de venda) *
                </Label>
                <Input
                  id="valorOrcamento"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.valorOrcamento}
                  onChange={(e) => handleInputChange("valorOrcamento", e.target.value)}
                  className={errors.valorOrcamento ? "border-destructive" : ""}
                />
                <p className="text-sm text-muted-foreground">Informe o custo de venda (SAO) da ordem de serviço</p>
                {errors.valorOrcamento && <p className="text-sm text-destructive">{errors.valorOrcamento}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anexos */}
        <Card>
          <CardHeader>
            <CardTitle>Anexos</CardTitle>
            <CardDescription>Documentos de apoio (opcional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="anexos">Arquivos</Label>
              <div className="flex items-center gap-2">
                <Input id="anexos" type="file" multiple onChange={handleFileUpload} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("anexos")?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Adicionar arquivos
                </Button>
              </div>
              {formData.anexos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{formData.anexos.length} arquivo(s) selecionado(s):</p>
                  {formData.anexos.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="flex gap-2 justify-end">
          <Link to="/engenharia-matricial/os-abertas">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={updateOSMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateOSMutation.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarOS;
