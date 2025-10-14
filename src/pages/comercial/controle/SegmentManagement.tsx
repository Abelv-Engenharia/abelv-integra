import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useSegmentos } from "@/hooks/comercial/useSegmentos";
import AddSegmentDialog from "@/components/comercial/AddSegmentDialog";

export default function SegmentManagement() {
  const { segmentos, isLoading, addSegmento, removeSegmento } = useSegmentos();

  const handleAdicionar = (nome: string) => {
    addSegmento.mutate(nome);
  };

  const handleRemover = (id: string) => {
    removeSegmento.mutate(id);
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar segmentos</h1>
          <p className="text-muted-foreground">
            Adicione ou remova segmentos de mercado
          </p>
        </div>
        <AddSegmentDialog 
          onAdd={handleAdicionar} 
          isLoading={addSegmento.isPending}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Segmentos cadastrados ({segmentos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {segmentos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum segmento cadastrado
            </p>
          ) : (
            <div className="space-y-2">
              {segmentos.map((segmento) => (
                <div
                  key={segmento.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                >
                  <span>{segmento.nome}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemover(segmento.id)}
                    disabled={removeSegmento.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
