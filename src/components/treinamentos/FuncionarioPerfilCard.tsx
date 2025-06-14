
// Corrige exibição da foto na consulta de funcionário
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { useSignedUrl } from "@/hooks/useSignedUrl";

// Espera objeto funcionário com campos: nome, funcao, matricula, data_admissao, foto
export const FuncionarioPerfilCard: React.FC<{ funcionario: any }> = ({ funcionario }) => {
  const { url: signedUrl, generate } = useSignedUrl();

  React.useEffect(() => {
    if (funcionario?.foto) {
      let filePath = funcionario.foto;
      if (/^https?:\/\//.test(filePath)) {
        const match = filePath.match(/\/storage\/v1\/object\/sign\/([^?]+)/);
        if (match) {
          filePath = decodeURIComponent(match[1]);
        } else {
          const idx = filePath.indexOf('funcionarios-fotos/');
          if (idx >= 0) filePath = filePath.slice(idx + 'funcionarios-fotos/'.length);
        }
      } else if (filePath.startsWith('funcionarios/')) {
        // ok
      } else {
        filePath = `funcionarios/${filePath}`;
      }
      generate('funcionarios-fotos', filePath, 480);
    }
    // eslint-disable-next-line
  }, [funcionario?.foto]);

  return (
    <Card className="p-4 flex items-center gap-4 rounded-lg">
      <Avatar className="size-20">
        {funcionario?.foto && signedUrl ? (
          <AvatarImage src={signedUrl} />
        ) : (
          <AvatarFallback>
            <UserRound className="h-10 w-10" />
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <div className="text-xl font-bold">{funcionario?.nome}</div>
        <div className="text-muted-foreground uppercase text-sm tracking-wide">{funcionario?.funcao}</div>
        <div className="text-sm">
          Matrícula: {funcionario?.matricula || "-"}
        </div>
        <div className="text-sm">
          Data de admissão: {funcionario?.data_admissao 
            ? new Date(funcionario.data_admissao).toLocaleDateString('pt-BR') 
            : "-"}
        </div>
      </div>
    </Card>
  );
};
