import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useCCAs } from "@/hooks/useCCAs";
import { almoxarifadoService, Almoxarifado } from "@/services/almoxarifadoService";

const Almoxarifados = () => {
  const { data: ccas = [], isLoading: isLoadingCCAs } = useCCAs();
  const [selectedCcaId, setSelectedCcaId] = useState<number | null>(null);
  const [almoxarifados, setAlmoxarifados] = useState<Almoxarifado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAlmoxarifado, setNewAlmoxarifado] = useState({
    nome: "",
    endereco: "",
    interno_cliente: false,
  });

  const [editingData, setEditingData] = useState({
    nome: "",
    endereco: "",
    interno_cliente: false,
  });

  useEffect(() => {
    if (selectedCcaId) {
      loadAlmoxarifados();
    } else {
      setAlmoxarifados([]);
    }
  }, [selectedCcaId]);

  const loadAlmoxarifados = async () => {
    if (!selectedCcaId) return;
    
    setIsLoading(true);
    try {
      const data = await almoxarifadoService.getByCCA(selectedCcaId);
      setAlmoxarifados(data);
    } catch (error) {
      console.error('Erro ao carregar almoxarifados:', error);
      toast.error('Erro ao carregar almoxarifados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAlmoxarifado = async () => {
    if (!selectedCcaId) {
      toast.error("Selecione um CCA");
      return;
    }

    if (!newAlmoxarifado.nome.trim()) {
      toast.error("O nome do almoxarifado é obrigatório");
      return;
    }

    try {
      await almoxarifadoService.create({
        cca_id: selectedCcaId,
        nome: newAlmoxarifado.nome,
        endereco: newAlmoxarifado.endereco,
        interno_cliente: newAlmoxarifado.interno_cliente,
        ativo: true,
      });
      
      setNewAlmoxarifado({ nome: "", endereco: "", interno_cliente: false });
      toast.success("Almoxarifado adicionado com sucesso");
      await loadAlmoxarifados();
    } catch (error) {
      console.error('Erro ao adicionar almoxarifado:', error);
      toast.error("Erro ao adicionar almoxarifado");
    }
  };

  const handleRemoveAlmoxarifado = async (id: string) => {
    try {
      await almoxarifadoService.delete(id);
      toast.success("Almoxarifado removido com sucesso");
      await loadAlmoxarifados();
    } catch (error) {
      console.error('Erro ao remover almoxarifado:', error);
      toast.error("Erro ao remover almoxarifado");
    }
  };

  const handleToggleAtivo = async (id: string, currentAtivo: boolean) => {
    try {
      await almoxarifadoService.toggleAtivo(id, !currentAtivo);
      toast.success("Status atualizado com sucesso");
      await loadAlmoxarifados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleStartEdit = (almoxarifado: Almoxarifado) => {
    setEditingId(almoxarifado.id);
    setEditingData({
      nome: almoxarifado.nome,
      endereco: almoxarifado.endereco || "",
      interno_cliente: almoxarifado.interno_cliente,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingData.nome.trim()) {
      toast.error("O nome do almoxarifado é obrigatório");
      return;
    }

    if (!editingId) return;

    try {
      await almoxarifadoService.update(editingId, {
        nome: editingData.nome,
        endereco: editingData.endereco,
        interno_cliente: editingData.interno_cliente,
      });
      
      setEditingId(null);
      setEditingData({ nome: "", endereco: "", interno_cliente: false });
      toast.success("Almoxarifado atualizado com sucesso");
      await loadAlmoxarifados();
    } catch (error) {
      console.error('Erro ao atualizar almoxarifado:', error);
      toast.error("Erro ao atualizar almoxarifado");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({ nome: "", endereco: "", interno_cliente: false });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Almoxarifados</h1>
        <p className="text-muted-foreground">
          Gerencie os almoxarifados por CCA
        </p>
      </div>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cca">CCA</Label>
          <Select 
            value={selectedCcaId?.toString()} 
            onValueChange={(value) => setSelectedCcaId(Number(value))}
            disabled={isLoadingCCAs}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um CCA" />
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

        {selectedCcaId && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Almoxarifado</CardTitle>
                <CardDescription>Preencha os dados do almoxarifado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome do almoxarifado"
                    value={newAlmoxarifado.nome}
                    onChange={(e) =>
                      setNewAlmoxarifado({ ...newAlmoxarifado, nome: e.target.value })
                    }
                    className={!newAlmoxarifado.nome ? "border-red-500" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    placeholder="Digite o endereço"
                    value={newAlmoxarifado.endereco}
                    onChange={(e) =>
                      setNewAlmoxarifado({ ...newAlmoxarifado, endereco: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="interno_cliente"
                    checked={newAlmoxarifado.interno_cliente}
                    onCheckedChange={(checked) =>
                      setNewAlmoxarifado({ ...newAlmoxarifado, interno_cliente: checked as boolean })
                    }
                  />
                  <Label htmlFor="interno_cliente" className="cursor-pointer">
                    Interno ao cliente
                  </Label>
                </div>
                <Button onClick={handleAddAlmoxarifado} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Almoxarifado
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Almoxarifados Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <p className="text-muted-foreground text-center py-4">Carregando...</p>
                  ) : almoxarifados.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum almoxarifado cadastrado para este CCA
                    </p>
                  ) : (
                    almoxarifados.map((almoxarifado) => (
                      <div
                        key={almoxarifado.id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        {editingId === almoxarifado.id ? (
                          <>
                            <div className="flex-1 space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edit_nome_${almoxarifado.id}`}>Nome</Label>
                                <Input
                                  id={`edit_nome_${almoxarifado.id}`}
                                  value={editingData.nome}
                                  onChange={(e) =>
                                    setEditingData({ ...editingData, nome: e.target.value })
                                  }
                                  className={!editingData.nome ? "border-red-500" : ""}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit_endereco_${almoxarifado.id}`}>Endereço</Label>
                                <Input
                                  id={`edit_endereco_${almoxarifado.id}`}
                                  value={editingData.endereco}
                                  onChange={(e) =>
                                    setEditingData({ ...editingData, endereco: e.target.value })
                                  }
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`edit_interno_${almoxarifado.id}`}
                                  checked={editingData.interno_cliente}
                                  onCheckedChange={(checked) =>
                                    setEditingData({ ...editingData, interno_cliente: checked as boolean })
                                  }
                                />
                                <Label htmlFor={`edit_interno_${almoxarifado.id}`} className="cursor-pointer">
                                  Interno ao cliente
                                </Label>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleSaveEdit}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <p className="font-medium">{almoxarifado.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                {almoxarifado.endereco || "Sem endereço"}
                              </p>
                              <div className="flex items-center gap-4 mt-1">
                                <p className="text-xs">
                                  Status:{" "}
                                  <span
                                    className={
                                      almoxarifado.ativo
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {almoxarifado.ativo ? "Ativo" : "Inativo"}
                                  </span>
                                </p>
                                {almoxarifado.interno_cliente && (
                                  <p className="text-xs text-blue-600">
                                    Interno ao cliente
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStartEdit(almoxarifado)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={almoxarifado.ativo ? "destructive" : "default"}
                                onClick={() => handleToggleAtivo(almoxarifado.id, almoxarifado.ativo)}
                              >
                                {almoxarifado.ativo ? "Desativar" : "Ativar"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveAlmoxarifado(almoxarifado.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </div>
  );
};

export default Almoxarifados;
