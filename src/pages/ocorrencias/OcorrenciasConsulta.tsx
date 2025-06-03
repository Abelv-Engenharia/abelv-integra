
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OcorrenciasFiltros } from "@/components/ocorrencias/OcorrenciasFiltros";
import { Button } from "@/components/ui/button";
import { Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllOcorrencias } from "@/services/ocorrencias/ocorrenciasService";

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

const OcorrenciasConsulta = () => {
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOcorrencias = async () => {
      try {
        setLoading(true);
        const data = await getAllOcorrencias();
        setOcorrencias(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Erro ao carregar ocorrências:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOcorrencias();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple search filter
    if (searchTerm.trim() === "") {
      setFilteredData(ocorrencias);
      return;
    }
    
    const filtered = ocorrencias.filter(
      (item) => 
        item.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tipo_ocorrencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.disciplina?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredData(filtered);
  };

  const handleViewOcorrencia = (id: string) => {
    navigate(`/ocorrencias/detalhes/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Consulta de Ocorrências</h2>
        <OcorrenciasFiltros onFilter={() => setFiltroAtivo(true)} />
      </div>

      {filtroAtivo && (
        <div className="bg-slate-50 p-2 rounded-md border border-slate-200">
          <p className="text-sm text-muted-foreground">
            Filtros aplicados - <button className="text-primary underline" onClick={() => setFiltroAtivo(false)}>Limpar filtros</button>
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Lista de Ocorrências</CardTitle>
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <input
                  type="text"
                  placeholder="Buscar ocorrência..."
                  className="px-3 py-2 border rounded-l-md w-full sm:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhuma ocorrência encontrada para a busca." : "Nenhuma ocorrência cadastrada."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>CCA</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Tipo de Ocorrência</TableHead>
                    <TableHead className="hidden md:table-cell">Classificação de Risco</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((ocorrencia) => (
                    <TableRow key={ocorrencia.id}>
                      <TableCell>
                        {ocorrencia.data ? new Date(ocorrencia.data).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>{ocorrencia.cca || '-'}</TableCell>
                      <TableCell>{ocorrencia.empresa || '-'}</TableCell>
                      <TableCell>{ocorrencia.disciplina || '-'}</TableCell>
                      <TableCell>{ocorrencia.tipo_ocorrencia || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {ocorrencia.classificacao_risco ? (
                          <span className={`px-2 py-1 rounded-full text-xs ${getRiscoClassColor(ocorrencia.classificacao_risco)}`}>
                            {ocorrencia.classificacao_risco}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ocorrencia.status === 'Em tratativa' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {ocorrencia.status || 'Em tratativa'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewOcorrencia(ocorrencia.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OcorrenciasConsulta;
