import { useState } from "react";
import { ArrowLeft, FolderOpen, Plus, Edit2, Trash2, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { categoriasmock, type categoria } from "@/data/repositorioMockData";
import { toast } from "@/hooks/use-toast";

const DocumentCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState({
    nome: "",
    descricao: ""
  });
  const [editingCategory, setEditingCategory] = useState<categoria | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categoriasFiltradas = categoriasmock.filter(categoria =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    if (!newCategory.nome) return;
    
    toast({
      title: "Categoria criada com sucesso!",
      description: `A categoria "${newCategory.nome}" foi criada.`,
    });
    
    setNewCategory({ nome: "", descricao: "" });
    setIsDialogOpen(false);
  };

  const handleEditCategory = (categoria: categoria) => {
    setEditingCategory(categoria);
    setIsDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    
    toast({
      title: "Categoria atualizada com sucesso!",
      description: `A categoria "${editingCategory.nome}" foi atualizada.`,
    });
    
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (categoria: categoria) => {
    toast({
      title: "Categoria excluída",
      description: `A categoria "${categoria.nome}" foi excluída.`,
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/comercial/repositorio/documentos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categorias de Documentos</h1>
            <p className="text-muted-foreground">Organize seus documentos em categorias</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              onClick={() => {
                setEditingCategory(null);
                setNewCategory({ nome: "", descricao: "" });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory 
                  ? "Atualize as informações da categoria" 
                  : "Crie uma nova categoria para organizar seus documentos"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Categoria *</Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome da categoria"
                  value={editingCategory ? editingCategory.nome : newCategory.nome}
                  onChange={(e) => {
                    if (editingCategory) {
                      setEditingCategory({ ...editingCategory, nome: e.target.value });
                    } else {
                      setNewCategory(prev => ({ ...prev, nome: e.target.value }));
                    }
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o tipo de documentos desta categoria"
                  value={editingCategory ? editingCategory.descricao : newCategory.descricao}
                  onChange={(e) => {
                    if (editingCategory) {
                      setEditingCategory({ ...editingCategory, descricao: e.target.value });
                    } else {
                      setNewCategory(prev => ({ ...prev, descricao: e.target.value }));
                    }
                  }}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                  disabled={editingCategory ? !editingCategory.nome : !newCategory.nome}
                >
                  {editingCategory ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Buscar categorias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoriasFiltradas.map((categoria) => (
          <Card key={categoria.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${categoria.cor} bg-opacity-20`}>
                    <FolderOpen className={`h-6 w-6 text-white`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{categoria.nome}</CardTitle>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditCategory(categoria)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCategory(categoria)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {categoria.descricao}
              </CardDescription>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Subpastas:</h4>
                <div className="grid grid-cols-1 gap-1">
                  {categoria.subcategorias.map((subcategoria) => (
                    <div key={subcategoria.id} className="flex items-center gap-2 p-1 rounded hover:bg-muted/50 cursor-pointer">
                      <FolderOpen className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{subcategoria.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {categoria.quantidadedocumentos} documento{categoria.quantidadedocumentos !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <Badge variant="secondary" className="text-xs">
                  Ativa
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categoriasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhuma categoria encontrada
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "Tente ajustar sua busca" : "Crie sua primeira categoria para organizar os documentos"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentCategories;
