import { useState } from "react";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NovoControleFeriasModal } from "@/components/ferias/NovoControleFeriasModal";
import { HistoricoFeriasCard } from "@/components/gestao-pessoas/ferias/HistoricoFeriasCard";

export default function ControleFerias() {
  const [novoModalAberto, setNovoModalAberto] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Solicitação de Férias</h1>
          <p className="text-muted-foreground">
            Solicitar férias de prestadores de serviços
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Nova Solicitação de Férias
          </CardTitle>
          <CardDescription>
            Preencha o formulário abaixo para solicitar férias para um prestador de serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setNovoModalAberto(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Criar Solicitação de Férias
          </Button>
        </CardContent>
      </Card>

      {/* Histórico de Solicitações */}
      <HistoricoFeriasCard />

      {/* Modal */}
      <NovoControleFeriasModal
        aberto={novoModalAberto}
        onFechar={() => setNovoModalAberto(false)}
      />
    </div>
  );
}