import React, { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NFUploadFieldProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
}

const NFUploadField: React.FC<NFUploadFieldProps> = ({
  label,
  value,
  onChange,
  accept = ".pdf,.xml,.jpg,.jpeg,.png",
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].size > 20 * 1024 * 1024) {
        alert("Arquivo muito grande. Tamanho máximo: 20MB");
        return;
      }
      onChange(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (files[0].size > 20 * 1024 * 1024) {
        alert("Arquivo muito grande. Tamanho máximo: 20MB");
        return;
      }
      onChange(files[0]);
    }
  };

  const removeFile = () => {
    onChange(null);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <FileText className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="space-y-2">
      <label className={`text-sm font-medium ${required && !value ? 'text-destructive' : ''}`}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      {value ? (
        <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
          {getFileIcon(value.name)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={removeFile}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : required
              ? "border-destructive"
              : "border-border hover:border-primary"
          }`}
          onClick={() => document.getElementById(`file-input-${label}`)?.click()}
        >
          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">
            Clique para selecionar ou arraste o arquivo
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, XML, JPG ou PNG (máx. 20MB)
          </p>
        </div>
      )}
      
      <input
        id={`file-input-${label}`}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default NFUploadField;
