
import React from "react";
import { Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useSignedUrl } from "@/hooks/useSignedUrl";

interface PhotoUploadProps {
  photoPreview: string | null;
  editingFuncionario?: { foto?: string } | null;
  photoRemoved: boolean;
  onPhotoChange: (file: File | null) => void;
  onRemovePhoto: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photoPreview,
  editingFuncionario,
  photoRemoved,
  onPhotoChange,
  onRemovePhoto
}) => {
  const { toast } = useToast();
  const { url: signedUrl, generate } = useSignedUrl();

  // Gera signed URL para exibir foto privada do funcionário, se necessário
  React.useEffect(() => {
    if (
      !photoPreview && // Não está mostrando uma imagem enviada agora
      editingFuncionario?.foto &&
      !photoRemoved
    ) {
      let filePath = editingFuncionario.foto;
      // Se for URL absoluta, extrai o path relativo ou ajusta
      if (/^https?:\/\//.test(filePath)) {
        const match = filePath.match(/\/storage\/v1\/object\/sign\/([^?]+)/);
        if (match) {
          filePath = decodeURIComponent(match[1]);
        } else {
          const idx = filePath.indexOf('funcionarios-fotos/');
          if (idx >= 0) filePath = filePath.slice(idx + 'funcionarios-fotos/'.length);
        }
      } else if (filePath.startsWith('funcionarios/')) {
        // ok
      } else {
        filePath = `funcionarios/${filePath}`;
      }
      generate('funcionarios-fotos', filePath, 480); // 8 min
    }
    // Não adicionar generate como dependência para evitar loops
    // eslint-disable-next-line
  }, [editingFuncionario?.foto, photoPreview, photoRemoved]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }

      onPhotoChange(file);
    }
  };

  // Mostra a preview local se for novo upload, senão signedUrl do funcionário atual
  const avatarSrc = photoPreview
    ? photoPreview
    : (!photoRemoved && editingFuncionario?.foto)
      ? signedUrl || ""
      : "";

  return (
    <div className="flex flex-col items-center sm:items-start mb-6">
      <Label className="mb-2">Foto</Label>
      <Avatar className="size-32 mb-3">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>
          <UserRound className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <label
          htmlFor="photo-upload"
          className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          <Upload className="h-4 w-4" />
          Selecionar imagem
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
        {(!!avatarSrc || editingFuncionario?.foto) && !photoRemoved && (
          <Button
            type="button"
            variant="outline"
            onClick={onRemovePhoto}
          >
            Remover
          </Button>
        )}
      </div>
    </div>
  );
};
