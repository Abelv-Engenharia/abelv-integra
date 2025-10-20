import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { gerarAssuntoEmail, gerarCorpoEmailSimplificado } from "@/utils/gerarEmailAnaliseContrato";

interface PreviewEmailAnaliseContratoProps {
  dadosContrato: any;
  destinatarios: string[];
}

export function PreviewEmailAnaliseContrato({ 
  dadosContrato, 
  destinatarios 
}: PreviewEmailAnaliseContratoProps) {
  
  const assunto = gerarAssuntoEmail(dadosContrato);
  const corpoHTML = gerarCorpoEmailSimplificado(dadosContrato);

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Mail className="w-6 h-6" />
          📧 Preview Do Email De Validação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Assunto */}
        <div>
          <div className="text-sm font-semibold text-gray-600 mb-1">Assunto:</div>
          <div className="p-3 bg-white border rounded-lg font-medium">
            {assunto}
          </div>
        </div>

        {/* Preview do Corpo */}
        <div>
          <div className="text-sm font-semibold text-gray-600 mb-1">Corpo Do Email:</div>
          <div 
            className="p-4 bg-white border rounded-lg max-h-96 overflow-y-auto text-sm"
            dangerouslySetInnerHTML={{ __html: corpoHTML }}
          />
        </div>

        {/* Destinatários */}
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
            <Users className="w-4 h-4" />
            Destinatários ({destinatarios.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {destinatarios.map((email, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {email}
              </Badge>
            ))}
          </div>
        </div>

        {/* Aviso */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-700">
            ⚠️ Este email será enviado automaticamente após todas as validações serem concluídas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
