
import React, { useState } from "react";
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

// Mock data for the occurrence list
const mockOcorrencias = [
  {
    id: "1",
    data: "2023-05-15",
    empresa: "Empresa A",
    cca: "CCA-001",
    disciplina: "Elétrica",
    tipoOcorrencia: "Acidente com Afastamento",
    classificacaoRisco: "Alto",
    status: "Em tratativa",
  },
  {
    id: "2",
    data: "2023-06-22",
    empresa: "Empresa B",
    cca: "CCA-002",
    disciplina: "Mecânica",
    tipoOcorrencia: "Acidente sem Afastamento",
    classificacaoRisco: "Médio",
    status: "Concluído",
  },
  {
    id: "3",
    data: "2023-07-05",
    empresa: "Empresa C",
    cca: "CCA-003",
    disciplina: "Civil",
    tipoOcorrencia: "Quase Acidente",
    classificacaoRisco: "Baixo",
    status: "Em tratativa",
  },
  {
    id: "4",
    data: "2023-08-11",
    empresa: "Empresa A",
    cca: "CCA-001",
    disciplina: "Elétrica",
    tipoOcorrencia: "Acidente sem Afastamento",
    classificacaoRisco: "Alto",
    status: "Concluído",
  },
  {
    id: "5",
    data: "2023-09-28",
    empresa: "Empresa D",
    cca: "CCA-004",
    disciplina: "Instrumentação",
    tipoOcorrencia: "Acidente com Afastamento",
    classificacaoRisco: "Alto",
    status: "Em tratativa",
  },
];

const OcorrenciasConsulta = () => {
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [filteredData, setFilteredData] = useState(mockOcorrencias);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple search filter for demonstration
    if (searchTerm.trim() === "") {
      setFilteredData(mockOcorrencias);
      return;
    }
    
    const filtered = mockOcorrencias.filter(
      (item) => 
        item.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tipoOcorrencia.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredData(filtered);
  };

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
                    <TableCell>{new Date(ocorrencia.data).toLocaleDateString()}</TableCell>
                    <TableCell>{ocorrencia.cca}</TableCell>
                    <TableCell>{ocorrencia.empresa}</TableCell>
                    <TableCell>{ocorrencia.disciplina}</TableCell>
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
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OcorrenciasConsulta;
