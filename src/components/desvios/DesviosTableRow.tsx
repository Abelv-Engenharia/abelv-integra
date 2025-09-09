
import React from "react";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";
import DesvioDetailsDialog from "./DesvioDetailsDialog";
import EditDesvioDialog from "./EditDesvioDialog";
import DeleteDesvioDialog from "./DeleteDesvioDialog";
import { DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import { Button } from "@/components/ui/button";
import { calculateStatusAcao } from "@/utils/desviosUtils";

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

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  
  // Parse the date as a local date to avoid timezone issues
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month é 0-indexado
  
  return date.toLocaleDateString("pt-BR");
};

const DesviosTableRow = ({
  desvio,
  onStatusUpdated,
  onEditClick,
  onDesvioDeleted,
  editDesvioId,
  editDialogOpen,
  setEditDialogOpen,
  onDesvioUpdated,
}: Props) => {
  // Calcular o status correto baseado na situação e prazo_conclusao
  const calculatedStatus = calculateStatusAcao(
    desvio.situacao || desvio.status || "",
    desvio.prazo_conclusao || ""
  );

  // Usar o status calculado se disponível, senão usar o status original
  const displayStatus = calculatedStatus || desvio.status || "PENDENTE";

  return (
    <tr>
      <td>{formatDate(desvio.data_desvio)}</td>
      <td>
        {(desvio as any).ccas?.codigo
          ? `${(desvio as any).ccas.codigo} - ${(desvio as any).ccas.nome}`
          : "N/A"}
      </td>
      <td className="whitespace-pre-wrap break-words">
        {desvio.descricao_desvio || "-"}
      </td>
      <td className="max-w-[150px] truncate">
        {(desvio as any).empresas?.nome || "N/A"}
      </td>
      <td className="max-w-[150px] truncate">
        {(desvio as any).disciplinas?.nome || "N/A"}
      </td>
      <td>
        <RiskBadge risk={desvio.classificacao_risco} />
      </td>
      <td>
        <StatusBadge status={displayStatus} />
      </td>
      <td className="text-right">
        <div className="flex justify-end gap-2">
          <DesvioDetailsDialog
            desvio={desvio}
            onStatusUpdated={onStatusUpdated}
          />
          <Button variant="ghost" size="icon" onClick={() => onEditClick(desvio)}>
            <span className="sr-only">Editar</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 3.5l4 4L6 22H2v-4L16.5 3.5z"
              />
            </svg>
          </Button>
          <DeleteDesvioDialog
            desvio={desvio}
            onDesvioDeleted={onDesvioDeleted}
          />
          {/* Modal de edição fora para garantir consistência do dialog em múltiplas linhas */}
          {editDesvioId === desvio.id && (
            <EditDesvioDialog
              desvio={desvio}
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              onDesvioUpdated={onDesvioUpdated}
            />
          )}
        </div>
      </td>
    </tr>
  );
};

export default DesviosTableRow;
