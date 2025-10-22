import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X, Download, Eye } from 'lucide-react';
import { useSupabaseDocuments, DocumentFile } from '@/hooks/useSupabaseDocuments';

interface DocumentUploadProps {
  documentId: string;
  onFilesChange?: (files: DocumentFile[]) => void;
}

export function DocumentUpload({ documentId, onFilesChange }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const { toast } = useToast();
  const { uploadFile, getDocumentFiles, getFileUrl } = useSupabaseDocuments();

  const loadFiles = useCallback(async () => {
    const documentFiles = await getDocumentFiles(documentId);
    setFiles(documentFiles);
    onFilesChange?.(documentFiles);
  }, [documentId, getDocumentFiles, onFilesChange]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        await uploadFile(documentId, file);
        setUploadProgress(((i + 1) / acceptedFiles.length) * 100);
      }
      
      await loadFiles();
      toast({
        title: "Upload concluído",
        description: `${acceptedFiles.length} arquivo(s) enviado(s) com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro durante o upload dos arquivos.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [documentId, uploadFile, loadFiles, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: uploading
  });

  const handleDownload = async (file: DocumentFile) => {
    try {
      const url = await getFileUrl(file.file_path);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo.",
        variant: "destructive"
      });
    }
  };

  const handlePreview = async (file: DocumentFile) => {
    try {
      const url = await getFileUrl(file.file_path);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Erro na visualização",
        description: "Não foi possível visualizar o arquivo.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return '📊';
    if (mimeType.includes('image')) return '🖼️';
    return '📎';
  };

  // Load files when component mounts
  React.useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Arquivos
        </CardTitle>
        <CardDescription>
          Faça upload dos arquivos relacionados a este documento. Formatos suportados: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-lg font-medium">Solte os arquivos aqui...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-sm text-muted-foreground">
                Máximo 50MB por arquivo
              </p>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Enviando arquivos...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Arquivos ({files.length})
            </h4>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">
                      {getFileIcon(file.mime_type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.filename}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.file_size)}</span>
                        <Badge variant="outline" className="text-xs">
                          {file.version}
                        </Badge>
                        <span>
                          {new Date(file.uploaded_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(file)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(file)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}