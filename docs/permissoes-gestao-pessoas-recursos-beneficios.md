# Permissões: Gestão de Pessoas - Recursos & Benefícios

## Estrutura de Permissões

### Solicitações de Serviços (5 permissões)

| Slug | Descrição | Acesso |
|------|-----------|--------|
| `gestao_pessoas_solicitacoes_dashboard` | Visualizar dashboard/KPIs de solicitações | Menu + Rota |
| `gestao_pessoas_solicitacoes_criar` | Criar novas solicitações de serviços | Menu + Rota |
| `gestao_pessoas_solicitacoes_visualizar` | Visualizar e controlar solicitações | Menu + Rota |
| `gestao_pessoas_solicitacoes_aprovar` | Aprovar/reprovar solicitações | Menu + Rota |
| `gestao_pessoas_solicitacoes_relatorios` | Acessar relatórios de solicitações | Menu + Rota |

### Gestão de Viagens (5 permissões)

| Slug | Descrição | Acesso |
|------|-----------|--------|
| `gestao_pessoas_viagens_dashboard` | Dashboard de viagens corporativas | Menu + Rota |
| `gestao_pessoas_viagens_cadastrar_fatura` | Cadastrar faturas de viagens | Menu + Rota |
| `gestao_pessoas_viagens_importar_fatura` | Importar faturas via arquivo | Menu + Rota |
| `gestao_pessoas_viagens_consultar_faturas` | Consultar histórico de faturas | Menu + Rota |
| `gestao_pessoas_viagens_relatorios` | Relatórios de viagens | Menu + Rota |

### Gestão de Veículos (20 permissões)

| Slug | Descrição | Acesso |
|------|-----------|--------|
| `gestao_pessoas_veiculos_dashboard` | Dashboard consolidado de veículos | Menu + Rota |
| `gestao_pessoas_veiculos_cadastrar` | Cadastrar novos veículos | Menu + Rota |
| `gestao_pessoas_veiculos_editar` | Editar dados de veículos | Funcionalidade |
| `gestao_pessoas_veiculos_visualizar` | Visualizar detalhes de veículos | Funcionalidade |
| `gestao_pessoas_veiculos_excluir` | Excluir veículos | Funcionalidade |
| `gestao_pessoas_veiculos_consultas` | Consultar veículos com filtros | Menu + Rota |
| `gestao_pessoas_veiculos_multas_cadastrar` | Cadastrar multas | Menu + Rota |
| `gestao_pessoas_veiculos_multas_visualizar` | Visualizar multas | Funcionalidade |
| `gestao_pessoas_veiculos_multas_editar` | Editar multas | Funcionalidade |
| `gestao_pessoas_veiculos_condutores_cadastrar` | Cadastrar condutores | Menu + Rota |
| `gestao_pessoas_veiculos_condutores_visualizar` | Visualizar condutores | Funcionalidade |
| `gestao_pessoas_veiculos_condutores_editar` | Editar condutores | Funcionalidade |
| `gestao_pessoas_veiculos_cartoes_cadastrar` | Cadastrar cartões de abastecimento | Menu + Rota |
| `gestao_pessoas_veiculos_cartoes_visualizar` | Visualizar cartões | Funcionalidade |
| `gestao_pessoas_veiculos_pedagios_cadastrar` | Cadastrar pedágios/estacionamento | Menu + Rota |
| `gestao_pessoas_veiculos_pedagios_visualizar` | Visualizar pedágios | Funcionalidade |
| `gestao_pessoas_veiculos_checklists_criar` | Criar checklists de veículos | Menu + Rota |
| `gestao_pessoas_veiculos_checklists_visualizar` | Visualizar checklists | Funcionalidade |
| `gestao_pessoas_veiculos_abastecimento_gerenciar` | Gerenciar controle de abastecimento | Menu + Rota |
| `gestao_pessoas_veiculos_relatorios` | Acessar relatórios de veículos | Menu + Rota |

## Hierarquia de Acesso

- **Admin Sistema**: Acesso total automático (sem necessidade de slugs específicos)
- **Gestores**: Precisam de slugs específicos atribuídos no perfil
- **Usuários**: Acesso limitado conforme slugs no perfil

## Como Atribuir Permissões

1. Acessar `/admin/perfis` ou `/admin/usuarios-perfis`
2. Editar o perfil do usuário
3. Adicionar os slugs desejados no campo `menus_sidebar`
4. Salvar alterações

## Migração Aplicada

- **Usuários afetados:** Todos com `tipo_usuario = 'administrador'`
- **Ação:** Adição automática de todos os 30 slugs de Recursos & Benefícios

## Validação de Acesso

O sistema valida permissões em duas camadas:
1. **Sidebar**: Itens de menu visíveis apenas se o usuário tiver o slug correspondente
2. **Rotas**: Guards bloqueiam acesso direto via URL sem a permissão necessária
