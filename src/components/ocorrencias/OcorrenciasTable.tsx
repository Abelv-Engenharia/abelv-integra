
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// Mock data for the table
const mockData = [
  {
    id: "1",
    data: "2023-05-15",
    colaborador: "José da Silva",
    empresa: "Empresa A",
    tipoOcorrencia: "Acidente com Afastamento",
    classificacaoRisco: "Alto",
    status: "Em tratativa",
  },
  {
    id: "2",
    data: "2023-06-22",
    colaborador: "Paulo Souza",
    empresa: "Empresa B",
    tipoOcorrencia: "Acidente sem Afastamento",
    classificacaoRisco: "Médio",
    status: "Concluído",
  },
  {
    id: "3",
    data: "2023-07-05",
    colaborador: "Carla Oliveira",
    empresa: "Empresa C",
    tipoOcorrencia: "Quase Acidente",
    classificacaoRisco: "Baixo",
    status: "Em tratativa",
  },
  {
    id: "4",
    data: "2023-08-11",
    colaborador: "Rafael Lima",
    empresa: "Empresa A",
    tipoOcorrencia: "Acidente sem Afastamento",
    classificacaoRisco: "Alto",
    status: "Concluído",
  },
  {
    id: "5",
    data: "2023-09-28",
    colaborador: "Mariana Costa",
    empresa: "Empresa D",
    tipoOcorrencia: "Acidente com Afastamento",
    classificacaoRisco: "Alto",
    status: "Em tratativa",
  },
];

const OcorrenciasTable = () => {
  const [data, setData] = useState(mockData);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Colaborador</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Tipo de Ocorrência</TableHead>
          <TableHead className="hidden md:table-cell">Classificação de Risco</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((ocorrencia) => (
          <TableRow key={ocorrencia.id}>
            <TableCell>{new Date(ocorrencia.data).toLocaleDateString()}</TableCell>
            <TableCell>{ocorrencia.colaborador}</TableCell>
            <TableCell>{ocorrencia.empresa}</TableCell>
            <TableCell>{ocorrencia.tipoOcorrencia}</TableCell>
            <TableCell className="hidden md:table-cell">
              <span className={`px-2 py-1 rounded-full text-xs ${
                ocorrencia.classificacaoRisco === 'Alto' 
                  ? 'bg-red-100 text-red-800' 
                  : ocorrencia.classificacaoRisco === 'Médio'
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {ocorrencia.classificacaoRisco}
              </span>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                ocorrencia.status === 'Em tratativa' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {ocorrencia.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OcorrenciasTable;
