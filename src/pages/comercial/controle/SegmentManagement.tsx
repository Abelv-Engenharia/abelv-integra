import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { segmentoOptions } from "@/data/commercialMockData";

export default function SegmentManagement() {
  const [segmentos, setSegmentos] = useState<string[]>([...segmentoOptions]);
  const [novoSegmento, setNovoSegmento] = useState("");

  const handleAdicionar = () => {
    if (!novoSegmento.trim()) {
      toast.error("Digite um nome para o segmento");
      return;
    }

    if (segmentos.includes(novoSegmento.trim())) {
      toast.error("Este segmento já existe");
      return;
    }

    setSegmentos([...segmentos, novoSegmento.trim()]);
    setNovoSegmento("");
    toast.success("Segmento adicionado com sucesso");
  };

  const handleRemover = (segmento: string) => {
    setSegmentos(segmentos.filter((s) => s !== segmento));
    toast.success("Segmento removido com sucesso");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Segmentos</h1>
        <p className="text-muted-foreground">
          Adicione ou remova segmentos de mercado
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Segmento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nome do segmento"
              value={novoSegmento}
              onChange={(e) => setNovoSegmento(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdicionar()}
            />
            <Button onClick={handleAdicionar}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segmentos Cadastrados ({segmentos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {segmentos.map((segmento) => (
              <div
                key={segmento}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
              >
                <span>{segmento}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemover(segmento)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
