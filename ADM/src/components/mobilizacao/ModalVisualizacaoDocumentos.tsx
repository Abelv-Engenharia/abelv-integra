import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Eye, Calendar, AlertTriangle } from "lucide-react";
import type { StatusColaborador } from "@/types/mobilizacao";

interface ModalVisualizacaoDocumentosProps {
  colaborador: StatusColaborador;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModalVisualizacaoDocumentos({ 
  colaborador, 
  open, 
  onOpenChange 
}: ModalVisualizacaoDocumentosProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-500';
      case 'pendente': return 'bg-yellow-500';
      case 'vencido': return 'bg-red-500';
      case 'em_validacao': return 'bg-blue-500';
      case 'nao_se_aplica': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ok': return 'OK';
      case 'pendente': return 'Pendente';
      case 'vencido': return 'Vencido';
      case 'em_validacao': return 'Em Validação';
      case 'nao_se_aplica': return 'Não se aplica';
      default: return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDiasRestantes = (validade?: string, diasRestantesPreCalculado?: number) => {
    if (diasRestantesPreCalculado !== undefined) return diasRestantesPreCalculado;
    if (!validade) return null;
    const dataValidade = new Date(validade);
    const hoje = new Date();
    const diasRestantes = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes;
  };

  const documentosOrdenados = Object.entries(colaborador.documentos).sort(([a], [b]) => a.localeCompare(b));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos - {colaborador.colaborador.nome}
          </DialogTitle>
          <DialogDescription>
            RE: {colaborador.colaborador.re} | {colaborador.colaborador.obra_nome} ({colaborador.colaborador.obra_cca})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo do Colaborador */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Informações do Colaborador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Função:</span>
                  <p>{colaborador.colaborador.funcao}</p>
                </div>
                <div>
                  <span className="font-medium">Tipo M.O.:</span>
                  <p>{colaborador.colaborador.tipo_mo}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="capitalize">{colaborador.colaborador.status_funcional.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="font-medium">Status Geral:</span>
                  <Badge className={`${getStatusColor(colaborador.status_geral)} text-white`}>
                    {getStatusText(colaborador.status_geral)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo de Pendências */}
          {(colaborador.total_pendencias > 0 || colaborador.total_vencidos > 0) && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  Atenção Necessária
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm">
                  {colaborador.total_pendencias > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {colaborador.total_pendencias} Pendente(s)
                      </Badge>
                    </div>
                  )}
                  {colaborador.total_vencidos > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                        {colaborador.total_vencidos} Vencido(s)
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Documentos */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Status dos Documentos</h3>
            <div className="grid gap-3">
              {documentosOrdenados.map(([tipo, documento]) => {
                const diasRestantes = getDiasRestantes(documento.validade, documento.dias_restantes);
                
                return (
                  <Card key={tipo} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{tipo}</h4>
                          {documento.validade && documento.status !== 'nao_se_aplica' && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>Validade: {formatDate(documento.validade)}</span>
                              {diasRestantes !== null && (
                                <span className={`font-medium ${
                                  diasRestantes < 0 ? 'text-red-600' :
                                  diasRestantes <= 7 ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  {diasRestantes < 0 
                                    ? `(vencido há ${Math.abs(diasRestantes)} dias)`
                                    : diasRestantes === 0
                                    ? '(vence hoje)'
                                    : `(${diasRestantes} dias restantes)`
                                  }
                                </span>
                              )}
                            </div>
                          )}
                          {documento.observacoes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {documento.observacoes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(documento.status)} text-white`}>
                          {getStatusText(documento.status)}
                        </Badge>
                        
                        {documento.status === 'ok' && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Ações */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Total de documentos: {documentosOrdenados.length} | 
              Válidos: {documentosOrdenados.filter(([, doc]) => doc.status === 'ok').length}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar ZIP
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}