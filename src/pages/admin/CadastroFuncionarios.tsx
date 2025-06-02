
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FuncionarioForm } from "@/components/admin/funcionarios/FuncionarioForm";
import { FuncionariosTable } from "@/components/admin/funcionarios/FuncionariosTable";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { Funcionario, FuncionarioFormData } from "@/types/funcionarios";

const CadastroFuncionarios = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administração de Funcionários</h1>
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
            funcionarios={funcionarios}
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
