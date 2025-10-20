import { useState } from "react"
import { Upload, FileText, X, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface DocumentReturnUploadProps {
  multaId: number
  currentDocument?: File | null
  onDocumentUpload: (file: File | null) => void
}

export function DocumentReturnUpload({ 
  multaId, 
  currentDocument, 
  onDocumentUpload 
}: DocumentReturnUploadProps) {
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
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive"
      })
      return
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ]

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Apenas arquivos PDF, JPG e PNG são aceitos.",
        variant: "destructive"
      })
      return
    }

    onDocumentUpload(file)
    
    toast({
      title: "Documento recebido!",
      description: `O arquivo ${file.name} foi carregado com sucesso.`
    })
  }

  const removeDocument = () => {
    onDocumentUpload(null)
    
    toast({
      title: "Documento removido",
      description: "O documento foi removido da multa."
    })
  }

  const downloadDocument = () => {
    if (currentDocument) {
      // Em um ambiente real, aqui seria feito o download do arquivo
      toast({
        title: "Download iniciado",
        description: `Fazendo download de ${currentDocument.name}`
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          Documento Preenchido Retornado
        </Label>
        {currentDocument && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Recebido
          </Badge>
        )}
      </div>

      {currentDocument ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">
                    {typeof currentDocument === 'string' ? currentDocument : currentDocument.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Recebido em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadDocument}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeDocument}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            dragActive && "border-primary bg-primary/5",
            "hover:border-primary hover:bg-primary/5"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`document-return-${multaId}`)?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            Clique ou arraste o documento preenchido aqui
          </p>
          <p className="text-xs text-muted-foreground">
            Formatos aceitos: PDF, JPG, PNG | Máx: 5MB
          </p>
        </div>
      )}

      <Input
        id={`document-return-${multaId}`}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-xs text-muted-foreground">
        <p><strong>Instruções:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Faça upload apenas do documento oficial preenchido pelo condutor</li>
          <li>Verifique se todos os campos obrigatórios foram preenchidos</li>
          <li>O documento deve estar legível e assinado pelo condutor</li>
        </ul>
      </div>
    </div>
  )
}