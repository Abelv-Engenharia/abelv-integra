
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";

const PlaceholderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  const getPageTitle = () => {
    const pathSegments = path.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) return 'Página';
    
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const getBreadcrumb = () => {
    const pathSegments = path.split('/').filter(Boolean);
    
    return pathSegments
      .map(segment => 
        segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
      .join(' › ');
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{getPageTitle()}</h1>
        <p className="text-muted-foreground">
          {getBreadcrumb()}
        </p>
      </div>

      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            Página em desenvolvimento
          </h2>
          <p className="text-muted-foreground mb-6">
            Esta funcionalidade está em desenvolvimento e estará disponível em breve.
          </p>
          <Button onClick={() => navigate('/')}>
            Voltar para Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
