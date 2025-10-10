import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const EstoqueRelacaoAlmoxarifados = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relação de Almoxarifados</h1>
          <p className="text-muted-foreground">
            Lista completa de almoxarifados cadastrados
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relação de Almoxarifados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Página em construção - Relação de almoxarifados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueRelacaoAlmoxarifados;
