
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useModelosInspecao, ModeloInspecao } from "@/hooks/inspecao-sms/useModelosInspecao";
import ModeloInspecaoForm from "@/components/inspecao-sms/ModeloInspecaoForm";

const CAMPOS_CABECALHO_LABELS: Record<string, string> = {
  cca: 'CCA',
  engenheiro_responsavel: 'Engenheiro',
  supervisor_responsavel: 'Supervisor',
  encarregado_responsavel: 'Encarregado',
  responsavel_inspecao: 'Responsável',
  local: 'Local',
  data: 'Data',
  hora: 'Hora',
};

const AdminModelosInspecao = () => {
  const { modelos, isLoading, createModelo, updateModelo, deleteModelo } = useModelosInspecao();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModelo, setEditingModelo] = useState<ModeloInspecao | null>(null);
  const [viewingModelo, setViewingModelo] = useState<ModeloInspecao | null>(null);

  console.log("Modelos carregados:", modelos);

  const handleSubmit = (formData: any) => {
    console.log("Submitting form data:", formData);
    if (editingModelo) {
      updateModelo({ id: editingModelo.id, ...formData });
    } else {
      createModelo(formData);
    }
    setDialogOpen(false);
    setEditingModelo(null);
  };

  const handleEdit = (modelo: ModeloInspecao) => {
    console.log("Editing modelo:", modelo);
    setEditingModelo(modelo);
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

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingModelo(null);
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
            <Button onClick={resetDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Modelo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingModelo ? 'Editar Modelo' : 'Novo Modelo de Inspeção'}
              </DialogTitle>
            </DialogHeader>
            <ModeloInspecaoForm
              modelo={editingModelo || undefined}
              onSubmit={handleSubmit}
              onCancel={resetDialog}
            />
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
                <TableHead>Campos Cabeçalho</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum modelo cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                modelos.map((modelo) => (
                  <TableRow key={modelo.id}>
                    <TableCell className="font-medium">{modelo.nome}</TableCell>
                    <TableCell>{modelo.tipos_inspecao_sms?.nome || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(modelo.campos_cabecalho) && modelo.campos_cabecalho.slice(0, 3).map((campo) => (
                          <Badge key={campo} variant="secondary" className="text-xs">
                            {CAMPOS_CABECALHO_LABELS[campo] || campo}
                          </Badge>
                        ))}
                        {Array.isArray(modelo.campos_cabecalho) && modelo.campos_cabecalho.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{modelo.campos_cabecalho.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {Array.isArray(modelo.itens_verificacao) ? modelo.itens_verificacao.length : 0} itens
                      </Badge>
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
                <h4 className="font-semibold mb-2">Descrição:</h4>
                <p className="text-sm text-muted-foreground">
                  {viewingModelo.descricao || 'Sem descrição'}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Campos do Cabeçalho:</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(viewingModelo.campos_cabecalho) && viewingModelo.campos_cabecalho.map((campo) => (
                    <Badge key={campo} variant="secondary">
                      {CAMPOS_CABECALHO_LABELS[campo] || campo}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Itens de Verificação:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {Array.isArray(viewingModelo.itens_verificacao) && viewingModelo.itens_verificacao.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{item.descricao}</span>
                      {item.categoria && (
                        <Badge variant="outline" className="text-xs">
                          {item.categoria}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminModelosInspecao;
