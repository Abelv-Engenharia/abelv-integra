import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Trash2, FileText } from "lucide-react";
import { useComunicadoPorId, useAtualizarComunicado } from "@/hooks/useComunicados";
import { useCCAs } from "@/hooks/useCCAs";
import { comunicadosService } from "@/services/comunicadosService";
import { toast } from "@/hooks/use-toast";
import { UsuariosSelector } from "@/components/admin/comunicados/UsuariosSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ComunicadoForm {
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  ativo: boolean;
  publico_alvo: {
    tipo: 'todos' | 'cca' | 'usuarios';
    cca_id?: number;
    usuarios_ids?: string[];
  };
  arquivo?: File;
  manterAnexo: boolean;
}

const ComunicadoEdicao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: comunicado, isLoading } = useComunicadoPorId(id!);
  const { data: ccas = [] } = useCCAs();
  const atualizarComunicado = useAtualizarComunicado();
  const [uploading, setUploading] = useState(false);
  const [publicoAlvo, setPublicoAlvo] = useState<ComunicadoForm['publico_alvo']>({
    tipo: 'todos',
    cca_id: undefined,
    usuarios_ids: []
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ComunicadoForm>();

  const watchPublicoTipo = watch('publico_alvo.tipo');
  const watchManterAnexo = watch('manterAnexo');

  useEffect(() => {
    if (comunicado) {
      setValue('titulo', comunicado.titulo);
      setValue('descricao', comunicado.descricao || '');
      setValue('data_inicio', comunicado.data_inicio);
      setValue('data_fim', comunicado.data_fim);
      setValue('ativo', comunicado.ativo);
      setPublicoAlvo(comunicado.publico_alvo);
      setValue('publico_alvo', comunicado.publico_alvo);
      setValue('manterAnexo', !!comunicado.arquivo_url);
    }
  }, [comunicado, setValue]);

  const onSubmit = async (data: ComunicadoForm) => {
    if (!comunicado) return;

    try {
      let arquivo_url = comunicado.arquivo_url;
      let arquivo_nome = comunicado.arquivo_nome;

      // Se não deve manter anexo e havia anexo, remover
      if (!data.manterAnexo && comunicado.arquivo_url) {
        try {
          await comunicadosService.excluirAnexo(comunicado.arquivo_url);
        } catch (error) {
          console.warn('Erro ao excluir anexo anterior:', error);
        }
        arquivo_url = null;
        arquivo_nome = null;
      }

      // Se há novo arquivo, fazer upload
      if (data.arquivo) {
        setUploading(true);
        
        // Se havia anexo anterior e vai ser substituído, excluir o antigo
        if (comunicado.arquivo_url) {
          try {
            await comunicadosService.excluirAnexo(comunicado.arquivo_url);
          } catch (error) {
            console.warn('Erro ao excluir anexo anterior:', error);
          }
        }

        arquivo_url = await comunicadosService.uploadAnexo(data.arquivo);
        arquivo_nome = data.arquivo.name;
      }

      await atualizarComunicado.mutateAsync({
        id: comunicado.id,
        titulo: data.titulo,
        descricao: data.descricao,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        ativo: data.ativo,
        publico_alvo: publicoAlvo,
        arquivo_url,
        arquivo_nome,
      });

      toast({
        title: "Sucesso",
        description: "Comunicado atualizado com sucesso!",
      });

      navigate('/admin/comunicados/consulta');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar comunicado: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando comunicado...</div>
      </div>
    );
  }

  if (!comunicado) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Comunicado não encontrado</h2>
              <Button onClick={() => navigate('/admin/comunicados/consulta')}>
                Voltar para consulta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/comunicados/consulta')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">Editar Comunicado</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                {...register('titulo', { required: 'Título é obrigatório' })}
                className={errors.titulo ? 'border-destructive' : ''}
              />
              {errors.titulo && (
                <p className="text-sm text-destructive mt-1">{errors.titulo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                rows={4}
                {...register('descricao')}
                placeholder="Descreva o conteúdo do comunicado..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_inicio">Data de início *</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  {...register('data_inicio', { required: 'Data de início é obrigatória' })}
                  className={errors.data_inicio ? 'border-destructive' : ''}
                />
                {errors.data_inicio && (
                  <p className="text-sm text-destructive mt-1">{errors.data_inicio.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="data_fim">Data de fim *</Label>
                <Input
                  id="data_fim"
                  type="date"
                  {...register('data_fim', { required: 'Data de fim é obrigatória' })}
                  className={errors.data_fim ? 'border-destructive' : ''}
                />
                {errors.data_fim && (
                  <p className="text-sm text-destructive mt-1">{errors.data_fim.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                defaultChecked={comunicado.ativo}
                onCheckedChange={(checked) => setValue('ativo', checked)}
              />
              <Label htmlFor="ativo">Comunicado ativo</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Público-alvo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tipo de Público-Alvo *</Label>
              <Select
                value={publicoAlvo.tipo}
                onValueChange={(value: 'todos' | 'cca' | 'usuarios') => 
                  setPublicoAlvo({ 
                    tipo: value,
                    cca_id: undefined,
                    usuarios_ids: []
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os usuários</SelectItem>
                  <SelectItem value="cca">Usuários de um CCA específico</SelectItem>
                  <SelectItem value="usuarios">Usuários específicos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {publicoAlvo.tipo === 'cca' && (
              <div>
                <Label>Selecionar CCA *</Label>
                <Select
                  value={publicoAlvo.cca_id?.toString() || ""}
                  onValueChange={(value) => 
                    setPublicoAlvo(prev => ({ 
                      ...prev,
                      cca_id: parseInt(value)
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CCA" />
                  </SelectTrigger>
                  <SelectContent>
                    {ccas.map((cca) => (
                      <SelectItem key={cca.id} value={cca.id.toString()}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {publicoAlvo.tipo === 'usuarios' && (
              <div>
                <Label>Selecionar Usuários *</Label>
                <UsuariosSelector
                  selectedIds={publicoAlvo.usuarios_ids || []}
                  onChange={(ids) => 
                    setPublicoAlvo(prev => ({ 
                      ...prev,
                      usuarios_ids: ids
                    }))
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anexo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {comunicado.arquivo_url && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manterAnexo"
                    defaultChecked={!!comunicado.arquivo_url}
                    onCheckedChange={(checked) => setValue('manterAnexo', !!checked)}
                  />
                  <Label htmlFor="manterAnexo">Manter anexo atual</Label>
                </div>
                
                {watchManterAnexo && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{comunicado.arquivo_nome}</span>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="arquivo">
                {comunicado.arquivo_url ? 'Substituir anexo' : 'Novo anexo'}
              </Label>
              <Input
                id="arquivo"
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue('arquivo', file);
                    if (comunicado.arquivo_url) {
                      setValue('manterAnexo', false);
                    }
                  }
                }}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Formatos aceitos: imagens (JPG, PNG), PDF, DOC, DOCX
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/comunicados/consulta')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || uploading}
            className="min-w-[120px]"
          >
            {isSubmitting || uploading ? (
              uploading ? "Enviando arquivo..." : "Salvando..."
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ComunicadoEdicao;