
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ocorrencia } from "@/types/database";
import RelatorioFilters from "@/components/relatorios/RelatorioFilters";

// This is a mock data based on our new database schema
// In a real implementation, this would be fetched from Supabase
const mockOcorrencias: Ocorrencia[] = [
  {
    id: "1",
    data: "2023-04-05T09:30:00Z",
    empresa: "Empresa A",
    cca: "Produção",
    disciplina: "Segurança",
    tipo_ocorrencia: "Acidente sem afastamento",
    classificacao_risco: "MODERADO",
    status: "Concluído",
    descricao: "Colaborador sofreu pequeno corte ao manusear ferramenta",
    partes_corpo_afetadas: ["Mão direita"],
    created_at: "2023-04-05T09:30:00Z",
    updated_at: "2023-04-07T14:20:00Z"
  },
  {
    id: "2",
    data: "2023-04-12T11:15:00Z",
    empresa: "Empresa B",
    cca: "Manutenção",
    disciplina: "Segurança",
    tipo_ocorrencia: "Quase acidente",
    classificacao_risco: "TOLERÁVEL",
    status: "Em tratativa",
    descricao: "Material caiu próximo a área de circulação de pessoas",
    created_at: "2023-04-12T11:15:00Z",
    updated_at: "2023-04-12T11:15:00Z"
  },
  {
    id: "3",
    data: "2023-04-18T14:30:00Z",
    empresa: "Empresa A",
    cca: "Logística",
    disciplina: "Meio Ambiente",
    tipo_ocorrencia: "Incidente ambiental",
    classificacao_risco: "SUBSTANCIAL",
    status: "Concluído",
    descricao: "Pequeno derramamento de óleo durante abastecimento",
    created_at: "2023-04-18T14:30:00Z",
    updated_at: "2023-04-20T09:45:00Z"
  },
  {
    id: "4",
    data: "2023-04-22T08:20:00Z",
    empresa: "Empresa C",
    cca: "Administrativo",
    disciplina: "Saúde",
    tipo_ocorrencia: "Emergência médica",
    classificacao_risco: "MODERADO",
    status: "Concluído",
    descricao: "Colaborador com mal súbito necessitou de atendimento médico",
    partes_corpo_afetadas: ["Sistema circulatório"],
    medidas_tomadas: "Acionado ambulância e prestado primeiros socorros",
    created_at: "2023-04-22T08:20:00Z",
    updated_at: "2023-04-22T10:30:00Z"
  },
  {
    id: "5",
    data: "2023-04-25T16:45:00Z",
    empresa: "Empresa B",
    cca: "Produção",
    disciplina: "Segurança",
    tipo_ocorrencia: "Acidente com afastamento",
    classificacao_risco: "INTOLERÁVEL",
    status: "Em tratativa",
    descricao: "Queda de altura durante manutenção em telhado",
    partes_corpo_afetadas: ["Perna esquerda", "Coluna"],
    medidas_tomadas: "Acionado SAMU e comunicado setor de SST",
    created_at: "2023-04-25T16:45:00Z",
    updated_at: "2023-04-25T18:20:00Z"
  }
];

const RelatoriosOcorrencias = () => {
  const [filteredData, setFilteredData] = useState(mockOcorrencias);

  const handleFilter = (filters: any) => {
    // This would typically be handled by a Supabase query
    // For now, we'll just filter the mock data
    const filtered = mockOcorrencias.filter((item) => {
      return true; // In a real app, apply actual filtering logic
    });
    
    setFilteredData(filtered);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Relatórios de Ocorrências</h2>
        <p className="text-muted-foreground">
          Análise detalhada de ocorrências registradas no sistema
        </p>
      </div>
      
      <RelatorioFilters onFilter={handleFilter} />
      
      <Card>
        <CardHeader>
          <CardTitle>Ocorrências Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left border">Data</th>
                  <th className="p-2 text-left border">Empresa</th>
                  <th className="p-2 text-left border">CCA</th>
                  <th className="p-2 text-left border">Tipo</th>
                  <th className="p-2 text-left border">Classificação</th>
                  <th className="p-2 text-left border">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 border">{new Date(item.data).toLocaleDateString()}</td>
                    <td className="p-2 border">{item.empresa}</td>
                    <td className="p-2 border">{item.cca}</td>
                    <td className="p-2 border">{item.tipo_ocorrencia}</td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.classificacao_risco === 'INTOLERÁVEL' || item.classificacao_risco === 'SUBSTANCIAL' ? 'bg-red-100 text-red-800' :
                        item.classificacao_risco === 'MODERADO' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.classificacao_risco}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
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

export default RelatoriosOcorrencias;
