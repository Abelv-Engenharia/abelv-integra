import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";

interface PhotoUploadProps {
  onPhotoUploaded: (photoUrl: string, fileName: string) => void;
  onPhotoRemoved: () => void;
  existingPhoto?: {
    url: string;
    fileName: string;
  };
  disabled?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoUploaded,
  onPhotoRemoved,
  existingPhoto,
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { profile } = useProfile();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);

      // Criar nome único para o arquivo
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const filePath = `${profile.id}/${fileName}`;

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from('inspecoes-sms-fotos')
        .upload(filePath, file);

      if (error) {
        console.error('Erro no upload:', error);
        throw error;
      }

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('inspecoes-sms-fotos')
        .getPublicUrl(filePath);

      onPhotoUploaded(urlData.publicUrl, file.name);

      toast({
        title: "Sucesso",
        description: "Foto anexada com sucesso."
      });

    } catch (error: any) {
      console.error('Erro ao fazer upload da foto:', error);
      toast({
        title: "Erro",
        description: "Falha ao anexar a foto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Limpar o input
      event.target.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!existingPhoto) return;

    try {
      // Extrair o path do arquivo da URL
      const url = new URL(existingPhoto.url);
      const pathSegments = url.pathname.split('/');
      const filePath = pathSegments.slice(-2).join('/'); // userId/fileName

      // Remover arquivo do storage
      const { error } = await supabase.storage
        .from('inspecoes-sms-fotos')
        .remove([filePath]);

      if (error) {
        console.error('Erro ao remover foto:', error);
        // Não falhar se não conseguir remover o arquivo
      }

      onPhotoRemoved();

      toast({
        title: "Sucesso",
        description: "Foto removida com sucesso."
      });

    } catch (error: any) {
      console.error('Erro ao remover foto:', error);
      toast({
        title: "Erro",
        description: "Falha ao remover a foto.",
        variant: "destructive"
      });
    }
  };

  if (existingPhoto) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Foto anexada</Label>
        <div className="relative border border-gray-200 rounded-lg p-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 truncate max-w-[200px]">
                {existingPhoto.fileName}
              </span>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {/* Preview da imagem */}
          <div className="mt-2">
            <img 
              src={existingPhoto.url} 
              alt="Foto anexada" 
              className="max-w-full h-32 object-cover rounded border"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="photo-upload" className="text-sm font-medium">
        Anexar foto (opcional)
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={disabled || isUploading}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('photo-upload')?.click()}
          disabled={disabled || isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              Anexar foto
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB.
      </p>
    </div>
  );
};