import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw, FileText } from "lucide-react";
import { TiposDocumentosTable } from "@/components/admin/tipos-documentos/TiposDocumentosTable";
import { CreateTipoDocumentoDialog } from "@/components/admin/tipos-documentos/CreateTipoDocumentoDialog";
import { EditTipoDocumentoDialog } from "@/components/admin/tipos-documentos/EditTipoDocumentoDialog";
import { DeleteTipoDocumentoDialog } from "@/components/admin/tipos-documentos/DeleteTipoDocumentoDialog";
import { tipoDocumentoService, TipoDocumento } from "@/services/admin/tipoDocumentoService";

const AdminTiposDocumentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDocumento, setEditDocumento] = useState<TipoDocumento | null>(null);
  const [deleteDocumento, setDeleteDocumento] = useState<TipoDocumento | null>(null);
  const queryClient = useQueryClient();

  const { data: documentos = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-tipos-documentos'],
    queryFn: tipoDocumentoService.getAll,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const filteredDocumentos = documentos.filter(doc =>
    doc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (documento: TipoDocumento) => {
    setEditDocumento(documento);
  };

  const handleDelete = (documento: TipoDocumento) => {
    setDeleteDocumento(documento);
  };

  const handleSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin-tipos-documentos'] });
    setCreateDialogOpen(false);
    setEditDocumento(null);
    setDeleteDocumento(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Tipos de Documentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie os tipos de documentos do sistema
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
            Novo Tipo
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
                  placeholder="Buscar por código ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Tipos de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos Cadastrados ({filteredDocumentos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TiposDocumentosTable
            documentos={filteredDocumentos}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Diálogos */}
      <CreateTipoDocumentoDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleSuccess}
      />

      {editDocumento && (
        <EditTipoDocumentoDialog
          documento={editDocumento}
          open={!!editDocumento}
          onOpenChange={(open) => !open && setEditDocumento(null)}
          onSuccess={handleSuccess}
        />
      )}

      {deleteDocumento && (
        <DeleteTipoDocumentoDialog
          documento={deleteDocumento}
          open={!!deleteDocumento}
          onOpenChange={(open) => !open && setDeleteDocumento(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default AdminTiposDocumentos;
