
import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Funcionario } from "@/types/treinamentos";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface Props {
  ccasOrdenados: { id: number; codigo: string; nome: string }[];
  selectedCcaId: number | undefined;
  handleCcaChange: (ccaId: string) => void;
  funcionariosFiltrados: Funcionario[];
  selectedFuncionarioId: string | undefined;
  handleFuncionarioChange: (funcionarioId: string) => void;
  funcionario: Funcionario | null;
}

const FuncionarioSelector: React.FC<Props> = ({
  ccasOrdenados,
  selectedCcaId,
  handleCcaChange,
  funcionariosFiltrados,
  selectedFuncionarioId,
  handleFuncionarioChange,
  funcionario,
}) => {
  const { data: userCCAs = [] } = useUserCCAs();

  // Filtrar CCAs baseado nas permissões do usuário
  const ccasFiltrados = ccasOrdenados.filter(cca => 
    userCCAs.some(userCca => userCca.id === cca.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecione o Funcionário</CardTitle>
        <CardDescription>
          Escolha um CCA e um funcionário para gerar o crachá de capacitação
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* CAMPO CCA EM UMA LINHA SÓ */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <label className="text-sm text-gray-500 mb-1 block" htmlFor="cca-select">CCA</label>
            <Select onValueChange={handleCcaChange} value={selectedCcaId ? String(selectedCcaId) : undefined}>
              <SelectTrigger id="cca-select">
                <SelectValue placeholder="Selecione um CCA" />
              </SelectTrigger>
              <SelectContent>
                {ccasFiltrados.map((cca) => (
                  <SelectItem key={cca.id} value={String(cca.id)}>
                    {cca.codigo} - {cca.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* SEGUNDA LINHA: FUNCIONÁRIO, FUNÇÃO, MATRÍCULA (proporções ajustadas) */}
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          {/* Funcionário */}
          <div className="w-full md:w-1/3">
            <label className="text-sm text-gray-500 mb-1 block" htmlFor="funcionario-select">Funcionário</label>
            <Select
              onValueChange={handleFuncionarioChange}
              value={selectedFuncionarioId}
              disabled={!selectedCcaId || funcionariosFiltrados.length === 0}
            >
              <SelectTrigger id="funcionario-select">
                <SelectValue placeholder={selectedCcaId ? (funcionariosFiltrados.length > 0 ? "Selecione um funcionário" : "Nenhum funcionário disponível") : "Selecione um CCA primeiro"} />
              </SelectTrigger>
              <SelectContent>
                {funcionariosFiltrados.map((funcionario) => (
                  <SelectItem key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Função - mais largo */}
          <div className="w-full md:w-1/2">
            <label className="text-sm text-gray-500 mb-1 block">Função</label>
            <p className="font-medium border rounded-md px-3 py-2 min-h-[40px] bg-white">
              {funcionario?.funcao || <span className="text-gray-400">---</span>}
            </p>
          </div>
          {/* Matrícula - mais estreito */}
          <div className="w-full md:w-1/6">
            <label className="text-sm text-gray-500 mb-1 block">Matrícula</label>
            <p className="font-medium border rounded-md px-3 py-2 min-h-[40px] bg-white">
              {funcionario?.matricula || <span className="text-gray-400">---</span>}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FuncionarioSelector;
