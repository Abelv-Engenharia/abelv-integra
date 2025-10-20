import { useState } from "react";
import { X, Download, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fotos: {
    [posicao: number]: {
      arquivos: string[];
      files: File[];
    }
  };
  nomeVeiculo: string;
}

const vehiclePositions = [
  "Frente", "Lateral dianteira direita", "Pneu dianteiro direito", 
  "Lateral traseira direita", "Pneu traseiro direito", "Traseira", 
  "Estepe", "Lateral traseira esquerda", "Pneu traseiro esquerdo", 
  "Lateral dianteira esquerda", "Pneu dianteiro esquerdo", 
  "Painel de instrumentos", "Bateria", "CNH do condutor"
];

export function PhotoViewerModal({ isOpen, onClose, fotos, nomeVeiculo }: PhotoViewerModalProps) {
  const [fotoSelecionada, setFotoSelecionada] = useState<{posicao: number, index: number} | null>(null);
  const [fotoZoom, setFotoZoom] = useState<string | null>(null);

  const totalFotos = Object.values(fotos).reduce((acc, curr) => acc + curr.files.length, 0);
  const posicoesComFotos = Object.keys(fotos).filter(pos => fotos[parseInt(pos)]?.files.length > 0).length;

  const downloadFoto = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadTodasFotos = () => {
    Object.entries(fotos).forEach(([posicao, dadosFotos]) => {
      dadosFotos.files.forEach(file => {
        setTimeout(() => downloadFoto(file), 100);
      });
    });
  };

  const navegarFoto = (direcao: 'anterior' | 'proximo') => {
    if (!fotoSelecionada) return;

    const todasFotos: {posicao: number, index: number}[] = [];
    Object.entries(fotos).forEach(([posicao, dadosFotos]) => {
      dadosFotos.files.forEach((_, index) => {
        todasFotos.push({posicao: parseInt(posicao), index});
      });
    });

    const indiceAtual = todasFotos.findIndex(
      f => f.posicao === fotoSelecionada.posicao && f.index === fotoSelecionada.index
    );

    if (direcao === 'anterior' && indiceAtual > 0) {
      const novaFoto = todasFotos[indiceAtual - 1];
      setFotoSelecionada(novaFoto);
      const file = fotos[novaFoto.posicao].files[novaFoto.index];
      setFotoZoom(URL.createObjectURL(file));
    } else if (direcao === 'proximo' && indiceAtual < todasFotos.length - 1) {
      const novaFoto = todasFotos[indiceAtual + 1];
      setFotoSelecionada(novaFoto);
      const file = fotos[novaFoto.posicao].files[novaFoto.index];
      setFotoZoom(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Fotos do Veículo - {nomeVeiculo}</span>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  {totalFotos} fotos em {posicoesComFotos} posições
                </Badge>
                <Button onClick={downloadTodasFotos} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Todas
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehiclePositions.map((nomeposicao, posicao) => {
              const fotosposicao = fotos[posicao];
              const temfotos = fotosposicao && fotosposicao.files.length > 0;

              return (
                <Card key={posicao} className={`${temfotos ? 'border-green-200' : 'border-muted'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>{nomeposicao}</span>
                      {temfotos && (
                        <Badge variant="secondary" className="text-xs">
                          {fotosposicao.files.length}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {temfotos ? (
                      <div className="space-y-2">
                        {fotosposicao.files.map((file, index) => (
                          <div key={index} className="relative group">
                            {file.type.startsWith('image/') ? (
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`${nomeposicao} - ${index + 1}`}
                                  className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => {
                                    setFotoSelecionada({posicao, index});
                                    setFotoZoom(URL.createObjectURL(file));
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                  onClick={() => {
                                    setFotoSelecionada({posicao, index});
                                    setFotoZoom(URL.createObjectURL(file));
                                  }}
                                >
                                  <ZoomIn className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="h-24 bg-muted rounded flex items-center justify-center">
                                <span className="text-xs text-muted-foreground text-center p-2">
                                  {file.name}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-muted-foreground truncate flex-1">
                                {file.name}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => downloadFoto(file)}
                                className="h-6 w-6 p-0"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-24 bg-muted/50 rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Nenhuma foto</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Zoom */}
      {fotoZoom && (
        <Dialog open={!!fotoZoom} onOpenChange={() => setFotoZoom(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              <Button
                onClick={() => setFotoZoom(null)}
                className="absolute top-4 right-4 z-10 h-8 w-8 p-0"
                variant="secondary"
              >
                <X className="h-4 w-4" />
              </Button>
              
              {fotoSelecionada && (
                <>
                  <Button
                    onClick={() => navegarFoto('anterior')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0"
                    variant="secondary"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={() => navegarFoto('proximo')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0"
                    variant="secondary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              <img
                src={fotoZoom}
                alt="Foto ampliada"
                className="w-full max-h-[90vh] object-contain"
              />

              {fotoSelecionada && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                  {vehiclePositions[fotoSelecionada.posicao]} - Foto {fotoSelecionada.index + 1}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}