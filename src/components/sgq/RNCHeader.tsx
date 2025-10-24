import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const RNCHeader = () => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-info">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sistema RNC</h1>
              <p className="text-sm text-muted-foreground">Gestão de Registros de Não Conformidade</p>
            </div>
          </div>
          
          <Link to="/sgq/rnc/novo">
            <Button className="bg-gradient-to-r from-primary to-info hover:from-primary-hover hover:to-info/90 shadow-soft">
              <Plus className="h-4 w-4 mr-2" />
              Nova RNC
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
