import { useState } from "react";
import { Upload, X, File } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  onFileUpload: (url: string, fileName: string) => void;
  currentFile?: string;
  onRemove?: () => void;
  accept?: string;
  className?: string;
}

export const FileUpload = ({
  onFileUpload,
  currentFile,
  onRemove,
  accept = "*/*",
  className,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    try {
      setUploading(true);
      
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("email-attachments")
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("email-attachments")
        .getPublicUrl(data.path);

      onFileUpload(publicUrl, file.name);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const getCurrentFileName = () => {
    if (!currentFile) return "";
    const parts = currentFile.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div className={cn("w-full", className)}>
      {currentFile ? (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{getCurrentFileName()}</span>
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center transition-colors",
            dragActive && "border-primary bg-primary/5",
            uploading && "opacity-50 pointer-events-none"
          )}
        >
          <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Arraste um arquivo aqui ou clique para selecionar
          </p>
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={uploading}
          >
            {uploading ? "Enviando..." : "Selecionar arquivo"}
          </Button>
        </div>
      )}
    </div>
  );
};