
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewRecord: () => void;
}

const FormSuccessDialog = ({ open, onOpenChange, onNewRecord }: FormSuccessDialogProps) => {
  const navigate = useNavigate();

  const handleNewRecord = () => {
    onNewRecord();
    onOpenChange(false);
  };

  const handleGoHome = () => {
    navigate("/");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-xl">
            Registro Realizado com Sucesso!
          </DialogTitle>
          <DialogDescription className="text-center">
            O desvio foi cadastrado no sistema com sucesso.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-6">
          <Button onClick={handleNewRecord} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Registro
          </Button>
          <Button onClick={handleGoHome} variant="outline" className="w-full flex items-center gap-2">
            <Home className="h-4 w-4" />
            Menu Principal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormSuccessDialog;
