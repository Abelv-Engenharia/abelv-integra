import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { EmpresaSienge } from "@/services/admin/empresaSiengeService";
import { useState } from "react";
import EditEmpresaSiengeDialog from "./EditEmpresaSiengeDialog";
import DeleteEmpresaSiengeDialog from "./DeleteEmpresaSiengeDialog";
import { usePermissionsDirect } from "@/hooks/usePermissionsDirect";

interface EmpresasSiengeTableProps {
  empresas: EmpresaSienge[];
  onUpdate: () => void;
}

export default function EmpresasSiengeTable({ empresas, onUpdate }: EmpresasSiengeTableProps) {
  const [editingEmpresa, setEditingEmpresa] = useState<EmpresaSienge | null>(null);
  const [deletingEmpresa, setDeletingEmpresa] = useState<EmpresaSienge | null>(null);
  const { hasPermission } = usePermissionsDirect();
  
  const canManage = hasPermission("admin_empresas");

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id sienge</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Nome fantasia</TableHead>
              <TableHead>Cnpj</TableHead>
              {canManage && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 5 : 4} className="text-center text-muted-foreground">
                  Nenhuma empresa encontrada
                </TableCell>
              </TableRow>
            ) : (
              empresas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell>{empresa.id_sienge}</TableCell>
                  <TableCell>{empresa.name}</TableCell>
                  <TableCell>{empresa.tradeName || "-"}</TableCell>
                  <TableCell>{empresa.cnpj || "-"}</TableCell>
                  {canManage && (
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingEmpresa(empresa)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingEmpresa(empresa)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingEmpresa && (
        <EditEmpresaSiengeDialog
          empresa={editingEmpresa}
          open={!!editingEmpresa}
          onOpenChange={(open) => !open && setEditingEmpresa(null)}
          onSuccess={() => {
            setEditingEmpresa(null);
            onUpdate();
          }}
        />
      )}

      {deletingEmpresa && (
        <DeleteEmpresaSiengeDialog
          empresa={deletingEmpresa}
          open={!!deletingEmpresa}
          onOpenChange={(open) => !open && setDeletingEmpresa(null)}
          onSuccess={() => {
            setDeletingEmpresa(null);
            onUpdate();
          }}
        />
      )}
    </>
  );
}
