import React from "react";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";
import DesvioDetailsDialog from "./DesvioDetailsDialog";
import EditDesvioDialog from "./EditDesvioDialog";
import DeleteDesvioDialog from "./DeleteDesvioDialog";
import { DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import { Button } from "@/components/ui/button";
interface Props {
  desvio: DesvioCompleto;
  onStatusUpdated: (id: string, newStatus: string) => void;
  onEditClick: (desvio: DesvioCompleto) => void;
  onDesvioDeleted: (id?: string, deleted?: boolean) => void;
  editDesvioId: string | null;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  onDesvioUpdated: () => void;
}
const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "";
const DesviosTableRow = ({
  desvio,
  onStatusUpdated,
  onEditClick,
  onDesvioDeleted,
  editDesvioId,
  editDialogOpen,
  setEditDialogOpen,
  onDesvioUpdated
}: Props) => {
  return <tr>
      <td className="font-medium">{desvio.id?.slice(0, 8)}...</td>
      <td>{formatDate(desvio.data_desvio)}</td>
      <td className="max-w-[250px] truncate py-[20px] px-0 mx-0 my-[3px]">
        {desvio.descricao_desvio?.substring(0, 60)}
        {desvio.descricao_desvio && desvio.descricao_desvio.length > 60 ? "..." : ""}
      </td>
      <td className="py-0 my-[9px] px-px mx-0">{(desvio as any).ccas?.nome || "N/A"}</td>
      <td>
        <RiskBadge risk={desvio.classificacao_risco} />
      </td>
      <td>
        <StatusBadge status={desvio.status} />
      </td>
      <td className="text-right">
        <div className="flex justify-end gap-2">
          <DesvioDetailsDialog desvio={desvio} onStatusUpdated={onStatusUpdated} />
          <Button variant="ghost" size="icon" onClick={() => onEditClick(desvio)}>
            <span className="sr-only">Editar</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5l4 4L6 22H2v-4L16.5 3.5z" /></svg>
          </Button>
          <DeleteDesvioDialog desvio={desvio} onDesvioDeleted={onDesvioDeleted} />
          {/* Modal de edição fora para garantir consistência do dialog em múltiplas linhas */}
          {editDesvioId === desvio.id && <EditDesvioDialog desvio={desvio} open={editDialogOpen} onOpenChange={setEditDialogOpen} onDesvioUpdated={onDesvioUpdated} />}
        </div>
      </td>
    </tr>;
};
export default DesviosTableRow;