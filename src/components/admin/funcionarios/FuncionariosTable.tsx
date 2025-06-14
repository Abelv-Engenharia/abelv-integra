
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit, UserRound } from "lucide-react";
import { Funcionario } from "@/types/funcionarios";

function formatDateBR(dateStr?: string | null) {
  if (!dateStr) return "-";
  // Espera "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm:ss"
  const onlyDate = dateStr.slice(0, 10);
  const [ano, mes, dia] = onlyDate.split("-");
  if (!ano || !mes || !dia) return "-";
  return `${dia}/${mes}/${ano}`;
}

interface FuncionariosTableProps {
  funcionarios: Funcionario[];
  isLoading: boolean;
  onEdit: (funcionario: Funcionario) => void;
  onDelete: (id: string) => void;
}

export const FuncionariosTable: React.FC<FuncionariosTableProps> = ({
  funcionarios,
  isLoading,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return <p>Carregando...</p>;
  }

  // Gera uma query string simples para o cache bust de imagem
  const getFotoUrl = (foto?: string | null) => {
    if (!foto) return "";
    // Adiciona um timestamp para evitar cache
    return `${foto}${foto.includes("?") ? "&" : "?"}t=${Date.now()}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 p-2 text-left">Foto</th>
            <th className="border border-gray-300 p-2 text-left">Nome</th>
            <th className="border border-gray-300 p-2 text-left">Função</th>
            <th className="border border-gray-300 p-2 text-left">Matrícula</th>
            <th className="border border-gray-300 p-2 text-left">Data de admissão</th>
            <th className="border border-gray-300 p-2 text-left">CCA</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((funcionario) => (
            <tr key={funcionario.id}>
              <td className="border border-gray-300 p-2">
                <Avatar className="size-8">
                  <AvatarImage src={getFotoUrl(funcionario.foto)} />
                  <AvatarFallback>
                    <UserRound className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </td>
              <td className="border border-gray-300 p-2">{funcionario.nome}</td>
              <td className="border border-gray-300 p-2">{funcionario.funcao}</td>
              <td className="border border-gray-300 p-2">{funcionario.matricula}</td>
              <td className="border border-gray-300 p-2">
                {formatDateBR(funcionario.data_admissao)}
              </td>
              <td className="border border-gray-300 p-2">
                {funcionario.ccas ? `${funcionario.ccas.codigo} - ${funcionario.ccas.nome}` : "Nenhum"}
              </td>
              <td className="border border-gray-300 p-2">
                <span className={`px-2 py-1 rounded text-xs ${funcionario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {funcionario.ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <div className="flex justify-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(funcionario)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {funcionario.ativo && (
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => onDelete(funcionario.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
