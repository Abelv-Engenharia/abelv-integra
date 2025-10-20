import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface ApprovalTimeTableProps {
  tempoAprovacao: Array<{
    viajante: string;
    modal: string;
    quantidade: number;
    tempoMedio: number;
  }>;
}

export const ApprovalTimeTable = ({ tempoAprovacao }: ApprovalTimeTableProps) => {
  const getModalLabel = (modal: string) => {
    const labels: Record<string, string> = {
      'aereo': 'Aéreo',
      'hospedagem': 'Hotel',
      'rodoviario': 'Rodoviário'
    };
    return labels[modal] || modal;
  };

  const getTimeColor = (hours: number) => {
    if (hours <= 2) return "bg-green-500";
    if (hours <= 4) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Tempo Médio de Aprovação de Protocolos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Viajante</TableHead>
              <TableHead>Modal</TableHead>
              <TableHead className="text-center">Quantidade</TableHead>
              <TableHead className="text-right">Tempo Médio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tempoAprovacao.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.viajante}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getModalLabel(item.modal)}</Badge>
                </TableCell>
                <TableCell className="text-center">{item.quantidade}</TableCell>
                <TableCell className="text-right">
                  <Badge className={getTimeColor(item.tempoMedio)}>
                    {item.tempoMedio.toFixed(1)}h
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
