import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, ArrowLeft, FileText, User, MapPin, Shield, CheckCircle, AlertTriangle, LogIn, Factory } from "lucide-react";
import { fetchInspecaoPublica } from "@/services/extintores/extintoresService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const InspecaoExtintorPublico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: inspecao, isLoading } = useQuery({
    queryKey: ["inspecao-publica", id],
    queryFn: () => fetchInspecaoPublica(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Flame className="h-16 w-16 mx-auto animate-pulse text-primary" />
          <p className="text-muted-foreground">Carregando inspeção...</p>
        </div>
      </div>
    );
  }

  if (!inspecao) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-16 w-16 mx-auto text-destructive" />
              <h1 className="text-2xl font-bold">Inspeção Não Encontrada</h1>
              <p className="text-muted-foreground">
                A inspeção solicitada não foi encontrada ou não está mais disponível.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const itensInspecao = (inspecao.dados_preenchidos as any)?.itens || [];
  const extintor = inspecao.extintores;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Público */}
      <div className="bg-primary text-primary-foreground py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Detalhes da Inspeção</h1>
              <p className="text-sm opacity-90">Sistema de Prevenção contra Incêndios</p>
            </div>
          </div>
          <Link to="/login">
            <Button variant="secondary" size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Acessar Sistema
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Botão Voltar */}
        <Button 
          variant="outline" 
          onClick={() => navigate(`/prevencao-incendio/extintor/${extintor?.codigo}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Extintor
        </Button>

        {/* Status da Inspeção */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            variant={inspecao.status === 'concluida' ? 'default' : 'secondary'}
            className={inspecao.status === 'concluida' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {inspecao.status === 'concluida' ? 'Concluída' : inspecao.status}
          </Badge>
          <Badge 
            variant={inspecao.tem_nao_conformidade ? 'destructive' : 'default'}
            className={!inspecao.tem_nao_conformidade ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {inspecao.tem_nao_conformidade ? 'Não Conforme' : 'Conforme'}
          </Badge>
        </div>

        {/* Informações Gerais */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Dados da Inspeção */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dados da Inspeção
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Data:</span>
                <span>{format(new Date(inspecao.data_inspecao + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Responsável:</span>
                <span>{inspecao.profiles?.nome || 'Não informado'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Checklist:</span>
                <span>{inspecao.checklists_avaliacao?.nome || 'Padrão'}</span>
              </div>

              {inspecao.observacoes && (
                <div>
                  <span className="font-medium">Observações:</span>
                  <p className="text-muted-foreground mt-1">{inspecao.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dados do Extintor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Dados do Extintor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">Código:</span>
                <span className="ml-2">{extintor?.codigo}</span>
              </div>
              
              <div>
                <span className="font-medium">Tipo:</span>
                <span className="ml-2">{extintor?.tipo}</span>
              </div>

              <div>
                <span className="font-medium">Capacidade:</span>
                <span className="ml-2">{extintor?.capacidade}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Localização:</span>
                <span>{extintor?.localizacao}</span>
              </div>

              {extintor?.fabricante && (
                <div className="flex items-center gap-2">
                  <Factory className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Fabricante:</span>
                  <span>{extintor.fabricante}</span>
                </div>
              )}

              {extintor?.data_vencimento && (
                <div>
                  <span className="font-medium">Vencimento:</span>
                  <span className="ml-2">
                    {format(new Date(extintor.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Itens da Inspeção */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Itens Verificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {itensInspecao.map((item: any, index: number) => (
                <div key={item.id || index}>
                  {item.isSection ? (
                    <div className="border-b border-gray-200 pb-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{item.nome}</h3>
                    </div>
                  ) : (
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">{item.nome}</p>
                          
                          <div className="flex items-center gap-2">
                            {item.status === 'conforme' && (
                              <Badge variant="default" className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-3 w-3" />
                                Conforme
                              </Badge>
                            )}
                            {item.status === 'nao_conforme' && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Não Conforme
                              </Badge>
                            )}
                            {item.status === 'nao_se_aplica' && (
                              <Badge variant="outline">
                                Não se Aplica
                              </Badge>
                            )}
                          </div>

                          {item.status === 'nao_conforme' && item.observacao_nc && (
                            <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-400">
                              <p className="text-sm text-red-700">
                                <strong>Observação da NC:</strong> {item.observacao_nc}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {itensInspecao.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Nenhum item de verificação encontrado para esta inspeção.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumo da Inspeção */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Inspeção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {itensInspecao.filter((item: any) => item.status === 'conforme').length}
                </div>
                <div className="text-sm text-green-600">Itens Conformes</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {itensInspecao.filter((item: any) => item.status === 'nao_conforme').length}
                </div>
                <div className="text-sm text-red-600">Não Conformidades</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {itensInspecao.filter((item: any) => item.status === 'nao_se_aplica').length}
                </div>
                <div className="text-sm text-gray-600">Não se Aplica</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assinatura Digital */}
        {(inspecao.dados_preenchidos as any)?.assinatura_responsavel && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Assinatura Digital
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">Responsável pela Inspeção:</span>
                <span className="ml-2">
                  {(inspecao.dados_preenchidos as any).responsavel_nome || inspecao.profiles?.nome}
                </span>
              </div>
              
              {(inspecao.dados_preenchidos as any).data_assinatura && (
                <div>
                  <span className="font-medium">Data da Assinatura:</span>
                  <span className="ml-2">
                    {format(
                      new Date((inspecao.dados_preenchidos as any).data_assinatura), 
                      "dd/MM/yyyy 'às' HH:mm", 
                      { locale: ptBR }
                    )}
                  </span>
                </div>
              )}
              
              <div className="border rounded-lg p-4 bg-muted">
                <img 
                  src={(inspecao.dados_preenchidos as any).assinatura_responsavel} 
                  alt="Assinatura do responsável" 
                  className="max-w-full h-auto mx-auto"
                  style={{ maxHeight: '200px' }}
                />
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Assinatura digital capturada e vinculada ao usuário {inspecao.profiles?.nome}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-6">
          <p>Sistema de Gestão de Segurança</p>
          <p className="mt-1">
            Para mais informações, entre em contato com o responsável pela segurança
          </p>
        </div>
      </div>
    </div>
  );
};

export default InspecaoExtintorPublico;
