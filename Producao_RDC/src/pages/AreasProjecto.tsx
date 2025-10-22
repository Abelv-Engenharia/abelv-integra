import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Edit, Trash2, Building2, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface AreaProjeto {
  id: string
  nome: string
  descricao?: string
  ativo: boolean
  ccas_ids?: string[]
  created_at: string
  updated_at: string
}

interface CCA {
  id: string
  codigo: string
  nome: string
  ativo: boolean
}

export default function AreasProjecto() {
  const [areas, setAreas] = useState<AreaProjeto[]>([])
  const [ccas, setCcas] = useState<CCA[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editandoArea, setEditandoArea] = useState<AreaProjeto | null>(null)
  const [busca, setBusca] = useState("")
  const [filtroCcaId, setFiltroCcaId] = useState<string>("")
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ativo: true,
    ccas_ids: [] as string[]
  })
  const { toast } = useToast()

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      // Carregar áreas
      const { data: areasData, error: areasError } = await supabase
        .from("areas_projeto")
        .select("*")
        .eq("ativo", true)
        .order("nome")

      if (areasError) throw areasError

      // Carregar CCAs
      const { data: ccasData, error: ccasError } = await supabase
        .from("ccas")
        .select("id, codigo, nome, ativo")
        .eq("ativo", true)
        .order("codigo")

      if (ccasError) throw ccasError

      setAreas(areasData || [])
      setCcas(ccasData || [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      ativo: true,
      ccas_ids: []
    })
    setEditandoArea(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome da área é obrigatório",
        variant: "destructive"
      })
      return
    }

    try {
      const dados = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim() || null,
        ativo: formData.ativo,
        ccas_ids: formData.ccas_ids
      }

      if (editandoArea) {
        const { error } = await supabase
          .from("areas_projeto")
          .update(dados)
          .eq("id", editandoArea.id)

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "Área atualizada com sucesso"
        })
      } else {
        const { error } = await supabase
          .from("areas_projeto")
          .insert([dados])

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "Área cadastrada com sucesso"
        })
      }

      setDialogOpen(false)
      resetForm()
      carregarDados()
    } catch (error) {
      console.error("Erro ao salvar área:", error)
      toast({
        title: "Erro",
        description: "Erro ao salvar área",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (area: AreaProjeto) => {
    setEditandoArea(area)
    setFormData({
      nome: area.nome,
      descricao: area.descricao || "",
      ativo: area.ativo,
      ccas_ids: area.ccas_ids || []
    })
    setDialogOpen(true)
  }

  const handleDelete = async (area: AreaProjeto) => {
    if (!confirm(`Tem certeza que deseja excluir a área "${area.nome}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from("areas_projeto")
        .update({ ativo: false })
        .eq("id", area.id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Área excluída com sucesso"
      })

      carregarDados()
    } catch (error) {
      console.error("Erro ao excluir área:", error)
      toast({
        title: "Erro",
        description: "Erro ao excluir área",
        variant: "destructive"
      })
    }
  }

  const handleCcaToggle = (ccaId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        ccas_ids: [...prev.ccas_ids, ccaId]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        ccas_ids: prev.ccas_ids.filter(id => id !== ccaId)
      }))
    }
  }

  const getCcaNomes = (ccaIds: string[] = []) => {
    return ccaIds
      .map(id => {
        const cca = ccas.find(c => c.id === id)
        return cca ? `${cca.codigo} - ${cca.nome}` : null
      })
      .filter(Boolean)
      .join(", ")
  }

  const areasFiltradas = areas.filter(area => {
    const matchBusca = area.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (area.descricao && area.descricao.toLowerCase().includes(busca.toLowerCase()))
    
    const matchCca = !filtroCcaId || area.ccas_ids?.includes(filtroCcaId)
    
    return matchBusca && matchCca
  })

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Carregando...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cadastro de Áreas do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar áreas..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative min-w-[250px]">
                  <Select value={filtroCcaId} onValueChange={setFiltroCcaId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por CCA" />
                    </SelectTrigger>
                    <SelectContent>
                      {ccas.map((cca) => (
                        <SelectItem key={cca.id} value={cca.id}>
                          {cca.codigo} - {cca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {filtroCcaId && (
                    <button
                      type="button"
                      onClick={() => setFiltroCcaId("")}
                      className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 rounded-sm opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) resetForm()
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Área
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editandoArea ? "Editar Área" : "Nova Área"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome da Área</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Ex: Área de Produção"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                        placeholder="Descrição detalhada da área..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-3">
                        <Building2 className="h-4 w-4" />
                        CCAs Vinculados
                      </Label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                        {ccas.map((cca) => (
                          <div key={cca.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={cca.id}
                              checked={formData.ccas_ids.includes(cca.id)}
                              onCheckedChange={(checked) => handleCcaToggle(cca.id, !!checked)}
                            />
                            <Label htmlFor={cca.id} className="text-sm">
                              {cca.codigo} - {cca.nome}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {ccas.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Nenhum CCA disponível. Cadastre CCAs primeiro.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ativo"
                        checked={formData.ativo}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                      />
                      <Label htmlFor="ativo">Ativo</Label>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editandoArea ? "Atualizar" : "Cadastrar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {areasFiltradas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {busca ? "Nenhuma área encontrada para a busca realizada." : "Nenhuma área cadastrada."}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>CCAs Vinculados</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areasFiltradas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.nome}</TableCell>
                      <TableCell>{area.descricao || "-"}</TableCell>
                      <TableCell>
                        {area.ccas_ids && area.ccas_ids.length > 0 ? (
                          <div className="max-w-xs">
                            <span className="text-sm">{getCcaNomes(area.ccas_ids)}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Nenhum CCA vinculado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={area.ativo ? "default" : "secondary"}>
                          {area.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(area)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(area)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}