import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, PriorityBadge } from "@/components/sgq/StatusBadge";
import { useRNCData } from "@/hooks/sgq/useRNCData";
import { RNC, FileAttachment } from "@/types/sgq";
import { ImageViewerDialog } from "@/components/sgq/ImageViewerDialog";
import { ArrowLeft, Edit, Calendar, User, Building, AlertTriangle, CheckCircle, Eye, FileEdit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function DetalhesRNC() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRNC, closeRNC } = useRNCData();
  const { toast } = useToast();
  const [rnc, setRnc] = useState<RNC | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<FileAttachment | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadRNC = async () => {
      if (id) {
        const data = await getRNC(id);
        setRnc(data);
        setLoading(false);
      }
    };
    loadRNC();
  }, [id]);

  const handleImageClick = (attachment: FileAttachment) => {
    setSelectedImage(attachment);
    setImageDialogOpen(true);
  };

  const handleCloseRNC = async () => {
    if (!id) return;
    
    try {
      await closeRNC(id);
      toast({
        title: "RNC fechada com sucesso",
        description: "O status da RNC foi alterado para fechada.",
      });
      setCloseDialogOpen(false);
      // Recarregar os dados da RNC
      const data = await getRNC(id);
      setRnc(data);
    } catch (error) {
      toast({
        title: "Erro ao fechar RNC",
        description: "Ocorreu um erro ao tentar fechar a RNC. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-soft">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!rnc) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-soft">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">RNC não encontrada</h3>
            <p className="text-muted-foreground mb-4">
              A RNC solicitada não foi encontrada ou não existe.
            </p>
            <Button onClick={() => navigate('/sgq/rnc')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/sgq/rnc')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Lista
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-foreground">RNC #{rnc.numero}</h1>
              <StatusBadge status={rnc.status} />
              <PriorityBadge priority={rnc.prioridade} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                CCA: {rnc.cca}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {rnc.emitente}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(rnc.data_emissao).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate(`/sgq/rnc/editar/${id}`)}
            disabled={rnc.status === 'fechada'}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar RNC
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Setor / Projeto</label>
                  <p className="text-foreground">{rnc.setor_projeto || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Detectado por</label>
                  <p className="text-foreground">{rnc.detectado_por || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Origem</label>
                  <p className="text-foreground capitalize">{rnc.origem}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Previsão de Fechamento</label>
                  <p className="text-foreground">
                    {new Date(rnc.previsao_fechamento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Disciplinas</label>
                <div className="flex flex-wrap gap-2">
                  {rnc.disciplina.map((disc) => (
                    <Badge key={disc} variant="outline">
                      {disc === 'Outros' && rnc.disciplina_outros 
                        ? `Outros (${rnc.disciplina_outros})` 
                        : disc}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição da NC */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Descrição da Não Conformidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Descrição</label>
                <p className="text-foreground whitespace-pre-wrap">{rnc.descricao_nc}</p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Evidências</label>
                <p className="text-foreground whitespace-pre-wrap">{rnc.evidencias_nc}</p>
              </div>
            </CardContent>
          </Card>

          {/* Disposição */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Disposição da NC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Ações de Disposição</label>
                <div className="flex flex-wrap gap-2">
                  {rnc.disposicao.map((disp) => (
                    <Badge key={disp} variant="secondary">
                      {disp}
                    </Badge>
                  ))}
                </div>
              </div>

              {(rnc.responsavel_disposicao || rnc.prazo_disposicao) && (
                <>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    {rnc.responsavel_disposicao && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Responsável</label>
                        <p className="text-foreground">{rnc.responsavel_disposicao}</p>
                      </div>
                    )}
                    {rnc.prazo_disposicao && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Prazo</label>
                        <p className="text-foreground">
                          {new Date(rnc.prazo_disposicao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {rnc.analise_disposicao && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Análise da Disposição</label>
                    <p className="text-foreground whitespace-pre-wrap">{rnc.analise_disposicao}</p>
                  </div>
                </>
              )}

              {rnc.eficacia && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Eficácia da Disposição</label>
                    <Badge 
                      className={
                        rnc.eficacia === 'eficaz' ? 'bg-success text-success-foreground' :
                        rnc.eficacia === 'nao_eficaz' ? 'bg-critical text-critical-foreground' :
                        'bg-warning text-warning-foreground'
                      }
                    >
                      {rnc.eficacia === 'eficaz' ? 'Eficaz' : 
                       rnc.eficacia === 'nao_eficaz' ? 'Não Eficaz' : 'Nova NC Aberta'}
                    </Badge>
                  </div>
                </>
              )}

              {rnc.evidencia_disposicao && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Evidência da Disposição</label>
                    <p className="text-foreground whitespace-pre-wrap">{rnc.evidencia_disposicao}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Evidências Fotográficas */}
          {((rnc.anexos_evidencias_nc && rnc.anexos_evidencias_nc.length > 0) || 
            (rnc.anexos_evidencia_disposicao && rnc.anexos_evidencia_disposicao.length > 0)) && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Evidências Fotográficas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {rnc.anexos_evidencias_nc && rnc.anexos_evidencias_nc.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-4 text-lg">Evidências da Não Conformidade</h4>
                    <div className="grid gap-6">
                      {rnc.anexos_evidencias_nc
                        .sort((a, b) => (a.evidence_number || 0) - (b.evidence_number || 0))
                        .map((attachment, index) => (
                        <div key={attachment.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">
                                Evidência {attachment.evidence_number || index + 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleImageClick(attachment)}
                                title="Visualizar imagem"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                            {attachment.file_type.startsWith('image/') && attachment.url && (
                              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                <img 
                                  src={attachment.url} 
                                  alt={`Evidência ${attachment.evidence_number || index + 1}`}
                                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => handleImageClick(attachment)}
                                />
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {attachment.file_name}
                            </p>
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                            <div className="p-3 bg-background rounded-lg border">
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {attachment.description || 'Sem descrição'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rnc.anexos_evidencia_disposicao && rnc.anexos_evidencia_disposicao.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-4 text-lg">Evidências da Disposição</h4>
                    <div className="grid gap-6">
                      {rnc.anexos_evidencia_disposicao
                        .sort((a, b) => (a.evidence_number || 0) - (b.evidence_number || 0))
                        .map((attachment, index) => (
                        <div key={attachment.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">
                                Evidência {attachment.evidence_number || index + 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleImageClick(attachment)}
                                title="Visualizar imagem"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                            {attachment.file_type.startsWith('image/') && attachment.url && (
                              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                <img 
                                  src={attachment.url} 
                                  alt={`Evidência ${attachment.evidence_number || index + 1}`}
                                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => handleImageClick(attachment)}
                                />
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {attachment.file_name}
                            </p>
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                            <div className="p-3 bg-background rounded-lg border">
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {attachment.description || 'Sem descrição'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline / Status */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div>
                  <p className="text-sm font-medium">RNC Criada</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(rnc.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {rnc.data_disposicao && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <div>
                    <p className="text-sm font-medium">Disposição Aplicada</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(rnc.data_disposicao).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}

              {rnc.status === 'fechada' && rnc.data_fechamento && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <div>
                    <p className="text-sm font-medium">RNC Fechada</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(rnc.data_fechamento).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Aprovações */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Aprovações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Emitente</span>
                {rnc.aprovacao_emitente ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Qualidade</span>
                {rnc.aprovacao_qualidade ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Cliente</span>
                {rnc.aprovacao_cliente ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {/* TODO: Implementar atualização de disposição */}}
              >
                <FileEdit className="h-4 w-4 mr-2" />
                Atualizar Disposição
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCloseDialogOpen(true)}
                disabled={rnc.status === 'fechada'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Fechar RNC
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Viewer Dialog */}
      {selectedImage && (
        <ImageViewerDialog
          open={imageDialogOpen}
          onOpenChange={setImageDialogOpen}
          imageUrl={selectedImage.url || ''}
          imageName={selectedImage.file_name}
          evidenceNumber={selectedImage.evidence_number}
          description={selectedImage.description}
        />
      )}

      {/* Close RNC Confirmation Dialog */}
      <AlertDialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar fechamento da RNC</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja fechar esta RNC? O status será alterado para "Fechada" 
              e a data de fechamento será registrada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseRNC}>
              Confirmar Fechamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
