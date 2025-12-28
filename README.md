# Fiscaliza AI - Câmara Federal SDUI App

[![Expo](https://img.shields.io/badge/Expo-54.0.0-black.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76.1-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/ESLint-8.56.0-red.svg)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.2.5-pink.svg)](https://prettier.io/)

Aplicativo móvel para acompanhamento de deputados federais brasileiros, desenvolvido com **Server-Driven UI (SDUI)** para máxima flexibilidade e atualização dinâmica da interface.

## 🚀 Funcionalidades

- 📱 **Interface Dinâmica**: UI controlada por servidor permite atualizações instantâneas
- 👥 **Acompanhamento de Deputados**: Lista personalizada de deputados seguidos
- 📊 **Resumos Semanais**: Informações sobre atividades no Congresso
- 🗳️ **Votações**: Acompanhe votações recentes e históricas
- 📄 **Propostas**: Explore projetos de lei e propostas legislativas
- ⚙️ **Configurações**: Personalize sua experiência

## 🚀 Upgrade Recente - Expo SDK 54

Este projeto foi recentemente atualizado para o **Expo SDK 54** com as seguintes melhorias:

- **React Native 0.76.1**: Versão mais recente com melhor performance
- **React Navigation 7.x**: Nova versão major com APIs melhoradas
- **React 18.3.1**: Versão estável mais recente
- **TypeScript 5.3.3**: Melhor suporte e performance
- **Dependências atualizadas**: Todas as bibliotecas compatíveis com Expo 54

## 🏗️ Arquitetura

### Server-Driven UI (SDUI)

O aplicativo utiliza uma arquitetura **Server-Driven UI** que permite:

- **Atualizações Instantâneas**: Modifique a interface sem necessidade de deploy
- **A/B Testing**: Teste diferentes versões da UI simultaneamente
- **Personalização**: Interfaces adaptadas por usuário ou segmento
- **Iteração Rápida**: Deploy de mudanças visuais independente do código

### Estrutura Técnica

```
src/
├── components/          # Componentes compartilhados
├── navigation/          # Configuração de navegação React Navigation
├── sdui/               # Sistema Server-Driven UI
│   ├── components/     # Componentes SDUI base (TextBlock, Container, etc.)
│   ├── ComponentRegistry.tsx  # Registro de componentes
│   └── ScreenRenderer.tsx     # Renderizador principal
├── screens/            # Telas do aplicativo
├── types/              # Definições TypeScript
└── utils/              # Utilitários e helpers
```

## 🛠️ Tecnologias

### Core
- **React Native 0.76.1** - Framework mobile cross-platform
- **Expo SDK 54** - Plataforma de desenvolvimento e build
- **TypeScript 5.3.3** - Tipagem estática para maior segurança

### Navegação
- **React Navigation 7.x** - Navegação robusta e flexível
- **Bottom Tabs** - Navegação principal por abas

### Desenvolvimento
- **ESLint** - Linting e qualidade de código
- **Prettier** - Formatação automática de código
- **Husky** - Git hooks para qualidade pré-commit
- **lint-staged** - Linting apenas em arquivos modificados

### SDUI System
- **Component Registry** - Mapeamento dinâmico de componentes
- **Type-Safe Components** - Componentes tipados para segurança
- **Flexible Styling** - Sistema de estilos adaptável

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

### Para Desenvolvimento Mobile
- **iOS**: Xcode 15+ (macOS)
- **Android**: Android Studio com SDK 34+

## 🚀 Instalação e Execução

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/fiscaliza-ai-camara-federal-sdui-app.git
cd fiscaliza-ai-camara-federal-sdui-app
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Inicie o Servidor de Desenvolvimento

```bash
npm start
```

### 4. Execute no Dispositivo/Emulador

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Web (para testes)
```bash
npm run web
```

## 📱 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o servidor Expo
npm run android        # Executa no Android
npm run ios           # Executa no iOS
npm run web           # Executa na web

# Qualidade de Código
npm run lint          # Executa ESLint
npm run lint:fix      # Executa ESLint e corrige erros automaticamente
npm run format        # Formata código com Prettier
npm run format:check  # Verifica formatação do código
npm run typecheck     # Verifica tipos TypeScript

# Build
expo build:android    # Build para Android
expo build:ios       # Build para iOS
```

## 🎨 Sistema SDUI

### Componentes Base

O sistema inclui componentes fundamentais para construção de interfaces:

- **TextBlock**: Texto com variantes (title, subtitle, body, caption)
- **Container**: Layout flexível com direção e espaçamento
- **Spacer**: Espaçamento consistente
- **Button**: Interação com estados (loading, disabled)
- **Image**: Exibição de imagens com resize modes
- **Card**: Container com elevação e sombra

### Exemplo de Payload SDUI

```json
{
  "id": "home-screen",
  "title": "Início",
  "components": [
    {
      "id": "welcome-title",
      "type": "TextBlock",
      "text": "Bem-vindo ao Fiscaliza AI",
      "variant": "title"
    },
    {
      "id": "spacer-1",
      "type": "Spacer",
      "size": "medium"
    },
    {
      "id": "deputies-section",
      "type": "Container",
      "direction": "column",
      "spacing": 16,
      "children": [
        {
          "id": "section-title",
          "type": "TextBlock",
          "text": "Deputados que você segue",
          "variant": "subtitle"
        }
      ]
    }
  ]
}
```

## 🔧 Configuração de Desenvolvimento

### Aliases de Path

O projeto utiliza aliases para imports mais limpos:

```typescript
// ✅ Recomendado
import { SDUIScreen } from '@/types/sdui';
import { ScreenRenderer } from '@/sdui/ScreenRenderer';

// ❌ Não recomendado
import { SDUIScreen } from '../../types/sdui';
```

**Aliases disponíveis:**
- `@/*` - Raiz do src
- `@/components/*` - Componentes compartilhados
- `@/screens/*` - Telas
- `@/navigation/*` - Navegação
- `@/sdui/*` - Sistema SDUI
- `@/types/*` - Tipos TypeScript

### Linting e Formatação

O projeto inclui configuração rigorosa de qualidade:

- **ESLint**: Regras TypeScript e React Native
- **Prettier**: Formatação consistente
- **Husky**: Hooks Git para qualidade pré-commit
- **lint-staged**: Linting apenas em arquivos modificados

### TypeScript

Configuração strict com paths absolutos:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      // ... outros aliases
    }
  }
}
```

## 🧪 Testes

### Estrutura de Testes

```
__tests__/
├── components/     # Testes de componentes
├── sdui/          # Testes do sistema SDUI
├── screens/       # Testes de telas
└── utils/         # Testes de utilitários
```

### Executando Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## 🚀 Deploy

### Build de Produção

#### Android
```bash
expo build:android --type app-bundle
```

#### iOS
```bash
expo build:ios --type archive
```

### Publicação na App Store / Play Store

1. **Configurar EAS Build** (recomendado pelo Expo)
2. **Configurar credenciais** de desenvolvedor
3. **Build de produção** com `eas build`
4. **Upload** para stores respectivas

## 📚 Documentação

### Arquivos de Documentação

- **[Memory Bank](./docs/memory-bank.md)** - Decisões arquiteturais e contexto
- **[Regras de Componentes](./docs/component-rules.md)** - Padrões para criação de componentes SDUI
- **[API Documentation](./docs/api.md)** - Documentação da API (futuro)

### Desenvolvimento

Para contribuir com o projeto:

1. **Leia o Memory Bank** para entender as decisões tomadas
2. **Siga as Regras de Componentes** para manter consistência
3. **Use os aliases de path** para imports
4. **Execute linting** antes de commits
5. **Adicione testes** para novas funcionalidades

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit

```
feat: add new SDUI component
fix: correct button styling
docs: update component rules
style: format code with prettier
refactor: simplify component registry
test: add tests for TextBlock component
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

**Equipe Fiscaliza AI**
- Email: contato@fiscaliza.ai
- Website: https://fiscaliza.ai
- LinkedIn: [Fiscaliza AI](https://linkedin.com/company/fiscaliza-ai)

---

**Desenvolvido com ❤️ para transparência na política brasileira**

---

## 🔄 Roadmap

### Próximas Features

- [ ] **API Integration**: Conexão com backend real
- [ ] **Offline Support**: Cache e sincronização offline
- [ ] **Push Notifications**: Alertas de votações importantes
- [ ] **Biometria**: Autenticação por biometria
- [ ] **Deep Linking**: Navegação direta para conteúdo específico

### Melhorias Técnicas

- [ ] **Component Library**: Expansão da biblioteca SDUI
- [ ] **State Management**: Redux/Zustand para estado global
- [ ] **Testing Suite**: Cobertura completa de testes
- [ ] **Performance**: Otimizações avançadas
- [ ] **Accessibility**: Conformidade WCAG AAA

Ver [Memory Bank](./docs/memory-bank.md) para detalhes completos do roadmap.
