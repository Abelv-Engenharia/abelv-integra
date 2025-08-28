import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

interface ItemAvaliacao {
  id: string;
  texto: string;
}

interface CampoDisponivel {
  id: string;
  nome: string;
  descricao: string;
}

interface ChecklistAvaliacao {
  id: string;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  campos_cabecalho: Json;
  itens_avaliacao: Json;
  created_at: string;
}

const AdminChecklists = () => {
  const [checklists, setChecklists] = useState<ChecklistAvaliacao[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<ChecklistAvaliacao | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ativo: true,
    campos_cabecalho: [] as string[],
    itens_avaliacao: [] as ItemAvaliacao[]
  });
  const [novoItem, setNovoItem] = useState('');
  const { toast } = useToast();

  // Campos disponíveis para seleção no cabeçalho
  const camposDisponiveis: CampoDisponivel[] = [
    { id: 'cca', nome: 'CCA', descricao: 'Centro de Custo de Atividade' },
    { id: 'engenheiro_responsavel', nome: 'Engenheiro Responsável', descricao: 'Engenheiro responsável pelo CCA' },
    { id: 'supervisor_responsavel', nome: 'Supervisor Responsável', descricao: 'Supervisor responsável pelo CCA' },
    { id: 'encarregado_responsavel', nome: 'Encarregado Responsável', descricao: 'Encarregado responsável pelo CCA' },
    { id: 'empresa', nome: 'Empresa', descricao: 'Empresa vinculada ao CCA' },
    { id: 'disciplina', nome: 'Disciplina', descricao: 'Disciplina da inspeção' },
    { id: 'responsavel_inspecao', nome: 'Responsável pela Inspeção', descricao: 'Usuário responsável pela inspeção' },
  ];

  const loadChecklists = async () => {
    try {
      const { data, error } = await supabase
        .from('checklists_avaliacao')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) throw error;
      
      if (data) {
        setChecklists(data);
      }
    } catch (error: any) {
      console.error('Erro ao carregar checklists:', error);
      toast({
        title: "Erro ao carregar checklists",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dadosChecklist = {
        nome: formData.nome,
        descricao: formData.descricao || null,
        ativo: formData.ativo,
        campos_cabecalho: formData.campos_cabecalho as unknown as Json,
        itens_avaliacao: formData.itens_avaliacao as unknown as Json
      };

      if (editingChecklist) {
        const { error } = await supabase
          .from('checklists_avaliacao')
          .update(dadosChecklist)
          .eq('id', editingChecklist.id);
        
        if (error) throw error;
        
        toast({
          title: "Checklist atualizado com sucesso!",
          description: "O checklist foi atualizado.",
        });
      } else {
        const { error } = await supabase
          .from('checklists_avaliacao')
          .insert([dadosChecklist]);
        
        if (error) throw error;
        
        toast({
          title: "Checklist cadastrado com sucesso!",
          description: "O checklist foi criado.",
        });
      }

      setDialogOpen(false);
      resetForm();
      loadChecklists();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar checklist",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este checklist?')) return;
    
    try {
      const { error } = await supabase
        .from('checklists_avaliacao')
        .update({ ativo: false })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Checklist excluído com sucesso!",
        description: "O checklist foi removido da lista.",
      });
      
      loadChecklists();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir checklist",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      ativo: true,
      campos_cabecalho: [],
      itens_avaliacao: []
    });
    setNovoItem('');
    setEditingChecklist(null);
  };

  const openEditDialog = (checklist: ChecklistAvaliacao) => {
    setEditingChecklist(checklist);
    setFormData({
      nome: checklist.nome,
      descricao: checklist.descricao || '',
      ativo: checklist.ativo,
      campos_cabecalho: Array.isArray(checklist.campos_cabecalho) ? checklist.campos_cabecalho as unknown as string[] : [],
      itens_avaliacao: Array.isArray(checklist.itens_avaliacao) ? checklist.itens_avaliacao as unknown as ItemAvaliacao[] : []
    });
    setDialogOpen(true);
  };

  const handleCampoChange = (campoId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        campos_cabecalho: [...prev.campos_cabecalho, campoId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        campos_cabecalho: prev.campos_cabecalho.filter(campo => campo !== campoId)
      }));
    }
  };

  const adicionarItem = () => {
    if (novoItem.trim()) {
      const novoItemObj: ItemAvaliacao = {
        id: Date.now().toString(),
        texto: novoItem.trim()
      };
      setFormData(prev => ({
        ...prev,
        itens_avaliacao: [...prev.itens_avaliacao, novoItemObj]
      }));
      setNovoItem('');
    }
  };

  const removerItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itens_avaliacao: prev.itens_avaliacao.filter((_, i) => i !== index)
    }));
  };

  const getCamposCabecalho = (campos: Json): string[] => {
    return Array.isArray(campos) ? campos as string[] : [];
  };

  const getCampoNome = (campoId: string): string => {
    const campo = camposDisponiveis.find(c => c.id === campoId);
    return campo ? campo.nome : campoId;
  };

  const getItensAvaliacao = (itens: Json): ItemAvaliacao[] => {
    return Array.isArray(itens) ? itens as unknown as ItemAvaliacao[] : [];
  };

  useEffect(() => {
    loadChecklists();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Checklists de Avaliação</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Checklist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingChecklist ? 'Editar Checklist' : 'Novo Checklist'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome do Checklist *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Digite o nome do checklist"
                    required
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Label htmlFor="ativo">Checklist Ativo</Label>
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Digite a descrição do checklist"
                  rows={3}
                />
              </div>

              <div>
                <Label>Campos do Cabeçalho</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Selecione os campos que aparecerão no cabeçalho do checklist
                </p>
                <div className="space-y-3">
                  {camposDisponiveis.map((campo) => (
                    <div key={campo.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={campo.id}
                        checked={formData.campos_cabecalho.includes(campo.id)}
                        onCheckedChange={(checked) => handleCampoChange(campo.id, checked as boolean)}
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={campo.id} 
                          className="text-sm font-medium cursor-pointer"
                        >
                          {campo.nome}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {campo.descricao}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {formData.campos_cabecalho.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Campos Selecionados:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.campos_cabecalho.map((campoId) => (
                          <Badge key={campoId} variant="secondary">
                            {getCampoNome(campoId)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Itens de Avaliação</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={novoItem}
                      onChange={(e) => setNovoItem(e.target.value)}
                      placeholder="Adicionar item"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarItem())}
                    />
                    <Button type="button" onClick={adicionarItem} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.itens_avaliacao.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{item.texto}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removerItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingChecklist ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Checklists Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Campos Cabeçalho</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Data Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum checklist cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                checklists.map((checklist) => (
                  <TableRow key={checklist.id}>
                    <TableCell className="font-medium">{checklist.nome}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {checklist.descricao || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getCamposCabecalho(checklist.campos_cabecalho).slice(0, 2).map((campoId, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {getCampoNome(campoId)}
                          </Badge>
                        ))}
                        {getCamposCabecalho(checklist.campos_cabecalho).length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{getCamposCabecalho(checklist.campos_cabecalho).length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getItensAvaliacao(checklist.itens_avaliacao).length} itens
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(checklist.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(checklist)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(checklist.id)}
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
    </div>
  );
};

export default AdminChecklists;