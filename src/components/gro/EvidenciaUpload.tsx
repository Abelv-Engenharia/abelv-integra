
import React from "react";
import { Input } from "@/components/ui/input";

type EvidenciaUploadProps = {
  files: File[];
  setFiles: (files: File[]) => void;
};

export default function EvidenciaUpload({ files, setFiles }: EvidenciaUploadProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles([...files, ...selected]);
  }

  function removeFile(idx: number) {
    setFiles(files.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <Input
        type="file"
        accept="image/*,application/pdf,video/*"
        multiple
        onChange={handleChange}
      />
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((file, i) => (
            <li key={i} className="flex items-center gap-2 text-xs">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                className="text-red-600 hover:underline ml-2"
                onClick={() => removeFile(i)}
                aria-label={`Remover ${file.name}`}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
