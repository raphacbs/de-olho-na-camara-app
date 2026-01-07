# Fiscaliza AI - Câmara Federal App

[![Expo](https://img.shields.io/badge/Expo-54.0.0-black.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76.1-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/ESLint-8.56.0-red.svg)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.2.5-pink.svg)](https://prettier.io/)

Aplicativo móvel para acompanhamento de deputados federais brasileiros.

## 🚀 Funcionalidades

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

### Estrutura Técnica

```
src/
├── components/          # Componentes compartilhados
├── navigation/          # Configuração de navegação React Navigation
├── screens/            # Telas do aplicativo
├── services/           # Serviços de API e dados
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
git clone https://github.com/seu-usuario/fiscaliza-ai-camara-federal-app.git
cd fiscaliza-ai-camara-federal-app
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

## 🔧 Configuração de Desenvolvimento

### Aliases de Path

O projeto utiliza aliases para imports mais limpos:

```typescript
// ✅ Recomendado
import { PoliticianDto } from '@/types/api';
import { dataService } from '@/services/dataService';

// ❌ Não recomendado
import { PoliticianDto } from '../../types/api';
```

**Aliases disponíveis:**
- `@/*` - Raiz do src
- `@/components/*` - Componentes compartilhados
- `@/screens/*` - Telas
- `@/navigation/*` - Navegação
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

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

**Equipe Fiscaliza AI**
- Email: contato@fiscaliza.ai
- Website: https://fiscaliza.ai
- LinkedIn: [Fiscaliza AI](https://linkedin.com/company/fiscaliza-ai)

---

**Desenvolvido com ❤️ para transparência na política brasileira**
