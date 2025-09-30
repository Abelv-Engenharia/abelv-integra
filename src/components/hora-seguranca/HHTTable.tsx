
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchHHTByCCA } from "@/services/hora-seguranca/horasTrabalhadasService";
import { Skeleton } from "@/components/ui/skeleton";
import { EditHHTDialog } from "./EditHHTDialog";
import { DeleteHHTDialog } from "./DeleteHHTDialog";
import { PermissionGuard } from "@/components/security/PermissionGuard";

type HHTByCCAItem = {
  id: string;
  mes: number;
  ano: number;
  horas_trabalhadas: number;
  observacoes?: string;
  cca_id: number;
  codigo: string;
  nome: string;
};

// Helper function to get month name
const getMonthName = (month: number) => {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return months[month - 1] || month.toString();
};

export function HHTTable() {
  const [hhtData, setHhtData] = useState<HHTByCCAItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHHTData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchHHTByCCA();
      setHhtData(data);
    } catch (error) {
      console.error("Erro ao carregar dados de HHT:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHHTData();
  }, []);

  const handleSuccess = () => {
    loadHHTData();
  };

  if (isLoading) {
    return <HHTTableSkeleton />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mês</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Nome do CCA</TableHead>
            <TableHead className="text-right">Horas Trabalhadas</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hhtData.length > 0 ? (
            hhtData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {getMonthName(item.mes)}/{item.ano}
                </TableCell>
                <TableCell className="font-medium">{item.codigo}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell className="text-right font-medium">
                  {item.horas_trabalhadas.toLocaleString('pt-BR')} horas
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <PermissionGuard requiredPermissions={["admin_registro_hht", "admin_funcionarios"]}>
                      <EditHHTDialog hht={item} onSuccess={handleSuccess} />
                    </PermissionGuard>
                    <PermissionGuard requiredPermissions={["admin_registro_hht", "admin_funcionarios"]}>
                      <DeleteHHTDialog hht={item} onSuccess={handleSuccess} />
                    </PermissionGuard>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                Nenhum registro de HHT encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function HHTTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mês</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Nome do CCA</TableHead>
            <TableHead className="text-right">Horas Trabalhadas</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-24 ml-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
