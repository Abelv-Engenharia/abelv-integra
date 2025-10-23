import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface UploadModeloContratoProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function UploadModeloContrato({
  onFileSelect,
  selectedFile,
  onClear,
}: UploadModeloContratoProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Validar tipo de arquivo
        const validTypes = [
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword'
        ];
        
        if (!validTypes.includes(file.type)) {
          toast.error('Apenas arquivos .docx são permitidos');
          return;
        }
        
        // Simular progresso de upload
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 100);
        
        setTimeout(() => {
          onFileSelect(file);
          setUploadProgress(0);
        }, 1000);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
  });

  if (selectedFile) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center gap-3">
          <File className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium text-sm">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-sm text-primary font-medium">Solte o arquivo aqui...</p>
        ) : (
          <>
            <p className="text-sm font-medium mb-1">
              Arraste um arquivo .docx ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">
              Apenas arquivos Word (.docx) são aceitos
            </p>
          </>
        )}
      </div>
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            Carregando arquivo... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
}
