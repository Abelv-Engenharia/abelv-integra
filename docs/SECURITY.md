# Sistema de Segurança e Permissões

## Resumo da Implementação

O sistema agora possui **múltiplas camadas de proteção** para garantir que usuários apenas acessem funcionalidades permitidas pelo seu perfil:

### 1. **PermissionGuard** - Proteção em Nível de Componente
- Componente que envolve páginas específicas
- Verifica permissões antes de renderizar o conteúdo
- Exibe tela de "Acesso Negado" quando necessário

### 2. **useRouteProtection** - Proteção em Nível de Layout
- Hook que monitora mudanças de rota
- Redireciona automaticamente para o dashboard se o usuário não tiver permissão
- Exibe toast de aviso sobre acesso negado

### 3. **usePermissions** - Sistema Centralizado de Permissões
- Hook que centraliza toda lógica de verificação de permissões
- Integra com o sistema de perfis do Supabase
- Valida tanto permissões diretas quanto menus da sidebar

### 4. **SecurityAlert** - Monitoramento Proativo
- Componente que detecta usuários com perfis problemáticos
- Visível apenas para administradores
- Alerta sobre usuários sem perfil ou com permissões inválidas

## Mapeamento de Rotas e Permissões

### Sistema/Administração
- `/admin/usuarios` → `sistema_usuarios`
- `/admin/perfis` → `sistema_perfis`
- `/admin/ccas` → `sistema_ccas`
- `/admin/empresas` → `sistema_empresas`
- `/admin/funcionarios` → `sistema_funcionarios`

### Módulos Principais
- `/tarefas/*` → `tarefas_*`
- `/treinamentos/*` → `treinamentos_*`
- `/desvios/*` → `desvios_*`
- `/ocorrencias/*` → `ocorrencias_*`
- `/hora-seguranca/*` → `hora_seguranca_*`
- `/relatorios/*` → `relatorios_*`

## Como Funciona a Validação

1. **Usuário tenta acessar uma rota**
2. **useRouteProtection** verifica se a rota requer permissões especiais
3. **usePermissions** consulta o perfil do usuário no Supabase
4. **Se não tiver permissão:**
   - PermissionGuard exibe tela de erro
   - useRouteProtection redireciona + toast de aviso
5. **Se tiver permissão:** acesso liberado

## Configuração de Perfis

Para configurar permissões, acesse:
1. **Admin → Perfis**
2. **Editar perfil desejado**
3. **Selecionar módulos e submenus**
4. **Definir ações específicas** (editar, excluir, etc.)

## Auditoria e Logs

O sistema registra:
- Tentativas de acesso não autorizado
- Mudanças em perfis de usuário
- Usuários sem perfil definido
- Permissões mal configuradas

## Resolução de Problemas

### Usuário não consegue acessar módulo
1. Verificar se o perfil está atribuído corretamente
2. Verificar se o perfil tem as permissões necessárias
3. Verificar se os menus estão selecionados no perfil

### Usuário vê módulo na sidebar mas não consegue acessar
- Problema: menu selecionado mas permissão específica faltando
- Solução: verificar mapeamento de permissões no código

### Alertas de segurança constantes
1. Verificar usuários sem perfil no SecurityAlert
2. Atribuir perfis adequados
3. Verificar integridade dos dados de permissão

## Segurança Adicional

- **Validação em tempo real**: permissões verificadas a cada navegação
- **Fallback seguro**: usuários sem permissão sempre redirecionados
- **Logs de auditoria**: todas as tentativas de acesso registradas
- **Interface de alerta**: administradores notificados sobre problemas