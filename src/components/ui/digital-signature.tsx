import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Save } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DigitalSignatureProps {
  onSave: (signatureData: string) => void;
  onCancel: () => void;
  title?: string;
}

export const DigitalSignature: React.FC<DigitalSignatureProps> = ({
  onSave,
  onCancel,
  title = "Assinatura Digital"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    canvas.width = 400;
    canvas.height = 200;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Limpar canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Prevenir scroll em dispositivos móveis
    if (isMobile) {
      const preventScroll = (e: TouchEvent) => {
        // Apenas prevenir se o toque for especificamente no canvas
        const target = e.target as Element;
        if (target && target === canvas) {
          e.preventDefault();
        }
      };

      const preventContextMenu = (e: Event) => {
        e.preventDefault();
      };

      // Adicionar event listeners apenas no canvas
      canvas.addEventListener('touchmove', preventScroll, { passive: false });
      canvas.addEventListener('touchstart', preventScroll, { passive: false });
      canvas.addEventListener('contextmenu', preventContextMenu);

      // Cleanup
      return () => {
        canvas.removeEventListener('touchmove', preventScroll);
        canvas.removeEventListener('touchstart', preventScroll);
        canvas.removeEventListener('contextmenu', preventContextMenu);
      };
    }
  }, [isMobile]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Touch events para dispositivos móveis
  const startTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const touch = e.touches[0];
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const moveTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const touch = e.touches[0];
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const endTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const dataURL = canvas.toDataURL('image/png');
    onSave(dataURL);
  };

  return (
    <div 
      data-signature-container
      className={`${isMobile ? 'fixed inset-0 z-50 bg-background flex items-center justify-center p-4' : 'relative'}`}
      style={isMobile ? { 
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      } : {}}
    >
      <Card className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} mx-auto`}>
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-gray-300 rounded-lg p-2 bg-white">
            <canvas
              ref={canvasRef}
              className={`w-full ${isMobile ? 'h-40' : 'h-48'} cursor-crosshair border border-dashed border-gray-200 rounded`}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startTouch}
              onTouchMove={moveTouch}
              onTouchEnd={endTouch}
              style={{
                touchAction: 'none',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            />
          </div>

          <p className="text-xs text-center text-muted-foreground">
            {isMobile ? 'Toque para desenhar sua assinatura' : 'Use o mouse ou toque para desenhar sua assinatura'}
          </p>

          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={clearSignature} size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} size="sm">
                Cancelar
              </Button>
              <Button 
                onClick={saveSignature} 
                disabled={!hasSignature}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};