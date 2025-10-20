import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Indicador {
  icone: string;
  label: string;
  valor: string;
  status?: 'positivo' | 'atencao' | 'neutro';
}

interface TabelaIndicadoresProps {
  indicadores: Indicador[];
}

export function TabelaIndicadores({ indicadores }: TabelaIndicadoresProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'positivo':
        return <Badge className="bg-green-500 text-white">Ok</Badge>;
      case 'atencao':
        return <Badge className="bg-yellow-500 text-white">Atenção</Badge>;
      case 'neutro':
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Indicador</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {indicadores.map((indicador, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {indicador.icone} {indicador.label}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {indicador.valor}
              </TableCell>
              <TableCell className="text-right">
                {getStatusBadge(indicador.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
