import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ZoomIn, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GaleriaFotosProps {
  fotos: string[];
  onChange: (fotos: string[]) => void;
  maxFotos?: number;
}

export function GaleriaFotos({ fotos = [], onChange, maxFotos = 5 }: GaleriaFotosProps) {
  const [uploading, setUploading] = useState(false);
  const [fotoZoom, setFotoZoom] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (fotos.length + files.length > maxFotos) {
      toast.error(`Máximo de ${maxFotos} fotos permitidas`);
      return;
    }

    setUploading(true);
    const novasFotos: string[] = [];

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} não é uma imagem válida`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} é muito grande (máx 5MB)`);
          continue;
        }

        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('analises-contratuais')
          .upload(`fotos/${fileName}`, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('analises-contratuais')
          .getPublicUrl(`fotos/${fileName}`);

        novasFotos.push(publicUrl);
      }

      if (novasFotos.length > 0) {
        onChange([...fotos, ...novasFotos]);
        toast.success(`${novasFotos.length} foto(s) enviada(s) com sucesso`);
      }
    } catch (error: any) {
      toast.error("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removerFoto = (index: number) => {
    const novasFotos = fotos.filter((_, i) => i !== index);
    onChange(novasFotos);
    toast.success("Foto removida");
  };

  return (
    <div className="space-y-4">
      {fotos.length < maxFotos && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('upload-fotos')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Enviando..." : "Adicionar Fotos"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {fotos.length}/{maxFotos} fotos
          </span>
          <input
            id="upload-fotos"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      )}

      {fotos.length > 0 && (
        <div className="grid grid-cols-5 gap-4">
          {fotos.map((foto, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={foto}
                alt={`Foto ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setFotoZoom(foto)}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removerFoto(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!fotoZoom} onOpenChange={() => setFotoZoom(null)}>
        <DialogContent className="max-w-4xl">
          {fotoZoom && (
            <img src={fotoZoom} alt="Visualização" className="w-full h-auto" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
