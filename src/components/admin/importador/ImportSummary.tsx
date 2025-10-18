import { ImportSummary as ImportSummaryType } from '@/types/githubImport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Copy, FileCode, Route, Menu, BookOpen, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ImportSummaryProps {
  summary: ImportSummaryType;
}

export function ImportSummary({ summary }: ImportSummaryProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [label]: true });
      toast.success(`${label} copiado!`);
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [label]: false });
      }, 2000);
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  const toggleStep = (step: string) => {
    setCompletedSteps({ ...completedSteps, [step]: !completedSteps[step] });
  };

  const getMenuDestinationLabel = () => {
    if (!summary.menuDestination) return 'Não configurado';
    
    if (summary.menuDestination.type === 'new') {
      return `Novo menu: ${summary.menuDestination.newSectionName}`;
    } else {
      const labels: Record<string, string> = {
        'admin': 'Administração',
        'gestao-sms': 'Gestão SMS',
        'tarefas': 'Tarefas',
        'seguranca': 'Segurança',
        'apoio-geral': 'Apoio Geral',
        'suprimentos': 'Suprimentos',
        'engenharia-matricial': 'Engenharia Matricial',
        'comercial': 'Comercial'
      };
      return `Menu existente: ${labels[summary.menuDestination.existingSection || ''] || summary.menuDestination.existingSection}`;
    }
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(text, label)}
      className="gap-2"
    >
      {copiedStates[label] ? (
        <>
          <Check className="h-4 w-4" />
          Copiado!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copiar
        </>
      )}
    </Button>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-6 w-6 text-green-500" />
            Importação concluída!
          </CardTitle>
          <CardDescription>
            Importação realizada em {formatDate(summary.timestamp)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Arquivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.filesImported}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rotas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.routesCreated.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">{getMenuDestinationLabel()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Abas */}
          <Tabs defaultValue="instructions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="instructions" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Instruções
              </TabsTrigger>
              <TabsTrigger value="files" className="gap-2">
                <FileCode className="h-4 w-4" />
                Arquivos
              </TabsTrigger>
              <TabsTrigger value="routes" className="gap-2">
                <Route className="h-4 w-4" />
                Rotas
              </TabsTrigger>
              <TabsTrigger value="menu" className="gap-2">
                <Menu className="h-4 w-4" />
                Menu
              </TabsTrigger>
            </TabsList>

            {/* ABA INSTRUÇÕES */}
            <TabsContent value="instructions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Instruções de instalação manual</CardTitle>
                  <CardDescription>
                    Siga os passos abaixo para completar a importação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => toggleStep('step1')}
                  >
                    {completedSteps['step1'] ? (
                      <CheckSquare className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">Etapa 1: Criar arquivos importados</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Vá para a aba "Arquivos" e copie o código de cada arquivo. Crie os arquivos nos caminhos indicados usando o Lovable AI.
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => toggleStep('step2')}
                  >
                    {completedSteps['step2'] ? (
                      <CheckSquare className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">Etapa 2: Atualizar rotas</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Vá para a aba "Rotas". Copie os imports e cole no topo do src/App.tsx. Depois copie as rotas e cole dentro do componente &lt;Routes&gt;.
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => toggleStep('step3')}
                  >
                    {completedSteps['step3'] ? (
                      <CheckSquare className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">Etapa 3: Atualizar menu</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Vá para a aba "Menu". {summary.menuDestination?.type === 'new' ? 'Crie o arquivo de sidebar e adicione o import e componente no AppSidebar.tsx.' : 'Adicione os itens de menu no arquivo indicado.'}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => toggleStep('step4')}
                  >
                    {completedSteps['step4'] ? (
                      <CheckSquare className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">Etapa 4: Testar</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Verifique se não há erros no console. Teste se as páginas estão acessíveis e se o menu aparece corretamente.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA ARQUIVOS */}
            <TabsContent value="files" className="space-y-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-4 pr-4">
                  {summary.fileContents && summary.fileContents.length > 0 ? (
                    summary.fileContents.map((file, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center justify-between">
                            <span className="font-mono text-sm">{file.path}</span>
                            <CopyButton text={file.content} label={`arquivo-${index}`} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                            <code>{file.content}</code>
                          </pre>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Nenhum arquivo disponível
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* ABA ROTAS */}
            <TabsContent value="routes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Imports para App.tsx
                    <CopyButton 
                      text={summary.generatedCode?.appTsxImports || ''} 
                      label="imports" 
                    />
                  </CardTitle>
                  <CardDescription>
                    Adicione estas linhas no topo do arquivo src/App.tsx
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                    <code>{summary.generatedCode?.appTsxImports || '// Nenhum import disponível'}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Rotas para App.tsx
                    <CopyButton 
                      text={summary.generatedCode?.appTsxRoutes || ''} 
                      label="rotas" 
                    />
                  </CardTitle>
                  <CardDescription>
                    Adicione estas linhas dentro do componente &lt;Routes&gt; no src/App.tsx
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                    <code>{summary.generatedCode?.appTsxRoutes || '// Nenhuma rota disponível'}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA MENU */}
            <TabsContent value="menu" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração do menu</CardTitle>
                  <CardDescription>
                    {getMenuDestinationLabel()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {summary.menuDestination?.type === 'new' ? (
                    <>
                      <div>
                        <h4 className="font-medium mb-2 flex items-center justify-between">
                          1. Criar arquivo de sidebar
                          <CopyButton 
                            text={summary.generatedCode?.sidebarComponent || ''} 
                            label="sidebar-component" 
                          />
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Caminho: <code className="bg-muted px-2 py-1 rounded">{summary.generatedCode?.sidebarComponentPath || 'N/A'}</code>
                        </p>
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs max-h-[400px]">
                          <code>{summary.generatedCode?.sidebarComponent || '// Código não disponível'}</code>
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 flex items-center justify-between">
                          2. Adicionar import no AppSidebar.tsx
                          <CopyButton 
                            text={summary.generatedCode?.sidebarImport || ''} 
                            label="sidebar-import" 
                          />
                        </h4>
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                          <code>{summary.generatedCode?.sidebarImport || '// Import não disponível'}</code>
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 flex items-center justify-between">
                          3. Adicionar componente no AppSidebar.tsx
                          <CopyButton 
                            text={summary.generatedCode?.sidebarUsage || ''} 
                            label="sidebar-usage" 
                          />
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Adicione dentro do &lt;SidebarContent&gt; do AppSidebar.tsx
                        </p>
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                          <code>{summary.generatedCode?.sidebarUsage || '// Código não disponível'}</code>
                        </pre>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center justify-between">
                        Adicionar itens ao menu existente
                        <CopyButton 
                          text={summary.generatedCode?.sidebarUsage || ''} 
                          label="menu-items" 
                        />
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {summary.generatedCode?.sidebarImport || 'Informações não disponíveis'}
                      </p>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                        <code>{summary.generatedCode?.sidebarUsage || '// Código não disponível'}</code>
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Avisos */}
          {summary.warnings && summary.warnings.length > 0 && (
            <Card className="border-yellow-500/50">
              <CardHeader>
                <CardTitle className="text-yellow-500">Pendências</CardTitle>
                <CardDescription>
                  Itens que requerem atenção adicional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-500 mt-1">⚠️</span>
                      <div>
                        <div className="font-medium">{warning.category}</div>
                        <div className="text-muted-foreground">
                          {warning.items && warning.items.filter(i => !i.checked).map(i => i.name).join(', ')}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link to="/admin/importador-github">
                Nova importação
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
