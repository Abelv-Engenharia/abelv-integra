import { useState } from "react";
import { Plus, FileText, Download, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UploadModeloContrato } from "@/components/gestao-pessoas/contratos/UploadModeloContrato";
import { CodigosDisponiveis } from "@/components/gestao-pessoas/contratos/CodigosDisponiveis";
import {
  useModelosContratos,
  useCreateModelo,
  useUpdateModelo,
  useDeleteModelo,
  useUploadModelo,
} from "@/hooks/gestao-pessoas/useModelosContratos";
import { ContratoModelo, TipoContratoModelo } from "@/types/gestao-pessoas/contratoModelo";
import { CODIGOS_CONTRATO_DISPONIVEIS } from "@/services/contratos/substituicaoCodigosContratoService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ModelosContratos() {
  const { data: modelos, isLoading } = useModelosContratos();
  const createModelo = useCreateModelo();
  const updateModelo = useUpdateModelo();
  const deleteModelo = useDeleteModelo();
  const uploadModelo = useUploadModelo();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingModelo, setEditingModelo] = useState<ContratoModelo | null>(null);
  const [deletingModelo, setDeletingModelo] = useState<ContratoModelo | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo_contrato: 'prestacao_servico' as TipoContratoModelo,
    ativo: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenDialog = (modelo?: ContratoModelo) => {
    if (modelo) {
      setEditingModelo(modelo);
      setFormData({
        nome: modelo.nome,
        descricao: modelo.descricao || '',
        tipo_contrato: modelo.tipo_contrato,
        ativo: modelo.ativo,
      });
    } else {
      setEditingModelo(null);
      setFormData({
        nome: '',
        descricao: '',
        tipo_contrato: 'prestacao_servico',
        ativo: true,
      });
      setSelectedFile(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingModelo(null);
    setFormData({
      nome: '',
      descricao: '',
      tipo_contrato: 'prestacao_servico',
      ativo: true,
    });
    setSelectedFile(null);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (!editingModelo && !selectedFile) {
      toast.error('Arquivo é obrigatório');
      return;
    }

    try {
      let arquivoUrl = editingModelo?.arquivo_url || '';
      let arquivoNome = editingModelo?.arquivo_nome || '';

      // Upload do arquivo se houver um novo
      if (selectedFile) {
        const uploadResult = await uploadModelo.mutateAsync({
          file: selectedFile,
          modeloId: editingModelo?.id,
        });
        arquivoUrl = uploadResult.url;
        arquivoNome = uploadResult.nome;
      }

      if (editingModelo) {
        // Atualizar
        await updateModelo.mutateAsync({
          id: editingModelo.id,
          updates: {
            ...formData,
            arquivo_url: arquivoUrl,
            arquivo_nome: arquivoNome,
            codigos_disponiveis: CODIGOS_CONTRATO_DISPONIVEIS,
          },
        });
      } else {
        // Criar
        await createModelo.mutateAsync({
          ...formData,
          arquivo_url: arquivoUrl,
          arquivo_nome: arquivoNome,
          codigos_disponiveis: CODIGOS_CONTRATO_DISPONIVEIS,
          created_by: null,
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleDelete = async () => {
    if (!deletingModelo) return;
    
    await deleteModelo.mutateAsync(deletingModelo.id);
    setDeleteDialogOpen(false);
    setDeletingModelo(null);
  };

  const handleDownload = async (modelo: ContratoModelo) => {
    try {
      const { data } = await supabase.storage
        .from('contratos-modelos')
        .createSignedUrl(modelo.arquivo_url.split('/').pop() || '', 3600);
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Erro ao baixar:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const getTipoLabel = (tipo: TipoContratoModelo) => {
    const labels = {
      prestacao_servico: 'Prestação de Serviço',
      aditivo: 'Aditivo',
      distrato: 'Distrato',
    };
    return labels[tipo];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando modelos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Modelos de contratos</h1>
          <p className="text-muted-foreground">
            Gerencie os modelos de contratos com códigos dinâmicos
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo modelo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modelos?.map((modelo) => (
          <Card key={modelo.id} className="p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {modelo.nome}
                </h3>
                {modelo.descricao && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {modelo.descricao}
                  </p>
                )}
              </div>
              {modelo.ativo ? (
                <Power className="h-4 w-4 text-green-600" />
              ) : (
                <PowerOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-2">
              <Badge variant="outline">{getTipoLabel(modelo.tipo_contrato)}</Badge>
              <p className="text-xs text-muted-foreground">
                {modelo.arquivo_nome}
              </p>
              <p className="text-xs text-muted-foreground">
                Criado em {new Date(modelo.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(modelo)}
                className="flex-1"
              >
                <Download className="h-3 w-3 mr-1" />
                Baixar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenDialog(modelo)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDeletingModelo(modelo);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Dialog de criação/edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingModelo ? 'Editar modelo' : 'Novo modelo'}
            </DialogTitle>
            <DialogDescription>
              {editingModelo
                ? 'Atualize as informações do modelo de contrato'
                : 'Crie um novo modelo de contrato com códigos dinâmicos'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ex: Contrato Padrão Prestação de Serviço"
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Descreva o modelo e quando utilizá-lo"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tipo_contrato">Tipo de contrato *</Label>
                <Select
                  value={formData.tipo_contrato}
                  onValueChange={(value: TipoContratoModelo) =>
                    setFormData({ ...formData, tipo_contrato: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prestacao_servico">
                      Prestação de serviço
                    </SelectItem>
                    <SelectItem value="aditivo">Aditivo</SelectItem>
                    <SelectItem value="distrato">Distrato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, ativo: checked })
                  }
                />
                <Label htmlFor="ativo">Modelo ativo</Label>
              </div>

              <div>
                <Label>Arquivo do modelo *</Label>
                <UploadModeloContrato
                  onFileSelect={setSelectedFile}
                  selectedFile={selectedFile}
                  onClear={() => setSelectedFile(null)}
                />
              </div>
            </div>

            <div>
              <CodigosDisponiveis />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingModelo ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o modelo "{deletingModelo?.nome}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingModelo(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
