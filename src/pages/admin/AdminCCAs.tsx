
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw } from "lucide-react";
import { CCAsTable } from "@/components/admin/ccas/CCAsTable";
import { CreateCCADialog } from "@/components/admin/ccas/CreateCCADialog";
import { EditCCADialog } from "@/components/admin/ccas/EditCCADialog";
import { DeleteCCADialog } from "@/components/admin/ccas/DeleteCCADialog";
import { ccaService } from "@/services/admin/ccaService";

const AdminCCAs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editCCA, setEditCCA] = useState(null);
  const [deleteCCA, setDeleteCCA] = useState(null);

  const { data: ccas = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-ccas'],
    queryFn: ccaService.getAll,
    refetchOnWindowFocus: false,
  });

  const filteredCCAs = ccas.filter(cca =>
    cca.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cca.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cca.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (cca) => {
    setEditCCA(cca);
  };

  const handleDelete = (cca) => {
    setDeleteCCA(cca);
  };

  const handleSuccess = () => {
    refetch();
    setCreateDialogOpen(false);
    setEditCCA(null);
    setDeleteCCA(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Administração de CCAs</h1>
          <p className="text-muted-foreground">
            Gerencie os Centros de Custo e Áreas (CCAs) do sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo CCA
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, código ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de CCAs */}
      <Card>
        <CardHeader>
          <CardTitle>CCAs Cadastrados ({filteredCCAs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <CCAsTable
            ccas={filteredCCAs}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Diálogos */}
      <CreateCCADialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleSuccess}
      />

      {editCCA && (
        <EditCCADialog
          cca={editCCA}
          open={!!editCCA}
          onOpenChange={(open) => !open && setEditCCA(null)}
          onSuccess={handleSuccess}
        />
      )}

      {deleteCCA && (
        <DeleteCCADialog
          cca={deleteCCA}
          open={!!deleteCCA}
          onOpenChange={(open) => !open && setDeleteCCA(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default AdminCCAs;
