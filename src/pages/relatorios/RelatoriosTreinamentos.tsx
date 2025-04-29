
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreinamentoNormativo, Treinamento } from "@/types/database";
import RelatorioFilters from "@/components/relatorios/RelatorioFilters";

// This is a mock data based on our new database schema
// In a real implementation, this would be fetched from Supabase
const mockTreinamentos: (TreinamentoNormativo & { 
  funcionario_nome: string; 
  treinamento_nome: string;
})[] = [
  {
    id: "1",
    funcionario_id: "1",
    funcionario_nome: "João Silva",
    treinamento_id: "1",
    treinamento_nome: "NR10 - Segurança em instalações elétricas",
    tipo: "Formação",
    data_realizacao: "2023-05-15",
    data_validade: "2025-05-15",
    status: "Válido",
    arquivado: false,
    created_at: "2023-05-15T00:00:00Z",
    updated_at: "2023-05-15T00:00:00Z"
  },
  {
    id: "2",
    funcionario_id: "1",
    funcionario_nome: "João Silva",
    treinamento_id: "2",
    treinamento_nome: "NR35 - Trabalho em altura",
    tipo: "Formação",
    data_realizacao: "2023-10-10",
    data_validade: "2025-10-10",
    status: "Válido",
    arquivado: false,
    created_at: "2023-10-10T00:00:00Z",
    updated_at: "2023-10-10T00:00:00Z"
  },
  {
    id: "3",
    funcionario_id: "2",
    funcionario_nome: "Maria Oliveira",
    treinamento_id: "3",
    treinamento_nome: "NR33 - Espaço confinado",
    tipo: "Formação",
    data_realizacao: "2023-03-20",
    data_validade: "2024-03-20",
    status: "Válido",
    arquivado: false,
    created_at: "2023-03-20T00:00:00Z",
    updated_at: "2023-03-20T00:00:00Z"
  },
  {
    id: "4",
    funcionario_id: "3",
    funcionario_nome: "Pedro Santos",
    treinamento_id: "4",
    treinamento_nome: "Brigada de incêndio",
    tipo: "Reciclagem",
    data_realizacao: "2023-01-10",
    data_validade: "2024-01-10",
    status: "Próximo ao vencimento",
    arquivado: false,
    created_at: "2023-01-10T00:00:00Z",
    updated_at: "2023-01-10T00:00:00Z"
  },
  {
    id: "5",
    funcionario_id: "4",
    funcionario_nome: "Ana Costa",
    treinamento_id: "5",
    treinamento_nome: "Primeiros socorros",
    tipo: "Formação",
    data_realizacao: "2022-11-05",
    data_validade: "2024-11-05",
    status: "Válido",
    arquivado: false,
    created_at: "2022-11-05T00:00:00Z",
    updated_at: "2022-11-05T00:00:00Z"
  }
];

const RelatoriosTreinamentos = () => {
  const [filteredData, setFilteredData] = useState(mockTreinamentos);

  const handleFilter = (filters: any) => {
    // This would typically be handled by a Supabase query
    // For now, we'll just filter the mock data
    const filtered = mockTreinamentos.filter((item) => {
      return true; // In a real app, apply actual filtering logic
    });
    
    setFilteredData(filtered);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Relatório de Treinamentos</h2>
        <p className="text-muted-foreground">
          Análise detalhada de treinamentos por período, status e funcionário
        </p>
      </div>
      
      <RelatorioFilters onFilter={handleFilter} />
      
      <Card>
        <CardHeader>
          <CardTitle>Treinamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left border">Funcionário</th>
                  <th className="p-2 text-left border">Treinamento</th>
                  <th className="p-2 text-left border">Tipo</th>
                  <th className="p-2 text-left border">Data Realização</th>
                  <th className="p-2 text-left border">Data Validade</th>
                  <th className="p-2 text-left border">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 border">{item.funcionario_nome}</td>
                    <td className="p-2 border">{item.treinamento_nome}</td>
                    <td className="p-2 border">{item.tipo}</td>
                    <td className="p-2 border">{new Date(item.data_realizacao).toLocaleDateString()}</td>
                    <td className="p-2 border">{new Date(item.data_validade).toLocaleDateString()}</td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'Válido' ? 'bg-green-100 text-green-800' :
                        item.status === 'Próximo ao vencimento' ? 'bg-yellow-100 text-yellow-800' : 
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

export default RelatoriosTreinamentos;
