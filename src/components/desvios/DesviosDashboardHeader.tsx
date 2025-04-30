
import { AlertTriangle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DesviosDashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard de Desvios</h1>
        <p className="text-muted-foreground">
          Visão geral dos desvios de segurança e suas métricas.
        </p>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button 
          variant="outline" 
          onClick={() => navigate("/desvios/consulta")}
        >
          <Search className="mr-2 h-4 w-4" />
          Consultar Desvios
        </Button>
        <Button 
          onClick={() => navigate("/desvios/cadastro")}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Novo Desvio
        </Button>
      </div>
    </div>
  );
};

export default DesviosDashboardHeader;
