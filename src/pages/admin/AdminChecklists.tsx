import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit2, Trash2, X, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

interface ItemAvaliacao {
  id: string;
  texto: string;
  secao_id?: string;
}

interface Secao {
  id: string;
  nome: string;
  descricao?: string;
  ordem: number;
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
  secoes?: Json;
  requer_assinatura?: boolean;
  created_at: string;
}

const AdminChecklists = () => {
  const [checklists, setChecklists] = useState<ChecklistAvaliacao[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<ChecklistAvaliacao | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemText, setEditingItemText] = useState('');
  const [editingItemSecao, setEditingItemSecao] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ativo: true,
    campos_cabecalho: [] as string[],
    itens_avaliacao: [] as ItemAvaliacao[],
    secoes: [] as Secao[],
    requer_assinatura: false
  });
  const [novoItem, setNovoItem] = useState('');
  const [novaSecao, setNovaSecao] = useState({ nome: '', descricao: '' });
  const [secaoSelecionada, setSecaoSelecionada] = useState<string>('sem_secao');
  const [visualizandoChecklist, setVisualizandoChecklist] = useState<ChecklistAvaliacao | null>(null);
  const [dialogVisualizacaoOpen, setDialogVisualizacaoOpen] = useState(false);
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
        itens_avaliacao: formData.itens_avaliacao as unknown as Json,
        secoes: formData.secoes as unknown as Json,
        requer_assinatura: formData.requer_assinatura
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
      itens_avaliacao: [],
      secoes: [],
      requer_assinatura: false
    });
    setNovoItem('');
    setNovaSecao({ nome: '', descricao: '' });
    setSecaoSelecionada('sem_secao');
    setEditingChecklist(null);
  };

  const openEditDialog = (checklist: ChecklistAvaliacao) => {
    setEditingChecklist(checklist);
    setFormData({
      nome: checklist.nome,
      descricao: checklist.descricao || '',
      ativo: checklist.ativo,
      campos_cabecalho: Array.isArray(checklist.campos_cabecalho) ? checklist.campos_cabecalho as unknown as string[] : [],
      itens_avaliacao: Array.isArray(checklist.itens_avaliacao) ? checklist.itens_avaliacao as unknown as ItemAvaliacao[] : [],
      secoes: Array.isArray(checklist.secoes) ? checklist.secoes as unknown as Secao[] : [],
      requer_assinatura: checklist.requer_assinatura || false
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

  const adicionarSecao = () => {
    if (novaSecao.nome.trim()) {
      const novaSecaoObj: Secao = {
        id: Date.now().toString(),
        nome: novaSecao.nome.trim(),
        descricao: novaSecao.descricao.trim() || undefined,
        ordem: formData.secoes.length + 1
      };
      setFormData(prev => ({
        ...prev,
        secoes: [...prev.secoes, novaSecaoObj]
      }));
      setNovaSecao({ nome: '', descricao: '' });
    }
  };

  const removerSecao = (secaoId: string) => {
    setFormData(prev => ({
      ...prev,
      secoes: prev.secoes.filter(secao => secao.id !== secaoId),
      itens_avaliacao: prev.itens_avaliacao.map(item => 
        item.secao_id === secaoId ? { ...item, secao_id: undefined } : item
      )
    }));
  };

  const adicionarItem = () => {
    if (novoItem.trim()) {
      const novoItemObj: ItemAvaliacao = {
        id: Date.now().toString(),
        texto: novoItem.trim(),
        secao_id: secaoSelecionada === 'sem_secao' ? undefined : secaoSelecionada
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

  const iniciarEdicaoItem = (item: ItemAvaliacao) => {
    setEditingItemId(item.id);
    setEditingItemText(item.texto);
    setEditingItemSecao(item.secao_id || 'sem_secao');
  };

  const cancelarEdicaoItem = () => {
    setEditingItemId(null);
    setEditingItemText('');
    setEditingItemSecao('');
  };

  const salvarEdicaoItem = () => {
    if (!editingItemText.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      itens_avaliacao: prev.itens_avaliacao.map(item =>
        item.id === editingItemId
          ? {
              ...item,
              texto: editingItemText.trim(),
              secao_id: editingItemSecao === 'sem_secao' ? undefined : editingItemSecao
            }
          : item
      )
    }));
    
    cancelarEdicaoItem();
  };

  const getCamposCabecalho = (campos: Json): string[] => {
    return Array.isArray(campos) ? campos as string[] : [];
  };

  const getSecoes = (secoes: Json): Secao[] => {
    return Array.isArray(secoes) ? secoes as unknown as Secao[] : [];
  };

  const getNomeSecao = (secaoId?: string): string => {
    if (!secaoId) return 'Sem seção';
    const secao = formData.secoes.find(s => s.id === secaoId);
    return secao ? secao.nome : 'Sem seção';
  };

  const getCampoNome = (campoId: string): string => {
    const campo = camposDisponiveis.find(c => c.id === campoId);
    return campo ? campo.nome : campoId;
  };

  const getItensAvaliacao = (itens: Json): ItemAvaliacao[] => {
    return Array.isArray(itens) ? itens as unknown as ItemAvaliacao[] : [];
  };

  const openVisualizacaoDialog = (checklist: ChecklistAvaliacao) => {
    setVisualizandoChecklist(checklist);
    setDialogVisualizacaoOpen(true);
  };

  const closeVisualizacaoDialog = () => {
    setVisualizandoChecklist(null);
    setDialogVisualizacaoOpen(false);
  };

  const renderVisualizacaoChecklist = () => {
    if (!visualizandoChecklist) return null;

    const campos = getCamposCabecalho(visualizandoChecklist.campos_cabecalho);
    const secoes = getSecoes(visualizandoChecklist.secoes || []);
    const itens = getItensAvaliacao(visualizandoChecklist.itens_avaliacao);

    return (
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{visualizandoChecklist.nome}</h3>
          {visualizandoChecklist.descricao && (
            <p className="text-muted-foreground">{visualizandoChecklist.descricao}</p>
          )}
          
          {campos.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Campos do Cabeçalho:</h4>
              <div className="flex flex-wrap gap-2">
                {campos.map((campoId) => (
                  <Badge key={campoId} variant="outline">
                    {getCampoNome(campoId)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Itens organizados por seção */}
        <div className="space-y-4">
          <h4 className="font-medium">Itens de Avaliação:</h4>
          
          {secoes.length > 0 ? (
            // Renderizar itens por seção
            <>
              {secoes.map((secao) => {
                const itensSecao = itens.filter(item => item.secao_id === secao.id);
                if (itensSecao.length === 0) return null;
                
                return (
                  <div key={secao.id} className="space-y-2">
                    <div className="border-l-4 border-primary pl-4">
                      <h5 className="font-medium text-primary">{secao.nome}</h5>
                      {secao.descricao && (
                        <p className="text-sm text-muted-foreground">{secao.descricao}</p>
                      )}
                    </div>
                    <div className="ml-4 space-y-1">
                      {itensSecao.map((item, index) => (
                        <div key={item.id} className="flex items-start gap-2 p-2 border rounded">
                          <span className="text-sm text-muted-foreground mt-1">{index + 1}.</span>
                          <span className="text-sm">{item.texto}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {/* Itens sem seção */}
              {(() => {
                const itensSemSecao = itens.filter(item => !item.secao_id);
                if (itensSemSecao.length === 0) return null;
                
                return (
                  <div className="space-y-2">
                    <div className="border-l-4 border-muted pl-4">
                      <h5 className="font-medium text-muted-foreground">Sem Seção</h5>
                    </div>
                    <div className="ml-4 space-y-1">
                      {itensSemSecao.map((item, index) => (
                        <div key={item.id} className="flex items-start gap-2 p-2 border rounded">
                          <span className="text-sm text-muted-foreground mt-1">{index + 1}.</span>
                          <span className="text-sm">{item.texto}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            // Renderizar itens sem seções
            <div className="space-y-1">
              {itens.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2 p-2 border rounded">
                  <span className="text-sm text-muted-foreground mt-1">{index + 1}.</span>
                  <span className="text-sm">{item.texto}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informações adicionais */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Requer Assinatura:</span>
            <Badge variant={visualizandoChecklist.requer_assinatura ? "default" : "secondary"}>
              {visualizandoChecklist.requer_assinatura ? "Sim" : "Não"}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Total de Itens:</span>
            <Badge variant="secondary">{itens.length}</Badge>
          </div>
        </div>
      </div>
    );
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nome">Nome do Checklist *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Digite o nome do checklist"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="ativo">Checklist Ativo</Label>
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Label htmlFor="assinatura">Requer Assinatura</Label>
                    <Switch
                      id="assinatura"
                      checked={formData.requer_assinatura}
                      onCheckedChange={(checked) => setFormData({...formData, requer_assinatura: checked})}
                    />
                  </div>
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
                <Label>Seções do Checklist</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Crie seções para organizar os itens de verificação (opcional)
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      value={novaSecao.nome}
                      onChange={(e) => setNovaSecao(prev => ({...prev, nome: e.target.value}))}
                      placeholder="Nome da seção"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarSecao())}
                    />
                    <Input
                      value={novaSecao.descricao}
                      onChange={(e) => setNovaSecao(prev => ({...prev, descricao: e.target.value}))}
                      placeholder="Descrição (opcional)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarSecao())}
                    />
                  </div>
                  <Button type="button" onClick={adicionarSecao} size="sm" className="w-full md:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Seção
                  </Button>
                  
                  {formData.secoes.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {formData.secoes.map((secao) => (
                        <div key={secao.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="text-sm font-medium">{secao.nome}</span>
                            {secao.descricao && (
                              <p className="text-xs text-muted-foreground">{secao.descricao}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removerSecao(secao.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Itens de Avaliação</Label>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="md:col-span-2">
                      <Input
                        value={novoItem}
                        onChange={(e) => setNovoItem(e.target.value)}
                        placeholder="Adicionar item"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarItem())}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={secaoSelecionada} onValueChange={setSecaoSelecionada}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Seção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sem_secao">Sem seção</SelectItem>
                          {formData.secoes.map((secao) => (
                            <SelectItem key={secao.id} value={secao.id}>
                              {secao.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={adicionarItem} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.itens_avaliacao.map((item, index) => (
                      <div key={item.id} className="border rounded">
                        {editingItemId === item.id ? (
                          <div className="p-2 space-y-2">
                            <div className="flex gap-2">
                              <Input
                                value={editingItemText}
                                onChange={(e) => setEditingItemText(e.target.value)}
                                placeholder="Texto do item"
                                className="flex-1"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    salvarEdicaoItem();
                                  }
                                  if (e.key === 'Escape') {
                                    e.preventDefault();
                                    cancelarEdicaoItem();
                                  }
                                }}
                              />
                              <Select value={editingItemSecao} onValueChange={setEditingItemSecao}>
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sem_secao">Sem seção</SelectItem>
                                  {formData.secoes.map((secao) => (
                                    <SelectItem key={secao.id} value={secao.id}>
                                      {secao.nome}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={cancelarEdicaoItem}
                              >
                                Cancelar
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={salvarEdicaoItem}
                              >
                                Salvar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-2">
                            <div className="flex-1">
                              <span className="text-sm">{item.texto}</span>
                              {item.secao_id && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                  {getNomeSecao(item.secao_id)}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => iniciarEdicaoItem(item)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removerItem(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
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
                <TableHead>Seções</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Assinatura</TableHead>
                <TableHead>Data Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
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
                      <div className="flex flex-wrap gap-1">
                        {getSecoes(checklist.secoes || []).slice(0, 2).map((secao, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {secao.nome}
                          </Badge>
                        ))}
                        {getSecoes(checklist.secoes || []).length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{getSecoes(checklist.secoes || []).length - 2}
                          </Badge>
                        )}
                        {getSecoes(checklist.secoes || []).length === 0 && (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getItensAvaliacao(checklist.itens_avaliacao).length} itens
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={checklist.requer_assinatura ? "default" : "secondary"}>
                        {checklist.requer_assinatura ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(checklist.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openVisualizacaoDialog(checklist)}
                          title="Visualizar checklist"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(checklist)}
                          title="Editar checklist"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(checklist.id)}
                          title="Excluir checklist"
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

      {/* Dialog de Visualização */}
      <Dialog open={dialogVisualizacaoOpen} onOpenChange={setDialogVisualizacaoOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Checklist</DialogTitle>
          </DialogHeader>
          {renderVisualizacaoChecklist()}
          <div className="flex justify-end">
            <Button variant="outline" onClick={closeVisualizacaoDialog}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChecklists;