
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewOccurrence: () => void;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  open,
  onOpenChange,
  onNewOccurrence,
}) => {
  const navigate = useNavigate();

  const handleNewOccurrence = () => {
    onOpenChange(false);
    onNewOccurrence();
  };

  const handleGoToDashboard = () => {
    onOpenChange(false);
    navigate("/ocorrencias/dashboard");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <AlertDialogTitle className="text-green-800">
            Ocorrência registrada com sucesso!
          </AlertDialogTitle>
          <AlertDialogDescription>
            A ocorrência foi cadastrada e está disponível para consulta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={handleNewOccurrence}
            className="w-full sm:w-auto"
          >
            Registrar nova ocorrência
          </Button>
          <Button
            onClick={handleGoToDashboard}
            className="w-full sm:w-auto"
          >
            Ir para dashboard
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
