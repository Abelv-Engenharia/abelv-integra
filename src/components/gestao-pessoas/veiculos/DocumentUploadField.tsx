import { useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface DocumentUploadFieldProps {
  label: string
  value?: string | null
  onChange: (file: File | null) => void
  accept?: string
  required?: boolean
}

export function DocumentUploadField({ 
  label, 
  value, 
  onChange, 
  accept = ".pdf,.jpg,.jpeg,.png", 
  required = false 
}: DocumentUploadFieldProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      if (files[0].size > 2 * 1024 * 1024) {
        // Toast será mostrado pelo componente pai se necessário
        return
      }
      onChange(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      if (files[0].size > 2 * 1024 * 1024) {
        // Toast será mostrado pelo componente pai se necessário
        return
      }
      onChange(files[0])
    }
  }

  const removeFile = () => {
    onChange(null)
  }

  return (
    <div className="space-y-2">
      <Label className={cn(required && !value && "text-destructive")}>
        {label} {required && "*"}
      </Label>
      <div className="space-y-2">
        {value ? (
          <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/20">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm flex-1 truncate">
              {typeof value === 'string' ? value : (value as File).name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              dragActive && "border-primary bg-primary/5",
              required && "border-destructive",
              "hover:border-primary hover:bg-primary/5"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById(`file-${label}`)?.click()}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-1">
              Clique ou arraste um arquivo aqui
            </p>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: PDF, JPG, PNG | Máx: 2MB
            </p>
          </div>
        )}
        <Input
          id={`file-${label}`}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  )
}