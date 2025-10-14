import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { commercialMockData } from "@/data/commercialMockData";
import { Badge } from "@/components/ui/badge";

const ConsolidationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const proposal = commercialMockData.find((item) => item.pc === id);

  if (!proposal) {
    return (
      <div className="flex flex-col min-h-screen p-6 bg-background">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/comercial/controle/registros")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Proposta não encontrada</h1>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Contemplado: "default",
      Estimativa: "secondary",
      "Pré-Venda": "outline",
      Perdido: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-background">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/comercial/controle/registros")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Detalhes da Proposta</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Código</p>
              <p className="font-semibold">{proposal.pc}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-semibold">{proposal.cliente}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {getStatusBadge(proposal.status)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Saída</p>
              <p className="font-semibold">{proposal.dataSaidaProposta}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Valor de Venda</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(proposal.valorVenda)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Segmento</p>
              <p className="font-semibold">{proposal.segmento}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vendedor Responsável</p>
              <p className="font-semibold">{proposal.vendedor}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsolidationDetails;
