import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface DocumentoPendente {
  tipo: string;
  pendente: boolean;
}

interface DocumentosPendentesCellProps {
  documentos: DocumentoPendente[];
}

export function DocumentosPendentesCell({ documentos }: DocumentosPendentesCellProps) {
  if (!documentos || documentos.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span className="text-sm text-muted-foreground">Completo</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {documentos.map((doc, index) => (
        <Badge
          key={index}
          variant="destructive"
          className="text-xs flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" />
          {doc.tipo}
        </Badge>
      ))}
    </div>
  );
}
