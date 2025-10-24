import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import Layout from "@/components/Layout"
import { Pencil, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ParametroTubulacao = {
  id: string
  tipo_material: string
  atividade: string
  valor_base: number
  descricao?: string
  created_at: string
  updated_at: string
}

export default function CadastroParametros() {
  const [parametros, setParametros] = useState<ParametroTubulacao[]>([])
  const [loading, setLoading] = useState(true)
  const [editingParametro, setEditingParametro] = useState<ParametroTubulacao | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    tipo_material: '',
    atividade: '',
    valor_base: '',
    descricao: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    carregarParametros()
  }, [])

  const carregarParametros = async () => {
    try {
      const { data, error } = await supabase
        .from('parametros_tubulacao')
        .select('*')
        .order('tipo_material', { ascending: true })

      if (error) throw error
      setParametros(data || [])
    } catch (error) {
      console.error('Erro ao carregar parâmetros:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar parâmetros.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const parametroData = {
        tipo_material: formData.tipo_material,
        atividade: formData.atividade,
        valor_base: parseFloat(formData.valor_base),
        descricao: formData.descricao || null
      }

      if (editingParametro) {
        const { error } = await supabase
          .from('parametros_tubulacao')
          .update(parametroData)
          .eq('id', editingParametro.id)

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "Parâmetro atualizado com sucesso!"
        })
      } else {
        const { error } = await supabase
          .from('parametros_tubulacao')
          .insert([parametroData])

        if (error) throw error

        toast({
          title: "Sucesso", 
          description: "Parâmetro cadastrado com sucesso!"
        })
      }

      resetForm()
      carregarParametros()
      setIsDialogOpen(false)
    } catch (error: any) {
      console.error('Erro ao salvar parâmetro:', error)
      toast({
        title: "Erro",
        description: error.message || "Falha ao salvar parâmetro.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (parametro: ParametroTubulacao) => {
    setEditingParametro(parametro)
    setFormData({
      tipo_material: parametro.tipo_material,
      atividade: parametro.atividade,
      valor_base: parametro.valor_base.toString(),
      descricao: parametro.descricao || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este parâmetro?')) return

    try {
      const { error } = await supabase
        .from('parametros_tubulacao')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Parâmetro excluído com sucesso!"
      })
      carregarParametros()
    } catch (error: any) {
      console.error('Erro ao excluir parâmetro:', error)
      toast({
        title: "Erro",
        description: error.message || "Falha ao excluir parâmetro.",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      tipo_material: '',
      atividade: '',
      valor_base: '',
      descricao: ''
    })
    setEditingParametro(null)
  }

  const openNewParametroDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Parâmetros de Tubulação</h1>
            <p className="text-muted-foreground">Gerenciar valores base para cálculos SPEC</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewParametroDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Parâmetro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingParametro ? 'Editar Parâmetro' : 'Novo Parâmetro'}
                </DialogTitle>
                <DialogDescription>
                  Configure os valores base para cálculos de eficiência SPEC.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo_material">Tipo de Material</Label>
                  <Select
                    value={formData.tipo_material}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_material: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CARBONO">CARBONO</SelectItem>
                      <SelectItem value="INOX304">INOX304</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="atividade">Atividade</Label>
                  <Select
                    value={formData.atividade}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, atividade: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a atividade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TUB_AC">TUB_AC</SelectItem>
                      <SelectItem value="TUB_AI304">TUB_AI304</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_base">Valor Base</Label>
                  <Input
                    id="valor_base"
                    type="number"
                    step="0.1"
                    value={formData.valor_base}
                    onChange={(e) => setFormData(prev => ({ ...prev, valor_base: e.target.value }))}
                    placeholder="Ex: 1.8"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descrição opcional do parâmetro"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : editingParametro ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Parâmetros */}
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros Cadastrados</CardTitle>
            <CardDescription>
              Lista dos valores base configurados para cálculos SPEC
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Carregando parâmetros...</div>
            ) : parametros.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum parâmetro cadastrado
              </div>
            ) : (
              <div className="space-y-4">
                {parametros.map((parametro) => (
                  <div key={parametro.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-semibold">
                        {parametro.tipo_material} - {parametro.atividade}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {parametro.valor_base}
                      </div>
                      {parametro.descricao && (
                        <div className="text-sm text-muted-foreground">
                          {parametro.descricao}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Atualizado em: {new Date(parametro.updated_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(parametro)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(parametro.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}