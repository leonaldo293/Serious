# ELTx HUB Frontend

Frontend completo para a plataforma ELTx HUB - Educação Tecnológica em África.

## 🚀 Visão Geral

O ELTx HUB é uma plataforma completa de educação tecnológica focada em capacitar profissionais em toda África. Este frontend oferece:

- **Bootcamps Intensivos**: Programas acelerados em tecnologia, idiomas e negócios
- **Comunidade Ativa**: Fórum, eventos e networking
- **Sistema de Pagamentos**: Integração com PayPal e WhatsApp
- **Chat em Tempo Real**: Comunicação entre alunos e mentores
- **Painel Administrativo**: Gestão completa de cursos, usuários e pagamentos
- **Relatórios e Analytics**: Insights detalhados sobre o desempenho

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 com App Router
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS
- **Ícones**: Lucide React
- **Estado**: React Context API
- **HTTP Client**: Axios com interceptors
- **Real-time**: Socket.IO
- **Pagamentos**: PayPal REST API v2
- **Uploads**: Suporte para Cloudinary/local
- **Autenticação**: JWT com RBAC

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend ELTx HUB rodando
- MongoDB (para backend)
- Conta PayPal (para pagamentos)
- WhatsApp Business (para pagamentos via WhatsApp)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd eltx-hub/frontend
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

4. **Configure o arquivo .env.local**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# WhatsApp Configuration
WHATSAPP_BUSINESS_PHONE=+23939947819
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token

# File Upload Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ELTx HUB
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

6. **Acesse a aplicação**
```
http://localhost:3000
```

## 🏗️ Estrutura do Projeto

```
frontend/
├── app/                          # App Router (Next.js 13+)
│   ├── (auth)/                   # Rotas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── admin/                    # Painel administrativo
│   │   ├── layout.tsx           # Layout admin com sidebar
│   │   ├── page.tsx             # Dashboard
│   │   ├── users/               # Gestão de usuários
│   │   ├── programs/            # Gestão de programas
│   │   ├── lessons/             # Gestão de aulas
│   │   ├── payments/            # Gestão de pagamentos
│   │   ├── enrollments/         # Gestão de inscrições
│   │   ├── mentors/             # Gestão de mentores
│   │   ├── tasks/               # Gestão de tarefas
│   │   ├── blog/                # Gestão de blog
│   │   ├── calendar/            # Calendário
│   │   ├── reports/             # Relatórios
│   │   ├── analytics/           # Analytics
│   │   └── settings/            # Configurações
│   ├── bootcamp/                # Bootcamps
│   ├── community/               # Comunidade
│   ├── consulting/              # Consultoria
│   ├── empowerment/             # Empoderamento
│   ├── programas/               # Programas
│   ├── profile/                 # Perfil do usuário
│   ├── tracker/                 # Tracker de progresso
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Homepage
│   └── globals.css             # Estilos globais
├── components/                  # Componentes reutilizáveis
│   ├── Chat/                   # Componentes de chat
│   ├── admin/                  # Componentes admin
│   ├── auth/                   # Componentes de autenticação
│   ├── ui/                     # Componentes UI genéricos
│   ├── Navbar.tsx              # Navbar principal
│   ├── Sidebar.tsx             # Sidebar admin
│   └── Footer.tsx              # Footer
├── contexts/                   # Contexts React
│   ├── AuthContext.tsx         # Contexto de autenticação
│   ├── LanguageContext.tsx     # Contexto de idioma
│   └── ThemeContext.tsx        # Contexto de tema
├── lib/                        # Bibliotecas e utilitários
│   ├── api.ts                  # Cliente API com Axios
│   ├── auth.ts                 # Utilitários de autenticação
│   ├── utils.ts                # Funções utilitárias
│   └── validations.ts          # Validações de formulário
├── hooks/                      # Hooks customizados
│   ├── useAuth.ts              # Hook de autenticação
│   ├── useLocalStorage.ts      # Hook de localStorage
│   └── useDebounce.ts          # Hook de debounce
├── types/                      # Tipos TypeScript
│   ├── auth.ts                 # Tipos de autenticação
│   ├── user.ts                 # Tipos de usuário
│   ├── course.ts               # Tipos de curso
│   └── payment.ts              # Tipos de pagamento
├── public/                     # Arquivos estáticos
│   ├── images/                 # Imagens
│   ├── videos/                 # Vídeos
│   ├── logo.jpeg              # Logo ELTx HUB
│   └── favicon.ico             # Favicon
├── styles/                     # Estilos
│   └── globals.css            # Estilos globais Tailwind
├── package.json               # Dependências
├── tailwind.config.js         # Configuração Tailwind
├── next.config.js             # Configuração Next.js
└── README.md                  # Este arquivo
```

## 🎨 Sistema de Design

### Cores
- **Dourado Africano**: `#D4A017` (cor primária)
- **Teal**: `#00B6A1` (secundária)
- **Preto Profundo**: `#0D0D0D` (textos)
- **Marfim**: `#F7F6F3` (fundo claro)
- **Cinza**: `#6B7280` (neutro)

### Tipografia
- **Fonte Principal**: Inter (Google Fonts)
- **Fonte de Código**: JetBrains Mono
- **Pesos**: 400, 500, 600, 700

### Componentes
- **Botões**: Variants (primary, secondary, outline, ghost)
- **Cards**: Shadow levels e bordas arredondadas
- **Formulários**: Estados (focus, error, disabled)
- **Modais**: Overlay e backdrop blur

## 🔐 Autenticação e RBAC

### Roles do Sistema
- **superadmin**: Acesso total ao sistema
- **admin**: Gestão de conteúdo e usuários
- **mentor**: Acesso a aulas e alunos atribuídos
- **student**: Acesso aos cursos matriculados

### Permissões
O sistema implementa RBAC (Role-Based Access Control) com permissões granulares:

```typescript
const ROLE_PERMISSIONS = {
  superadmin: [
    'users.create', 'users.read', 'users.update', 'users.delete',
    'programs.create', 'programs.read', 'programs.update', 'programs.delete',
    // ... mais permissões
  ],
  admin: [
    'users.read', 'users.update',
    'programs.create', 'programs.read', 'programs.update', 'programs.delete',
    // ... mais permissões
  ],
  mentor: [
    'lessons.create', 'lessons.read', 'lessons.update',
    'tasks.read', 'tasks.update',
    // ... mais permissões
  ],
  student: [
    'programs.read', 'lessons.read', 'enrollments.create', 'tasks.create'
  ]
}
```

## 💳 Sistema de Pagamentos

### PayPal Integration
- **REST API v2**: Criação e captura de ordens
- **Webhooks**: Notificações de pagamento
- **Sandbox**: Ambiente de testes integrado

### WhatsApp Payments
- **Business API**: Mensagens automatizadas
- **Número**: +239 399 47 819 (São Tomé)
- **Fluxo**: Pedido → Mensagem WhatsApp → Confirmação

### Fluxo de Pagamento
1. Usuário seleciona curso
2. Escolhe método (PayPal/WhatsApp)
3. **PayPal**: Redirecionado para aprovação
4. **WhatsApp**: Mensagem com instruções
5. Confirmação e ativação do curso

## 💬 Chat em Tempo Real

### Funcionalidades
- **Salas de Chat**: Públicas, privadas e diretas
- **Mensagens**: Texto, imagens e arquivos
- **Reações**: Emojis nas mensagens
- **Indicadores**: "Digitando..." e status de leitura
- **Online/Offline**: Status de usuários

### Socket.IO Events
```typescript
// Client → Server
socket.emit('join_room', { roomId })
socket.emit('send_message', message)
socket.emit('typing', { roomId })
socket.emit('mark_messages_read', { roomId })

// Server → Client
socket.on('new_message', message)
socket.on('typing', data)
socket.on('user_status', statuses)
socket.on('message_read', data)
```

## 📊 Relatórios e Analytics

### Tipos de Relatórios
- **Vendas**: CSV/PDF com transações
- **Inscrições**: Análise de matrículas
- **Progresso**: Desempenho dos alunos
- **Presença**: Frequência nas aulas

### Analytics
- **KPIs Dashboard**: Métricas em tempo real
- **Gráficos**: Revenue, inscrições, engajamento
- **Filtros**: Por período, curso, mentor
- **Exportação**: Dados em CSV/JSON

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure variáveis de ambiente no painel Vercel
```

### Docker
```bash
# Build
docker build -t eltx-hub-frontend .

# Run
docker run -p 3000:3000 eltx-hub-frontend
```

### Manual (VPS)
```bash
# Build
npm run build

# Start
npm start

# Use PM2 para produção
pm2 start npm --name "eltx-hub" -- start
```

### Variáveis de Ambiente de Produção
```env
NEXT_PUBLIC_API_URL=https://api.eltx-hub.com
NEXT_PUBLIC_SOCKET_URL=https://api.eltx-hub.com
NEXT_PUBLIC_PAYPAL_CLIENT_ID=production_client_id
PAYPAL_MODE=live
NEXT_PUBLIC_APP_URL=https://eltx-hub.com
```

## 🧪 Testes

### Unit Tests (Jest + React Testing Library)
```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### E2E Tests (Playwright)
```bash
# Install browsers
npx playwright install

# Run tests
npx playwright test

# UI mode
npx playwright test --ui
```

### Estrutura de Testes
```
tests/
├── unit/                     # Testes unitários
│   ├── components/          # Componentes
│   ├── hooks/               # Hooks
│   └── utils/               # Utilitários
├── e2e/                     # Testes E2E
│   ├── auth.spec.ts         # Fluxo de autenticação
│   ├── admin.spec.ts        # Painel admin
│   └── payments.spec.ts     # Sistema de pagamentos
└── fixtures/                # Dados de teste
```

## 🔧 Configuração Avançada

### Custom Server
```typescript
// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000)
})
```

### Middleware de Autenticação
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}
```

### Configuração de Imagens
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.eltx-hub.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // ... outras configurações
}
```

## 🐛 Troubleshooting

### Problemas Comuns

**Erro: "default export is not a React Component"**
- Verifique se os arquivos de layout exportam corretamente
- Confirme que não há imports circulares

**Erro: "Socket connection failed"**
- Verifique se o backend está rodando
- Confirme as variáveis de ambiente do Socket.IO

**Erro: "PayPal button not loading"**
- Verifique o CLIENT_ID do PayPal
- Confirme se o script do PayPal está carregando

**Performance lenta**
- Use `next build` para produção
- Otimize imagens com Next.js Image
- Implemente lazy loading

### Debug Tips
```bash
# Verificar build
npm run build

# Analisar bundle
npm run analyze

# Verificar tipos
npm run type-check

# Lint
npm run lint
```

## 📱 PWA (Progressive Web App)

O frontend está configurado como PWA:

- **Manifest**: `public/manifest.json`
- **Service Worker**: Geração automática
- **Offline**: Cache estratégico
- **Install Prompt**: Exibição automática

## 🌍 Internacionalização

### Idiomas Suportados
- Português (PT-ST)
- Inglês (EN)

### Estrutura de Tradução
```typescript
// contexts/LanguageContext.tsx
const translations = {
  'pt': {
    'welcome': 'Bem-vindo',
    'login': 'Entrar',
    // ...
  },
  'en': {
    'welcome': 'Welcome',
    'login': 'Login',
    // ...
  }
}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie branch feature (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- Use TypeScript estrito
- Siga as convenções do React
- Componentes funcionais com hooks
- Testes para novas features

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: support@eltx-hub.com
- **WhatsApp**: +239 399 47 819
- **Website**: https://eltx-hub.com

## 🗺️ Roadmap

### v1.0 (Atual)
- ✅ Painel administrativo completo
- ✅ Sistema de pagamentos PayPal/WhatsApp
- ✅ Chat em tempo real
- ✅ Gestão de cursos e usuários

### v1.1 (Planejado)
- 🔄 Mobile app (React Native)
- 🔄 Sistema de certificados
- 🔄 Integração com Zoom/Meet
- 🔄 Gamificação

### v2.0 (Futuro)
- 📋 AI-powered recommendations
- 📋 Marketplace de mentores
- 📋 Integração com LinkedIn
- 📋 Sistema de avaliações 360°

---

**Desenvolvido com ❤️ para capacitar África através da tecnologia educacional.**
