import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, Image as ImageIcon, Download, CheckCircle, Users, FileDown } from "lucide-react";
import { useComunicadoPorId, useCienciasComunicado } from "@/hooks/useComunicados";
import { useExportarComunicadoPdf } from "@/hooks/useExportarComunicadoPdf";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

const ComunicadoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: comunicado, isLoading } = useComunicadoPorId(id!);
  const { data: ciencias, isLoading: isLoadingCiencias } = useCienciasComunicado(id!);
  
  const { exportarPdf, isExporting } = useExportarComunicadoPdf({
    comunicado: comunicado!,
    ciencias: ciencias || []
  });

  const getFileUrl = (url: string) => {
    if (url.includes('comunicados-anexos')) {
      const fileName = url.split('/').pop();
      const { data } = supabase.storage
        .from('comunicados-anexos')
        .getPublicUrl(fileName || '');
      return data.publicUrl;
    }
    return url;
  };

  const isImage = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  const isPdf = (fileName: string) => {
    return /\.pdf$/i.test(fileName);
  };

  const getStatusBadge = () => {
    if (!comunicado) return null;
    
    const today = new Date().toISOString().split('T')[0];
    
    if (!comunicado.ativo) {
      return <Badge variant="secondary">Inativo</Badge>;
    }
    
    if (today < comunicado.data_inicio) {
      return <Badge variant="outline">Aguardando</Badge>;
    }
    
    if (today > comunicado.data_fim) {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    
    return <Badge variant="default">Ativo</Badge>;
  };

  const renderAnexo = () => {
    if (!comunicado?.arquivo_url || !comunicado?.arquivo_nome) return null;

    const fileUrl = getFileUrl(comunicado.arquivo_url);
    const fileName = comunicado.arquivo_nome;

    if (isImage(fileName)) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Anexo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full h-auto rounded-lg border shadow-sm"
              style={{ maxHeight: '600px' }}
            />
            <p className="text-sm text-muted-foreground mt-2">{fileName}</p>
          </CardContent>
        </Card>
      );
    }

    if (isPdf(fileName)) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documento PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              src={fileUrl}
              className="w-full h-[600px] border rounded-lg shadow-sm"
              title={fileName}
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">{fileName}</p>
              <Button variant="outline" size="sm" asChild>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Anexo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm">{fileName}</p>
            <Button variant="outline" size="sm" asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCienciasCard = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Ciências do Comunicado
            {ciencias && ciencias.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {ciencias.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingCiencias ? (
            <div className="text-sm text-muted-foreground">Carregando ciências...</div>
          ) : !ciencias || ciencias.length === 0 ? (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Nenhum usuário deu ciência ainda
            </div>
          ) : (
            <div className="space-y-3">
              {ciencias.map((ciencia) => (
                <div key={ciencia.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{ciencia.profiles?.nome || 'Nome não disponível'}</div>
                    <div className="text-xs text-muted-foreground">{ciencia.profiles?.email || 'Email não disponível'}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(ciencia.data_ciencia), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando comunicado...</div>
      </div>
    );
  }

  if (!comunicado) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Comunicado não encontrado</h2>
              <Button onClick={() => navigate('/admin/comunicados/consulta')}>
                Voltar para consulta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb e ações */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/comunicados/consulta')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Detalhes do Comunicado</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={exportarPdf}
            disabled={isExporting}
          >
            <FileDown className="h-4 w-4 mr-2" />
            {isExporting ? 'Gerando...' : 'Exportar PDF'}
          </Button>
          <Button
            onClick={() => navigate(`/admin/comunicados/edicao/${comunicado.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal - Conteúdo */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl">{comunicado.titulo}</CardTitle>
                {getStatusBadge()}
              </div>
            </CardHeader>
            <CardContent>
              {comunicado.descricao && (
                <div className="prose max-w-none">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {comunicado.descricao}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {comunicado.arquivo_url && renderAnexo()}
          
          {renderCienciasCard()}
        </div>

        {/* Coluna lateral - Informações */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Período de Vigência</label>
                <div className="text-sm">
                  <div>
                    <strong>Início:</strong> {format(new Date(comunicado.data_inicio), "dd/MM/yyyy", { locale: pt })}
                  </div>
                  <div>
                    <strong>Fim:</strong> {format(new Date(comunicado.data_fim), "dd/MM/yyyy", { locale: pt })}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Público-alvo</label>
                <div className="text-sm">
                  {comunicado.publico_alvo.tipo === 'todos' ? (
                    <span>Todos os usuários</span>
                  ) : (
                    <span>CCAs específicos</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  {getStatusBadge()}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                <div className="text-sm">
                  {format(new Date(comunicado.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
                </div>
              </div>

              {comunicado.updated_at !== comunicado.created_at && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                  <div className="text-sm">
                    {format(new Date(comunicado.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
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

export default ComunicadoDetalhe;