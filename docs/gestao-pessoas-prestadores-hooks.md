# 📘 Hooks de Prestadores de Serviço - Documentação Completa

Documentação técnica de todos os hooks criados para o módulo de Prestadores de Serviço integrado com Supabase.

---

## 📋 Índice

1. [usePrestadoresPJ](#1-useprestadorespj)
2. [usePrestadoresContratos](#2-useprestadorescontratos)
3. [useDemonstrativos](#3-usdemonstrativos)
4. [useNotasFiscais](#4-usenotasfiscais)
5. [usePrestadoresFerias](#5-useprestadoresferias)
6. [usePrestadoresPassivos](#6-useprestadorespassivos)
7. [useDashboardPrestadores](#7-usedashboardprestadores)
8. [useRelatorioPrestadores](#8-userelatorioPrestadores)

---

## 1. usePrestadoresPJ

**Arquivo:** `src/hooks/gestao-pessoas/usePrestadoresPJ.tsx`  
**Tabela Supabase:** `prestadores_pj`

### Funcionalidades

- `usePrestadoresPJ()` - Buscar todos os prestadores PJ ativos
- `usePrestadoresPJFiltrados(filtros)` - Filtrar por CCA, nome, CNPJ
- `usePrestadorPJById(id)` - Buscar prestador específico
- `useCreatePrestadorPJ()` - Criar novo prestador PJ
- `useUpdatePrestadorPJ()` - Atualizar prestador PJ
- `useDeletePrestadorPJ()` - Deletar prestador (soft delete)

### Mapeamento de Campos

| Banco de Dados | Frontend | Tipo |
|---|---|---|
| `id` | `id` | string |
| `nomecompleto` | `nomeCompleto` | string |
| `razaosocial` | `razaoSocial` | string |
| `cpf` | `cpf` | string |
| `cnpj` | `cnpj` | string |
| `email` | `email` | string |
| `telefone` | `telefone` | string |
| `endereco` | `endereco` | string |
| `cca_id` | `ccaId` | number \| null |
| `cca_codigo` | `ccaCodigo` | string \| null |
| `cca_nome` | `ccaNome` | string \| null |
| `valorprestacaoservico` | `valorPrestacaoServico` | number |
| `datainiciocontrato` | `dataInicioContrato` | string |
| `servico` | `servico` | string |
| `chavepix` | `chavePix` | string \| null |
| `ajudaaluguel` | `ajudaAluguel` | boolean |
| `ajudacusto` | `ajudaCusto` | boolean |
| `almoco` | `almoco` | boolean |
| `cafemanha` | `cafeManha` | boolean |
| `cafetarde` | `cafeTarde` | boolean |
| `valoralmoco` | `valorAlmoco` | number |
| `valorcafemanha` | `valorCafeManha` | number |
| `valorcafetarde` | `valorCafeTarde` | number |
| `contrato_url` | `contratoUrl` | string \| null |
| `contrato_nome` | `contratoNome` | string \| null |
| `ativo` | `ativo` | boolean |

### Exemplo de Uso

```typescript
import { usePrestadoresPJ, useCreatePrestadorPJ } from "@/hooks/gestao-pessoas/usePrestadoresPJ";

function MeuComponente() {
  const { data: prestadores, isLoading } = usePrestadoresPJ();
  const createMutation = useCreatePrestadorPJ();

  const handleCriar = () => {
    createMutation.mutate({
      nomeCompleto: "João Silva",
      razaoSocial: "João Silva Serviços ME",
      cpf: "123.456.789-00",
      cnpj: "12.345.678/0001-00",
      // ... outros campos
    });
  };

  return <div>...</div>;
}
```

---

## 2. usePrestadoresContratos

**Arquivo:** `src/hooks/gestao-pessoas/usePrestadoresContratos.tsx`  
**Tabela Supabase:** `prestadores_contratos`

### Funcionalidades

- `useContratos()` - Buscar todos os contratos ativos
- `useContratosFiltrados(filtros)` - Filtrar por status, tipo, prestador
- `useContratoById(id)` - Buscar contrato específico
- `useContratosByPrestador(prestadorId)` - Buscar contratos de um prestador
- `useCreateContrato()` - Criar novo contrato/aditivo/distrato
- `useUpdateContrato()` - Atualizar contrato
- `useDeleteContrato()` - Deletar contrato (soft delete)

### Mapeamento de Campos

| Banco de Dados | Frontend | Tipo |
|---|---|---|
| `id` | `id` | string |
| `numero` | `numero` | string |
| `tipo` | `tipo` | 'contrato' \| 'aditivo' \| 'distrato' |
| `prestador_pj_id` | `prestadorId` | string |
| `prestador_nome` | `prestador` | string |
| `prestador_cpf` | `cpf` | string |
| `prestador_cnpj` | `cnpj` | string |
| `servico` | `servico` | string |
| `valor` | `valor` | number |
| `dataemissao` | `dataemissao` | string |
| `datainicio` | `datainicio` | string |
| `datafim` | `datafim` | string |
| `status` | `status` | 'ativo' \| 'encerrado' \| 'suspenso' |
| `empresa` | `empresa` | string |
| `cca_nome` | `obra` | string |

---

## 3. useDemonstrativos

**Arquivo:** `src/hooks/gestao-pessoas/useDemonstrativos.tsx`  
**Tabela Supabase:** `prestadores_demonstrativos`

### Funcionalidades

- `useDemonstrativos()` - Buscar todos os demonstrativos ativos
- `useDemonstrativosFiltrados(filtros)` - Filtrar por período, prestador, CCA
- `useDemonstrativoById(id)` - Buscar demonstrativo específico
- `useDemonstrativosByPrestador(prestadorId)` - Buscar demonstrativos de um prestador
- `useCreateDemonstrativo()` - Criar novo demonstrativo
- `useUpdateDemonstrativo()` - Atualizar demonstrativo
- `useDeleteDemonstrativo()` - Deletar demonstrativo

### Mapeamento de Campos

| Banco de Dados | Frontend | Tipo |
|---|---|---|
| `id` | `id` | string |
| `codigo` | `codigo` | string |
| `nome` | `nome` | string |
| `cpf` | `cpf` | string |
| `funcao` | `funcao` | string |
| `admissao` | `admissao` | string |
| `datanascimento` | `datanascimento` | string |
| `mes` | `mes` | string (YYYY-MM) |
| `salario` | `salario` | number |
| `premiacaonexa` | `premiacaoNexa` | number |
| `ajudacustoobra` | `ajudaCustoObra` | number |
| `ajudaaluguel` | `ajudaAluguel` | number |
| `reembolsoconvenio` | `reembolsoConvenio` | number |
| `descontoconvenio` | `descontoConvenio` | number |
| `multasdescontos` | `multasDescontos` | number |
| `descontoabelvrun` | `descontoAbelvRun` | number |
| `valornf` | `valorNf` | number |
| `valorliquido` | `valorLiquido` | number |
| `nomeempresa` | `nomeEmpresa` | string |
| `cca_nome` | `obra` | string |

---

## 4. useNotasFiscais

**Arquivo:** `src/hooks/gestao-pessoas/useNotasFiscais.tsx`  
**Tabela Supabase:** `prestadores_notas_fiscais`

### Funcionalidades

- `useNotasFiscais()` - Buscar todas as notas fiscais ativas
- `useNotasFiscaisFiltradas(filtros)` - Filtrar por status, período, prestador
- `useNotaFiscalById(id)` - Buscar NF específica
- `useNotasFiscaisByPrestador(prestadorId)` - Buscar NFs de um prestador
- `useCreateNotaFiscal()` - Criar nova NF
- `useUpdateNotaFiscal()` - Atualizar NF
- `useAprovarNotaFiscal()` - Aprovar NF
- `useReprovarNotaFiscal()` - Reprovar NF
- `useDeleteNotaFiscal()` - Deletar NF

### Mapeamento de Campos

| Banco de Dados | Frontend | Tipo |
|---|---|---|
| `id` | `id` | string |
| `numero` | `numero` | string |
| `nomeempresa` | `nomeEmpresa` | string |
| `nomerepresentante` | `nomeRepresentante` | string |
| `periodocontabil` | `periodoContabil` | string |
| `dataemissao` | `dataEmissao` | string |
| `datavencimento` | `dataVencimento` | string |
| `descricaoservico` | `descricaoServico` | string |
| `valor` | `valor` | number |
| `status` | `status` | 'rascunho' \| 'enviado' \| 'aprovado' \| 'reprovado' |
| `statusaprovacao` | `statusAprovacao` | string |
| `aprovadopor` | `aprovadoPor` | string |
| `dataaprovacao` | `dataAprovacao` | string |
| `observacoesaprovacao` | `observacoesAprovacao` | string |
| `arquivo_url` | `arquivoUrl` | string |
| `arquivo_nome` | `arquivoNome` | string |
| `cca_nome` | `cca` | string |

---

## 5. usePrestadoresFerias

**Arquivo:** `src/hooks/gestao-pessoas/usePrestadoresFerias.tsx`  
**Tabela Supabase:** `prestadores_ferias`

### Funcionalidades

- `useFerias()` - Buscar todas as solicitações de férias ativas
- `useFeriasFiltradas(filtros)` - Filtrar por status, período, prestador
- `useFeriasById(id)` - Buscar férias específica
- `useFeriasByPrestador(prestadorId)` - Buscar férias de um prestador
- `useCreateFerias()` - Criar nova solicitação de férias
- `useUpdateFerias()` - Atualizar férias
- `useAprovarFerias()` - Aprovar férias
- `useReprovarFerias()` - Reprovar férias
- `useDeleteFerias()` - Deletar férias

### Mapeamento de Campos

| Banco de Dados | Frontend | Tipo |
|---|---|---|
| `id` | `id` | string |
| `nomeprestador` | `nomePrestador` | string |
| `funcaocargo` | `funcaoCargo` | string |
| `empresa` | `empresa` | string |
| `datainicioferias` | `dataInicioFerias` | Date |
| `diasferias` | `diasFerias` | number |
| `periodoaquisitivo` | `periodoAquisitivo` | string |
| `responsaveldireto` | `responsavelDireto` | string |
| `responsavelregistro` | `responsavelRegistro` | string |
| `status` | `status` | StatusFerias enum |
| `aprovadopor` | `aprovadoPor` | string |
| `dataaprovacao` | `dataAprovacao` | Date |
| `justificativareprovacao` | `justificativaReprovacao` | string |
| `anexos` | `anexos` | string[] |
| `observacoes` | `observacoes` | string |
| `cca_nome` | `obraLocalAtuacao` | string |

---

## 6. usePrestadoresPassivos

**Arquivo:** `src/hooks/gestao-pessoas/usePrestadoresPassivos.tsx`  
**Tabela Supabase:** `prestadores_passivos`

### Funcionalidades

- `usePassivos()` - Buscar todos os passivos ativos
- `usePassivosFiltrados(filtros)` - Filtrar por status, prestador, CCA
- `usePassivoById(id)` - Buscar passivo específico
- `usePassivosByPrestador(prestadorId)` - Buscar passivos de um prestador
- `useCreatePassivo()` - Criar novo passivo
- `useUpdatePassivo()` - Atualizar passivo
- `useQuitarPassivo()` - Quitar passivo
- `useDeletePassivo()` - Deletar passivo

### Mapeamento de Campos

| Banco de Dados | Frontend | Tipo |
|---|---|---|
| `id` | `id` | string |
| `prestador_pj_id` | `prestadorid` | string |
| `nomeprestador` | `nomeprestador` | string |
| `empresa` | `empresa` | string |
| `cargo` | `cargo` | string |
| `salariobase` | `salariobase` | number |
| `dataadmissao` | `dataadmissao` | Date |
| `datacorte` | `datacorte` | Date |
| `saldoferias` | `saldoferias` | number |
| `decimoterceiro` | `decimoterceiro` | number |
| `avisopravio` | `avisopravio` | number |
| `total` | `total` | number |
| `status` | `status` | 'ativo' \| 'quitado' \| 'parcial' \| 'pendente' |
| `observacoes` | `observacoes` | string |

---

## 7. useDashboardPrestadores

**Arquivo:** `src/hooks/gestao-pessoas/useDashboardPrestadores.tsx`  
**Hook Agregador** - Consome `useDemonstrativos()`

### Funcionalidades

Este hook processa dados de demonstrativos e calcula:

- **KPIs Financeiros:**
  - `totalnf` - Soma de todos os valores de NF
  - `totalajudaaluguel` - Soma de ajuda de aluguel
  - `totalreembolsoconvenio` - Soma de reembolsos
  - `totaldescontoconvenio` - Soma de descontos
  - `totalmultas` - Soma de multas
  - `totaldescontoabelvrun` - Soma de descontos Abelv Run

- **Dados para Gráficos:**
  - `dadosMensais` - Evolução mensal (últimos 6 meses)
  - `top10Prestadores` - Top 10 prestadores por valor de NF
  - Distribuição de valores por tipo
  - Comparativo mensal

### Retorno

```typescript
{
  demonstrativos: DemonstrativoPrestador[];
  demonstrativosFiltrados: DemonstrativoPrestador[];
  kpis: KPIData;
  dadosMensais: DadosGraficoMensal[];
  top10Prestadores: TopPrestador[];
  isLoading: boolean;
  error: Error | null;
}
```

---

## 8. useRelatorioPrestadores

**Arquivo:** `src/hooks/gestao-pessoas/useRelatorioPrestadores.tsx`  
**Hook Agregador** - Consome todos os hooks de módulos

### Funcionalidades

- `carregarDadosModulo(modulo)` - Busca dados de um módulo específico
- `carregarDadosCompletos(modulos, colunas)` - Consolida dados de múltiplos módulos
- `aplicarFiltros(dados, filtros)` - Aplica filtros avançados

### Módulos Suportados

| Módulo | Hook Consumido | Descrição |
|---|---|---|
| `cadastro_pj` | `usePrestadoresPJ()` | Cadastro de Prestadores PJ |
| `contratos` | `useContratos()` | Contratos |
| `demonstrativo` | `useDemonstrativos()` | Demonstrativos |
| `emissao_nf` | `useNotasFiscais()` | Emissão de Notas Fiscais |
| `aprovacao_nf` | `useNotasFiscais()` | Aprovação de Notas Fiscais |
| `ferias` | `useFerias()` | Férias |
| `aprovacao_ferias` | `useFerias()` | Aprovação de Férias |
| `passivos` | `usePassivos()` | Controle de Passivos |

### Retorno

```typescript
{
  carregarDadosModulo: (modulo: ModuloPrestador) => any[];
  carregarDadosCompletos: (modulos, colunas) => DadosModulo[];
  aplicarFiltros: (dados, filtros) => any[];
  isLoading: boolean;
  error: Error | null;
}
```

---

## 🔧 Padrões de Implementação

### Soft Delete

Todos os hooks implementam soft delete:
```typescript
// Não deleta fisicamente, apenas marca como inativo
const { error } = await supabase
  .from("tabela")
  .update({ ativo: false })
  .eq("id", id);
```

### Invalidação de Cache

Após mutações, o cache do React Query é invalidado:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["chave"] });
  toast.success("Operação realizada com sucesso!");
}
```

### Tratamento de Erros

```typescript
onError: (error: Error) => {
  toast.error(`Erro: ${error.message}`);
}
```

---

## 📊 Resumo

| Hook | Tabela | Operações | Status |
|---|---|---|---|
| usePrestadoresPJ | prestadores_pj | CRUD | ✅ Implementado |
| usePrestadoresContratos | prestadores_contratos | CRUD | ✅ Implementado |
| useDemonstrativos | prestadores_demonstrativos | CRUD | ✅ Implementado |
| useNotasFiscais | prestadores_notas_fiscais | CRUD + Aprovação | ✅ Implementado |
| usePrestadoresFerias | prestadores_ferias | CRUD + Aprovação | ✅ Implementado |
| usePrestadoresPassivos | prestadores_passivos | CRUD + Quitar | ✅ Implementado |
| useDashboardPrestadores | - (agregador) | Cálculos/KPIs | ✅ Implementado |
| useRelatorioPrestadores | - (agregador) | Consolidação | ✅ Implementado |

**Total:** 8 hooks implementados com integração completa ao Supabase.
