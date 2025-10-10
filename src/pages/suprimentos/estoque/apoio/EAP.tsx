import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface EAPNode {
  id: string;
  name: string;
  children: EAPNode[];
  isExpanded: boolean;
}

export default function EAP() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [eapData, setEapData] = useState<EAPNode>({
    id: "1",
    name: "Projeto Final",
    isExpanded: true,
    children: [
      {
        id: "2",
        name: "Planejamento",
        isExpanded: true,
        children: [
          { id: "3", name: "Levantamento de Requisitos", isExpanded: false, children: [] },
          { id: "4", name: "Planejamento de Recursos", isExpanded: false, children: [] }
        ]
      },
      {
        id: "5",
        name: "Execução",
        isExpanded: true,
        children: [
          {
            id: "6",
            name: "Desenvolvimento",
            isExpanded: true,
            children: [
              { id: "7", name: "Design", isExpanded: false, children: [] },
              { id: "8", name: "Codificação", isExpanded: false, children: [] }
            ]
          }
        ]
      }
    ]
  });

  const [editingNode, setEditingNode] = useState<EAPNode | null>(null);
  const [newNodeName, setNewNodeName] = useState("");
  const [parentNode, setParentNode] = useState<EAPNode | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCca, setSelectedCca] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);

  const findNodeById = (node: EAPNode, id: string): EAPNode | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
    return null;
  };

  const updateNodeInTree = (node: EAPNode, updatedNode: EAPNode): EAPNode => {
    if (node.id === updatedNode.id) {
      return { ...updatedNode };
    }
    return {
      ...node,
      children: node.children.map(child => updateNodeInTree(child, updatedNode))
    };
  };

  const removeNodeFromTree = (node: EAPNode, nodeIdToRemove: string): EAPNode => {
    return {
      ...node,
      children: node.children
        .filter(child => child.id !== nodeIdToRemove)
        .map(child => removeNodeFromTree(child, nodeIdToRemove))
    };
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const toggleExpand = (nodeId: string) => {
    const nodeToUpdate = findNodeById(eapData, nodeId);
    if (nodeToUpdate) {
      const updatedNode = { ...nodeToUpdate, isExpanded: !nodeToUpdate.isExpanded };
      setEapData(updateNodeInTree(eapData, updatedNode));
    }
  };

  const addNode = () => {
    if (!newNodeName.trim()) return;

    const newNode: EAPNode = {
      id: generateId(),
      name: newNodeName,
      children: [],
      isExpanded: false
    };

    if (parentNode) {
      const updatedParent = {
        ...parentNode,
        children: [...parentNode.children, newNode],
        isExpanded: true
      };
      setEapData(updateNodeInTree(eapData, updatedParent));
    } else {
      setEapData({
        ...eapData,
        children: [...eapData.children, newNode]
      });
    }

    setNewNodeName("");
    setParentNode(null);
    setIsAddDialogOpen(false);
  };

  const editNode = () => {
    if (!editingNode || !newNodeName.trim()) return;

    const updatedNode = { ...editingNode, name: newNodeName };
    setEapData(updateNodeInTree(eapData, updatedNode));
    
    setEditingNode(null);
    setNewNodeName("");
    setIsEditDialogOpen(false);
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === eapData.id) return; // Não permitir deletar o nó raiz
    setEapData(removeNodeFromTree(eapData, nodeId));
  };

  const openAddDialog = (parent?: EAPNode) => {
    setParentNode(parent || null);
    setNewNodeName("");
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (node: EAPNode) => {
    setEditingNode(node);
    setNewNodeName(node.name);
    setIsEditDialogOpen(true);
  };

  // Função para converter EAP em estrutura tabular
  const convertEapToFlat = (node: EAPNode, level: number = 1, result: any[] = []): any[] => {
    const row: any = {};
    
    // Preencher os níveis anteriores com vazios
    for (let i = 1; i < level; i++) {
      row[`nivel${i}`] = "";
    }
    
    // Preencher o nível atual
    row[`nivel${level}`] = node.name;
    
    // Preencher os níveis posteriores com vazios
    for (let i = level + 1; i <= 10; i++) {
      row[`nivel${i}`] = "";
    }
    
    result.push(row);
    
    // Processar filhos
    node.children.forEach(child => {
      convertEapToFlat(child, level + 1, result);
    });
    
    return result;
  };

  // Função para converter estrutura tabular em EAP
  const convertFlatToEap = (rows: any[]): EAPNode => {
    const rootNodes: EAPNode[] = [];
    const nodeMap = new Map<string, EAPNode>();
    
    rows.forEach((row, index) => {
      let currentLevel = 0;
      let parentPath = "";
      
      for (let level = 1; level <= 10; level++) {
        const cellValue = row[`nivel${level}`];
        if (cellValue && cellValue.trim()) {
          currentLevel = level;
          const currentPath = parentPath + (parentPath ? "/" : "") + cellValue.trim();
          
          if (!nodeMap.has(currentPath)) {
            const newNode: EAPNode = {
              id: generateId(),
              name: cellValue.trim(),
              children: [],
              isExpanded: true
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
    
    // Se não há nós raiz, criar um nó padrão
    if (rootNodes.length === 0) {
      return {
        id: generateId(),
        name: "Projeto",
        children: [],
        isExpanded: true
      };
    }
    
    // Se há apenas um nó raiz, retorná-lo
    if (rootNodes.length === 1) {
      return rootNodes[0];
    }
    
    // Se há múltiplos nós raiz, criar um nó contenedor
    return {
      id: generateId(),
      name: "Projeto",
      children: rootNodes,
      isExpanded: true
    };
  };

  // Função para baixar o modelo XLSX
  const downloadModelTemplate = () => {
    const modelData = [
      {
        nivel1: "Projeto",
        nivel2: "",
        nivel3: "",
        nivel4: "",
        nivel5: "",
        nivel6: "",
        nivel7: "",
        nivel8: "",
        nivel9: "",
        nivel10: ""
      },
      {
        nivel1: "Projeto",
        nivel2: "Planejamento",
        nivel3: "",
        nivel4: "",
        nivel5: "",
        nivel6: "",
        nivel7: "",
        nivel8: "",
        nivel9: "",
        nivel10: ""
      },
      {
        nivel1: "Projeto",
        nivel2: "Planejamento",
        nivel3: "Requisitos",
        nivel4: "",
        nivel5: "",
        nivel6: "",
        nivel7: "",
        nivel8: "",
        nivel9: "",
        nivel10: ""
      },
      {
        nivel1: "Projeto",
        nivel2: "Planejamento",
        nivel3: "Recursos",
        nivel4: "",
        nivel5: "",
        nivel6: "",
        nivel7: "",
        nivel8: "",
        nivel9: "",
        nivel10: ""
      },
      {
        nivel1: "Projeto",
        nivel2: "Execução",
        nivel3: "",
        nivel4: "",
        nivel5: "",
        nivel6: "",
        nivel7: "",
        nivel8: "",
        nivel9: "",
        nivel10: ""
      },
      {
        nivel1: "Projeto",
        nivel2: "Execução",
        nivel3: "Desenvolvimento",
        nivel4: "",
        nivel5: "",
        nivel6: "",
        nivel7: "",
        nivel8: "",
        nivel9: "",
        nivel10: ""
      },
      {
        nivel1: "Projeto",
        nivel2: "Execução",
        nivel3: "Desenvolvimento",
        nivel4: "Frontend",
        nivel5: "",
        nivel6: "",
        nivel7: "",
        nivel8: "",
        nivel9: "",
        nivel10: ""
      },
      {
        nivel1: "Projeto",
        nivel2: "Execução",
        nivel3: "Desenvolvimento",
        nivel4: "Backend",
        nivel5: "",
        nivel6: "",
        nivel7: "",
        nivel8: "",
        nivel9: "",
        nivel10: ""
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(modelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo EAP");
    
    // Ajustar largura das colunas
    const cols = Array(10).fill(0).map(() => ({ width: 20 }));
    worksheet['!cols'] = cols;
    
    XLSX.writeFile(workbook, "Modelo_EAP_10_Niveis.xlsx");
    
    toast({
      title: "Modelo baixado",
      description: "O arquivo modelo foi baixado com sucesso.",
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

        // Validar se pelo menos uma linha tem dados no Nível 1
        const hasValidData = jsonData.some((row: any) => 
          row.nivel1 || row.Nivel1 || row['Nível 1'] || row['nivel 1']
        );

        if (!hasValidData) {
          toast({
            title: "Erro",
            description: "Não foram encontrados dados válidos. Verifique se a coluna 'nivel1' está preenchida.",
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
              `Nivel ${i}`,
              `NIVEL${i}`,
              `NÍVEL ${i}`
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
        // Limpar o input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const renderNode = (node: EAPNode, level: number = 0) => {
    const hasChildren = node.children.length > 0;
    const marginLeft = level * 40;

    return (
      <div key={node.id} className="relative">
        {/* Linhas conectoras */}
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
            <Collapsible open={node.isExpanded} onOpenChange={() => toggleExpand(node.id)}>
              <CollapsibleTrigger className="p-1 hover:bg-accent rounded">
                {node.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
            </Collapsible>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
            </div>
          )}

          <div className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center justify-between group hover:bg-primary/90 transition-colors">
            <span>{node.name}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => openAddDialog(node)}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => openEditDialog(node)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              {node.id !== eapData.id && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => deleteNode(node.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {hasChildren && (
          <Collapsible open={node.isExpanded}>
            <CollapsibleContent>
              <div className="relative">
                {/* Linha vertical para conectar filhos */}
                {node.isExpanded && (
                  <div 
                    className="absolute w-px bg-border"
                    style={{ 
                      left: marginLeft + 20, 
                      top: 0, 
                      height: node.children.length * 50 - 10 
                    }}
                  />
                )}
                {node.children.map(child => renderNode(child, level + 1))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EAP</h1>
          <p className="text-muted-foreground">
            Estrutura Analítica do Projeto
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={downloadModelTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Baixar modelo
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isImporting ? "Importando..." : "Importar XLSX"}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CCA</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCca} onValueChange={setSelectedCca}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o CCA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cca001">CCA 001 - Centro de Custo A</SelectItem>
              <SelectItem value="cca002">CCA 002 - Centro de Custo B</SelectItem>
              <SelectItem value="cca003">CCA 003 - Centro de Custo C</SelectItem>
              <SelectItem value="cca004">CCA 004 - Centro de Custo D</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estrutura do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-2">
            {renderNode(eapData)}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para adicionar nó */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {parentNode ? `Adicionar subnó a "${parentNode.name}"` : "Adicionar novo nó"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome do nó"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNode()}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={addNode}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar nó */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Nó</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome do nó"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && editNode()}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={editNode}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
