# Arquivar - Frontend Operador

## Sobre o Projeto

O Arquivar é uma plataforma de gerenciamento de documentos empresariais que permite o armazenamento seguro, organização e controle de acesso a arquivos. Este repositório contém o frontend da aplicação voltado para operadores do sistema.

## Tecnologias Utilizadas

### Core
- **Next.js 15** - Framework React com foco em SSR e otimização de performance
- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática

### UI/UX
- **Tailwind CSS** - Framework CSS utility-first para estilização
- **Radix UI** - Biblioteca de componentes headless para acessibilidade
- **Shadcn/ui** - Componentes reutilizáveis baseados em Radix UI
- **Lucide React** - Ícones modernos e consistentes
- **React Dropzone** - Componente para upload de arquivos
- **Recharts** - Biblioteca para criação de gráficos
- **Sonner** - Sistema de notificações moderno

### Gerenciamento de Estado e Formulários
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP para requisições

### Performance e PWA
- **Next PWA** - Suporte a Progressive Web App
- **Next Themes** - Sistema de temas claro/escuro
- **Next Intl** - Internacionalização

## Por que essas tecnologias?

- **Next.js**: Escolhido pela sua excelente performance, SSR, e otimização automática de imagens
- **Radix UI + Tailwind**: Combinação que oferece acessibilidade e flexibilidade na estilização
- **TypeScript**: Adiciona segurança e melhor DX através da tipagem estática
- **Zod**: Validação type-safe integrada com TypeScript
- **PWA**: Permite instalação e funcionamento offline

## Estrutura do Projeto

\`\`\`
arquivar/
├── src/
│   ├── app/                    # Rotas e páginas
│   │   ├── account/           # Gestão de conta
│   │   ├── auth/              # Autenticação
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── employees/         # Gestão de funcionários
│   │   ├── file/             # Visualização de arquivos
│   │   └── organizations/     # Gestão de organizações
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes de UI base
│   │   └── [feature]/        # Componentes específicos
│   └── lib/                   # Utilitários e configurações
├── public/                    # Arquivos estáticos
└── prisma/                    # Schema do banco de dados
\`\`\`

## Principais Funcionalidades

1. **Dashboard**
   - Visualização de métricas
   - Gráficos de atividade
   - Estatísticas em tempo real

2. **Gerenciamento de Organizações**
   - CRUD de organizações
   - Gestão de planos
   - Controle de pagamentos

3. **Sistema de Arquivos**
   - Upload e download
   - Organização em pastas
   - Controle de permissões
   - Histórico de acesso

4. **Gestão de Usuários**
   - Controle de acesso
   - Atribuição de permissões
   - Monitoramento de atividades

## Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório
\`\`\`bash
git clone [url-do-repositorio]
\`\`\`

2. Instale as dependências
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. Configure as variáveis de ambiente
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Inicie o servidor de desenvolvimento
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

### Scripts Disponíveis

- \`npm run dev\` - Inicia o servidor de desenvolvimento com Turbopack
- \`npm run dev:n\` - Inicia o servidor de desenvolvimento sem Turbopack
- \`npm run build\` - Cria a build de produção
- \`npm run start\` - Inicia o servidor de produção
- \`npm run lint\` - Executa o linter

## Boas Práticas

1. **Componentes**
   - Uso de Server Components quando possível
   - Client Components apenas quando necessário
   - Componentes pequenos e reutilizáveis

2. **Performance**
   - Lazy loading de componentes pesados
   - Otimização de imagens
   - Minimização de JavaScript

3. **Estilização**
   - Mobile-first com Tailwind
   - Temas consistentes
   - Componentes acessíveis

4. **Estado**
   - Server-side quando possível
   - Client-side apenas para UI

## Contribuição

1. Fork o projeto
2. Crie sua branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request
