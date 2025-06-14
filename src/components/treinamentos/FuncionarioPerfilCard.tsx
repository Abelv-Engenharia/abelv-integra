
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface FuncionarioPerfilCardProps {
  funcionario: {
    nome: string;
    foto?: string | null;
    funcao: string;
    matricula: string;
    data_admissao?: string | null;
  };
}

export const FuncionarioPerfilCard: React.FC<FuncionarioPerfilCardProps> = ({
  funcionario,
}) => {
  return (
    <Card className="flex items-center gap-4 mb-4 p-4">
      <Avatar className="h-16 w-16">
        {funcionario.foto ? (
          <AvatarImage src={funcionario.foto} alt={funcionario.nome} />
        ) : (
          <AvatarFallback>
            {funcionario.nome.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="font-semibold text-lg">{funcionario.nome}</div>
        <div className="text-sm text-muted-foreground">{funcionario.funcao}</div>
        <div className="text-sm">Matrícula: {funcionario.matricula}</div>
        <div className="text-sm">
          Data de admissão:{" "}
          {funcionario.data_admissao
            ? new Date(funcionario.data_admissao).toLocaleDateString("pt-BR")
            : "-"}
        </div>
      </div>
    </Card>
  );
};
