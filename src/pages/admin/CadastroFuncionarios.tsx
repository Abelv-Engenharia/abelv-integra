
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FuncionarioForm } from "@/components/admin/funcionarios/FuncionarioForm";
import { FuncionariosTable } from "@/components/admin/funcionarios/FuncionariosTable";
import { FuncionarioAutocomplete } from "@/components/admin/funcionarios/FuncionarioAutocomplete";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { Funcionario, FuncionarioFormData } from "@/types/funcionarios";

const CadastroFuncionarios = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const {
    funcionarios,
    ccas,
    loadingFuncionarios,
    createFuncionarioMutation,
    deleteFuncionarioMutation
  } = useFuncionarios();

  const handleEdit = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario);
    setIsDialogOpen(true);
  };

  const handleNewFuncionario = () => {
    setEditingFuncionario(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = (formData: FuncionarioFormData, photoFile: File | null, photoRemoved: boolean) => {
    createFuncionarioMutation.mutate({ 
      funcionario: formData, 
      editingFuncionario, 
      photoFile, 
      photoRemoved 
    });
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingFuncionario(null);
  };

  const handleDelete = (id: string) => {
    deleteFuncionarioMutation.mutate(id);
  };

  // Atualiza o estado de busca conforme digitado
  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleSearchClear = () => {
    setSearchText("");
  };

  // Filtra funcionários conforme texto digitado
  const filteredFuncionarios = searchText.trim().length > 0
    ? funcionarios.filter(func =>
        func.nome.toLowerCase().includes(searchText.trim().toLowerCase())
      )
    : funcionarios;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Administração de Funcionários</h1>
        <div className="flex-1 max-w-md">
          {/* Busca por nome */}
          <FuncionarioAutocomplete
            funcionarios={funcionarios}
            search={searchText}
            onSearchChange={handleSearchChange}
            onSelect={() => {}} // Não precisa tratar seleção, busca é livre agora
          />
          {/* Exibir botão para limpar busca, caso haja filtro */}
          {searchText.trim().length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="mt-2"
              onClick={handleSearchClear}
            >
              Limpar busca
            </Button>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewFuncionario}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFuncionario ? "Editar Funcionário" : "Novo Funcionário"}
              </DialogTitle>
            </DialogHeader>
            <FuncionarioForm
              editingFuncionario={editingFuncionario}
              ccas={ccas}
              isLoading={createFuncionarioMutation.isPending}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <FuncionariosTable
            funcionarios={filteredFuncionarios}
            isLoading={loadingFuncionarios}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroFuncionarios;

