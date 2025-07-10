
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit, UserRound } from "lucide-react";
import { Funcionario } from "@/types/funcionarios";
import { useSignedUrl } from "@/hooks/useSignedUrl";

function formatDateBR(dateStr?: string | null) {
  if (!dateStr) return "-";
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

const FuncionarioAvatar: React.FC<{ funcionario: Funcionario }> = ({ funcionario }) => {
  const { url, loading, error, generate } = useSignedUrl();

  React.useEffect(() => {
    if (funcionario.foto) {
      let filePath = funcionario.foto;
      if (/^https?:\/\//.test(filePath)) {
        const match = filePath.match(/\/storage\/v1\/object\/sign\/([^?]+)/);
        if (match) {
          filePath = decodeURIComponent(match[1]);
        } else {
          const idx = filePath.indexOf('funcionarios-fotos/');
          if (idx >= 0) filePath = filePath.slice(idx + 'funcionarios-fotos/'.length);
        }
      } else if (filePath.startsWith('funcionarios/')) {
        // OK!
      } else {
        filePath = `funcionarios/${filePath}`;
      }
      generate('funcionarios-fotos', filePath, 300);
    }
  }, [funcionario.foto]);

  if (!funcionario.foto) {
    return (
      <Avatar className="size-8">
        <AvatarFallback>
          <UserRound className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className="size-8">
      {url ? (
        <AvatarImage src={url} />
      ) : (
        <AvatarFallback>
          <UserRound className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export const FuncionariosTable: React.FC<FuncionariosTableProps> = ({
  funcionarios,
  isLoading,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return <p>Carregando...</p>;
  }

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
            <th className="border border-gray-300 p-2 text-left">CCAs</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((funcionario) => (
            <tr key={funcionario.id}>
              <td className="border border-gray-300 p-2">
                <FuncionarioAvatar funcionario={funcionario} />
              </td>
              <td className="border border-gray-300 p-2">{funcionario.nome}</td>
              <td className="border border-gray-300 p-2">{funcionario.funcao}</td>
              <td className="border border-gray-300 p-2">{funcionario.matricula}</td>
              <td className="border border-gray-300 p-2">
                {formatDateBR(funcionario.data_admissao)}
              </td>
              <td className="border border-gray-300 p-2">
                {funcionario.funcionario_ccas && funcionario.funcionario_ccas.length > 0 
                  ? funcionario.funcionario_ccas.map(fc => `${fc.ccas.codigo}`).join(', ')
                  : "Nenhum"
                }
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
