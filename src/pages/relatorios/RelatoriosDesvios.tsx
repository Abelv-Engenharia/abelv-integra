
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Desvio } from "@/types/database";
import RelatorioFilters from "@/components/relatorios/RelatorioFilters";

// This is a mock data based on our new database schema
// In a real implementation, this would be fetched from Supabase
const mockDesvios: Desvio[] = [
  {
    id: "1",
    data: "2023-04-10T10:30:00Z",
    local: "Setor de Produção",
    tipo: "Condição Insegura",
    descricao: "Piso molhado sem sinalização",
    classificacao: "Médio",
    status: "Resolvido",
    responsavel_id: "1",
    created_at: "2023-04-10T10:30:00Z",
    updated_at: "2023-04-12T14:20:00Z"
  },
  {
    id: "2",
    data: "2023-04-15T09:15:00Z",
    local: "Almoxarifado",
    tipo: "Ato Inseguro",
    descricao: "Funcionário sem EPIs obrigatórios",
    classificacao: "Alto",
    status: "Resolvido",
    responsavel_id: "2",
    created_at: "2023-04-15T09:15:00Z",
    updated_at: "2023-04-16T11:45:00Z"
  },
  {
    id: "3",
    data: "2023-04-18T14:00:00Z",
    local: "Escritório Administrativo",
    tipo: "Condição Insegura",
    descricao: "Fios expostos próximos a área de circulação",
    classificacao: "Alto",
    status: "Em andamento",
    prazo: "2023-04-25",
    responsavel_id: "3",
    created_at: "2023-04-18T14:00:00Z",
    updated_at: "2023-04-19T10:30:00Z"
  },
  {
    id: "4",
    data: "2023-04-20T11:20:00Z",
    local: "Estacionamento",
    tipo: "Condição Insegura",
    descricao: "Buraco no piso causando risco de queda",
    classificacao: "Médio",
    status: "Aberto",
    prazo: "2023-04-30",
    responsavel_id: "2",
    created_at: "2023-04-20T11:20:00Z",
    updated_at: "2023-04-20T11:20:00Z"
  },
  {
    id: "5",
    data: "2023-04-22T16:45:00Z",
    local: "Refeitório",
    tipo: "Ato Inseguro",
    descricao: "Manipulação incorreta de alimentos",
    classificacao: "Baixo",
    status: "Resolvido",
    responsavel_id: "4",
    created_at: "2023-04-22T16:45:00Z",
    updated_at: "2023-04-23T09:10:00Z"
  }
];

const RelatoriosDesvios = () => {
  const [filteredData, setFilteredData] = useState(mockDesvios);

  const handleFilter = (filters: any) => {
    // This would typically be handled by a Supabase query
    // For now, we'll just filter the mock data
    const filtered = mockDesvios.filter((item) => {
      return true; // In a real app, apply actual filtering logic
    });
    
    setFilteredData(filtered);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Relatórios de Desvios</h2>
        <p className="text-muted-foreground">
          Análise detalhada de desvios registrados no sistema
        </p>
      </div>
      
      <RelatorioFilters onFilter={handleFilter} />
      
      <Card>
        <CardHeader>
          <CardTitle>Desvios Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left border">Data</th>
                  <th className="p-2 text-left border">Local</th>
                  <th className="p-2 text-left border">Tipo</th>
                  <th className="p-2 text-left border">Descrição</th>
                  <th className="p-2 text-left border">Classificação</th>
                  <th className="p-2 text-left border">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 border">{new Date(item.data).toLocaleDateString()}</td>
                    <td className="p-2 border">{item.local}</td>
                    <td className="p-2 border">{item.tipo}</td>
                    <td className="p-2 border">{item.descricao}</td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.classificacao === 'Alto' || item.classificacao === 'Muito Alto' ? 'bg-red-100 text-red-800' :
                        item.classificacao === 'Médio' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.classificacao}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'Resolvido' ? 'bg-green-100 text-green-800' :
                        item.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' : 
                        item.status === 'Aberto' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosDesvios;
