# Fase 3: Implementação de Hooks de Integração - Módulo de Viagens

## 📋 Resumo
Implementação de hooks customizados para integração com Supabase no módulo de Gestão de Viagens, substituindo dados mockados por dados reais do banco de dados.

## 🎯 Objetivos Concluídos
- ✅ Criação de hook `useFaturasViagens` para buscar dados de faturas
- ✅ Criação de hook `useDashboardViagens` para processar e agregar dados do dashboard
- ✅ Integração do `GestaoViagensDashboard` com dados reais do Supabase
- ✅ Implementação de filtros dinâmicos de consulta
- ✅ Cálculos automáticos de estatísticas e agregações

## 🗄️ Estrutura da Tabela Supabase

### `faturas_viagens_integra`
Tabela principal que armazena os registros detalhados de viagens:

```typescript
{
  id: string;
  dataemissaofat: string;        // Data de emissão da fatura
  agencia: string;                // 'Onfly' | 'Biztrip'
  numerodefat: string;            // Número da fatura
  protocolo: string;              // Protocolo da viagem
  datadacompra: string;           // Data da compra
  viajante: string;               // Nome do viajante
  tipo: string;                   // 'aereo' | 'hospedagem' | 'rodoviario' | 'cancelamento'
  hospedagem: string | null;      // Nome do hotel (para tipo hospedagem)
  origem: string;                 // Origem da viagem
  destino: string;                // Destino da viagem
  checkin: string | null;         // Data de check-in (hospedagem)
  checkout: string | null;        // Data de check-out (hospedagem)
  comprador: string;              // Nome do comprador/solicitante
  valorpago: number;              // Valor pago
  motivoevento: string;           // Motivo/evento da viagem
  cca: string;                    // Código do centro de custo
  centrodecusto: string;          // Descrição do centro de custo
  antecedencia: number | null;    // Dias de antecedência da compra
  ciaida: string | null;          // Companhia aérea de ida
  ciavolta: string | null;        // Companhia aérea de volta
  possuibagagem: string;          // 'Sim' | 'Não'
  valorpagodebagagem: number | null;
  observacao: string | null;
  quemsolicitouforapolitica: string | null;
  dentrodapolitica: string;       // 'Sim' | 'Não'
  codconta: string | null;
  contafinanceira: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}
```

## 📦 Hooks Criados

### 1. `useFaturasViagens`
Hook para buscar e filtrar faturas de viagens do Supabase.

**Localização:** `src/hooks/gestao-pessoas/useFaturasViagens.tsx`

**Funcionalidades:**
- Busca faturas da tabela `faturas_viagens_integra`
- Suporta múltiplos filtros:
  - Período (data inicial e final)
  - Agência (Onfly/Biztrip)
  - Tipo de serviço (aéreo/hospedagem/rodoviário)
  - CCA (Centro de Custo)
  - Nome do viajante
  - Dentro/fora da política
- Conversão automática do formato Supabase para `FaturaIntegra`
- Cache automático via React Query

**Uso:**
```typescript
const { data: faturas, isLoading } = useFaturasViagens({
  dataInicial: '2024-01-01',
  dataFinal: '2024-12-31',
  agencia: ['Onfly'],
  tipo: ['aereo', 'hospedagem']
});
```

### 2. `useDashboardViagens`
Hook para processar e agregar dados para o dashboard de viagens.

**Localização:** `src/hooks/gestao-pessoas/useDashboardViagens.tsx`

**Funcionalidades:**
- Utiliza `useFaturasViagens` internamente
- Calcula automaticamente:
  - **Resumo Geral:** total gasto por tipo de serviço
  - **Reservas por Modal:** quantidade de reservas por tipo
  - **Antecedência Média:** média de dias de antecedência por modal
  - **Cancelamentos:** quantidade de cancelamentos por modal
  - **Detalhes Aéreo:** 
    - Ticket médio dentro/fora da política
    - Companhias aéreas mais usadas
    - Trechos mais comuns
  - **Detalhes Hotel:**
    - Hotéis mais usados
    - Cidades mais visitadas
    - Ticket médio
  - **Detalhes Rodoviário:**
    - Rotas mais comuns
    - Ticket médio
  - **Análise por CCA:**
    - Gastos por centro de custo
    - Total de viagens por CCA

**Uso:**
```typescript
const { dashboardData, isLoading, faturas } = useDashboardViagens(
  '2024-01-01',
  '2024-12-31',
  ['CCA001', 'CCA002'] // Opcional
);
```

## 🔄 Componentes Atualizados

### `GestaoViagensDashboard`
**Localização:** `src/pages/gestao-pessoas/GestaoViagensDashboard.tsx`

**Mudanças:**
- Removido estado local com dados mockados
- Implementado hook `useDashboardViagens` para dados reais
- Adicionado estado de loading
- Período padrão: últimos 3 meses
- Importação de `date-fns` para manipulação de datas

**Antes:**
```typescript
const [dashboardData] = useState({ /* dados mockados */ });
```

**Depois:**
```typescript
const [dataInicial] = useState(() => format(subMonths(new Date(), 3), 'yyyy-MM-dd'));
const [dataFinal] = useState(() => format(new Date(), 'yyyy-MM-dd'));
const { dashboardData, isLoading } = useDashboardViagens(dataInicial, dataFinal);
```

## 📊 Agregações Implementadas

### 1. Resumo Geral
- Soma total de gastos por tipo de serviço
- Total geral de gastos

### 2. Reservas por Modal
- Contagem de registros por tipo de serviço

### 3. Antecedência Média
- Média aritmética dos dias de antecedência
- Filtrado por modal
- Ignora registros sem antecedência informada

### 4. Cancelamentos
- Identificados pelo tipo 'cancelamento'
- Classificados por modal usando observações

### 5. Detalhes por Modal
#### Aéreo:
- Agrupamento por companhias aéreas
- Separação dentro/fora da política
- Top 10 trechos mais utilizados
- Cálculos de ticket médio

#### Hotel:
- Top 10 hotéis mais usados
- Top 10 cidades mais visitadas
- Gastos totais e médios

#### Rodoviário:
- Top 10 rotas mais comuns
- Ticket médio

### 6. Análise por CCA
- Gastos separados por tipo (aéreo/hotel/rodoviário)
- Total de viagens por CCA
- Descrição do centro de custo

## 🔜 Próximos Passos (TODOs)

### Dados Complementares
- [ ] Implementar busca de orçamento total por CCA
- [ ] Adicionar campo de empresa rodoviária na tabela
- [ ] Implementar lógica de viagens nacionais vs internacionais
- [ ] Adicionar informação de viagens com/sem acordo
- [ ] Implementar cálculo de emissão de CO2

### Funcionalidades Avançadas
- [ ] Implementar dados de tempo de aprovação
- [ ] Criar filtros de período no frontend
- [ ] Adicionar filtros por CCA específico
- [ ] Implementar cache inteligente com invalidação
- [ ] Adicionar paginação para grandes volumes de dados

### Relatórios e Exportação
- [ ] Integrar com sistema de geração de PDF
- [ ] Implementar envio de email com seleção de gráficos
- [ ] Criar relatórios personalizados

### Otimizações
- [ ] Implementar agregações no banco de dados (views materializadas)
- [ ] Adicionar índices para queries mais rápidas
- [ ] Implementar paginação infinita
- [ ] Cache de agregações frequentes

## 🎨 Interface

### Estado de Loading
Implementado spinner de carregamento enquanto os dados são buscados:
```typescript
if (isLoading) {
  return <LoadingSpinner />;
}
```

### Período Padrão
- Últimos 3 meses de dados
- Calculado automaticamente usando `date-fns`

## 🔗 Dependências
- `@tanstack/react-query`: Gerenciamento de cache e estado
- `date-fns`: Manipulação de datas
- `@supabase/supabase-js`: Cliente do Supabase

## 📝 Observações

### Performance
- React Query implementa cache automático
- Queries são invalidadas automaticamente
- Agregações são feitas no frontend (considerar mover para backend em produção)

### Mapeamento de Campos
Alguns campos têm nomes diferentes entre Supabase e frontend:
- `dataemissaofat` → `dataEmissaoFat`
- `numerodefat` → `numeroDeFat`
- `datadacompra` → `dataDaCompra`
- `centrodecusto` → `descricaoCentroDeCusto`
- `dentrodapolitica` → `dentroDaPolitica`

### Tipos
- Frontend usa `FaturaIntegra` do arquivo de tipos
- Conversão automática de snake_case (Supabase) para camelCase (Frontend)
- Valores nulos são convertidos para strings vazias ou zeros quando apropriado

## ✅ Validações
- Filtros são aplicados apenas quando fornecidos
- Arrays vazios são tratados adequadamente
- Divisões por zero são prevenidas em cálculos de média
- Valores nulos são tratados com defaults seguros

---

**Fase 3 Concluída** ✅
Próxima fase: Implementação de hooks para o módulo de Veículos
