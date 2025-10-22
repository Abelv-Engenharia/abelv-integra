import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Document } from '@/types/document';

interface DashboardProps {
  documents: Document[];
}

export function Dashboard({ documents }: DashboardProps) {
  const totalDocuments = documents.length;
  const aprovados = documents.filter(d => d.status === 'aprovado').length;
  const emRevisao = documents.filter(d => d.status === 'revisao').length;
  const emElaboracao = documents.filter(d => d.status === 'elaboracao').length;
  const obsoletos = documents.filter(d => d.status === 'obsoleto').length;

  const recentDocuments = documents
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const disciplinasStats = documents.reduce((acc, doc) => {
    acc[doc.disciplina] = (acc[doc.disciplina] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'text-green-600';
      case 'revisao': return 'text-yellow-600';
      case 'elaboracao': return 'text-blue-600';
      case 'obsoleto': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Documentos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{aprovados}</div>
            <p className="text-xs text-muted-foreground">
              {totalDocuments > 0 ? Math.round((aprovados / totalDocuments) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{emRevisao}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Elaboração</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{emElaboracao}</div>
            <p className="text-xs text-muted-foreground">
              Em desenvolvimento
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documentos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Atualizações Recentes</CardTitle>
            <CardDescription>
              Últimos documentos modificados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDocuments.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum documento cadastrado</p>
              ) : (
                recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doc.numero}</p>
                      <p className="text-xs text-muted-foreground truncate">{doc.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(doc.updatedAt)}
                      </p>
                    </div>
                    <div className={`text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status === 'elaboracao' && 'Elaboração'}
                      {doc.status === 'revisao' && 'Revisão'}
                      {doc.status === 'aprovado' && 'Aprovado'}
                      {doc.status === 'obsoleto' && 'Obsoleto'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Disciplina */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Disciplina</CardTitle>
            <CardDescription>
              Documentos organizados por área
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(disciplinasStats).length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhuma disciplina cadastrada</p>
              ) : (
                Object.entries(disciplinasStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([disciplina, count]) => (
                    <div key={disciplina} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="font-medium text-sm">{disciplina}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round((count / totalDocuments) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}