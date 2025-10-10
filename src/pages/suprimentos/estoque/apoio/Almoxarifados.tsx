import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";
import { useState } from "react";

interface Almoxarifado {
  id: string;
  nome: string;
  endereco: string;
  ativo: boolean;
}

export default function Almoxarifados() {
  const [selectedCca, setSelectedCca] = useState<string>("");
  const [almoxarifados, setAlmoxarifados] = useState<Almoxarifado[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Almoxarifado | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    ativo: true,
  });

  const handleAddAlmoxarifado = () => {
    if (!formData.nome.trim() || !formData.endereco.trim()) {
      return;
    }

    const novoAlmoxarifado: Almoxarifado = {
      id: Date.now().toString(),
      nome: formData.nome,
      endereco: formData.endereco,
      ativo: formData.ativo,
    };

    setAlmoxarifados([...almoxarifados, novoAlmoxarifado]);
    setFormData({ nome: "", endereco: "", ativo: true });
  };

  const handleRemoveAlmoxarifado = (id: string) => {
    setAlmoxarifados(almoxarifados.filter((item) => item.id !== id));
  };

  const handleToggleAtivo = (id: string) => {
    setAlmoxarifados(almoxarifados.map((item) => (item.id === id ? { ...item, ativo: !item.ativo } : item)));
  };

  const handleStartEdit = (almoxarifado: Almoxarifado) => {
    setEditingId(almoxarifado.id);
    setEditData({ ...almoxarifado });
  };

  const handleSaveEdit = () => {
    if (!editData || !editData.nome.trim() || !editData.endereco.trim()) {
      return;
    }

    setAlmoxarifados(almoxarifados.map((item) => (item.id === editData.id ? editData : item)));
    setEditingId(null);
    setEditData(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Almoxarifados</h1>
          <p className="text-muted-foreground">Gerenciamento de almoxarifados</p>
        </div>
      </div>

      {/* Campo CCA */}
      <Card>
        <CardHeader>
          <CardTitle>CCA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="cca">Selecione o CCA</Label>
            <Input
              id="cca"
              value={selectedCca}
              onChange={(e) => setSelectedCca(e.target.value)}
              placeholder="Digite ou selecione o CCA"
              className={!selectedCca ? "border-red-500" : ""}
            />
          </div>
        </CardContent>
      </Card>

      {/* Card para adicionar almoxarifados */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Almoxarifado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome*</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Digite o nome do almoxarifado"
                  className={!formData.nome ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço*</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Digite o endereço"
                  className={!formData.endereco ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: !!checked })}
              />
              <Label htmlFor="ativo">Ativo</Label>
            </div>
            <Button onClick={handleAddAlmoxarifado} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Almoxarifado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de almoxarifados */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Almoxarifados</CardTitle>
        </CardHeader>
        <CardContent>
          {almoxarifados.length === 0 ? (
            <p className="text-muted-foreground">Nenhum almoxarifado cadastrado no momento.</p>
          ) : (
            <div className="space-y-3">
              {almoxarifados.map((almoxarifado) => (
                <div key={almoxarifado.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex-1">
                    {editingId === almoxarifado.id && editData ? (
                      // Modo de edição
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Nome*</Label>
                            <Input
                              value={editData.nome}
                              onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                              className={!editData.nome ? "border-red-500" : ""}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Endereço*</Label>
                            <Input
                              value={editData.endereco}
                              onChange={(e) => setEditData({ ...editData, endereco: e.target.value })}
                              className={!editData.endereco ? "border-red-500" : ""}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={editData.ativo}
                            onCheckedChange={(checked) => setEditData({ ...editData, ativo: !!checked })}
                          />
                          <Label className="text-sm">Ativo</Label>
                        </div>
                      </div>
                    ) : (
                      // Modo de visualização
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium">{almoxarifado.nome}</h3>
                          <p className="text-sm text-muted-foreground">{almoxarifado.endereco}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={almoxarifado.ativo}
                            onCheckedChange={() => handleToggleAtivo(almoxarifado.id)}
                            disabled={editingId !== null}
                          />
                          <Label className="text-sm">{almoxarifado.ativo ? "Ativo" : "Inativo"}</Label>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {editingId === almoxarifado.id ? (
                      // Botões de salvar/cancelar
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={!editData?.nome.trim() || !editData?.endereco.trim()}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      // Botões de editar/deletar
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(almoxarifado)}
                          disabled={editingId !== null}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAlmoxarifado(almoxarifado.id)}
                          disabled={editingId !== null}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
