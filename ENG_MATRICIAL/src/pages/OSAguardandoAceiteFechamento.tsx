import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X, FileText } from "lucide-react";
import { useOS } from "@/contexts/OSContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function OSAguardandoAceiteFechamento() {
  const { osList, aceitarFechamento, rejeitarFechamento } = useOS();
  const { toast } = useToast();
  
  const osAguardandoAceiteFechamento = osList.filter(os => os.status === "aguardando-aceite-fechamento");

  const capitalizarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAceitarFechamento = (osId: number) => {
    aceitarFechamento(osId);
    toast({
      title: "Fechamento aceito",
      description: "OS finalizada com sucesso.",
    });
  };

  const handleRejeitarFechamento = (osId: number) => {
    rejeitarFechamento(osId);
    toast({
      title: "Fechamento rejeitado",
      description: "OS retornada para execução.",
      variant: "destructive"
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">OS Aguardando aceite fechamento</h1>
          <p className="text-muted-foreground">
            {osAguardandoAceiteFechamento.length} ordem{osAguardandoAceiteFechamento.length !== 1 ? 's' : ''} de serviço aguardando aceite do fechamento pelo solicitante
          </p>
        </div>
      </div>

      {osAguardandoAceiteFechamento.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma OS aguardando aceite de fechamento encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {osAguardandoAceiteFechamento.map((os) => (
            <Card key={os.id} className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    OS Nº {os.numero || os.id} - CCA {os.cca}
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Aguardando aceite fechamento
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleAceitarFechamento(os.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aceitar fechamento
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRejeitarFechamento(os.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                    <Link to={`/os/${os.id}`}>
                      <Button variant="outline" size="sm" title="Ver detalhes">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{os.cliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disciplina</p>
                    <p className="font-medium">{capitalizarTexto(os.disciplina)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solicitante</p>
                    <p className="font-medium text-primary">{os.nomeSolicitante}</p>
                  </div>
                  {os.dataConclusao && (
                    <div>
                      <p className="text-sm text-muted-foreground">Data conclusão</p>
                      <p className="font-medium">{formatDate(os.dataConclusao)}</p>
                    </div>
                  )}
                  {os.valorEngenharia && (
                    <div>
                      <p className="text-sm text-muted-foreground">Valor engenharia</p>
                      <p className="font-medium">{formatCurrency(os.valorEngenharia)}</p>
                    </div>
                  )}
                  {os.valorSuprimentos && (
                    <div>
                      <p className="text-sm text-muted-foreground">Valor suprimentos</p>
                      <p className="font-medium">{formatCurrency(os.valorSuprimentos)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">HH executado</p>
                    <p className="font-medium">{os.hhPlanejado + (os.hhAdicional || 0)}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável EM</p>
                    <p className="font-medium">{os.responsavelEM}</p>
                  </div>
                  {os.competencia && (
                    <div>
                      <p className="text-sm text-muted-foreground">Competência</p>
                      <p className="font-medium">{os.competencia}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="text-sm bg-muted p-3 rounded-md">{os.descricao}</p>
                </div>

                {os.justificativaEngenharia && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Justificativa engenharia</p>
                    <p className="text-sm bg-blue-50 p-3 rounded-md border-l-4 border-blue-200">{os.justificativaEngenharia}</p>
                  </div>
                )}

                {os.percentualSaving && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md border-l-4 border-green-200">
                    <p className="text-sm text-muted-foreground">Saving obtido</p>
                    <p className="font-medium text-green-700">
                      {os.percentualSaving > 0 ? '+' : ''}{os.percentualSaving.toFixed(1)}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}