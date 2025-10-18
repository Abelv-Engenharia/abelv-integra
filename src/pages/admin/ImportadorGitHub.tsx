import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GitHubRepoInput } from '@/components/admin/importador/GitHubRepoInput';
import { DirectoryTree } from '@/components/admin/importador/DirectoryTree';
import { DependencyAnalyzer } from '@/components/admin/importador/DependencyAnalyzer';
import { ConflictResolver } from '@/components/admin/importador/ConflictResolver';
import { ImportLog } from '@/components/admin/importador/ImportLog';
import { RouteRegistration } from '@/components/admin/importador/RouteRegistration';
import { PostImportChecklist } from '@/components/admin/importador/PostImportChecklist';
import { useToast } from '@/hooks/use-toast';
import { GitHubImportService } from '@/services/githubImportService';
import { DependencyAnalyzer as DepAnalyzer } from '@/services/dependencyAnalyzer';
import { FileImportService } from '@/services/fileImportService';
import { RouteGenerator } from '@/services/routeGenerator';
import { 
  GitHubRepo, 
  FileNode, 
  DependencyDiff, 
  ImportConflict, 
  ImportLog as ImportLogType,
  RouteConfig,
  PostImportCheck,
  ImportStep,
  MenuDestination,
  ImportSummary 
} from '@/types/githubImport';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImportadorGitHub() {
  const [currentStep, setCurrentStep] = useState<ImportStep>('connection');
  const [loading, setLoading] = useState(false);
  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [githubToken, setGithubToken] = useState<string | undefined>();
  const [fileNodes, setFileNodes] = useState<FileNode[]>([]);
  const [dependencyDiff, setDependencyDiff] = useState<DependencyDiff | null>(null);
  const [selectedDeps, setSelectedDeps] = useState<Set<string>>(new Set());
  const [conflicts, setConflicts] = useState<ImportConflict[]>([]);
  const [logs, setLogs] = useState<ImportLogType[]>([]);
  const [routes, setRoutes] = useState<RouteConfig[]>([]);
  const [registeredRoutes, setRegisteredRoutes] = useState<RouteConfig[]>([]);
  const [menuDestination, setMenuDestination] = useState<MenuDestination>({
    type: 'existing',
    existingSection: 'admin',
  });
  const [checks, setChecks] = useState<PostImportCheck[]>([]);
  const [importedFiles, setImportedFiles] = useState<{ source: string; destination: string }[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const depAnalyzer = new DepAnalyzer();
  const fileService = new FileImportService();
  const routeGenerator = new RouteGenerator();

  const steps: { key: ImportStep; title: string; description: string }[] = [
    { key: 'connection', title: 'Conexão', description: 'Conectar ao repositório' },
    { key: 'selection', title: 'Seleção', description: 'Escolher arquivos' },
    { key: 'dependencies', title: 'Dependências', description: 'Analisar pacotes' },
    { key: 'conflicts', title: 'Conflitos', description: 'Resolver conflitos' },
    { key: 'importing', title: 'Importação', description: 'Importar arquivos' },
    { key: 'routes', title: 'Rotas', description: 'Registrar rotas' },
    { key: 'checklist', title: 'Checklist', description: 'Verificações finais' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleConnect = async (repoData: GitHubRepo & { token?: string }) => {
    setLoading(true);
    try {
      setGithubToken(repoData.token);
      const githubServiceWithToken = new GitHubImportService(repoData.token);
      
      const validationResult = await githubServiceWithToken.validateRepo(repoData);
      if (!validationResult.valid) {
        toast({
          title: 'Erro',
          description: validationResult.error || 'Repositório não encontrado ou inacessível',
          variant: 'destructive',
        });
        return;
      }

      setRepo(repoData);
      
      const structure = await githubServiceWithToken.getRepoStructure(
        repoData.owner,
        repoData.repo,
        repoData.branch
      );
      setFileNodes(structure);
      
      toast({ title: 'Sucesso', description: 'Conectado ao repositório' });
      setCurrentStep('selection');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao conectar ao repositório',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExpandNode = async (node: FileNode): Promise<FileNode[]> => {
    if (!repo) return [];
    const githubService = new GitHubImportService(githubToken);
    return await githubService.expandDirectory(repo.owner, repo.repo, repo.branch, node);
  };

  const handleNextStep = async () => {
    if (currentStep === 'selection') {
      setLoading(true);
      try {
        // Analisar dependências
        if (repo) {
          const githubService = new GitHubImportService(githubToken);
          const sourcePackage = await githubService.getPackageJson(repo.owner, repo.repo, repo.branch);
          const currentPackage = await fetch('/package.json').then(r => r.json());
          
          if (sourcePackage && currentPackage) {
            const diff = depAnalyzer.analyzeDependencies(sourcePackage, currentPackage);
            setDependencyDiff(diff);
            
            // Selecionar automaticamente dependências ausentes
            setSelectedDeps(new Set(Object.keys(diff.missing)));
          }
        }
        setCurrentStep('dependencies');
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 'dependencies') {
      // Detectar conflitos
      const selectedFiles = getAllSelectedFiles(fileNodes);
      const existingFiles: string[] = []; // TODO: Obter arquivos existentes
      const detectedConflicts = fileService.detectConflicts(selectedFiles, existingFiles);
      setConflicts(detectedConflicts);
      setCurrentStep('conflicts');
    } else if (currentStep === 'conflicts') {
      setCurrentStep('importing');
      await performImport();
    } else if (currentStep === 'importing') {
      // Detectar rotas
      const selectedFiles = getAllSelectedFiles(fileNodes);
      const detectedRoutes = routeGenerator.detectPageFiles(selectedFiles.map(f => f.path));
      setRoutes(detectedRoutes);
      setCurrentStep('routes');
    } else if (currentStep === 'routes') {
      // Gerar checklist
      await generateChecklist();
      setCurrentStep('checklist');
    }
  };

  const performImport = async () => {
    if (!repo) return;
    
    const githubService = new GitHubImportService(githubToken);
    const selectedFiles = getAllSelectedFiles(fileNodes);
    const result = await fileService.importFiles(
      selectedFiles,
      conflicts,
      async (path) => await githubService.getFileContent(repo.owner, repo.repo, path, repo.branch)
    );
    
    setLogs(fileService.getLogs());
    setImportedFiles(result.savedFiles);
    
    toast({
      title: 'Importação concluída',
      description: `${result.success} arquivos importados com sucesso`,
    });
  };

  const handleRegisterRoute = (route: RouteConfig, destination: MenuDestination) => {
    setRegisteredRoutes(prev => {
      const updated = [...prev, route];
      toast({ 
        title: 'Rota configurada', 
        description: `${route.title} será adicionada ao menu` 
      });
      
      // Se todas as rotas foram configuradas, avançar automaticamente
      if (updated.length === routes.length) {
        setTimeout(() => handleNextStep(), 500);
      }
      
      return updated;
    });
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Gerar resumo da importação
      const summary: ImportSummary = {
        filesImported: importedFiles.length,
        savedFiles: importedFiles,
        routesCreated: registeredRoutes,
        menuDestination: menuDestination,
        warnings: checks.filter(c => c.status === 'pending'),
        timestamp: new Date(),
      };
      
      toast({
        title: 'Importação finalizada!',
        description: 'Redirecionando para o resumo...',
      });
      
      // Redirecionar para página de resumo
      setTimeout(() => {
        navigate('/admin/importador-github/resumo', { state: { summary } });
      }, 1000);
      
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao finalizar importação',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateChecklist = async () => {
    const githubService = new GitHubImportService(githubToken);
    const selectedFiles = getAllSelectedFiles(fileNodes);
    const allContent = await Promise.all(
      selectedFiles
        .filter(f => f.type === 'file')
        .map(async f => {
          if (!repo) return '';
          return await githubService.getFileContent(repo.owner, repo.repo, f.path, repo.branch) || '';
        })
    );
    
    const content = allContent.join('\n');
    
    const envVars = fileService.extractEnvVariables(content);
    const tables = fileService.extractSupabaseTables(content);
    const components = fileService.extractShadcnComponents(content);
    
    const checklistData: PostImportCheck[] = [
      {
        category: 'env',
        status: 'pending',
        items: envVars.map(v => ({
          name: v,
          checked: false,
          required: true,
          details: 'Configure no arquivo .env',
        })),
      },
      {
        category: 'supabase',
        status: 'pending',
        items: tables.map(t => ({
          name: `Tabela: ${t}`,
          checked: false,
          required: true,
          details: 'Verificar se tabela existe no Supabase',
        })),
      },
      {
        category: 'tailwind',
        status: 'pending',
        items: components.map(c => ({
          name: `Componente: ${c}`,
          checked: false,
          required: false,
          details: 'Verificar se componente shadcn está instalado',
        })),
      },
      {
        category: 'dependencies',
        status: selectedDeps.size === 0 ? 'completed' : 'pending',
        items: Array.from(selectedDeps).map(d => ({
          name: d,
          checked: false,
          required: true,
          details: 'Instalar dependência',
        })),
      },
    ];
    
    setChecks(checklistData);
  };

  const getAllSelectedFiles = (nodes: FileNode[]): FileNode[] => {
    const selected: FileNode[] = [];
    
    const traverse = (node: FileNode) => {
      if (node.selected && node.type === 'file') {
        selected.push(node);
      }
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    nodes.forEach(traverse);
    return selected;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'connection':
        return <GitHubRepoInput onConnect={handleConnect} loading={loading} />;
      
      case 'selection':
        return (
          <DirectoryTree
            nodes={fileNodes}
            onSelectionChange={setFileNodes}
            onExpand={handleExpandNode}
          />
        );
      
      case 'dependencies':
        return dependencyDiff ? (
          <DependencyAnalyzer
            diff={dependencyDiff}
            selectedDeps={selectedDeps}
            onSelectionChange={setSelectedDeps}
          />
        ) : null;
      
      case 'conflicts':
        return (
          <ConflictResolver
            conflicts={conflicts}
            onResolutionChange={setConflicts}
          />
        );
      
      case 'importing':
        return <ImportLog logs={logs} />;
      
      case 'routes':
        return (
          <RouteRegistration
            routes={routes}
            menuDestination={menuDestination}
            onMenuDestinationChange={setMenuDestination}
            onRegister={handleRegisterRoute}
          />
        );
      
      case 'checklist':
        return (
          <PostImportChecklist
            checks={checks}
            onCheckChange={setChecks}
          />
        );
    }
  };

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Importador github</h1>
        <p className="text-muted-foreground">
          Importar páginas e componentes de outros repositórios
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{steps[currentStepIndex].title}</CardTitle>
                <CardDescription>{steps[currentStepIndex].description}</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                Etapa {currentStepIndex + 1} de {steps.length}
              </div>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => {
                const prevIndex = Math.max(0, currentStepIndex - 1);
                setCurrentStep(steps[prevIndex].key);
              }}
              disabled={currentStepIndex === 0 || loading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {currentStepIndex < steps.length - 1 ? (
              <Button onClick={handleNextStep} disabled={loading}>
                Próximo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={loading}>
                Concluir
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
