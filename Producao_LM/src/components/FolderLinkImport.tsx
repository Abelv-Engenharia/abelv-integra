import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Upload } from "lucide-react";
import { FileMatchingTable } from "./FileMatchingTable";
import { useSupabaseDocuments } from "@/hooks/useSupabaseDocuments";
import { toast } from "sonner";

export const FolderLinkImport = () => {
  const [folderLink, setFolderLink] = useState("");
  const [fileList, setFileList] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [matchedFiles, setMatchedFiles] = useState<any[]>([]);
  const { documents } = useSupabaseDocuments();

  const handleProcessList = () => {
    setProcessing(true);
    
    const fileNames = fileList
      .split("\n")
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (fileNames.length === 0) {
      toast.error("Nenhum arquivo encontrado na lista");
      setProcessing(false);
      return;
    }

    // Match files with documents
    const matches = fileNames.map(fileName => {
      const matchedDoc = documents.find(doc => 
        fileName.toLowerCase().includes(doc.numero.toLowerCase()) ||
        fileName.toLowerCase().includes(doc.titulo.toLowerCase())
      );

      return {
        fileName,
        document: matchedDoc,
        status: matchedDoc ? "matched" : "unmatched",
      };
    });

    setMatchedFiles(matches);
    setProcessing(false);
    toast.success(`${matches.length} arquivos processados`);
  };

  const handleFilesDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);

    // Process uploaded files
    const matches = files.map(file => {
      const matchedDoc = documents.find(doc => 
        file.name.toLowerCase().includes(doc.numero.toLowerCase()) ||
        file.name.toLowerCase().includes(doc.titulo.toLowerCase())
      );

      return {
        fileName: file.name,
        file: file,
        document: matchedDoc,
        status: matchedDoc ? "matched" : "unmatched",
      };
    });

    setMatchedFiles(matches);
    toast.success(`${files.length} arquivos carregados`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Importar de Pasta</CardTitle>
          <CardDescription>
            Cole o link da pasta ou a lista de arquivos para processar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Como obter a lista de arquivos do SharePoint:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>SharePoint: Acesse a biblioteca de documentos → Selecione a pasta → Use "Exportar para Excel" ou copie os nomes dos arquivos</li>
                <li>Windows: Navegue até a pasta sincronizada do SharePoint → Dir /b no CMD ou Get-ChildItem no PowerShell</li>
                <li>PowerShell: Connect-PnPOnline → Get-PnPListItem para listar arquivos</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="folder-link">Link do SharePoint (Informativo)</Label>
            <Input
              id="folder-link"
              placeholder="https://[tenant].sharepoint.com/sites/[site]/[library]"
              value={folderLink}
              onChange={(e) => setFolderLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-list">Lista de Arquivos (Um por linha)</Label>
            <Textarea
              id="file-list"
              placeholder="documento-001.pdf&#10;projeto-estrutural-v2.dwg&#10;memorial-descritivo.docx"
              value={fileList}
              onChange={(e) => setFileList(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <Button 
            onClick={handleProcessList} 
            disabled={!fileList.trim() || processing}
            className="w-full"
          >
            Processar Lista
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload em Massa</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm text-muted-foreground">
                  Arraste arquivos ou clique para selecionar
                </span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFilesDrop}
                className="hidden"
                accept=".pdf,.dwg,.docx,.xlsx,.doc,.xls"
              />
              {uploadedFiles.length > 0 && (
                <p className="text-sm text-primary mt-2">
                  {uploadedFiles.length} arquivo(s) selecionado(s)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {matchedFiles.length > 0 && (
        <FileMatchingTable matches={matchedFiles} />
      )}
    </div>
  );
};
