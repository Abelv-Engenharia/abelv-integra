
import React from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SuccessCardProps {
  onReset: () => void;
}

const SuccessCard = ({ onReset }: SuccessCardProps) => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Registro Concluído!</CardTitle>
          <CardDescription className="text-center">
            O registro de execução de treinamento foi salvo com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={onReset}
          >
            Registrar novo treinamento
          </Button>
          <Button asChild>
            <Link to="/treinamentos/dashboard">
              Menu principal
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessCard;
