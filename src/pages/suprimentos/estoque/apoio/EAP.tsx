import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, ChevronDown, Plus, Edit, Trash2, Upload, Download, FileDown, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { eapService, EAPNode, EAPEstrutura } from "@/services/eapService";
import { supabase } from "@/integrations/supabase/client";

export default function EAP() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados principais
  const [ccas, setCcas] = useState<Array<{ id: number; codigo: string; nome: string }>>([]);
  const [selectedCcaId, setSelectedCcaId] = useState<number | null>(null);
  const [estruturas, setEstruturas] = useState<EAPEstrutura[]>([]);
  const [estruturaAtual, setEstruturaAtual] = useState<EAPEstrutura | null>(null);
  const [eapData, setEapData] = useState<EAPNode[]>([]);
  const [estruturaNome, setEstruturaNome] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para os diálogos
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewEstruturaDialogOpen, setIsNewEstruturaDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<EAPNode | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Carregar CCAs ao montar o componente
  useEffect(() => {
    loadCcas();
  }, []);

  // Carregar estruturas quando CCA é selecionado
  useEffect(() => {
    if (selectedCcaId) {
      loadEstruturas();
    }
  }, [selectedCcaId]);

  const loadCcas = async () => {
    try {
      const { data, error } = await supabase
        .from("ccas")
        .select("id, codigo, nome")
        .eq("ativo", true)
        .order("codigo");

      if (error) throw error;
      setCcas(data || []);
    } catch (error) {
      console.error("Erro ao carregar CCAs:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os CCAs",
        variant: "destructive",
      });
    }
  };

  const loadEstruturas = async () => {
    if (!selectedCcaId) return;

    setIsLoading(true);
    try {
      const data = await eapService.getByCC(selectedCcaId);
      setEstruturas(data);
      
      // Se houver estruturas, carregar a primeira
      if (data.length > 0) {
        loadEstrutura(data[0].id);
      } else {
        setEstruturaAtual(null);
        setEapData([]);
      }
    } catch (error) {
      console.error("Erro ao carregar estruturas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estruturas EAP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEstrutura = async (estruturaId: string) => {
    setIsLoading(true);
    try {
      const estrutura = await eapService.getById(estruturaId);
      if (estrutura) {
        setEstruturaAtual(estrutura);
        setEapData(estrutura.estrutura);
        setEstruturaNome(estrutura.nome);
      }
    } catch (error) {
      console.error("Erro ao carregar estrutura:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a estrutura EAP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveEstrutura = async () => {
    if (!selectedCcaId || !estruturaNome.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um CCA e digite um nome para a estrutura",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (estruturaAtual) {
        // Atualizar estrutura existente
        await eapService.update(estruturaAtual.id, {
          nome: estruturaNome,
          estrutura: eapData,
        });

        toast({
          title: "Sucesso",
          description: "Estrutura EAP atualizada com sucesso!",
        });
      } else {
        // Criar nova estrutura
        const novaEstrutura = await eapService.create({
          nome: estruturaNome,
          cca_id: selectedCcaId,
          estrutura: eapData,
          ativo: true,
        });

        setEstruturaAtual(novaEstrutura);
        toast({
          title: "Sucesso",
          description: "Estrutura EAP criada com sucesso!",
        });
      }

      loadEstruturas();
    } catch (error) {
      console.error("Erro ao salvar estrutura:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a estrutura EAP",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const createNovaEstrutura = () => {
    setEstruturaAtual(null);
    setEapData([]);
    setEstruturaNome("");
    setIsNewEstruturaDialogOpen(false);
  };

  // Funções auxiliares para manipular a árvore
  const findNodeById = (nodes: EAPNode[], id: string): EAPNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateNodeInTree = (nodes: EAPNode[], updatedNode: EAPNode): EAPNode[] => {
    return nodes.map(node => {
      if (node.id === updatedNode.id) {
        return { ...updatedNode };
      }
      return {
        ...node,
        children: node.children ? updateNodeInTree(node.children, updatedNode) : []
      };
    });
  };

  const removeNodeFromTree = (nodes: EAPNode[], nodeIdToRemove: string): EAPNode[] => {
    return nodes
      .filter(node => node.id !== nodeIdToRemove)
      .map(node => ({
        ...node,
        children: node.children ? removeNodeFromTree(node.children, nodeIdToRemove) : []
      }));
  };

  const generateId = () => crypto.randomUUID();

  const toggleExpand = (nodeId: string) => {
    const allNodes = findNodeById(eapData, nodeId);
    if (allNodes) {
      const updatedNode = { ...allNodes, expanded: !allNodes.expanded };
      setEapData(updateNodeInTree(eapData, updatedNode));
    }
  };

  const addNode = () => {
    if (!nodeName.trim()) return;

    const newNode: EAPNode = {
      id: generateId(),
      name: nodeName,
      children: [],
      expanded: false
    };

    if (selectedNode) {
      const updatedParent = {
        ...selectedNode,
        children: [...(selectedNode.children || []), newNode],
        expanded: true
      };
      setEapData(updateNodeInTree(eapData, updatedParent));
    } else {
      setEapData([...eapData, newNode]);
    }

    setNodeName("");
    setSelectedNode(null);
    setIsAddDialogOpen(false);
  };

  const editNode = () => {
    if (!selectedNode || !nodeName.trim()) return;

    const updatedNode = { ...selectedNode, name: nodeName };
    setEapData(updateNodeInTree(eapData, updatedNode));
    
    setSelectedNode(null);
    setNodeName("");
    setIsEditDialogOpen(false);
  };

  const deleteNode = (nodeId: string) => {
    setEapData(removeNodeFromTree(eapData, nodeId));
  };

  const openAddDialog = (parent: EAPNode | null) => {
    setSelectedNode(parent);
    setNodeName("");
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (node: EAPNode) => {
    setSelectedNode(node);
    setNodeName(node.name);
    setIsEditDialogOpen(true);
  };

  // Função para converter EAP em estrutura tabular
  const convertEapToFlat = (nodes: EAPNode[], level: number = 1, result: any[] = []): any[] => {
    nodes.forEach(node => {
      const row: any = {};
      
      for (let i = 1; i < level; i++) {
        row[`nivel${i}`] = "";
      }
      
      row[`nivel${level}`] = node.name;
      
      for (let i = level + 1; i <= 10; i++) {
        row[`nivel${i}`] = "";
      }
      
      result.push(row);
      
      if (node.children && node.children.length > 0) {
        convertEapToFlat(node.children, level + 1, result);
      }
    });
    
    return result;
  };

  // Função para converter estrutura tabular em EAP
  const convertFlatToEap = (rows: any[]): EAPNode[] => {
    const rootNodes: EAPNode[] = [];
    const nodeMap = new Map<string, EAPNode>();
    
    rows.forEach((row) => {
      let parentPath = "";
      
      for (let level = 1; level <= 10; level++) {
        const cellValue = row[`nivel${level}`];
        if (cellValue && cellValue.trim()) {
          const currentPath = parentPath + (parentPath ? "/" : "") + cellValue.trim();
          
          if (!nodeMap.has(currentPath)) {
            const newNode: EAPNode = {
              id: generateId(),
              name: cellValue.trim(),
              children: [],
              expanded: true
            };
            
            nodeMap.set(currentPath, newNode);
            
            if (level === 1) {
              rootNodes.push(newNode);
            } else {
              const parent = nodeMap.get(parentPath);
              if (parent && !parent.children.find(child => child.name === newNode.name)) {
                parent.children.push(newNode);
              }
            }
          }
          
          parentPath = currentPath;
        } else {
          break;
        }
      }
    });
    
    return rootNodes;
  };

  // Função para baixar o modelo XLSX
  const downloadModelTemplate = () => {
    const modelData = [
      { nivel1: "Projeto", nivel2: "", nivel3: "", nivel4: "", nivel5: "", nivel6: "", nivel7: "", nivel8: "", nivel9: "", nivel10: "" },
      { nivel1: "Projeto", nivel2: "Planejamento", nivel3: "", nivel4: "", nivel5: "", nivel6: "", nivel7: "", nivel8: "", nivel9: "", nivel10: "" },
      { nivel1: "Projeto", nivel2: "Planejamento", nivel3: "Requisitos", nivel4: "", nivel5: "", nivel6: "", nivel7: "", nivel8: "", nivel9: "", nivel10: "" },
      { nivel1: "Projeto", nivel2: "Execução", nivel3: "", nivel4: "", nivel5: "", nivel6: "", nivel7: "", nivel8: "", nivel9: "", nivel10: "" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(modelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo EAP");
    
    const cols = Array(10).fill(0).map(() => ({ width: 20 }));
    worksheet['!cols'] = cols;
    
    XLSX.writeFile(workbook, "Modelo_EAP_10_Niveis.xlsx");
    
    toast({
      title: "Modelo baixado",
      description: "O arquivo modelo foi baixado com sucesso.",
    });
  };

  // Função para exportar EAP para Excel
  const downloadExcel = () => {
    if (eapData.length === 0) {
      toast({
        title: "Aviso",
        description: "Não há dados para exportar",
        variant: "destructive",
      });
      return;
    }

    const flatData = convertEapToFlat(eapData);
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EAP");
    
    const cols = Array(10).fill(0).map(() => ({ width: 20 }));
    worksheet['!cols'] = cols;
    
    XLSX.writeFile(workbook, `EAP_${estruturaNome || 'Estrutura'}.xlsx`);
    
    toast({
      title: "Exportação concluída",
      description: "EAP exportada com sucesso!",
    });
  };

  // Função para importar arquivo XLSX
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls).",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast({
            title: "Erro",
            description: "O arquivo está vazio ou não contém dados válidos.",
            variant: "destructive"
          });
          setIsImporting(false);
          return;
        }

        // Normalizar os nomes das colunas
        const normalizedData = jsonData.map((row: any) => {
          const normalizedRow: any = {};
          for (let i = 1; i <= 10; i++) {
            const possibleKeys = [
              `nivel${i}`,
              `Nivel${i}`,
              `Nível ${i}`,
              `nivel ${i}`,
              `NIVEL${i}`
            ];
            
            for (const key of possibleKeys) {
              if (row[key] !== undefined) {
                normalizedRow[`nivel${i}`] = row[key];
                break;
              }
            }
            
            if (normalizedRow[`nivel${i}`] === undefined) {
              normalizedRow[`nivel${i}`] = "";
            }
          }
          return normalizedRow;
        });

        const newEapData = convertFlatToEap(normalizedData);
        setEapData(newEapData);
        
        toast({
          title: "Importação concluída",
          description: `EAP importada com sucesso! ${jsonData.length} linhas processadas.`,
        });
        
      } catch (error) {
        console.error('Erro ao importar arquivo:', error);
        toast({
          title: "Erro na importação",
          description: "Ocorreu um erro ao processar o arquivo. Verifique se o formato está correto.",
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const renderNode = (node: EAPNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const marginLeft = level * 40;

    return (
      <div key={node.id} className="relative">
        {level > 0 && (
          <>
            <div 
              className="absolute w-px h-6 bg-border"
              style={{ left: marginLeft - 20, top: -6 }}
            />
            <div 
              className="absolute h-px w-5 bg-border"
              style={{ left: marginLeft - 20, top: 19 }}
            />
          </>
        )}
        
        <div 
          className="flex items-center gap-2 py-2"
          style={{ marginLeft }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(node.id)}
              className="p-1 hover:bg-accent rounded transition-colors"
            >
              {node.expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
          
          <span className="flex-1 font-medium">{node.name}</span>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openAddDialog(node)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openEditDialog(node)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteNode(node.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hasChildren && node.expanded && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">EAP - Estrutura Analítica de Projeto</h1>
            <p className="text-muted-foreground mt-1">
              Organize e gerencie a estrutura hierárquica do seu projeto
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={saveEstrutura}
              disabled={isSaving || !selectedCcaId || !estruturaNome}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        {/* Seleção de CCA e Estrutura */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>CCA *</Label>
            <Select
              value={selectedCcaId?.toString() || ""}
              onValueChange={(value) => setSelectedCcaId(parseInt(value))}
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

          <div className="space-y-2">
            <Label>Estrutura</Label>
            <Select
              value={estruturaAtual?.id || ""}
              onValueChange={loadEstrutura}
              disabled={!selectedCcaId || estruturas.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={estruturas.length === 0 ? "Nenhuma estrutura" : "Selecione a estrutura"} />
              </SelectTrigger>
              <SelectContent>
                {estruturas.map((est) => (
                  <SelectItem key={est.id} value={est.id}>
                    {est.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nome da Estrutura *</Label>
            <Input
              value={estruturaNome}
              onChange={(e) => setEstruturaNome(e.target.value)}
              placeholder="Digite o nome da estrutura"
              disabled={!selectedCcaId}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isNewEstruturaDialogOpen} onOpenChange={setIsNewEstruturaDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!selectedCcaId}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Estrutura
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Estrutura</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Isso irá limpar a estrutura atual. Certifique-se de ter salvado antes.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewEstruturaDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={createNovaEstrutura}>
                  Criar Nova
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={downloadModelTemplate}>
            <FileDown className="mr-2 h-4 w-4" />
            Baixar Modelo
          </Button>
          <label htmlFor="file-upload">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Importar Excel
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileImport}
          />
          <Button variant="outline" size="sm" onClick={downloadExcel}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Árvore EAP */}
      {selectedCcaId && (
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Estrutura da EAP</h2>
            <Button onClick={() => openAddDialog(null)} disabled={!estruturaNome}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Item Raiz
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Carregando estrutura...</p>
            </div>
          ) : eapData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Nenhum item na EAP</p>
              <p className="text-sm mt-2">Clique em "Adicionar Item Raiz" para começar</p>
            </div>
          ) : (
            <div className="space-y-2 group">
              {eapData.map((node) => renderNode(node, 0))}
            </div>
          )}
        </div>
      )}

      {/* Dialog para adicionar nó */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedNode ? `Adicionar item em "${selectedNode.name}"` : "Adicionar Item Raiz"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="node-name">Nome do Item</Label>
              <Input
                id="node-name"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="Digite o nome do item"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addNode();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addNode} disabled={!nodeName.trim()}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar nó */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-node-name">Nome do Item</Label>
              <Input
                id="edit-node-name"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="Digite o nome do item"
                onKeyDown={(e) => {
                  if (e.key === "Enter") editNode();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={editNode} disabled={!nodeName.trim()}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
