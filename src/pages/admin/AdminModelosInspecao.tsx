
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useModelosInspecao, ModeloInspecao } from "@/hooks/inspecao-sms/useModelosInspecao";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTiposInspecao } from "@/hooks/inspecao-sms/useTiposInspecao";

const AdminModelosInspecao = () => {
  const { modelos, isLoading, createModelo, updateModelo, deleteModelo } = useModelosInspecao();
  const { tipos } = useTiposInspecao();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModelo, setEditingModelo] = useState<ModeloInspecao | null>(null);
  const [viewingModelo, setViewingModelo] = useState<ModeloInspecao | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipo_inspecao_id: '',
    arquivo_modelo_url: ''
  });

  console.log("Modelos carregados:", modelos);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    
    const modeloData = {
      ...formData,
      campos_substituicao: {}
    };

    if (editingModelo) {
      updateModelo({ id: editingModelo.id, ...modeloData });
    } else {
      createModelo(modeloData);
    }
    handleCloseDialog();
  };

  const handleEdit = (modelo: ModeloInspecao) => {
    console.log("Editing modelo:", modelo);
    setEditingModelo(modelo);
    setFormData({
      nome: modelo.nome,
      tipo_inspecao_id: modelo.tipo_inspecao_id,
      arquivo_modelo_url: modelo.arquivo_modelo_url || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      deleteModelo(id);
    }
  };

  const handleView = (modelo: ModeloInspecao) => {
    console.log("Viewing modelo:", modelo);
    setViewingModelo(modelo);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingModelo(null);
    setFormData({
      nome: '',
      tipo_inspecao_id: '',
      arquivo_modelo_url: ''
    });
  };

  const handleNewModel = () => {
    setEditingModelo(null);
    setFormData({
      nome: '',
      tipo_inspecao_id: '',
      arquivo_modelo_url: ''
    });
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modelos de Inspeção SMS</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewModel}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Modelo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingModelo ? 'Editar Modelo' : 'Novo Modelo de Inspeção'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Modelo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="tipo">Tipo de Inspeção *</Label>
                <Select 
                  value={formData.tipo_inspecao_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_inspecao_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="arquivo_modelo_url">URL do Arquivo Modelo</Label>
                <Input
                  id="arquivo_modelo_url"
                  value={formData.arquivo_modelo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, arquivo_modelo_url: e.target.value }))}
                  placeholder="URL opcional do arquivo modelo"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingModelo ? 'Atualizar' : 'Criar'} Modelo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modelos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Arquivo Modelo</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum modelo cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                modelos.map((modelo) => (
                  <TableRow key={modelo.id}>
                    <TableCell className="font-medium">{modelo.nome}</TableCell>
                    <TableCell>{modelo.tipos_inspecao_sms?.nome || 'N/A'}</TableCell>
                    <TableCell>
                      {modelo.arquivo_modelo_url ? (
                        <a 
                          href={modelo.arquivo_modelo_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Ver arquivo
                        </a>
                      ) : (
                        'Nenhum arquivo'
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(modelo.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleView(modelo)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(modelo)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(modelo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para visualizar modelo */}
      <Dialog open={!!viewingModelo} onOpenChange={() => setViewingModelo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visualizar Modelo: {viewingModelo?.nome}</DialogTitle>
          </DialogHeader>
          {viewingModelo && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Tipo de Inspeção:</h4>
                <p className="text-sm text-muted-foreground">
                  {viewingModelo.tipos_inspecao_sms?.nome || 'N/A'}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Arquivo Modelo:</h4>
                <p className="text-sm text-muted-foreground">
                  {viewingModelo.arquivo_modelo_url ? (
                    <a 
                      href={viewingModelo.arquivo_modelo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {viewingModelo.arquivo_modelo_url}
                    </a>
                  ) : (
                    'Nenhum arquivo especificado'
                  )}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Data de Criação:</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(viewingModelo.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminModelosInspecao;
