import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { OrigemCandidato, EtapaProcesso, StatusCandidato } from "@/types/gestao-pessoas/candidato";
import { toast } from "@/hooks/use-toast";

interface NovoCandidatoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export const NovoCandidatoModal = ({ open, onOpenChange, onSubmit }: NovoCandidatoModalProps) => {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    cidadeEstado: "",
    cargoVagaPretendida: "",
    unidadeObra: "",
    origemCandidato: "",
    dataEntrevista: "",
    etapaProcesso: "",
    responsavelEtapa: "",
    feedbackGestorRH: "",
    possibilidadeReaproveitamento: true,
    observacoesGerais: "",
    statusCandidato: StatusCandidato.DISPONIVEL,
    faixaSalarial: ""
  });

  const handleSubmit = () => {
    if (!formData.nomeCompleto || !formData.email || !formData.telefone || !formData.cargoVagaPretendida) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      ...formData,
      id: Date.now().toString(),
      dataCadastro: new Date(),
      dataUltimaAtualizacao: new Date(),
      dataEntrevista: formData.dataEntrevista ? new Date(formData.dataEntrevista) : undefined
    });

    setFormData({
      nomeCompleto: "",
      email: "",
      telefone: "",
      cidadeEstado: "",
      cargoVagaPretendida: "",
      unidadeObra: "",
      origemCandidato: "",
      dataEntrevista: "",
      etapaProcesso: "",
      responsavelEtapa: "",
      feedbackGestorRH: "",
      possibilidadeReaproveitamento: true,
      observacoesGerais: "",
      statusCandidato: StatusCandidato.DISPONIVEL,
      faixaSalarial: ""
    });

    onOpenChange(false);
    toast({
      title: "Candidato cadastrado",
      description: "O candidato foi adicionado ao banco de talentos com sucesso."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Candidato</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pessoais" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="profissionais">Informações Profissionais</TabsTrigger>
            <TabsTrigger value="avaliacao">Avaliação</TabsTrigger>
          </TabsList>

          <TabsContent value="pessoais" className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo <span className="text-red-500">*</span></Label>
              <Input
                value={formData.nomeCompleto}
                onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                className={!formData.nomeCompleto ? "border-red-500" : ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-mail <span className="text-red-500">*</span></Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={!formData.email ? "border-red-500" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Telefone <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(XX) XXXXX-XXXX"
                  className={!formData.telefone ? "border-red-500" : ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cidade / Estado <span className="text-red-500">*</span></Label>
              <Input
                value={formData.cidadeEstado}
                onChange={(e) => setFormData({ ...formData, cidadeEstado: e.target.value })}
                placeholder="Ex: Belo Horizonte / MG"
                className={!formData.cidadeEstado ? "border-red-500" : ""}
              />
            </div>
          </TabsContent>

          <TabsContent value="profissionais" className="space-y-4">
            <div className="space-y-2">
              <Label>Cargo / Vaga Pretendida <span className="text-red-500">*</span></Label>
              <Input
                value={formData.cargoVagaPretendida}
                onChange={(e) => setFormData({ ...formData, cargoVagaPretendida: e.target.value })}
                className={!formData.cargoVagaPretendida ? "border-red-500" : ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unidade / Obra</Label>
                <Input
                  value={formData.unidadeObra}
                  onChange={(e) => setFormData({ ...formData, unidadeObra: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Origem do Candidato</Label>
                <Select
                  value={formData.origemCandidato}
                  onValueChange={(value) => setFormData({ ...formData, origemCandidato: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OrigemCandidato).map((origem) => (
                      <SelectItem key={origem} value={origem}>
                        {origem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data da Entrevista</Label>
                <Input
                  type="date"
                  value={formData.dataEntrevista}
                  onChange={(e) => setFormData({ ...formData, dataEntrevista: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Etapa do Processo</Label>
                <Select
                  value={formData.etapaProcesso}
                  onValueChange={(value) => setFormData({ ...formData, etapaProcesso: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EtapaProcesso).map((etapa) => (
                      <SelectItem key={etapa} value={etapa}>
                        {etapa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Responsável pela Etapa</Label>
                <Input
                  value={formData.responsavelEtapa}
                  onChange={(e) => setFormData({ ...formData, responsavelEtapa: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Faixa Salarial</Label>
                <Input
                  value={formData.faixaSalarial}
                  onChange={(e) => setFormData({ ...formData, faixaSalarial: e.target.value })}
                  placeholder="Ex: R$ 5.000 - R$ 7.000"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="avaliacao" className="space-y-4">
            <div className="space-y-2">
              <Label>Feedback do Gestor / RH</Label>
              <Textarea
                value={formData.feedbackGestorRH}
                onChange={(e) => setFormData({ ...formData, feedbackGestorRH: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Possibilidade de Reaproveitamento</Label>
              <Select
                value={formData.possibilidadeReaproveitamento.toString()}
                onValueChange={(value) => setFormData({ ...formData, possibilidadeReaproveitamento: value === "true" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Observações Gerais</Label>
              <Textarea
                value={formData.observacoesGerais}
                onChange={(e) => setFormData({ ...formData, observacoesGerais: e.target.value })}
                rows={4}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Salvar Candidato
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
