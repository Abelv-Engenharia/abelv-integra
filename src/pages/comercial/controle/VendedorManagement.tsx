import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useVendedores } from "@/hooks/comercial/useVendedores";
import AddVendedorDialog from "@/components/comercial/AddVendedorDialog";
import EditVendedorDialog from "@/components/comercial/EditVendedorDialog";

export default function VendedorManagement() {
  const { 
    vendedores, 
    usuarios, 
    isLoading, 
    isLoadingUsuarios,
    addVendedor, 
    updateVendedor, 
    removeVendedor 
  } = useVendedores();

  const handleAdicionar = (usuarioId: string) => {
    addVendedor.mutate(usuarioId);
  };

  const handleEditar = (id: string, ativo: boolean) => {
    updateVendedor.mutate({ id, ativo });
  };

  const handleRemover = (id: string) => {
    removeVendedor.mutate(id);
  };

  if (isLoading || isLoadingUsuarios) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const vendedoresIds = vendedores.map(v => v.usuario_id);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar vendedores</h1>
          <p className="text-muted-foreground">
            Adicione ou remova vendedores da equipe
          </p>
        </div>
        <AddVendedorDialog 
          usuarios={usuarios}
          vendedoresExistentes={vendedoresIds}
          onAdd={handleAdicionar} 
          isLoading={addVendedor.isPending}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendedores cadastrados ({vendedores.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {vendedores.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum vendedor cadastrado
            </p>
          ) : (
            <div className="space-y-2">
              {vendedores.map((vendedor) => (
                <div
                  key={vendedor.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{vendedor.profiles.nome}</span>
                      <span className="text-sm text-muted-foreground">
                        {vendedor.profiles.email}
                      </span>
                    </div>
                    <Badge variant={vendedor.ativo ? "default" : "secondary"}>
                      {vendedor.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <EditVendedorDialog
                      vendedor={{
                        id: vendedor.id,
                        ativo: vendedor.ativo,
                        nome: vendedor.profiles.nome
                      }}
                      onUpdate={handleEditar}
                      isLoading={updateVendedor.isPending}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemover(vendedor.id)}
                      disabled={removeVendedor.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
