import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentUpload } from './DocumentUpload';
import { LMDImporter } from './LMDImporter';
import { DistributionControl } from './DistributionControl';
import { FolderLinkImport } from './FolderLinkImport';
import { Upload, FileSpreadsheet, Send, TrendingUp, FolderOpen } from 'lucide-react';
import { useSupabaseDocuments } from '@/hooks/useSupabaseDocuments';

export function UploadManager() {
  const [activeTab, setActiveTab] = useState('upload');
  const { documents, loading } = useSupabaseDocuments();

  const getStatsCards = () => [
    {
      title: "Total de Documentos",
      value: documents.length,
      icon: <Upload className="h-4 w-4" />,
      color: "bg-primary/10 text-primary"
    },
    {
      title: "Em Elaboração",
      value: documents.filter(d => d.status === 'elaboracao').length,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-warning/10 text-warning"
    },
    {
      title: "Aprovados",
      value: documents.filter(d => d.status === 'aprovado').length,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-success/10 text-success"
    },
    {
      title: "Em Revisão",
      value: documents.filter(d => d.status === 'revisao').length,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-info/10 text-info"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Sistema de Upload e Distribuição
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie uploads de documentos, importações em lote e controle de distribuição
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {getStatsCards().map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{loading ? '-' : stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Individual
          </TabsTrigger>
          <TabsTrigger value="folder" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Importar de Pasta
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Importação em Lote
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Controle de Distribuição
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Individual de Documentos</CardTitle>
                <CardDescription>
                  Faça upload de arquivos para documentos específicos. Selecione um documento da lista abaixo para gerenciar seus arquivos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Nenhum documento encontrado. Crie documentos primeiro ou importe uma LMD.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {documents.length} documento(s) disponível(eis) para upload
                    </p>
                    <div className="grid gap-3">
                      {documents.slice(0, 5).map((doc) => (
                        <div key={doc.id} className="p-4 border rounded-lg bg-muted/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-medium">{doc.numero}</span>
                              <Badge variant="outline">{doc.disciplina}</Badge>
                              <Badge variant="secondary">{doc.status}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 truncate">
                            {doc.titulo}
                          </p>
                          <DocumentUpload documentId={doc.id} />
                        </div>
                      ))}
                      {documents.length > 5 && (
                        <p className="text-sm text-muted-foreground text-center">
                          ... e mais {documents.length - 5} documento(s)
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="folder" className="space-y-6">
            <FolderLinkImport />
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <LMDImporter />
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <DistributionControl />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}