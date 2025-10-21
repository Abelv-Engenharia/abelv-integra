# 📦 Módulo Prestadores de Serviço - Documentação Geral

Visão geral completa do módulo de Prestadores de Serviço integrado com Supabase.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Submódulos](#submódulos)
3. [Arquitetura](#arquitetura)
4. [Status de Implementação](#status-de-implementação)
5. [Como Usar](#como-usar)
6. [Documentação Técnica](#documentação-técnica)

---

## 🎯 Visão Geral

O módulo de **Prestadores de Serviço** gerencia todo o ciclo de vida de prestadores pessoa jurídica, incluindo:

- ✅ Cadastro de Prestadores PJ
- ✅ Contratos, Aditivos e Distratos
- ✅ Demonstrativos Mensais de Pagamento
- ✅ Emissão e Aprovação de Notas Fiscais
- ✅ Controle de Férias
- ✅ Controle de Passivos Trabalhistas
- ✅ Dashboard com KPIs e Gráficos
- ✅ Relatórios Dinâmicos Consolidados

---

## 📂 Submódulos

### 1. Cadastro de Prestadores PJ
**Página:** `CadastroPrestadorPJ` (⚠️ A criar)  
**Hook:** `usePrestadoresPJ`  
**Tabela:** `prestadores_pj`

Gerencia cadastro completo de prestadores pessoa jurídica, incluindo:
- Dados pessoais (nome, CPF, CNPJ, email, telefone, endereço)
- Dados contratuais (valor prestação, data início, serviço)
- Benefícios (ajuda aluguel, ajuda custo, refeições + valores)
- Integração com CCA
- Upload de contrato

---

### 2. Contratos
**Página:** `ConsultaContratos`  
**Hook:** `usePrestadoresContratos`  
**Tabela:** `prestadores_contratos`

Gerencia contratos de prestação de serviço:
- **Tipos:** Contrato, Aditivo, Distrato
- **Status:** Ativo, Encerrado, Suspenso
- Visualização, filtros e exportação (Excel/PDF)
- Upload de documentos contratuais

---

### 3. Demonstrativos
**Integrado em:** `DashboardPrestadores`  
**Hook:** `useDemonstrativos`  
**Tabela:** `prestadores_demonstrativos`

Demonstrativos mensais de pagamento com:
- Salário base e premiações
- Ajuda de custo e ajuda aluguel
- Descontos (convênio, multas, Abelv Run)
- Reembolsos
- Valor NF e valor líquido

---

### 4. Notas Fiscais

#### 4.1 Emissão
**Página:** `EmissaoNF` (existente)  
**Hook:** `useNotasFiscais`  
**Tabela:** `prestadores_notas_fiscais`

Emissão de notas fiscais por prestadores.

#### 4.2 Aprovação
**Página:** `AprovacaoNF`  
**Hook:** `useNotasFiscais`, `useAprovarNotaFiscal`, `useReprovarNotaFiscal`  
**Tabela:** `prestadores_notas_fiscais`

Fluxo de aprovação de notas fiscais:
- Visualização de NFs pendentes
- Aprovação/reprovação
- Observações de aprovação
- Integração com Sienge (planejado)

---

### 5. Férias

#### 5.1 Solicitação
**Página:** `SolicitacaoFerias` (⚠️ A criar)  
**Hook:** `usePrestadoresFerias`  
**Tabela:** `prestadores_ferias`

Solicitação de férias por prestadores.

#### 5.2 Aprovação
**Página:** `AprovacaoFerias` (⚠️ A criar)  
**Hook:** `useAprovarFerias`, `useReprovarFerias`  
**Tabela:** `prestadores_ferias`

Aprovação de solicitações de férias com:
- Visualização de solicitações pendentes
- Aprovação/reprovação com justificativa
- Histórico de status
- Upload de anexos

---

### 6. Passivos
**Página:** `ControlePassivos` (⚠️ A criar)  
**Hook:** `usePrestadoresPassivos`  
**Tabela:** `prestadores_passivos`

Controle de passivos trabalhistas:
- Saldo de férias
- 13º salário
- Aviso prévio
- Cálculo automático do total
- Status: Ativo, Quitado, Parcial, Pendente

---

### 7. Dashboard
**Página:** `DashboardPrestadores` ✅  
**Hook:** `useDashboardPrestadores`  
**Fonte:** `prestadores_demonstrativos`

Dashboard completo com:
- **6 KPIs principais:**
  - Total de NF
  - Ajuda de Aluguel
  - Reembolso Convênio
  - Desconto Convênio
  - Multas de Trânsito
  - Desconto Abelv Run

- **4 Gráficos:**
  - Distribuição de valores por tipo
  - Comparativo mensal (últimos 6 meses)
  - Top 10 prestadores por valor de NF
  - Evolução trimestral

- **Filtros:**
  - Período (data inicial/final)
  - Empresas (múltipla seleção)
  - Prestador (busca)
  - Obra (busca)

- **Exportação:**
  - Excel (múltiplas abas)
  - PDF (relatório formatado)

---

### 8. Relatórios
**Página:** `RelatoriosPrestadores` ✅  
**Hook:** `useRelatorioPrestadores`  
**Fonte:** Todos os módulos

Relatórios dinâmicos consolidados:
- **Seleção de Módulos:** Escolha quais módulos incluir
- **Seleção de Colunas:** Escolha colunas de cada módulo
- **Filtros Avançados:** Data, valor, status, tipo, empresa, prestador
- **Tabelas Dinâmicas:** Visualização consolidada
- **Exportação:** Excel e PDF

---

## 🏗️ Arquitetura

### Camadas

```
┌─────────────────────────────────────┐
│         PÁGINAS (UI)                │
│  - DashboardPrestadores             │
│  - RelatoriosPrestadores            │
│  - ConsultaContratos                │
│  - AprovacaoNF                      │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         HOOKS (Lógica)              │
│  - usePrestadoresPJ                 │
│  - usePrestadoresContratos          │
│  - useDemonstrativos                │
│  - useNotasFiscais                  │
│  - usePrestadoresFerias             │
│  - usePrestadoresPassivos           │
│  - useDashboardPrestadores          │
│  - useRelatorioPrestadores          │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│       SUPABASE (Banco)              │
│  - prestadores_pj                   │
│  - prestadores_contratos            │
│  - prestadores_demonstrativos       │
│  - prestadores_notas_fiscais        │
│  - prestadores_ferias               │
│  - prestadores_passivos             │
│  - prestadores_ferias_historico     │
│  - prestadores_passivos_historico   │
└─────────────────────────────────────┘
```

### Padrões Utilizados

- **React Query:** Gerenciamento de estado e cache
- **Supabase:** Backend (banco de dados, storage)
- **TypeScript:** Tipagem forte
- **Soft Delete:** Campo `ativo` em todas as tabelas
- **Hooks Customizados:** Encapsulam lógica de negócio
- **Mapeamento de Campos:** Banco (snake_case) ↔ Frontend (camelCase)

---

## 📊 Status de Implementação

### ✅ Completamente Implementado

| Item | Status |
|---|---|
| Hook usePrestadoresPJ | ✅ 100% |
| Hook usePrestadoresContratos | ✅ 100% |
| Hook useDemonstrativos | ✅ 100% |
| Hook useNotasFiscais | ✅ 100% |
| Hook usePrestadoresFerias | ✅ 100% |
| Hook usePrestadoresPassivos | ✅ 100% |
| Hook useDashboardPrestadores | ✅ 100% |
| Hook useRelatorioPrestadores | ✅ 100% |
| DashboardPrestadores (página) | ✅ 100% |
| RelatoriosPrestadores (página) | ✅ 100% |
| ConsultaContratos (página) | ✅ 100% |
| AprovacaoNF (página) | ✅ 90% (falta implementar aprovação) |
| Remoção de dados mock | ✅ 100% |
| Documentação técnica | ✅ 100% |

### ⚠️ Parcialmente Implementado

| Item | Status | Pendente |
|---|---|---|
| AprovacaoNF | ⚠️ 90% | Implementar botões de aprovar/reprovar |
| Upload de arquivos | ⚠️ 0% | Integração com Supabase Storage |

### ❌ Não Implementado

| Item | Prioridade |
|---|---|
| CadastroPrestadorPJ (página) | Alta |
| SolicitacaoFerias (página) | Média |
| AprovacaoFerias (página) | Média |
| ControlePassivos (página) | Média |
| Autenticação de usuários | Alta |
| RLS (Row Level Security) | Alta |
| Validações de formulário | Média |
| Testes automatizados | Baixa |

---

## 🚀 Como Usar

### 1. Acessar Dashboard

```typescript
// Navegue para a página
<Link to="/gestao-pessoas/dashboard-prestadores">Dashboard</Link>

// A página automaticamente:
// - Carrega dados do Supabase
// - Calcula KPIs
// - Gera gráficos
// - Permite filtros e exportação
```

### 2. Consultar Contratos

```typescript
// Navegue para a página
<Link to="/gestao-pessoas/consulta-contratos">Contratos</Link>

// Funcionalidades disponíveis:
// - Busca por número, prestador, serviço
// - Filtros por status e tipo
// - Visualização detalhada
// - Exportação Excel/PDF
```

### 3. Aprovar Notas Fiscais

```typescript
// Navegue para a página
<Link to="/gestao-pessoas/aprovacao-nf">Aprovação NF</Link>

// Funcionalidades disponíveis:
// - Visualizar NFs pendentes
// - Filtrar por período, status, CCA
// - Visualizar detalhes
// - Editar NFs em rascunho
// - Exportar para Excel
```

### 4. Gerar Relatórios

```typescript
// Navegue para a página
<Link to="/gestao-pessoas/relatorios-prestadores">Relatórios</Link>

// Fluxo:
// 1. Selecione módulos (contratos, NFs, férias, etc.)
// 2. Escolha colunas de cada módulo
// 3. Aplique filtros (datas, valores, status)
// 4. Clique em "Gerar relatório"
// 5. Exporte para Excel ou PDF
```

### 5. Usar Hooks em Novos Componentes

```typescript
import { usePrestadoresPJ } from "@/hooks/gestao-pessoas/usePrestadoresPJ";

function MeuComponente() {
  const { data: prestadores, isLoading } = usePrestadoresPJ();

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      {prestadores.map(p => (
        <div key={p.id}>{p.nomeCompleto}</div>
      ))}
    </div>
  );
}
```

---

## 📚 Documentação Técnica

### Documentos Disponíveis

1. **[Hooks - Documentação Completa](./gestao-pessoas-prestadores-hooks.md)**
   - Descrição de todos os 8 hooks
   - Funcionalidades de cada hook
   - Mapeamento completo de campos
   - Exemplos de uso

2. **[Integração Supabase](./gestao-pessoas-prestadores-integracao.md)**
   - Tabelas utilizadas
   - Relacionamentos
   - Fluxos de dados
   - Páginas atualizadas
   - Arquivos removidos
   - Considerações de segurança
   - Próximos passos

3. **[Este Documento](./README-GESTAO-PESSOAS-PRESTADORES.md)**
   - Visão geral do módulo
   - Status de implementação
   - Como usar

---

## 🎯 Roadmap

### Fase 1-6: ✅ Concluídas
- Criação de 8 hooks
- Integração com Supabase
- Atualização de páginas principais
- Remoção de dados mock
- Documentação completa

### Fase 7: 🚧 Em Planejamento
- Autenticação e permissões
- Upload de arquivos
- Validações avançadas
- Páginas faltantes
- Testes automatizados

---

## 📞 Suporte

Para dúvidas técnicas sobre o módulo:
1. Consulte a documentação técnica detalhada
2. Verifique os exemplos de uso nos hooks
3. Revise o código das páginas implementadas

---

## 📝 Changelog

### v2.0.0 - Integração Supabase (Atual)
- ✅ 8 hooks implementados
- ✅ 4 páginas atualizadas
- ✅ Dados mock removidos
- ✅ Documentação completa

### v1.0.0 - Versão Mock
- ⚠️ Dados fictícios em services
- ⚠️ Sem persistência
- ⚠️ Sem backend

---

**Status Geral:** 🟢 Pronto para uso (com ressalvas de autenticação e RLS)
