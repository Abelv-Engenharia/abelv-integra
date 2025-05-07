
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Perfil } from "@/types/users";

interface PerfisTableProps {
  perfis: Perfil[];
  loading: boolean;
  buscar: string;
  onEditar: (perfil: Perfil) => void;
  onExcluir: (id: number) => void;
}

export const PerfisTable = ({ perfis, loading, buscar, onEditar, onExcluir }: PerfisTableProps) => {
  const perfisFiltrados = perfis.filter(perfil =>
    perfil.nome.toLowerCase().includes(buscar.toLowerCase()) ||
    perfil.descricao.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-8">
              Carregando...
            </TableCell>
          </TableRow>
        ) : perfisFiltrados.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-8">
              Nenhum perfil encontrado.
            </TableCell>
          </TableRow>
        ) : (
          perfisFiltrados.map((perfil) => (
            <TableRow key={perfil.id}>
              <TableCell>{perfil.nome}</TableCell>
              <TableCell>{perfil.descricao}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEditar(perfil)}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onExcluir(perfil.id)}>
                    Excluir
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
