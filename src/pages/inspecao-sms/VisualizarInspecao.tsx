
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, MapPin, Calendar, User, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageLoader } from "@/components/common/PageLoader";
import { toast } from "@/hooks/use-toast";

const VisualizarInspecao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspecao, setInspecao] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadInspecao = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inspecoes_sms')
        .select(`
          *,
          modelos_inspecao_sms(
            nome,
            tipos_inspecao_sms(id, nome)
          ),
          profiles(nome),
          ccas(codigo, nome)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setInspecao(data);
    } catch (error: any) {
      console.error('Erro ao carregar inspeção:', error);
      toast({
        title: "Erro ao carregar inspeção",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'concluida': { label: 'Concluída', variant: 'default' as const },
      'em_andamento': { label: 'Em Andamento', variant: 'secondary' as const },
      'pendente': { label: 'Pendente', variant: 'outline' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || 
      { label: status, variant: 'outline' as const };
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getConformidadeBadge = (temNaoConformidade: boolean) => {
    return (
      <Badge variant={temNaoConformidade ? "destructive" : "default"}>
        {temNaoConformidade ? "Não Conforme" : "Conforme"}
      </Badge>
    );
  };

  const getItemStatusBadge = (status: string) => {
    const statusMap = {
      'conforme': { label: 'Conforme', variant: 'default' as const },
      'nao_conforme': { label: 'Não Conforme', variant: 'destructive' as const },
      'nao_se_aplica': { label: 'Não se Aplica', variant: 'secondary' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || 
      { label: status, variant: 'outline' as const };
    
    return (
      <Badge variant={statusInfo.variant} className="text-xs">
        {statusInfo.label}
      </Badge>
    );
  };

  const handleDownloadPDF = async () => {
    if (!inspecao?.pdf_gerado_url) return;
    
    try {
      window.open(inspecao.pdf_gerado_url, '_blank');
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      toast({
        title: "Erro ao baixar PDF",
        description: "Não foi possível baixar o arquivo",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadInspecao();
  }, [id]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!inspecao) {
    return (
      <div className="content-padding section-spacing">
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-2">Inspeção não encontrada</h2>
          <p className="text-muted-foreground mb-4">A inspeção solicitada não foi encontrada ou você não tem permissão para visualizá-la.</p>
          <Button onClick={() => navigate('/inspecao-sms/consulta')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Consulta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-padding section-spacing">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/inspecao-sms/consulta')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Detalhes da Inspeção</h1>
            <p className="text-sm text-muted-foreground">
              {inspecao.modelos_inspecao_sms?.tipos_inspecao_sms?.nome}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusBadge(inspecao.status)}
          {getConformidadeBadge(inspecao.tem_nao_conformidade)}
          {inspecao.pdf_gerado_url && (
            <Button onClick={handleDownloadPDF} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Gerais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data da Inspeção</p>
                    <p className="font-medium">
                      {format(new Date(inspecao.data_inspecao), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Local</p>
                    <p className="font-medium">{inspecao.local}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável</p>
                    <p className="font-medium">{inspecao.profiles?.nome || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">CCA</p>
                    <p className="font-medium">
                      {inspecao.ccas ? `${inspecao.ccas.codigo} - ${inspecao.ccas.nome}` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Modelo de Inspeção</p>
                <p className="font-medium">{inspecao.modelos_inspecao_sms?.nome}</p>
              </div>
              
              {inspecao.observacoes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm bg-muted p-3 rounded-md">{inspecao.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Itens Verificados */}
          <Card>
            <CardHeader>
              <CardTitle>Itens Verificados</CardTitle>
            </CardHeader>
            <CardContent>
              {inspecao.dados_preenchidos?.itens ? (
                <div className="space-y-3">
                  {inspecao.dados_preenchidos.itens.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.nome}</p>
                      </div>
                      <div className="ml-4">
                        {getItemStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum item verificado encontrado.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Resumo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">
                  {inspecao.dados_preenchidos?.itens?.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Itens Verificados</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {inspecao.dados_preenchidos?.itens?.filter((item: any) => item.status === 'conforme')?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Conformes</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-600">
                    {inspecao.dados_preenchidos?.itens?.filter((item: any) => item.status === 'nao_conforme')?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Não Conformes</p>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">Criado em</div>
                <div className="text-sm">
                  {format(new Date(inspecao.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </div>
              </div>
              
              {inspecao.updated_at !== inspecao.created_at && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Atualizado em</div>
                  <div className="text-sm">
                    {format(new Date(inspecao.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisualizarInspecao;
