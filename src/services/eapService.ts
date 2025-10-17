import { supabase } from "@/integrations/supabase/client";

export interface EAPNode {
  id: string;
  name: string;
  children: EAPNode[];
  expanded?: boolean;
}

export interface EAPEstrutura {
  id: string;
  nome: string;
  cca_id: number;
  estrutura: EAPNode[];
  ativo: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface EAPItem {
  id: string;
  eap_estrutura_id: string;
  codigo: string;
  nome: string;
  nivel: number;
  parent_id?: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

class EAPService {
  // Buscar todas as estruturas EAP de um CCA
  async getByCC(ccaId: number): Promise<EAPEstrutura[]> {
    const { data, error } = await supabase
      .from("eap_estruturas")
      .select("*")
      .eq("cca_id", ccaId)
      .eq("ativo", true)
      .order("nome");

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      estrutura: item.estrutura as unknown as EAPNode[]
    }));
  }

  // Buscar uma estrutura EAP específica
  async getById(id: string): Promise<EAPEstrutura | null> {
    const { data, error } = await supabase
      .from("eap_estruturas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ? {
      ...data,
      estrutura: data.estrutura as unknown as EAPNode[]
    } : null;
  }

  // Criar nova estrutura EAP
  async create(estrutura: Omit<EAPEstrutura, "id" | "created_at" | "updated_at" | "created_by" | "updated_by">): Promise<EAPEstrutura> {
    const { data, error } = await supabase
      .from("eap_estruturas")
      .insert({
        ...estrutura,
        estrutura: estrutura.estrutura as any
      })
      .select()
      .single();

    if (error) throw error;

    // Sincronizar itens da estrutura
    if (data) {
      await this.syncItems(data.id, estrutura.estrutura);
    }

    return {
      ...data,
      estrutura: data.estrutura as unknown as EAPNode[]
    };
  }

  // Atualizar estrutura EAP
  async update(id: string, estrutura: Partial<EAPEstrutura>): Promise<EAPEstrutura> {
    const updateData: any = { ...estrutura };
    if (estrutura.estrutura) {
      updateData.estrutura = estrutura.estrutura as any;
    }

    const { data, error } = await supabase
      .from("eap_estruturas")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Sincronizar itens se a estrutura foi alterada
    if (data && estrutura.estrutura) {
      await this.syncItems(data.id, estrutura.estrutura);
    }

    return {
      ...data,
      estrutura: data.estrutura as unknown as EAPNode[]
    };
  }

  // Deletar estrutura EAP (soft delete)
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("eap_estruturas")
      .update({ ativo: false })
      .eq("id", id);

    if (error) throw error;
  }

  // Sincronizar itens individuais da EAP (para referências)
  private async syncItems(estruturaId: string, nodes: EAPNode[]): Promise<void> {
    // Deletar itens antigos
    await supabase
      .from("eap_itens")
      .delete()
      .eq("eap_estrutura_id", estruturaId);

    // Inserir novos itens
    const items: Omit<EAPItem, "id" | "created_at" | "updated_at">[] = [];
    
    const processNode = (node: EAPNode, parentCodigo: string = "", nivel: number = 1, ordem: number = 0) => {
      const codigo = this.generateCodigo(nodes, parentCodigo, node, ordem);
      
      items.push({
        eap_estrutura_id: estruturaId,
        codigo,
        nome: node.name,
        nivel,
        parent_id: undefined, // Não usamos parent_id na inserção, apenas o código hierárquico
        ordem,
        ativo: true
      });

      if (node.children && node.children.length > 0) {
        node.children.forEach((child, index) => {
          processNode(child, codigo, nivel + 1, index);
        });
      }
    };

    nodes.forEach((node, index) => {
      processNode(node, "", 1, index);
    });

    if (items.length > 0) {
      const { error } = await supabase
        .from("eap_itens")
        .insert(items);

      if (error) throw error;
    }
  }

  // Gerar código do item de forma hierárquica
  private generateCodigo(nodes: EAPNode[], parentCodigo: string = "", node: EAPNode, ordem: number): string {
    if (parentCodigo) {
      return `${parentCodigo}.${ordem + 1}`;
    }
    return `${ordem + 1}`;
  }

  // Buscar itens individuais de uma estrutura (para seleção em outros módulos)
  async getItems(estruturaId: string): Promise<EAPItem[]> {
    const { data, error } = await supabase
      .from("eap_itens")
      .select("*")
      .eq("eap_estrutura_id", estruturaId)
      .eq("ativo", true)
      .order("ordem");

    if (error) throw error;
    return data || [];
  }

  // Buscar item específico por código
  async getItemByCodigo(estruturaId: string, codigo: string): Promise<EAPItem | null> {
    const { data, error } = await supabase
      .from("eap_itens")
      .select("*")
      .eq("eap_estrutura_id", estruturaId)
      .eq("codigo", codigo)
      .eq("ativo", true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}

export const eapService = new EAPService();
