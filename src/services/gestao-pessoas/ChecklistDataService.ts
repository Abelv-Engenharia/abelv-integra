export interface ChecklistRecord {
  id: string;
  data: string;
  placa: string;
  condutor: string;
  tipo: 'Retirada' | 'Devolução';
  status: 'Concluído' | 'Pendente';
  datalimite: string;
  observacoes: string;
  tentativascobranca: number;
  fotos: {
    [posicao: number]: {
      arquivos: string[]; // nomes dos arquivos
      files: File[]; // arquivos reais para preview
    }
  };
  dadosoriginais: {
    nivelcombustivel: string;
    hodometro: string;
    observacoesdetalhadas: string;
    marcamodelo: string;
  };
}

class ChecklistDataService {
  private static readonly STORAGE_KEY = 'checklists_data';

  static salvarChecklist(checklist: Omit<ChecklistRecord, 'id'>): string {
    const id = this.gerarId();
    const checklistCompleto: ChecklistRecord = {
      id,
      ...checklist
    };

    const checklists = this.obterTodos();
    checklists.push(checklistCompleto);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(checklists));
    return id;
  }

  static obterTodos(): ChecklistRecord[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static obterPorId(id: string): ChecklistRecord | null {
    const checklists = this.obterTodos();
    return checklists.find(c => c.id === id) || null;
  }

  static atualizarStatus(id: string, status: ChecklistRecord['status']): boolean {
    const checklists = this.obterTodos();
    const index = checklists.findIndex(c => c.id === id);
    
    if (index !== -1) {
      checklists[index].status = status;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(checklists));
      return true;
    }
    return false;
  }

  static incrementarTentativaCobranca(id: string): boolean {
    const checklists = this.obterTodos();
    const index = checklists.findIndex(c => c.id === id);
    
    if (index !== -1) {
      checklists[index].tentativascobranca += 1;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(checklists));
      return true;
    }
    return false;
  }

  private static gerarId(): string {
    return `checklist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Para converter File para string (base64) para armazenamento
  static async fileParaBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Para converter string base64 de volta para File
  static base64ParaFile(base64: string, fileName: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }
}

export default ChecklistDataService;