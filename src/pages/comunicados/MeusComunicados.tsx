import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useComunicadosAtivos } from "@/hooks/useComunicados";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { FileText, Search, Calendar } from "lucide-react";
import ComunicadoModal from "@/components/comunicados/ComunicadoModal";
import { Comunicado } from "@/types/comunicados";

const MeusComunicados = () => {
  const { data: comunicados, isLoading } = useComunicadosAtivos();
  const [busca, setBusca] = useState("");
  const [comunicadoSelecionado, setComunicadoSelecionado] = useState<Comunicado | null>(null);

  const comunicadosFiltrados = comunicados?.filter(comunicado =>
    comunicado.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    (comunicado.descricao && comunicado.descricao.toLowerCase().includes(busca.toLowerCase()))
  ) || [];

  const handleVisualizarComunicado = (comunicado: Comunicado) => {
    setComunicadoSelecionado(comunicado);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando comunicados...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Meus Comunicados</h1>
        <p className="text-muted-foreground">
          Visualize todos os comunicados que você já deu ciência.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar comunicados..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {comunicadosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2" />
                {busca ? "Nenhum comunicado encontrado" : "Não há comunicados disponíveis"}
              </div>
            </CardContent>
          </Card>
        ) : (
          comunicadosFiltrados.map((comunicado) => (
            <Card 
              key={comunicado.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleVisualizarComunicado(comunicado)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{comunicado.titulo}</CardTitle>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(comunicado.created_at), "dd/MM/yyyy", { locale: pt })}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {comunicado.descricao && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {comunicado.descricao}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>
                        Válido: {format(new Date(comunicado.data_inicio), "dd/MM/yyyy", { locale: pt })} - {format(new Date(comunicado.data_fim), "dd/MM/yyyy", { locale: pt })}
                      </span>
                      {comunicado.arquivo_nome && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>Anexo disponível</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {comunicadoSelecionado && (
        <ComunicadoModal
          comunicado={comunicadoSelecionado}
          open={!!comunicadoSelecionado}
          onCiencia={() => setComunicadoSelecionado(null)}
        />
      )}
    </div>
  );
};

export default MeusComunicados;