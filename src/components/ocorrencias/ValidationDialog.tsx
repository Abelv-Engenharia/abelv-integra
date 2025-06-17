
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingFields: string[];
}

export const ValidationDialog: React.FC<ValidationDialogProps> = ({
  open,
  onOpenChange,
  missingFields,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Campos obrigatórios não preenchidos</AlertDialogTitle>
          <AlertDialogDescription>
            Por favor, preencha os seguintes campos obrigatórios antes de salvar:
            <ul className="mt-2 list-disc list-inside">
              {missingFields.map((field, index) => (
                <li key={index} className="text-red-600">{field}</li>
              ))}
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Entendi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
