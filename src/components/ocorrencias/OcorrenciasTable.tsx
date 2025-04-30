
import { useState, useEffect } from "react";
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
import { fetchLatestOcorrencias } from "@/services/ocorrenciasDashboardService";

// Function to get the background and text colors for each risk classification
const getRiscoClassColor = (classificacao: string) => {
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
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const ocorrenciasData = await fetchLatestOcorrencias();
        setData(ocorrenciasData);
      } catch (err) {
        console.error("Error loading latest ocorrencias:", err);
        setError("Erro ao carregar ocorrências recentes");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleViewOcorrencia = (id: string) => {
    navigate(`/ocorrencias/detalhes/${id}`);
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Nenhuma ocorrência encontrada</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
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
            <TableCell>{ocorrencia.empresa}</TableCell>
            <TableCell>{ocorrencia.tipo_ocorrencia}</TableCell>
            <TableCell className="hidden md:table-cell">
              <span className={`px-2 py-1 rounded-full text-xs ${getRiscoClassColor(ocorrencia.classificacao_risco)}`}>
                {ocorrencia.classificacao_risco}
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
