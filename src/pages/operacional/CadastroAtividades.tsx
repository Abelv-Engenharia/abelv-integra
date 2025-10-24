import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface AtividadeCadastrada {
  id: string
  nome: string
  descricao: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export default function CadastroAtividades() {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [atividades, setAtividades] = useState<AtividadeCadastrada[]>([])
  const [carregando, setCarregando] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAtividades()
  }, [])

  const fetchAtividades = async () => {
    try {
      const { data, error } = await supabase
        .from("atividades_cadastradas")
        .select("*")
        .eq("ativo", true)
        .eq("modulo", "mecanica")
        .order("nome")

      if (error) throw error
      setAtividades(data || [])
    } catch (error) {
      console.error("Erro ao buscar atividades:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar atividades",
        variant: "destructive"
      })
    }
  }

  const adicionarAtividade = async () => {
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da atividade é obrigatório",
        variant: "destructive"
      })
      return
    }

    // Verificar se já existe uma atividade com o mesmo nome
    const atividadeExistente = atividades.find(
      a => a.nome.toLowerCase() === nome.trim().toLowerCase()
    )

    if (atividadeExistente) {
      toast({
        title: "Erro",
        description: "Já existe uma atividade com este nome",
        variant: "destructive"
      })
      return
    }

    setCarregando(true)

    try {
      const { error } = await supabase
        .from("atividades_cadastradas")
        .insert([
          {
            nome: nome.trim(),
            descricao: descricao.trim() || null,
            modulo: "mecanica"
          }
        ])

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Atividade adicionada com sucesso!"
      })

      setNome("")
      setDescricao("")
      fetchAtividades()
    } catch (error) {
      console.error("Erro ao adicionar atividade:", error)
      toast({
        title: "Erro",
        description: "Erro ao adicionar atividade",
        variant: "destructive"
      })
    } finally {
      setCarregando(false)
    }
  }

  const removerAtividade = async (id: string) => {
    try {
      const { error } = await supabase
        .from("atividades_cadastradas")
        .update({ ativo: false })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Atividade removida com sucesso!"
      })

      fetchAtividades()
    } catch (error) {
      console.error("Erro ao remover atividade:", error)
      toast({
        title: "Erro",
        description: "Erro ao remover atividade",
        variant: "destructive"
      })
    }
  }

  const limparCampos = () => {
    setNome("")
    setDescricao("")
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Cadastro de Atividades</h1>
          <p className="text-muted-foreground">
            Gerencie as atividades disponíveis para os registros de etapas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulário de Cadastro */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">Nova Atividade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome da Atividade *
                </Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Soldagem, Montagem..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="descricao" className="text-sm font-medium">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição detalhada da atividade (opcional)"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={adicionarAtividade} 
                  disabled={carregando}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {carregando ? "Adicionando..." : "Adicionar"}
                </Button>
                <Button onClick={limparCampos} variant="outline">
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Atividades */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">
                Atividades Cadastradas ({atividades.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {atividades.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma atividade cadastrada
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {atividades.map((atividade) => (
                    <div
                      key={atividade.id}
                      className="flex items-start justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-card-foreground">
                          {atividade.nome}
                        </h3>
                        {atividade.descricao && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {atividade.descricao}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => removerAtividade(atividade.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}