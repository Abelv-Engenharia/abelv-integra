import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Upload, MoveUp, MoveDown, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FileAttachment } from '@/types/sgq';
import { useFileAttachments } from '@/hooks/sgq/useFileAttachments';

interface EvidenceUploadProps {
  rncId: string;
  attachmentType: 'evidencia_nc' | 'evidencia_disposicao';
  title: string;
  evidences: FileAttachment[];
  onEvidencesChange: (evidences: FileAttachment[]) => void;
}

interface EvidenceItem {
  id: string;
  file: File;
  preview: string;
  description: string;
  evidence_number: number;
}

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
  rncId,
  attachmentType,
  title,
  evidences,
  onEvidencesChange
}) => {
  const [localEvidences, setLocalEvidences] = useState<EvidenceItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { uploadFile } = useFileAttachments();

  const MAX_EVIDENCES = 8;
  const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_FORMATS.includes(file.type)) {
      toast({
        title: "Formato não suportado",
        description: "Apenas imagens JPG, PNG e WEBP são aceitas.",
        variant: "destructive",
      });
      return;
    }

    if (localEvidences.length >= MAX_EVIDENCES) {
      toast({
        title: "Limite atingido",
        description: `Máximo de ${MAX_EVIDENCES} evidências por relatório.`,
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newEvidence: EvidenceItem = {
        id: `temp-${Date.now()}`,
        file,
        preview: e.target?.result as string,
        description: '',
        evidence_number: localEvidences.length + 1
      };
      setLocalEvidences(prev => [...prev, newEvidence]);
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = '';
  }, [localEvidences.length, toast]);

  const updateDescription = useCallback((id: string, description: string) => {
    setLocalEvidences(prev =>
      prev.map(evidence =>
        evidence.id === id ? { ...evidence, description } : evidence
      )
    );
  }, []);

  const removeEvidence = useCallback((id: string) => {
    setLocalEvidences(prev => {
      const filtered = prev.filter(evidence => evidence.id !== id);
      // Renumber evidences
      return filtered.map((evidence, index) => ({
        ...evidence,
        evidence_number: index + 1
      }));
    });
  }, []);

  const moveEvidence = useCallback((id: string, direction: 'up' | 'down') => {
    setLocalEvidences(prev => {
      const currentIndex = prev.findIndex(evidence => evidence.id === id);
      if (currentIndex === -1) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newEvidences = [...prev];
      [newEvidences[currentIndex], newEvidences[newIndex]] = [newEvidences[newIndex], newEvidences[currentIndex]];
      
      // Renumber evidences
      return newEvidences.map((evidence, index) => ({
        ...evidence,
        evidence_number: index + 1
      }));
    });
  }, []);

  const uploadAllEvidences = useCallback(async () => {
    if (localEvidences.length === 0) return;
    
    // Validate descriptions
    const incompleteEvidences = localEvidences.filter(evidence => !evidence.description.trim());
    if (incompleteEvidences.length > 0) {
      toast({
        title: "Descrição obrigatória",
        description: "Todas as evidências devem ter uma descrição.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const uploadedEvidences: FileAttachment[] = [];
      
      for (const evidence of localEvidences) {
        const uploadedFile = await uploadFile(
          evidence.file,
          rncId,
          attachmentType,
          evidence.description,
          evidence.evidence_number
        );
        uploadedEvidences.push(uploadedFile);
      }

      onEvidencesChange([...evidences, ...uploadedEvidences]);
      setLocalEvidences([]);
      
      toast({
        title: "Evidências enviadas",
        description: `${uploadedEvidences.length} evidência(s) enviada(s) com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Erro ao enviar evidências. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [localEvidences, evidences, onEvidencesChange, rncId, attachmentType, uploadFile, toast]);

  const totalEvidences = evidences.length + localEvidences.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            {totalEvidences}/{MAX_EVIDENCES} evidências
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Button */}
        {totalEvidences < MAX_EVIDENCES && (
          <div>
            <Label htmlFor={`evidence-upload-${attachmentType}`} className="cursor-pointer">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Clique para adicionar evidência fotográfica
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WEBP - Máximo {MAX_EVIDENCES} evidências
                </p>
              </div>
            </Label>
            <input
              id={`evidence-upload-${attachmentType}`}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* Existing Evidences */}
        {evidences.map((evidence, index) => (
          <div key={evidence.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Evidência {evidence.evidence_number || index + 1}
                </Label>
              </div>
              {evidence.url && (
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={evidence.url} 
                    alt={`Evidência ${evidence.evidence_number || index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {evidence.file_name}
              </p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm">Descrição</Label>
              <Textarea
                value={evidence.description || ''}
                //readOnly
                className="min-h-[100px] bg-muted"
                placeholder="Descrição da evidência..."
              />
            </div>
          </div>
        ))}

        {/* Local Evidences (not uploaded yet) */}
        {localEvidences.map((evidence, index) => (
          <div key={evidence.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Evidência {evidence.evidence_number}
                </Label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveEvidence(evidence.id, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveEvidence(evidence.id, 'down')}
                    disabled={index === localEvidences.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEvidence(evidence.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img 
                  src={evidence.preview} 
                  alt={`Evidência ${evidence.evidence_number}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {evidence.file.name}
              </p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm">
                Descrição da Evidência {evidence.evidence_number} *
              </Label>
              <Textarea
                value={evidence.description}
                onChange={(e) => updateDescription(evidence.id, e.target.value)}
                className="min-h-[100px]"
                placeholder="Descreva detalhadamente o que mostra esta evidência..."
                required
              />
            </div>
          </div>
        ))}

        {/* Upload Button for Local Evidences */}
        {localEvidences.length > 0 && (
          <Button
            type="button"
            onClick={uploadAllEvidences}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? "Enviando..." : `Enviar ${localEvidences.length} Evidência(s)`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
