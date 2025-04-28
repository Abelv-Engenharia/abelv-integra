
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
import { useNavigate } from "react-router-dom";

// Updated mock data with the new risk classifications
const mockData = [
  {
    id: "1",
    data: "2023-05-15",
    colaborador: "José da Silva",
    empresa: "Empresa A",
    tipoOcorrencia: "Acidente com Afastamento",
    classificacaoRisco: "INTOLERÁVEL",
    status: "Em tratativa",
  },
  {
    id: "2",
    data: "2023-06-22",
    colaborador: "Paulo Souza",
    empresa: "Empresa B",
    tipoOcorrencia: "Acidente sem Afastamento",
    classificacaoRisco: "MODERADO",
    status: "Concluído",
  },
  {
    id: "3",
    data: "2023-07-05",
    colaborador: "Carla Oliveira",
    empresa: "Empresa C",
    tipoOcorrencia: "Quase Acidente",
    classificacaoRisco: "TRIVIAL",
    status: "Em tratativa",
  },
  {
    id: "4",
    data: "2023-08-11",
    colaborador: "Rafael Lima",
    empresa: "Empresa A",
    tipoOcorrencia: "Acidente sem Afastamento",
    classificacaoRisco: "SUBSTANCIAL",
    status: "Concluído",
  },
  {
    id: "5",
    data: "2023-09-28",
    colaborador: "Mariana Costa",
    empresa: "Empresa D",
    tipoOcorrencia: "Acidente com Afastamento",
    classificacaoRisco: "TOLERÁVEL",
    status: "Em tratativa",
  },
];

// Function to get the background and text colors for each risk classification
const getRiscoClassColor = (classificacao) => {
  switch (classificacao) {
    case "TRIVIAL":
      return "bg-[#34C6F4] text-white";
    case "TOLERÁVEL":
      return "bg-[#92D050] text-white";
    case "MODERADO":
      return "bg-[#FFE07D] text-gray-800";
    case "SUBSTANCIAL":
      return "bg-[#FFC000] text-gray-800";
    case "INTOLERÁVEL":
      return "bg-[#D13F3F] text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OcorrenciasTable = () => {
  const [data, setData] = useState(mockData);
  const navigate = useNavigate();

  const handleViewOcorrencia = (id) => {
    navigate(`/ocorrencias/detalhes/${id}`);
  };

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
              <span className={`px-2 py-1 rounded-full text-xs ${getRiscoClassColor(ocorrencia.classificacaoRisco)}`}>
                {ocorrencia.classificacaoRisco}
              </span>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                ocorrencia.status === 'Em tratativa' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {ocorrencia.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => handleViewOcorrencia(ocorrencia.id)}>
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
