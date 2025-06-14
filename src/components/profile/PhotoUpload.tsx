
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  userName: string;
  onPhotoChange: (photoUrl: string | null) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhotoUrl,
  userName,
  onPhotoChange
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Criar preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreviewUrl(url);
      onPhotoChange(url);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Sucesso",
      description: "Foto selecionada com sucesso!",
    });
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    onPhotoChange(null);
    
    // Limpar input file
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    toast({
      title: "Sucesso",
      description: "Foto removida com sucesso!",
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={previewUrl || undefined} alt={userName} />
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        {previewUrl && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
            onClick={handleRemovePhoto}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <Button
          variant="outline"
          onClick={() => document.getElementById('photo-upload')?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          {previewUrl ? 'Alterar Foto' : 'Adicionar Foto'}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Formatos aceitos: JPG, PNG, GIF<br />
          Tamanho máximo: 5MB
        </p>
      </div>
    </div>
  );
};

export default PhotoUpload;
