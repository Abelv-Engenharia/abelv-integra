import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { empresaSiengeService } from "@/services/admin/empresaSiengeService";
import EmpresasSiengeTable from "@/components/admin/empresas-sienge/EmpresasSiengeTable";
import CreateEmpresaSiengeDialog from "@/components/admin/empresas-sienge/CreateEmpresaSiengeDialog";
import { usePermissionsDirect } from "@/hooks/usePermissionsDirect";

export default function AdminEmpresasSienge() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { hasPermission } = usePermissionsDirect();
  
  const canManage = hasPermission("admin_empresas");

  const { data: empresas = [], refetch } = useQuery({
    queryKey: ["empresas-sienge"],
    queryFn: empresaSiengeService.getAll,
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Empresas (sienge)</h1>
          <p className="text-muted-foreground mt-1">Gerencie as empresas do sienge</p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova empresa
          </Button>
        )}
      </div>

      <EmpresasSiengeTable empresas={empresas} onUpdate={refetch} />

      <CreateEmpresaSiengeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
