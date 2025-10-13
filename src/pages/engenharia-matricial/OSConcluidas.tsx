import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useOSList } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";
import { Link } from "react-router-dom";

export default function OSConcluidas() {
  const { data: osConcluidas = [], isLoading } = useOSList({ status: 'concluida' });

  const capitalizarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">OS Concluídas</h1>
          <p className="text-muted-foreground">
            {osConcluidas.length} ordem{osConcluidas.length !== 1 ? 's' : ''} de serviço concluída{osConcluidas.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {osConcluidas.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma OS concluída encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {osConcluidas.map((os) => (
            <Card key={os.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    OS Nº {os.numero || os.id} - CCA {os.cca?.codigo || 'N/A'}
                    <Badge variant="secondary">
                      Concluída
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Link to={`/os/${os.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{os.cliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disciplina</p>
                    <p className="font-medium">{capitalizarTexto(os.disciplina)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HH planejado</p>
                    <p className="font-medium">{os.hh_planejado || 0}h</p>
                  </div>
                  {os.data_conclusao && (
                    <div>
                      <p className="text-sm text-muted-foreground">Data conclusão</p>
                      <p className="font-medium">{formatDate(os.data_conclusao)}</p>
                    </div>
                  )}
                  {os.valor_final && os.valor_final > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Valor final</p>
                      <p className="font-medium">{formatCurrency(os.valor_final)}</p>
                    </div>
                  )}
                  {os.percentual_saving && !isNaN(os.percentual_saving) && (
                    <div>
                      <p className="text-sm text-muted-foreground">Saving</p>
                      <p className="font-medium">{os.percentual_saving.toFixed(1)}%</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável EM</p>
                    <p className="font-medium">{os.responsavel_em?.nome || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solicitante</p>
                    <p className="font-medium">{os.solicitante_nome}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="text-sm">{os.descricao}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}