
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

type HHTByCCAItem = {
  cca_id: number;
  codigo: string;
  nome: string;
  total_horas: number;
};

export function HHTTable() {
  const [hhtData, setHhtData] = useState<HHTByCCAItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    loadHHTData();
  }, []);

  if (isLoading) {
    return <HHTTableSkeleton />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome do CCA</TableHead>
            <TableHead className="text-right">Total de Horas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hhtData.length > 0 ? (
            hhtData.map((item) => (
              <TableRow key={item.cca_id}>
                <TableCell className="font-medium">{item.codigo}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell className="text-right font-medium">
                  {item.total_horas.toLocaleString('pt-BR')} horas
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
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
            <TableHead>Código</TableHead>
            <TableHead>Nome do CCA</TableHead>
            <TableHead className="text-right">Total de Horas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-24 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
