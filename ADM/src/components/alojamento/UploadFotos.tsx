import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Foto {
  url: string;
  nome: string;
}

interface UploadFotosProps {
  analiseId: string;
  fotosAtuais: Foto[];
  onUpdate: (novasFotos: Foto[]) => void;
  maxFotos?: number;
}

export function UploadFotos({ 
  analiseId, 
  fotosAtuais, 
  onUpdate,
  maxFotos = 5 
}: UploadFotosProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (fotosAtuais.length + files.length > maxFotos) {
      toast({
        title: "Limite excedido",
        description: `Você pode enviar no máximo ${maxFotos} fotos.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const novasFotos: Foto[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${analiseId}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('analises-contratuais')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('analises-contratuais')
          .getPublicUrl(filePath);

        novasFotos.push({
          url: publicUrl,
          nome: file.name,
        });
      }

      const todasFotos = [...fotosAtuais, ...novasFotos];
      onUpdate(todasFotos);

      toast({
        title: "Sucesso",
        description: `${novasFotos.length} foto(s) enviada(s) com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar fotos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoverFoto = (index: number) => {
    const novasFotos = fotosAtuais.filter((_, i) => i !== index);
    onUpdate(novasFotos);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="upload-fotos">
          Upload De Fotos Do Imóvel (Máximo {maxFotos})
        </Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            id="upload-fotos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading || fotosAtuais.length >= maxFotos}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading || fotosAtuais.length >= maxFotos}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {fotosAtuais.length} de {maxFotos} fotos enviadas
        </p>
      </div>

      {fotosAtuais.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {fotosAtuais.map((foto, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                <img
                  src={foto.url}
                  alt={foto.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoverFoto(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                {foto.nome}
              </div>
            </div>
          ))}
        </div>
      )}

      {fotosAtuais.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhuma foto enviada ainda
          </p>
        </div>
      )}
    </div>
  );
}
