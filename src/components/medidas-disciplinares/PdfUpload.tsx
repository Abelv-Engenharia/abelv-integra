
import React from "react";
import { Input } from "@/components/ui/input";

interface PdfUploadProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
  error?: string;
}

export const PdfUpload: React.FC<PdfUploadProps> = ({ onFileChange, file, error }) => (
  <div>
    <Input
      type="file"
      accept="application/pdf"
      onChange={e => onFileChange(e.target.files?.[0] ?? null)}
    />
    {file && (
      <p className="text-xs text-muted-foreground mt-1">Arquivo: {file.name}</p>
    )}
    {error && (
      <p className="text-xs text-destructive mt-1">{error}</p>
    )}
  </div>
);
