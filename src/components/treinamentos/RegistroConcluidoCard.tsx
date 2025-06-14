
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Props = {
  onNovoRegistro: () => void;
  formReset: () => void;
};

export const RegistroConcluidoCard: React.FC<Props> = ({ onNovoRegistro, formReset }) => (
  <div className="flex items-center justify-center h-[calc(100vh-200px)]">
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Registro Concluído!</CardTitle>
        <CardDescription className="text-center">
          O registro de treinamento normativo foi salvo com sucesso.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => { formReset(); onNovoRegistro(); }}>
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
