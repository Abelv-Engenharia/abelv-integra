import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { subcentroCustoService, SubcentroCusto } from "@/services/admin/subcentroCustoService";

interface SubcentrosCustosTableProps {
  ccaId: number;
  onEdit: (subcentro: SubcentroCusto) => void;
  onDelete: (subcentro: SubcentroCusto) => void;
}

const SubcentrosCustosTable = ({ ccaId, onEdit, onDelete }: SubcentrosCustosTableProps) => {
  const { data: subcentros = [], isLoading } = useQuery({
    queryKey: ['subcentros-custos', ccaId],
    queryFn: () => subcentroCustoService.getByCCAId(ccaId),
    enabled: !!ccaId,
  });

  if (isLoading) {
    return <div className="text-center py-4">Carregando subcentros...</div>;
  }

  if (subcentros.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Nenhum subcentro de custo cadastrado
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id sienge</TableHead>
            <TableHead>Faturamento</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcentros.map((subcentro) => (
            <TableRow key={subcentro.id}>
              <TableCell>{subcentro.id_sienge}</TableCell>
              <TableCell>{subcentro.faturamento}</TableCell>
              <TableCell>{subcentro.empresa_sienge?.name || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(subcentro)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(subcentro)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export { SubcentrosCustosTable };
