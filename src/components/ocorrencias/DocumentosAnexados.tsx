import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Download, Eye } from "lucide-react";
import { useSignedUrl } from "@/hooks/useSignedUrl";

interface DocumentosAnexadosProps {
  ocorrencia: {
    id: string;
    arquivo_cat?: string;
    informe_preliminar?: string;
    relatorio_analise?: string;
    arquivo_licoes_aprendidas?: string;
  };
}

interface DocumentoItem {
  nome: string;
  url: string | null;
  tipo: string;
}

const DocumentosAnexados: React.FC<DocumentosAnexadosProps> = ({ ocorrencia }) => {
  const [open, setOpen] = useState(false);
  const { url: signedUrl, loading, error, generate } = useSignedUrl();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const documentos: DocumentoItem[] = [
    {
      nome: "CAT (Comunicação de Acidente de Trabalho)",
      url: ocorrencia.arquivo_cat || null,
      tipo: "cat"
    },
    {
      nome: "Informe Preliminar",
      url: ocorrencia.informe_preliminar || null,
      tipo: "informe"
    },
    {
      nome: "RAI (Relatório de Análise e Investigação)",
      url: ocorrencia.relatorio_analise || null,
      tipo: "rai"
    },
    {
      nome: "Lições Aprendidas",
      url: ocorrencia.arquivo_licoes_aprendidas || null,
      tipo: "licoes"
    }
  ];

  const documentosDisponiveis = documentos.filter(doc => doc.url);

  const handleViewDocument = async (url: string) => {
    setSelectedDoc(url);
    // Extrair o nome do arquivo da URL para gerar signed URL
    const fileName = url.split('/').pop();
    if (fileName) {
      await generate('ocorrencias', fileName, 3600); // URL válida por 1 hora
    }
  };

  const handleDownload = (url: string, nome: string) => {
    if (selectedDoc === url && signedUrl) {
      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      handleViewDocument(url);
    }
  };

  if (documentosDisponiveis.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          title="Ver Documentos"
        >
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Documentos Anexados</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {documentosDisponiveis.map((documento, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{documento.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    Documento anexado
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDocument(documento.url!)}
                  disabled={loading && selectedDoc === documento.url}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {loading && selectedDoc === documento.url ? "Carregando..." : "Visualizar"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(documento.url!, documento.nome)}
                  disabled={loading && selectedDoc === documento.url}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
          
          {error && (
            <div className="text-red-600 text-sm mt-2">
              Erro ao gerar link do documento: {error}
            </div>
          )}
          
          {signedUrl && selectedDoc && (
            <div className="mt-4">
              <iframe
                src={signedUrl}
                className="w-full h-96 border rounded-lg"
                title="Visualização do documento"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentosAnexados;