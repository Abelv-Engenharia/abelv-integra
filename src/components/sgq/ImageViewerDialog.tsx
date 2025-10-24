import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface ImageViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  imageName: string;
  evidenceNumber?: number;
  description?: string;
}

export const ImageViewerDialog = ({
  open,
  onOpenChange,
  imageUrl,
  imageName,
  evidenceNumber,
  description
}: ImageViewerDialogProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {evidenceNumber ? `Evidência ${evidenceNumber}` : 'Evidência'}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                title="Baixar imagem"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative bg-muted rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={imageName}
              className="w-full h-auto"
            />
          </div>
          
          {description && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição:</label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-lg">
                {description}
              </p>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            Arquivo: {imageName}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
