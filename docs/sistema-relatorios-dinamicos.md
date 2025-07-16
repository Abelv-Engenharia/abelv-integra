# Sistema de Relatórios Dinâmicos

Este sistema permite que os relatórios sejam registrados automaticamente no campo "Tipo de relatório" da configuração de e-mails.

## Como funciona

### 1. Serviço de Relatórios (`relatoriosService`)

O `relatoriosService` é um singleton que gerencia todos os relatórios disponíveis no sistema:

```typescript
import { relatoriosService } from '@/services/relatoriosService';

// Registrar um novo relatório
relatoriosService.registrarRelatorio({
  value: 'meu-relatorio',
  label: 'Meu Relatório',
  path: '/relatorios/meu-relatorio',
});

// Obter todos os relatórios
const relatorios = relatoriosService.getRelatorios();

// Remover um relatório
relatoriosService.removerRelatorio('meu-relatorio');
```

### 2. Hook `useRelatoriosDisponiveis`

O hook reativo que fornece os relatórios atualizados:

```typescript
import { useRelatoriosDisponiveis } from '@/hooks/useRelatoriosDisponiveis';

const { relatorios } = useRelatoriosDisponiveis();
```

### 3. Registro Automático

O dashboard de relatórios registra automaticamente todos os relatórios disponíveis:

```typescript
// Em RelatoriosDashboard.tsx
useEffect(() => {
  reportCards.forEach(card => {
    const linkParts = card.link.split('/');
    const value = linkParts[linkParts.length - 1];
    
    relatoriosService.registrarRelatorio({
      value,
      label: card.title,
      path: card.link,
    });
  });
}, []);
```

## Como adicionar um novo relatório

1. **Adicione o relatório ao dashboard:**

```typescript
// Em RelatoriosDashboard.tsx
const reportCards = [
  // ... outros relatórios
  {
    title: "Meu Novo Relatório",
    description: "Descrição do relatório",
    icon: <FileText className="h-8 w-8" />,
    link: "/relatorios/meu-novo-relatorio",
  },
];
```

2. **Crie a rota correspondente:**

```typescript
// Em App.tsx
<Route path="relatorios/meu-novo-relatorio" element={<MeuNovoRelatorio />} />
```

3. **O relatório será automaticamente disponível** no campo "Tipo de relatório" da configuração de e-mails.

## Relatórios Atuais

Os seguintes relatórios estão atualmente registrados:

- **Relatórios de Desvios** (`desvios`) - `/relatorios/desvios`
- **Relatórios de Treinamentos** (`treinamentos`) - `/relatorios/treinamentos`
- **Relatórios de Ocorrências** (`ocorrencias`) - `/relatorios/ocorrencias`
- **Relatórios IDSMS** (`idsms`) - `/relatorios/idsms`
- **Relatórios de Execução HSA** (`hsa`) - `/relatorios/hsa`

## Observações

- O sistema é reativo: mudanças nos relatórios são refletidas automaticamente na interface
- Os relatórios são registrados na inicialização do dashboard
- O campo "Tipo de relatório" na configuração de e-mails usa automaticamente a lista atualizada
- Compatibilidade mantida com tipos de relatório existentes no banco de dados