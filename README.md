# Controle de Atividades - SAP MOTTA 2035

Sistema de gerenciamento de tarefas com visualização Kanban e Gantt, integrado ao Supabase para armazenamento compartilhado.

## ✨ Funcionalidades

- 📋 **Gestão Completa de Tarefas**: Criar, editar e deletar atividades
- 🔄 **Visualizações Múltiplas**: Kanban e Gantt Chart
- 👥 **Colaboração**: Dados sincronizados entre usuários
- 📊 **Dashboard**: Estatísticas de progresso em tempo real
- 🎯 **Filtros**: Por status e responsável
- 💾 **Persistência**: Dados salvos no Supabase (compartilhado)

## 🛠️ Configuração do Supabase

### 1. Configurar Credenciais

No arquivo `src/lib/supabase.ts`, substitua pelas suas credenciais:

```typescript
const supabaseUrl = 'SUA_URL_DO_SUPABASE'
const supabaseAnonKey = 'SUA_CHAVE_ANONIMA'
```

### 2. Executar Migração

Execute o SQL em `supabase/migrations/001_create_tasks_table.sql` no SQL Editor do Supabase.

### 3. Migração Automática

- Ao acessar o sistema pela primeira vez, as tarefas do localStorage serão automaticamente migradas para o banco
- Dados ficam disponíveis para todos os usuários

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Supabase** para banco de dados
- **React Hook Form** + Zod para formulários
- **Lucide React** para ícones
- **Shadcn/ui** para componentes

## 📱 Como Usar

1. **Conecte ao Supabase** usando o botão verde na interface
2. **Configure as credenciais** no arquivo supabase.ts
3. **Execute a migração SQL** no Supabase
4. **Acesse o sistema** - dados serão migrados automaticamente

## 🔧 Status das Tarefas

- 🕐 **À Fazer** (todo)
- ⚡ **Fazendo** (doing) 
- ✅ **Feito** (done)
- 🚨 **Atrasado** (overdue)

## 👨‍💻 Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Fazer build
npm run build
```

## 📋 Próximas Melhorias

- [ ] Autenticação de usuários
- [ ] Notificações em tempo real
- [ ] Anexos de arquivos
- [ ] Relatórios avançados
- [ ] Integração com SharePoint

---

**Projeto SAP MOTTA 2035** - Sistema de Controle de Atividades