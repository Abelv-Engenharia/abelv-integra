import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, ZoomIn, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export interface FotoCategoria {
  id: string;
  categoria: string;
  legendaSugerida: string;
  fotos: FotoUpload[];
}

export interface FotoUpload {
  id: string;
  file: File;
  preview: string;
  legenda: string;
}

const categoriasPadrao: Omit<FotoCategoria, 'fotos'>[] = [
  { id: '1', categoria: 'Fachada do alojamento', legendaSugerida: 'Visão externa geral do alojamento' },
  { id: '2', categoria: 'Entrada principal', legendaSugerida: 'Portas, acesso e sinalização' },
  { id: '3', categoria: 'Quartos', legendaSugerida: 'Camas, armários, ventilação e iluminação' },
  { id: '4', categoria: 'Banheiros', legendaSugerida: 'Pias, vasos, chuveiros e condições de limpeza' },
  { id: '5', categoria: 'Cozinha/Refeitório', legendaSugerida: 'Área de preparo de alimentos e higiene' },
  { id: '6', categoria: 'Área de convivência', legendaSugerida: 'Salas, mesas e espaço de lazer' },
  { id: '7', categoria: 'Lavanderia', legendaSugerida: 'Tanques, máquinas e organização' },
  { id: '8', categoria: 'Instalações elétricas', legendaSugerida: 'Quadro de energia, fiação e tomadas' },
  { id: '9', categoria: 'Instalações hidráulicas', legendaSugerida: 'Caixas d\'água e encanamentos' },
  { id: '10', categoria: 'Itens de segurança', legendaSugerida: 'Extintores, rotas de fuga e iluminação de emergência' },
  { id: '11', categoria: 'Área externa', legendaSugerida: 'Corredores, quintal e estacionamento' },
  { id: '12', categoria: 'Problemas identificados', legendaSugerida: 'Infiltrações, danos e sujeira' }
];

interface RegistroFotograficoProps {
  onChange: (fotos: FotoCategoria[]) => void;
}

export default function RegistroFotografico({ onChange }: RegistroFotograficoProps) {
  const [categorias, setCategorias] = useState<FotoCategoria[]>(
    categoriasPadrao.map(cat => ({ ...cat, fotos: [] }))
  );
  const [categoriasExtras, setCategoriasExtras] = useState<FotoCategoria[]>([]);
  const [fotoAmpliada, setFotoAmpliada] = useState<{ foto: FotoUpload; categoria: string } | null>(null);

  const todasCategorias = [...categorias, ...categoriasExtras];

  const handleFileUpload = (categoriaId: string, files: FileList | null) => {
    if (!files) return;

    const novasFotos: FotoUpload[] = [];
    const filesArray = Array.from(files);

    // Validar arquivos
    for (const file of filesArray) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Arquivo ${file.name} excede 10MB`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`Arquivo ${file.name} não é uma imagem`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      novasFotos.push({
        id: `${categoriaId}-${Date.now()}-${Math.random()}`,
        file,
        preview,
        legenda: ''
      });
    }

    // Atualizar categoria
    const atualizarCategoria = (cats: FotoCategoria[]) =>
      cats.map(cat =>
        cat.id === categoriaId
          ? { ...cat, fotos: [...cat.fotos, ...novasFotos] }
          : cat
      );

    const categoriaPadrao = categorias.find(c => c.id === categoriaId);
    if (categoriaPadrao) {
      const novasCategorias = atualizarCategoria(categorias);
      setCategorias(novasCategorias);
      onChange([...novasCategorias, ...categoriasExtras]);
    } else {
      const novasExtras = atualizarCategoria(categoriasExtras);
      setCategoriasExtras(novasExtras);
      onChange([...categorias, ...novasExtras]);
    }

    toast.success(`${novasFotos.length} foto(s) adicionada(s)`);
  };

  const handleRemoveFoto = (categoriaId: string, fotoId: string) => {
    const removerFoto = (cats: FotoCategoria[]) =>
      cats.map(cat => {
        if (cat.id === categoriaId) {
          const fotoRemovida = cat.fotos.find(f => f.id === fotoId);
          if (fotoRemovida) {
            URL.revokeObjectURL(fotoRemovida.preview);
          }
          return { ...cat, fotos: cat.fotos.filter(f => f.id !== fotoId) };
        }
        return cat;
      });

    const categoriaPadrao = categorias.find(c => c.id === categoriaId);
    if (categoriaPadrao) {
      const novasCategorias = removerFoto(categorias);
      setCategorias(novasCategorias);
      onChange([...novasCategorias, ...categoriasExtras]);
    } else {
      const novasExtras = removerFoto(categoriasExtras);
      setCategoriasExtras(novasExtras);
      onChange([...categorias, ...novasExtras]);
    }
  };

  const handleUpdateLegenda = (categoriaId: string, fotoId: string, legenda: string) => {
    const atualizarLegenda = (cats: FotoCategoria[]) =>
      cats.map(cat =>
        cat.id === categoriaId
          ? {
              ...cat,
              fotos: cat.fotos.map(f =>
                f.id === fotoId ? { ...f, legenda } : f
              )
            }
          : cat
      );

    const categoriaPadrao = categorias.find(c => c.id === categoriaId);
    if (categoriaPadrao) {
      const novasCategorias = atualizarLegenda(categorias);
      setCategorias(novasCategorias);
      onChange([...novasCategorias, ...categoriasExtras]);
    } else {
      const novasExtras = atualizarLegenda(categoriasExtras);
      setCategoriasExtras(novasExtras);
      onChange([...categorias, ...novasExtras]);
    }
  };

  const handleAdicionarCategoriaExtra = () => {
    const novaCategoria: FotoCategoria = {
      id: `extra-${Date.now()}`,
      categoria: '',
      legendaSugerida: '',
      fotos: []
    };
    setCategoriasExtras([...categoriasExtras, novaCategoria]);
  };

  const handleUpdateCategoriaExtra = (categoriaId: string, campo: 'categoria' | 'legendaSugerida', valor: string) => {
    const novasExtras = categoriasExtras.map(cat =>
      cat.id === categoriaId ? { ...cat, [campo]: valor } : cat
    );
    setCategoriasExtras(novasExtras);
    onChange([...categorias, ...novasExtras]);
  };

  const totalFotos = todasCategorias.reduce((total, cat) => total + cat.fotos.length, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Registro Fotográfico</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Total de fotos: {totalFotos}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdicionarCategoriaExtra}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar categoria extra
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {todasCategorias.map((categoria) => {
          const isExtra = categoriasExtras.some(c => c.id === categoria.id);
          
          return (
            <div key={categoria.id} className="space-y-3 pb-6 border-b last:border-0">
              {isExtra ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Nome da categoria</Label>
                    <Input
                      placeholder="Ex: Área de segurança"
                      value={categoria.categoria}
                      onChange={(e) => handleUpdateCategoriaExtra(categoria.id, 'categoria', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Legenda sugerida</Label>
                    <Input
                      placeholder="Ex: Equipamentos de segurança"
                      value={categoria.legendaSugerida}
                      onChange={(e) => handleUpdateCategoriaExtra(categoria.id, 'legendaSugerida', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium">{categoria.categoria}</h4>
                  <p className="text-sm text-muted-foreground">{categoria.legendaSugerida}</p>
                </div>
              )}

              {/* Upload area */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                <label htmlFor={`upload-${categoria.id}`} className="cursor-pointer block">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>Clique para adicionar fotos (múltiplas)</span>
                  </div>
                  <input
                    id={`upload-${categoria.id}`}
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleFileUpload(categoria.id, e.target.files)}
                  />
                </label>
              </div>

              {/* Galeria de fotos */}
              {categoria.fotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoria.fotos.map((foto) => (
                    <div key={foto.id} className="space-y-2">
                      <div className="relative group">
                        <img
                          src={foto.preview}
                          alt={foto.legenda || 'Foto da vistoria'}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white hover:bg-white/20"
                                onClick={() => setFotoAmpliada({ foto, categoria: categoria.categoria })}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{fotoAmpliada?.categoria}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <img
                                  src={fotoAmpliada?.foto.preview}
                                  alt={fotoAmpliada?.foto.legenda || 'Foto ampliada'}
                                  className="w-full max-h-[70vh] object-contain rounded-lg"
                                />
                                {fotoAmpliada?.foto.legenda && (
                                  <p className="text-sm text-muted-foreground text-center">
                                    {fotoAmpliada.foto.legenda}
                                  </p>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={() => handleRemoveFoto(categoria.id, foto.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Input
                        placeholder={categoria.legendaSugerida || 'Adicionar legenda...'}
                        value={foto.legenda}
                        onChange={(e) => handleUpdateLegenda(categoria.id, foto.id, e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
