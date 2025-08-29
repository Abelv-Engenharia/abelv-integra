import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, MapPin, Calendar, User, Building, Users, PenTool } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageLoader } from "@/components/common/PageLoader";
import { toast } from "@/hooks/use-toast";
import { useIdentificacaoFrenteTrabalho } from "@/hooks/inspecao-sms/useIdentificacaoFrenteTrabalho";

const VisualizarInspecao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspecao, setInspecao] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [responsavelFrenteTrabalho, setResponsavelFrenteTrabalho] = useState<string>('');

  // Hook para buscar dados da identificação da frente de trabalho
  const { identificacao, isLoading: isLoadingIdentificacao } = useIdentificacaoFrenteTrabalho(
    inspecao?.dados_preenchidos?.campos_cabecalho
  );

  // Função para buscar o nome do responsável pela frente de trabalho
  const buscarResponsavelFrenteTrabalho = async (responsavelId: string) => {
    if (!responsavelId) return;

    try {
      // Tentar buscar em engenheiros
      const { data: engenheiro } = await supabase
        .from('engenheiros')
        .select('nome')
        .eq('id', responsavelId)
        .maybeSingle();

      if (engenheiro?.nome) {
        setResponsavelFrenteTrabalho(engenheiro.nome);
        return;
      }

      // Tentar buscar em supervisores
      const { data: supervisor } = await supabase
        .from('supervisores')
        .select('nome')
        .eq('id', responsavelId)
        .maybeSingle();

      if (supervisor?.nome) {
        setResponsavelFrenteTrabalho(supervisor.nome);
        return;
      }

      // Tentar buscar em encarregados
      const { data: encarregado } = await supabase
        .from('encarregados')
        .select('nome')
        .eq('id', responsavelId)
        .maybeSingle();

      if (encarregado?.nome) {
        setResponsavelFrenteTrabalho(encarregado.nome);
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar responsável da frente de trabalho:', error);
    }
  };

  const loadInspecao = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inspecoes_sms')
        .select(`
          *,
          checklists_avaliacao(nome),
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
      'pendente': { label: 'Pendente', variant: 'outline' as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: 'outline' as const,
    };

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
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
      'nao_se_aplica': { label: 'Não se Aplica', variant: 'secondary' as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: 'outline' as const,
    };

    return <Badge variant={statusInfo.variant} className="text-xs">{statusInfo.label}</Badge>;
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await supabase.functions.invoke('generate-inspecao-pdf', {
        body: { inspecaoId: inspecao.id },
      });

      if (response.data) {
        // Abrir o relatório HTML em uma nova aba para impressão como PDF
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(response.data);
          newWindow.document.close();
          // Aguardar um pouco e então abrir a caixa de impressão
          setTimeout(() => {
            newWindow.print();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadInspecao();
  }, [id]);

  // Buscar nome do responsável quando a inspeção for carregada
  useEffect(() => {
    if (inspecao?.dados_preenchidos?.responsavel_tecnico_id || 
        inspecao?.dados_preenchidos?.assinaturas?.responsavel_tecnico) {
      const responsavelId = inspecao.dados_preenchidos.responsavel_tecnico_id || 
                           inspecao.dados_preenchidos.assinaturas.responsavel_tecnico;
      buscarResponsavelFrenteTrabalho(responsavelId);
    }
  }, [inspecao]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!inspecao) {
    return (
      <div className="content-padding section-spacing">
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-2">Inspeção não encontrada</h2>
          <p className="text-muted-foreground mb-4">
            A inspeção solicitada não foi encontrada ou você não tem permissão para visualizá-la.
          </p>
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
          <Button variant="outline" size="sm" onClick={() => navigate('/inspecao-sms/consulta')}>
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
          <Button onClick={handleDownloadPDF} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Grid principal com duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna esquerda - 2/3 da largura */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Gerais */}
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
                        {format(new Date(inspecao.data_inspecao), 'dd/MM/yyyy', {
                          locale: ptBR
                        })}
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
                  <p className="font-medium">{inspecao.checklists_avaliacao?.nome || 'N/A'}</p>
                </div>
                
                {inspecao.observacoes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Observações</p>
                    <p className="text-sm bg-muted p-3 rounded-md">{inspecao.observacoes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card Identificação - Adaptado para tipo de inspeção */}
            {inspecao.dados_preenchidos?.campos_cabecalho && Object.keys(inspecao.dados_preenchidos.campos_cabecalho).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('veículo') || 
                     inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('transporte') ? 
                      'Identificação do Veículo de Transporte' : 
                      'Identificação da Frente de Trabalho'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingIdentificacao ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Carregando informações...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Campos específicos para veículo de transporte */}
                      {(inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('veículo') || 
                        inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('transporte')) ? (
                        <>
                          {/* Empresa */}
                          {identificacao.empresa && (
                            <div>
                              <p className="text-sm text-muted-foreground">Empresa</p>
                              <p className="font-medium">{identificacao.empresa}</p>
                            </div>
                          )}
                          
                          {/* Responsável pela Inspeção */}
                          <div>
                            <p className="text-sm text-muted-foreground">Responsável pela Inspeção</p>
                            <p className="font-medium">{inspecao.profiles?.nome || 'N/A'}</p>
                          </div>
                          
                          {/* Engenheiro Responsável */}
                          {identificacao.engenheiro && (
                            <div>
                              <p className="text-sm text-muted-foreground">Engenheiro Responsável</p>
                              <p className="font-medium">{identificacao.engenheiro}</p>
                            </div>
                          )}
                          
                          {/* Mostrar todos os campos do cabeçalho para veículo, exceto assinaturas */}
                          {Object.entries(inspecao.dados_preenchidos.campos_cabecalho).map(([key, value]: [string, any]) => {
                            if (!value || value === '') return null;
                            
                            // Filtrar campos de assinatura
                            if (key.toLowerCase().includes('assinatura') || 
                                key.toLowerCase().includes('data_assinatura')) {
                              return null;
                            }
                            
                            // Mapear os nomes dos campos para rótulos mais amigáveis
                            const fieldLabels: { [key: string]: string } = {
                              placa: 'Placa do Veículo',
                              motorista: 'Motorista',
                              modelo: 'Modelo do Veículo',
                              ano: 'Ano',
                              cor: 'Cor',
                              km: 'Quilometragem',
                              km_do_veiculo: 'Quilometragem',
                              combustivel: 'Combustível',
                              capacidade: 'Capacidade',
                              categoria: 'Categoria',
                              cnh: 'CNH (Nº/Categoria)',
                              empresa_de_transporte: 'Empresa de Transporte',
                              modelo_do_veiculo: 'Modelo do Veículo',
                              responsavel_inspecao: 'Responsável da Inspeção',
                              engenheiro_responsavel: 'Engenheiro Responsável',
                              renavam: 'RENAVAM',
                              chassi: 'Chassi'
                            };
                            
                            const label = fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                            const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                            
                            return (
                              <div key={key}>
                                <p className="text-sm text-muted-foreground">{label}</p>
                                <p className="font-medium">{displayValue}</p>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          {/* Campos para frente de trabalho (original) */}
                          {identificacao.engenheiro && (
                            <div>
                              <p className="text-sm text-muted-foreground">Engenheiro Responsável</p>
                              <p className="font-medium">{identificacao.engenheiro}</p>
                            </div>
                          )}
                          
                          {identificacao.supervisor && (
                            <div>
                              <p className="text-sm text-muted-foreground">Supervisor Responsável</p>
                              <p className="font-medium">{identificacao.supervisor}</p>
                            </div>
                          )}
                          
                          {identificacao.encarregado && (
                            <div>
                              <p className="text-sm text-muted-foreground">Encarregado Responsável</p>
                              <p className="font-medium">{identificacao.encarregado}</p>
                            </div>
                          )}
                          
                          {identificacao.empresa && (
                            <div>
                              <p className="text-sm text-muted-foreground">Empresa</p>
                              <p className="font-medium">{identificacao.empresa}</p>
                            </div>
                          )}
                          
                          {identificacao.disciplina && (
                            <div>
                              <p className="text-sm text-muted-foreground">Disciplina</p>
                              <p className="font-medium">{identificacao.disciplina}</p>
                            </div>
                          )}
                          
                          {!identificacao.engenheiro && !identificacao.supervisor && !identificacao.encarregado && !identificacao.empresa && !identificacao.disciplina && (
                            <div className="col-span-2 text-center py-4">
                              <p className="text-muted-foreground">Nenhuma informação de identificação da frente de trabalho disponível.</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Itens Verificados */}
            <Card>
              <CardHeader>
                <CardTitle>Itens Verificados</CardTitle>
              </CardHeader>
              <CardContent>
                {inspecao.dados_preenchidos?.itens ? (
                  <div className="space-y-4">
                    {inspecao.dados_preenchidos.itens.map((item: any, index: number) => (
                      <div key={item.id || index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.nome}</p>
                            {item.secao && !item.isSection && (
                              <p className="text-xs text-muted-foreground mt-1">Seção: {item.secao}</p>
                            )}
                          </div>
                          <div className="ml-4">
                            {getItemStatusBadge(item.status)}
                          </div>
                        </div>
                        {item.status === 'nao_conforme' && item.observacao_nc && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm font-medium text-red-900 mb-1">Observação da Não Conformidade:</p>
                            <p className="text-sm text-red-800">{item.observacao_nc}</p>
                          </div>
                        )}
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

          {/* Coluna direita - 1/3 da largura */}
          <div className="space-y-6">
            {/* Card Resumo */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {inspecao.dados_preenchidos?.itens?.length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Itens Verificados</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
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
                    <div>
                      <div className="text-lg font-semibold text-gray-600">
                        {inspecao.dados_preenchidos?.itens?.filter((item: any) => item.status === 'nao_se_aplica')?.length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Não Aplicáveis</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-2 border-t">
                  {inspecao.updated_at !== inspecao.created_at && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Atualizado em</div>
                      <div className="text-sm">
                        {format(new Date(inspecao.updated_at), 'dd/MM/yyyy HH:mm', {
                          locale: ptBR
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card Assinaturas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Assinaturas dos Responsáveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Assinatura do Auditor */}
                  <div className="text-center border-b pb-4">
                    <div className="mb-2">
                      {(inspecao.dados_preenchidos?.assinatura_inspetor || inspecao.dados_preenchidos?.assinaturas?.assinatura_inspetor) ? (
                        <div className="h-20 border rounded-md flex items-center justify-center bg-muted/50">
                          <img 
                            src={inspecao.dados_preenchidos?.assinatura_inspetor || inspecao.dados_preenchidos?.assinaturas?.assinatura_inspetor} 
                            alt="Assinatura do Auditor" 
                            className="max-h-16 max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-16 border-2 border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Assinatura não capturada</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium">{inspecao.profiles?.nome || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Auditor Responsável</p>
                    {inspecao.dados_preenchidos?.data_assinatura && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Assinado em: {format(new Date(inspecao.dados_preenchidos.data_assinatura), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    )}
                  </div>

                  {/* Assinatura do Responsável - Adaptado para tipo de inspeção */}
                  {/* Para veículo de transporte, não mostrar a seção de assinatura do responsável */}
                  {!(inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('veículo') || 
                    inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('transporte')) && (
                    <div className="text-center">
                      <div className="mb-2">
                        {(inspecao.dados_preenchidos?.assinatura_responsavel_tecnico || inspecao.dados_preenchidos?.assinaturas?.assinatura_responsavel_tecnico) ? (
                          <div className="h-20 border rounded-md flex items-center justify-center bg-muted/50">
                            <img 
                              src={inspecao.dados_preenchidos?.assinatura_responsavel_tecnico || inspecao.dados_preenchidos?.assinaturas?.assinatura_responsavel_tecnico} 
                              alt="Assinatura do Responsável pela Frente de Trabalho" 
                              className="max-h-16 max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-16 border-2 border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">Assinatura não capturada</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Para frente de trabalho - mostrar nome do responsável técnico */}
                      {responsavelFrenteTrabalho && (
                        <p className="text-sm font-semibold text-primary mb-1">
                          {responsavelFrenteTrabalho}
                        </p>
                      )}
                      <p className="text-sm font-medium">Responsável pela Frente de Trabalho</p>
                      <p className="text-xs text-muted-foreground">Responsável para Assinatura</p>
                      
                      {inspecao.dados_preenchidos?.data_assinatura && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Assinado em: {format(new Date(inspecao.dados_preenchidos.data_assinatura), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Mensagem quando nenhuma assinatura foi capturada */}
                  {!inspecao.dados_preenchidos?.assinatura_inspetor && 
                   !inspecao.dados_preenchidos?.assinaturas?.assinatura_inspetor && 
                   !inspecao.dados_preenchidos?.assinatura_responsavel_tecnico && 
                   !inspecao.dados_preenchidos?.assinaturas?.assinatura_responsavel_tecnico && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground text-sm">
                        Nenhuma assinatura foi capturada para esta inspeção.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizarInspecao;