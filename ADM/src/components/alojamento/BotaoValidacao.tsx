import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react";

interface BotaoValidacaoProps {
  titulo: string;
  status: string;
  observacao?: string;
  onValidar: (status: string, observacao: string) => void;
  area: string;
}

export function BotaoValidacao({
  titulo,
  status,
  observacao = "",
  onValidar,
  area
}: BotaoValidacaoProps) {
  const [obs, setObs] = useState(observacao);
  const [statusLocal, setStatusLocal] = useState(status);

  const handleValidacao = (novoStatus: string) => {
    setStatusLocal(novoStatus);
    onValidar(novoStatus, obs);
  };

  const getStatusBadge = () => {
    switch (statusLocal) {
      case "aprovado":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "ajustes":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            Ajustes Necessários
          </Badge>
        );
      case "reprovado":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Reprovado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
    }
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">{titulo}</h4>
          {getStatusBadge()}
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder="Observações da validação..."
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            className="min-h-[80px]"
          />

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => handleValidacao("aprovado")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Aprovar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleValidacao("ajustes")}
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              Solicitar Ajustes
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => handleValidacao("reprovado")}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reprovar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
