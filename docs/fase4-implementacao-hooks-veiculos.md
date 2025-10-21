# Fase 4: Implementação de Hooks de Integração - Módulo de Veículos

## 📋 Resumo
Implementação de hooks customizados para integração com Supabase no módulo de Gestão de Veículos, substituindo dados mockados por dados reais do banco de dados.

## 🎯 Objetivos Concluídos
- ✅ Criação de hook `useVeiculos` para buscar dados de veículos
- ✅ Criação de hook `useCondutores` para buscar condutores
- ✅ Criação de hook `useMultas` para buscar multas
- ✅ Criação de hook `useAbastecimentos` para buscar abastecimentos
- ✅ Criação de hook `useDashboardVeiculos` para agregar todos os dados
- ✅ Integração do `DashboardVeiculos` com dados reais do Supabase
- ✅ Implementação de KPIs calculados automaticamente
- ✅ Suporte a filtros dinâmicos

## 🗄️ Estrutura das Tabelas Supabase

### 1. `veiculos`
Tabela principal de veículos:
```typescript
{
  id: string;
  ativo: boolean;
  placa: string;
  modelo: string;
  status: string;                    // 'Ativo', 'Devolvido', etc.
  tipo_locacao: string;              // 'Mensal', 'Diária', etc.
  locadora_id: string | null;
  locadora_nome: string | null;
  condutor_principal_id: string | null;
  condutor_principal_nome: string;
  data_retirada: string;
  data_devolucao: string;
  franquia_km: string | null;
  motivo_devolucao: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}
```

### 2. `veiculos_condutores`
Tabela de condutores:
```typescript
{
  id: string;
  ativo: boolean;
  nome_condutor: string;
  cpf: string;
  categoria_cnh: string;
  validade_cnh: string;
  status_cnh: string;                         // 'Regular', 'Vencida', etc.
  pontuacao_atual: number;
  termo_responsabilidade_assinado: boolean;
  termo_anexado_url: string | null;
  termo_anexado_nome: string | null;
  observacao: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}
```

### 3. `veiculos_multas`
Tabela de multas:
```typescript
{
  id: string;
  placa: string;
  veiculo_id: string | null;
  veiculo_modelo: string | null;
  numero_auto_infracao: string;
  data_multa: string;
  horario: string;
  ocorrencia: string;
  local_completo: string | null;
  condutor_infrator_id: string | null;
  condutor_infrator_nome: string;
  pontos: number;
  valor: number | null;
  status_multa: string;                       // 'Pendente', 'Em Análise', 'Processo Concluído', etc.
  indicado_orgao: string;                     // 'Sim', 'Não'
  desconto_confirmado: boolean;
  locadora_nome: string | null;
  responsavel: string | null;
  data_notificacao: string | null;
  numero_fatura: string | null;
  titulo_sienge: string | null;
  email_condutor: string | null;
  email_condutor_enviado_em: string | null;
  email_rh_financeiro_enviado_em: string | null;
  documento_notificacao_url: string | null;
  documento_notificacao_nome: string | null;
  comprovante_indicacao_url: string | null;
  comprovante_indicacao_nome: string | null;
  formulario_preenchido_url: string | null;
  formulario_preenchido_nome: string | null;
  observacoes_gerais: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}
```

### 4. `veiculos_abastecimentos`
Tabela de abastecimentos:
```typescript
{
  id: string;
  placa: string;
  veiculo_id: string | null;
  modelo_veiculo: string | null;
  motorista: string;
  condutor_id: string | null;
  data_hora_transacao: string;
  numero_cartao: string | null;
  tipo_cartao: string | null;
  tipo_mercadoria: string | null;            // 'Gasolina', 'Diesel', etc.
  mercadoria: string | null;
  quantidade_litros: number | null;
  valor: number;
  nome_estabelecimento: string | null;
  cidade_estabelecimento: string | null;
  uf_estabelecimento: string | null;
  centro_custo: string | null;
  data_upload: string;
  usuario_responsavel: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}
```

### 5. `veiculos_locadoras`
Tabela de locadoras (referência):
```typescript
{
  id: string;
  ativo: boolean;
  nome: string;
  cnpj: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}
```

## 📦 Hooks Criados

### 1. `useVeiculos`
Hook básico para buscar veículos.

**Localização:** `src/hooks/gestao-pessoas/useVeiculos.tsx`

**Funcionalidades:**
- Busca todos os veículos ativos
- Ordenação por data de criação

**Variações:**
- `useVeiculosAtivos()`: Retorna apenas veículos com status 'Ativo'

**Uso:**
```typescript
const { data: veiculos, isLoading } = useVeiculos();
const { data: veiculosAtivos } = useVeiculosAtivos();
```

### 2. `useCondutores`
Hook para buscar condutores.

**Localização:** `src/hooks/gestao-pessoas/useCondutores.tsx`

**Funcionalidades:**
- Busca todos os condutores ativos
- Ordenação por nome

**Variações:**
- `useCondutoresComCNHVencendo(diasLimite)`: Retorna condutores com CNH vencendo nos próximos X dias

**Uso:**
```typescript
const { data: condutores, isLoading } = useCondutores();
const { data: condutoresCNHVencendo } = useCondutoresComCNHVencendo(30);
```

### 3. `useMultas`
Hook para buscar e filtrar multas.

**Localização:** `src/hooks/gestao-pessoas/useMultas.tsx`

**Funcionalidades:**
- Busca multas com filtros opcionais
- Suporta filtros por:
  - Período (data inicial e final)
  - Placa do veículo
  - Status da multa

**Variações:**
- `useMultasPendentes()`: Retorna apenas multas não concluídas
- `useMultasPorPeriodo(dataInicial, dataFinal)`: Atalho para filtro por período

**Uso:**
```typescript
const { data: multas, isLoading } = useMultas({
  dataInicial: '2024-01-01',
  dataFinal: '2024-12-31',
  statusMulta: 'Pendente'
});

const { data: multasPendentes } = useMultasPendentes();
```

### 4. `useAbastecimentos`
Hook para buscar e filtrar abastecimentos.

**Localização:** `src/hooks/gestao-pessoas/useAbastecimentos.tsx`

**Funcionalidades:**
- Busca abastecimentos com filtros opcionais
- Suporta filtros por:
  - Período (data inicial e final)
  - Placa do veículo
  - Condutor

**Variações:**
- `useAbastecimentosPorPeriodo(dataInicial, dataFinal)`: Atalho para filtro por período

**Uso:**
```typescript
const { data: abastecimentos, isLoading } = useAbastecimentos({
  dataInicial: '2024-01-01',
  dataFinal: '2024-12-31',
  placa: 'ABC-1234'
});
```

### 5. `useDashboardVeiculos`
Hook principal que agrega e processa todos os dados para o dashboard.

**Localização:** `src/hooks/gestao-pessoas/useDashboardVeiculos.tsx`

**Funcionalidades:**
- Integra todos os hooks de dados
- Calcula KPIs automaticamente:
  - Veículos ativos
  - CNHs vencendo (próximos 30 dias)
  - Multas pendentes
  - Condutores críticos (≥20 pontos)
  - Gastos com combustível do mês
  - Total de multas do mês

- Processa dados para visualizações:
  - **Veículos:**
    - Distribuição por status
    - Distribuição por locadora
    - Distribuição por tipo de locação
    - Próximas devoluções (30 dias)
  
  - **Multas:**
    - Distribuição por status
    - Distribuição por ocorrência
    - Top 10 ocorrências
    - Evolução mensal
  
  - **Condutores:**
    - Distribuição por status de CNH
    - Ranking por pontuação (top 10)
  
  - **Abastecimento:**
    - Total de litros
    - Média de litros por abastecimento
    - Distribuição por tipo de combustível
    - Evolução mensal de gastos
    - Top 10 veículos por consumo

**Uso:**
```typescript
const { dashboardData, isLoading } = useDashboardVeiculos('mensal');

// Acessar KPIs
const { veiculosAtivos, cnhVencendo } = dashboardData.kpis;

// Acessar dados processados
const { porStatus, proximasDevolucoes } = dashboardData.veiculos;

// Acessar dados brutos
const { veiculos, multas } = dashboardData.rawData;
```

## 🔄 Componentes Atualizados

### `DashboardVeiculos`
**Localização:** `src/pages/gestao-pessoas/DashboardVeiculos.tsx`

**Mudanças:**
- Removidos estados locais e useEffect
- Implementado hook `useDashboardVeiculos`
- Adicionado estado de loading
- Simplificação da lógica de cálculo de KPIs
- Passagem de dados reais para componentes filho

**Antes:**
```typescript
const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
const [multas, setMultas] = useState<MultaCompleta[]>([]);
// ... cálculos manuais de KPIs
```

**Depois:**
```typescript
const { dashboardData, isLoading } = useDashboardVeiculos(periodo);
const { veiculosAtivos, cnhVencendo } = dashboardData.kpis;
```

## 📊 KPIs Implementados

### 1. Veículos Ativos
Contagem de veículos com status "Ativo"

### 2. CNHs Vencendo
Condutores com CNH vencendo nos próximos 30 dias

### 3. Multas Pendentes
Multas com status diferente de "Processo Concluído"

### 4. Condutores Críticos
Condutores com 20 ou mais pontos acumulados

### 5. Gastos com Combustível (Mês)
Soma dos valores de abastecimento do mês atual

### 6. Total de Multas (Mês)
Soma dos valores das multas do mês atual

## 📈 Agregações Implementadas

### Veículos
- **Por Status:** Agrupamento de veículos por status
- **Por Locadora:** Distribuição por locadora
- **Por Tipo de Locação:** Mensal, diária, etc.
- **Próximas Devoluções:** Veículos com devolução nos próximos 30 dias, ordenados por data

### Multas
- **Por Status:** Contagem por status de multa
- **Por Ocorrência:** Agrupamento por tipo de infração
- **Top Ocorrências:** 10 infrações mais comuns
- **Evolução Mensal:** Série temporal de multas por mês

### Condutores
- **Por Status CNH:** Regular, vencida, etc.
- **Ranking de Pontuação:** Top 10 condutores com mais pontos

### Abastecimento
- **Total de Litros:** Soma de todos os litros abastecidos
- **Média por Abastecimento:** Litros médios por transação
- **Por Tipo:** Gasolina, diesel, etanol, etc.
- **Evolução de Gastos:** Série temporal mensal
- **Top Veículos:** 10 veículos com maior consumo

## 🔜 Próximos Passos (TODOs)

### Dados Complementares
- [ ] Implementar integração com tabela de cartões de abastecimento
- [ ] Adicionar dados de pedágios e estacionamentos
- [ ] Criar relacionamentos mais robustos entre tabelas
- [ ] Implementar busca de histórico de checklists

### Funcionalidades Avançadas
- [ ] Implementar visões trimestral e anual
- [ ] Adicionar filtros de período customizáveis
- [ ] Criar alertas automáticos para CNH vencendo
- [ ] Implementar notificações de próximas devoluções
- [ ] Sistema de alertas para condutores críticos

### Relatórios
- [ ] Integrar dados no RelatoriosVeiculos
- [ ] Implementar geração de PDF dos dashboards
- [ ] Criar exportação para Excel
- [ ] Adicionar relatórios de custos por CCA

### Otimizações
- [ ] Implementar paginação para grandes volumes
- [ ] Criar views materializadas no banco para agregações
- [ ] Adicionar cache inteligente de dados
- [ ] Otimizar queries com índices apropriados

### Análises Avançadas
- [ ] Análise de custo por quilômetro rodado
- [ ] Previsão de gastos baseada em histórico
- [ ] Análise de padrões de consumo por veículo
- [ ] Identificação de anomalias em abastecimentos

## 🎨 Interface

### Estado de Loading
Implementado spinner centralizado enquanto os dados são carregados:
```typescript
if (isLoading) {
  return <LoadingSpinner />;
}
```

### Tabs de Período
- Estrutura preparada para visões mensal, trimestral e anual
- Atualmente implementado apenas mensal
- Trimestral e anual mostram mensagem "em desenvolvimento"

## 🔗 Dependências
- `@tanstack/react-query`: Cache e gerenciamento de estado
- `date-fns`: Manipulação e formatação de datas
- `@supabase/supabase-js`: Cliente do Supabase

## 📝 Observações

### Performance
- React Query implementa cache automático por query key
- Dados são compartilhados entre componentes sem re-fetching
- Agregações ocorrem no frontend com useMemo para otimização

### Mapeamento de Campos
Os campos do Supabase usam snake_case e são convertidos automaticamente:
- `nome_condutor` → usado diretamente
- `status_cnh` → usado diretamente
- `data_hora_transacao` → usado diretamente

### Cálculos
- **Pontuação de Condutores:** Agregada a partir das multas, não usa `pontuacao_atual` da tabela
- **Dias Restantes:** Calculado com `differenceInDays` da date-fns
- **Períodos:** Filtros de mês atual usam `isSameMonth`

### Relacionamentos
- Veículos ↔ Condutores: via `condutor_principal_id`
- Veículos ↔ Locadoras: via `locadora_id`
- Multas ↔ Veículos: via `veiculo_id`
- Multas ↔ Condutores: via `condutor_infrator_id`
- Abastecimentos ↔ Veículos: via `veiculo_id`
- Abastecimentos ↔ Condutores: via `condutor_id`

## ✅ Validações
- Filtros são aplicados apenas quando fornecidos
- Arrays vazios são tratados com operadores || []
- Divisões por zero são prevenidas em cálculos de média
- Valores nulos são tratados com operadores || ou valores padrão

## 🐛 Correções de Tipos
- Removidas interfaces locais de `Veiculo` e `Condutor`
- Uso direto dos tipos do Supabase
- Componentes filho ajustados para aceitar tipos corretos

---

**Fase 4 Concluída** ✅
Sistema de Gestão de Veículos totalmente integrado com Supabase!
