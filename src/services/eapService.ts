import { supabase } from "@/integrations/supabase/client";

export interface EAPNode {
  id: string;
  name: string;
  children: EAPNode[];
  expanded?: boolean;
}

export interface EAPItem {
  id: string;
  cca_id: number;
  codigo: string;
  nome: string;
  nivel: number;
  parent_id?: string;
  parent_codigo?: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

class EAPService {
  // Buscar itens EAP de um CCA
  async getItemsByCCA(ccaId: number): Promise<EAPItem[]> {
    const { data, error } = await supabase
      .from("eap_itens")
      .select("*")
      .eq("cca_id", ccaId)
      .eq("ativo", true)
      .order("ordem");

    if (error) throw error;
    return data || [];
  }

  // Converter itens flat em estrutura de árvore
  convertItemsToTree(items: EAPItem[]): EAPNode[] {
    const itemsMap = new Map<string, EAPNode>();
    const rootNodes: EAPNode[] = [];

    // Criar todos os nós
    items.forEach(item => {
      itemsMap.set(item.codigo, {
        id: item.id,
        name: item.nome,
        children: [],
        expanded: true
      });
    });

    // Construir hierarquia
    items.forEach(item => {
      const node = itemsMap.get(item.codigo);
      if (!node) return;

      if (item.parent_codigo) {
        const parentNode = itemsMap.get(item.parent_codigo);
        if (parentNode) {
          parentNode.children.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  }

  // Converter árvore em itens flat
  convertTreeToItems(ccaId: number, nodes: EAPNode[], parentCodigo: string = "", nivel: number = 1): Omit<EAPItem, "id" | "created_at" | "updated_at">[] {
    const items: Omit<EAPItem, "id" | "created_at" | "updated_at">[] = [];

    nodes.forEach((node, index) => {
      const codigo = parentCodigo ? `${parentCodigo}.${index + 1}` : `${index + 1}`;

      items.push({
        cca_id: ccaId,
        codigo,
        nome: node.name,
        nivel,
        parent_id: undefined,
        parent_codigo: parentCodigo || undefined,
        ordem: index,
        ativo: true
      });

      if (node.children && node.children.length > 0) {
        const childItems = this.convertTreeToItems(ccaId, node.children, codigo, nivel + 1);
        items.push(...childItems);
      }
    });

    return items;
  }

  // Salvar estrutura EAP completa de um CCA
  async saveEAPStructure(ccaId: number, nodes: EAPNode[]): Promise<void> {
    // Deletar itens antigos do CCA
    await supabase
      .from("eap_itens")
      .delete()
      .eq("cca_id", ccaId);

    // Converter árvore em itens flat
    const items = this.convertTreeToItems(ccaId, nodes);

    if (items.length > 0) {
      const { error } = await supabase
        .from("eap_itens")
        .insert(items);

      if (error) throw error;
    }
  }

  // Buscar item específico por código
  async getItemByCodigo(ccaId: number, codigo: string): Promise<EAPItem | null> {
    const { data, error } = await supabase
      .from("eap_itens")
      .select("*")
      .eq("cca_id", ccaId)
      .eq("codigo", codigo)
      .eq("ativo", true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // Buscar todos os itens de um nível específico
  async getItemsByLevel(ccaId: number, nivel: number): Promise<EAPItem[]> {
    const { data, error } = await supabase
      .from("eap_itens")
      .select("*")
      .eq("cca_id", ccaId)
      .eq("nivel", nivel)
      .eq("ativo", true)
      .order("ordem");

    if (error) throw error;
    return data || [];
  }

  // Buscar itens filhos de um item
  async getChildItems(ccaId: number, parentCodigo: string): Promise<EAPItem[]> {
    const { data, error } = await supabase
      .from("eap_itens")
      .select("*")
      .eq("cca_id", ccaId)
      .eq("parent_codigo", parentCodigo)
      .eq("ativo", true)
      .order("ordem");

    if (error) throw error;
    return data || [];
  }
}

export const eapService = new EAPService();
