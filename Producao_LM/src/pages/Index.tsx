import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentTable } from '@/components/DocumentTable';
import { DocumentForm } from '@/components/DocumentForm';
import { Dashboard } from '@/components/Dashboard';
import { GRDSelection } from '@/components/GRDSelection';
import { GRDForm } from '@/components/GRDForm';
import { GRDHistory } from '@/components/GRDHistory';
import { GRDPDFGenerator } from '@/components/GRDPDFGenerator';
import { UploadManager } from '@/components/UploadManager';
import { useDocuments } from '@/hooks/useDocuments';
import { useGRDs } from '@/hooks/useGRDs';
import { Document, GRD } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { LayoutDashboard, FileText, Settings, Send, Upload } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showGRDSelection, setShowGRDSelection] = useState(false);
  const [showGRDForm, setShowGRDForm] = useState(false);
  const [selectedDocumentsForGRD, setSelectedDocumentsForGRD] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [viewingGRD, setViewingGRD] = useState<GRD | null>(null);
  
  const { documents, addDocument, updateDocument } = useDocuments();
  const { grds, addGRD } = useGRDs();
  const { toast } = useToast();

  const handleNewDocument = () => {
    setEditingDocument(null);
    setShowForm(true);
    setActiveTab('documents');
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setShowForm(true);
    setActiveTab('documents');
  };

  const handleSubmitDocument = (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingDocument) {
      updateDocument(editingDocument.id, documentData);
      toast({
        title: "Documento atualizado",
        description: "O documento foi atualizado com sucesso.",
      });
    } else {
      addDocument(documentData);
      toast({
        title: "Documento criado",
        description: "O documento foi criado com sucesso.",
      });
    }
    setShowForm(false);
    setEditingDocument(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingDocument(null);
  };

  const handleEmitGRD = () => {
    setShowGRDSelection(true);
    setActiveTab('grds');
  };

  const handleGRDSelectionProceed = (selectedDocs: Document[]) => {
    setSelectedDocumentsForGRD(selectedDocs);
    setShowGRDSelection(false);
    setShowGRDForm(true);
  };

  const handleGRDSelectionCancel = () => {
    setShowGRDSelection(false);
    setSelectedDocuments([]);
    setActiveTab('documents');
  };

  const handleGRDFormSubmit = (grdData: Omit<GRD, 'id' | 'numero' | 'createdAt'>) => {
    const newGRD = addGRD(grdData);
    toast({
      title: "GRD criada com sucesso",
      description: `GRD ${newGRD.numero} foi criada e está pronta para download.`,
    });
    setShowGRDForm(false);
    setSelectedDocumentsForGRD([]);
    setSelectedDocuments([]);
    return newGRD;
  };

  const handleGRDFormCancel = () => {
    setShowGRDForm(false);
    setSelectedDocumentsForGRD([]);
  };

  const handleGeneratePDF = (grd: GRD) => {
    // This will be handled by the PDFDownloadLink component
    toast({
      title: "PDF gerado",
      description: "O download do PDF da GRD será iniciado automaticamente.",
    });
  };

  const handleSelectDocument = (documentId: string, selected: boolean) => {
    if (selected) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedDocuments(documents.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleViewGRDDetails = (grd: GRD) => {
    setViewingGRD(grd);
    // Could open a modal or navigate to a detail page
    toast({
      title: "Visualizando GRD",
      description: `Visualizando detalhes da ${grd.numero}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Sistema LMD
          </h1>
          <p className="text-muted-foreground mt-2">
            Lista Mestra de Documentos - Gestão e Controle de Documentos de Projeto
          </p>
        </div>

        {/* Navegação Principal */}
        {!showForm && !showGRDSelection && !showGRDForm && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="grds" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                GRDs
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="dashboard" className="space-y-6">
                <Dashboard documents={documents} />
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <DocumentTable
                  documents={documents}
                  onEditDocument={handleEditDocument}
                  onNewDocument={handleNewDocument}
                  onEmitGRD={handleEmitGRD}
                  selectedDocuments={selectedDocuments}
                  onSelectDocument={handleSelectDocument}
                  onSelectAll={handleSelectAll}
                />
              </TabsContent>

              <TabsContent value="upload" className="space-y-6">
                <UploadManager />
              </TabsContent>

              <TabsContent value="grds" className="space-y-6">
                <GRDHistory 
                  grds={grds} 
                  onViewDetails={handleViewGRDDetails}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="bg-card rounded-lg p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Configurações do Sistema</h2>
                  <p className="text-muted-foreground">
                    Configurações avançadas estarão disponíveis em breve.
                    Funcionalidades incluirão:
                  </p>
                  <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                    <li>Configuração de templates de GRD</li>
                    <li>Gestão de usuários e permissões</li>
                    <li>Configuração de fluxos de aprovação</li>
                    <li>Integração com sistemas externos</li>
                  </ul>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        )}

        {/* Formulário de Documento */}
        {showForm && (
          <div className="animate-fade-in">
            <DocumentForm
              document={editingDocument || undefined}
              onSubmit={handleSubmitDocument}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Seleção de GRD */}
        {showGRDSelection && (
          <div className="animate-fade-in">
            <GRDSelection
              documents={documents}
              onProceed={handleGRDSelectionProceed}
              onCancel={handleGRDSelectionCancel}
            />
          </div>
        )}

        {/* Formulário de GRD */}
        {showGRDForm && (
          <div className="animate-fade-in">
            <GRDForm
              selectedDocuments={selectedDocumentsForGRD}
              onSubmit={handleGRDFormSubmit}
              onCancel={handleGRDFormCancel}
              onGeneratePDF={handleGeneratePDF}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
