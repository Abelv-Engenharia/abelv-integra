
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileUp, Trash2, Edit2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminModelosInspecao = () => {
  const [modelos, setModelos] = useState<any[]>([]);
  const [tiposInspecao, setTiposInspecao] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModelo, setEditingModelo] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipo_inspecao_id: '',
    arquivo_modelo_url: '',
    campos_substituicao: '[]'
  });
  const [arquivo, setArquivo] = useState<File | null>(null);

  const loadModelos = async () => {
    try {
      const { data } = await supabase
        .from('modelos_inspecao_sms')
        .select(`
          *,
          tipos_inspecao_sms(nome)
        `)
        .eq('ativo', true)
        .order('nome');
      
      if (data) {
        setModelos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    }
  };

  const loadTiposInspecao = async () => {
    try {
      const { data } = await supabase
        .from('tipos_inspecao_sms')
        .select('*')
        .eq('ativo', true);
      
      if (data) {
        setTiposInspecao(data);
      }
    } catch (error) {
      console.error('Erro ao carregar tipos de inspeção:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      // Por enquanto, vamos simular o upload
      // Em produção, isso seria feito com o Supabase Storage
      const fileName = `modelo_${Date.now()}_${file.name}`;
      return `/uploads/modelos/${fileName}`;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let arquivoUrl = formData.arquivo_modelo_url;
      
      if (arquivo) {
        arquivoUrl = await handleFileUpload(arquivo);
      }

      const dadosModelo = {
        ...formData,
        arquivo_modelo_url: arquivoUrl,
        campos_substituicao: JSON.parse(formData.campos_substituicao || '[]')
      };

      if (editingModelo) {
        const { error } = await supabase
          .from('modelos_inspecao_sms')
          .update(dadosModelo)
          .eq('id', editingModelo.id);
        
        if (error) throw error;
        
        toast({
          title: "Modelo atualizado com sucesso!",
          description: "O modelo de inspeção foi atualizado.",
        });
      } else {
        const { error } = await supabase
          .from('modelos_inspecao_sms')
          .insert([dadosModelo]);
        
        if (error) throw error;
        
        toast({
          title: "Modelo cadastrado com sucesso!",
          description: "O modelo de inspeção foi criado.",
        });
      }

      setDialogOpen(false);
      resetForm();
      loadModelos();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar modelo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este modelo?')) return;
    
    try {
      const { error } = await supabase
        .from('modelos_inspecao_sms')
        .update({ ativo: false })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Modelo excluído com sucesso!",
        description: "O modelo foi removido da lista.",
      });
      
      loadModelos();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir modelo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo_inspecao_id: '',
      arquivo_modelo_url: '',
      campos_substituicao: '[]'
    });
    setArquivo(null);
    setEditingModelo(null);
  };

  const openEditDialog = (modelo: any) => {
    setEditingModelo(modelo);
    setFormData({
      nome: modelo.nome,
      tipo_inspecao_id: modelo.tipo_inspecao_id,
      arquivo_modelo_url: modelo.arquivo_modelo_url,
      campos_substituicao: JSON.stringify(modelo.campos_substituicao || [])
    });
    setDialogOpen(true);
  };

  useEffect(() => {
    loadModelos();
    loadTiposInspecao();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modelos de Inspeção SMS</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
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
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="tipo">Tipo de Inspeção *</Label>
                <Select 
                  value={formData.tipo_inspecao_id} 
                  onValueChange={(value) => setFormData({...formData, tipo_inspecao_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposInspecao.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="arquivo">Arquivo Excel (.xlsx) *</Label>
                <Input
                  id="arquivo"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                  required={!editingModelo}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  O arquivo deve conter códigos de substituição como: {`{{data}}, {{local}}, {{responsavel}}`}
                </p>
              </div>

              <div>
                <Label htmlFor="campos">Campos de Substituição (JSON)</Label>
                <Textarea
                  id="campos"
                  value={formData.campos_substituicao}
                  onChange={(e) => setFormData({...formData, campos_substituicao: e.target.value})}
                  placeholder='["data", "local", "responsavel", "item1_status"]'
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lista dos campos que podem ser substituídos no formato JSON
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingModelo ? 'Atualizar' : 'Cadastrar'}
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
                <TableHead>Tipo de Inspeção</TableHead>
                <TableHead>Campos Substituição</TableHead>
                <TableHead>Data Cadastro</TableHead>
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
                    <TableCell>{modelo.tipos_inspecao_sms?.nome}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(modelo.campos_substituicao || []).slice(0, 3).map((campo: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {campo}
                          </Badge>
                        ))}
                        {(modelo.campos_substituicao || []).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(modelo.campos_substituicao || []).length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(modelo.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(modelo.arquivo_modelo_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(modelo)}
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
    </div>
  );
};

export default AdminModelosInspecao;
