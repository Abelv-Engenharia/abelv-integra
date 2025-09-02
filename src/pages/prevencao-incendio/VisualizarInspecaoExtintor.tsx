import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, Calendar, User, MapPin, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/common/PageLoader";
import { PermissionGuard } from "@/components/security/PermissionGuard";
import { AccessDenied } from "@/components/security/AccessDenied";

const VisualizarInspecaoExtintor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspecao, setInspecao] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadInspecao = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inspecoes_extintores')
        .select(`
          *,
          extintores(codigo, tipo, capacidade, fabricante, localizacao, data_fabricacao, data_vencimento),
          checklists_avaliacao(nome, descricao),
          profiles(nome, email)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setInspecao(data);
    } catch (error: any) {
      console.error('Erro ao carregar inspeção:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar os detalhes da inspeção.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'concluida': 'default',
      'pendente': 'secondary',
      'cancelada': 'destructive'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status === 'concluida' ? 'Concluída' : 
         status === 'pendente' ? 'Pendente' : 
         status === 'cancelada' ? 'Cancelada' : status}
      </Badge>
    );
  };

  const getConformidadeBadge = (temNaoConformidade: boolean) => {
    return (
      <Badge variant={temNaoConformidade ? 'destructive' : 'default'}>
        {temNaoConformidade ? 'Não Conforme' : 'Conforme'}
      </Badge>
    );
  };

  const downloadRelatorio = () => {
    // TODO: Implementar geração e download do relatório
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de download do relatório em desenvolvimento.",
    });
  };

  useEffect(() => {
    loadInspecao();
  }, [id]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!inspecao) {
    return (
      <PermissionGuard 
        requiredPermissions={['prevencao_incendio_inspecao_extintores', 'prevencao_incendio']}
        requireAdmin={false}
        fallback={<AccessDenied title="Acesso Negado" description="Você não tem permissão para visualizar esta inspeção." />}
      >
        <div className="space-y-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold mb-2">Inspeção não encontrada</h2>
            <p className="text-muted-foreground mb-4">
              A inspeção solicitada não foi encontrada ou você não tem permissão para visualizá-la.
            </p>
            <Button onClick={() => navigate('/prevencao-incendio/consulta-inspecoes')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Consulta
            </Button>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  const itensInspecao = inspecao.dados_preenchidos?.itens || [];
  const extintor = inspecao.extintores;

  return (
    <PermissionGuard 
      requiredPermissions={['prevencao_incendio_inspecao_extintores', 'prevencao_incendio']}
      requireAdmin={false}
      fallback={<AccessDenied title="Acesso Negado" description="Você não tem permissão para visualizar esta inspeção." />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/prevencao-incendio/consulta-inspecoes')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Detalhes da Inspeção</h1>
              <p className="text-muted-foreground">
                {inspecao.checklists_avaliacao?.nome}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge(inspecao.status)}
            {getConformidadeBadge(inspecao.tem_nao_conformidade)}
            <Button onClick={downloadRelatorio}>
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatório
            </Button>
          </div>
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
                <span>{format(new Date(inspecao.data_inspecao), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Responsável:</span>
                <span>{inspecao.profiles?.nome}</span>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Checklist:</span>
                <span>{inspecao.checklists_avaliacao?.nome}</span>
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
                <div>
                  <span className="font-medium">Fabricante:</span>
                  <span className="ml-2">{extintor.fabricante}</span>
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
                              <Badge variant="default" className="flex items-center gap-1">
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
      </div>
    </PermissionGuard>
  );
};

export default VisualizarInspecaoExtintor;