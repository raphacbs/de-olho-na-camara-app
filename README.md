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

---

## 🖥️ SDUI — Server-Driven UI

O app suporta renderização declarativa de telas via BFF (SDUI). O BFF retorna um JSON descrevendo os componentes da tela e o front-end os renderiza automaticamente, sem lógica de UI específica por tela.

**Habilitar o modo SDUI** (desabilitado por padrão):

```bash
# .env.local
EXPO_PUBLIC_SDUI_ENABLED=true
```

---

### 🗂️ Como o BFF define uma tela

O BFF retorna um payload JSON com uma lista de componentes:

```json
{
  "screenId": "home",
  "version": "1.0",
  "components": [
    {
      "id": "header",
      "type": "GREETING_HEADER",
      "properties": {
        "greeting": "Olá, cidadão!",
        "subtitle": "Acompanhe o Congresso"
      }
    },
    {
      "id": "stats",
      "type": "STATS_GRID",
      "properties": {
        "items": [
          {
            "label": "Deputados",
            "value": "513",
            "color": "#005A9C",
            "action": "NAVIGATE",
            "actionParams": { "route": "/politicians" }
          }
        ]
      }
    }
  ]
}
```

Cada entrada em `components` é renderizada pelo componente React Native registrado para aquele `type`.

---

### ➕ Adicionar uma nova tela SDUI (passo a passo)

#### Passo 1 — Criar o componente de tela

Crie um wrapper em `src/screens/` apontando `SDUIBFFScreen` para o endpoint do BFF:

```tsx
// src/screens/PoliticiansSDUIScreen.tsx
import React from 'react';
import { SDUIBFFScreen } from '@/sdui/SDUIBFFScreen';

export function PoliticiansSDUIScreen() {
  return (
    <SDUIBFFScreen
      endpoint="/api/v1/sdui/politicians"
      queryKey={['sduiPoliticians']}
    />
  );
}
```

> `SDUIBFFScreen` já cuida de: loading, erro, pull-to-refresh e renderização de todos os componentes. Não há mais nada a implementar.

#### Passo 2 — Registrar a rota em `RootTabs.tsx`

```tsx
// src/navigation/RootTabs.tsx
import { PoliticiansSDUIScreen } from '@/screens/PoliticiansSDUIScreen';

// Dentro de <Tab.Navigator>:
<Tab.Screen
  name="Deputados"
  component={PoliticiansSDUIScreen}
  options={{ title: 'Deputados(as)' }}
/>
```

Pronto. O BFF controla layout, dados e ordem dos componentes — sem mais alterações no front.

---

### 🧩 Adicionar um novo tipo de componente

Quando o BFF liberar um `type` ainda não reconhecido (ex: `BAR_CHART`), um placeholder amarelo aparece em modo dev. Para registrar:

#### Passo 1 — Criar o componente React Native

```tsx
// src/sdui/components/BarChart.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface BarChartProps {
  properties: { items: { label: string; value: number }[] };
}

export function BarChart({ properties }: BarChartProps) {
  return (
    <View>
      {properties.items.map(item => (
        <Text key={item.label}>{item.label}: {item.value}</Text>
      ))}
    </View>
  );
}
```

#### Passo 2 — Registrar em `ComponentRegistry.tsx`

```tsx
// src/sdui/ComponentRegistry.tsx
import { BarChart } from './components/BarChart';

export const componentRegistry = {
  // ...componentes existentes
  BAR_CHART: BarChart,
};
```

A partir daí, o BFF pode incluir `BAR_CHART` em **qualquer tela SDUI** sem nenhuma outra alteração no front.

---

### 🧭 Navegação e ações

O BFF controla a navegação via campos `action` e `actionParams` nos componentes. O hook `useSDUIActions` processa essas ações.

#### Ações de navegação disponíveis

| Ação BFF | O que faz | Parâmetros necessários |
|---|---|---|
| `NAVIGATE` | Navega para uma aba pelo caminho de rota | `{ route: "/politicians" }` |
| `navigate_with_params` | Navega com parâmetros customizados | `{ screen: "Deputados", params: { ... } }` |
| `open_deputy_detail` | Navega para detalhes de deputado | `{ deputyId: "123" }` |
| `open_proposition_detail` | Navega para detalhes de proposição | `{ propositionId: "456" }` |
| `apply_filters` | Aplica filtros na tela alvo sem sair dela | `{ targetScreen: "proposicoes", filters: { ... } }` |
| `custom_action` | Ação extensível | `{ action: "qualquer_acao" }` |

#### Mapeamento de rotas BFF → telas

| Rota BFF | Tela |
|---|---|
| `/politicians` | Deputados |
| `/followed` | Deputados |
| `/propositions` | Proposições |
| `/votings` | Votações |
| `/expenses` | Configurações |
| `/settings` | Configurações |

#### Exemplo no JSON do BFF

```json
{
  "id": "stats",
  "type": "STATS_GRID",
  "properties": {
    "items": [
      {
        "label": "Deputados",
        "value": "513",
        "color": "#005A9C",
        "action": "NAVIGATE",
        "actionParams": { "route": "/politicians" }
      }
    ]
  }
}
```

```json
{
  "id": "btn-detail",
  "type": "Button",
  "title": "Ver proposição",
  "onPress": "open_proposition_detail",
  "actionParams": {
    "propositionId": "7828",
    "title": "Sobre apoio do BNDES..."
  }
}
```

#### Adicionar uma nova ação

Adicione um `case` no switch de `handleAction` em `src/sdui/hooks/useSDUIActions.ts`:

```ts
case 'minha_nova_acao':
  // sua lógica aqui
  navigation.navigate('NovaTela', params as RootTabParamList['NovaTela']);
  break;
```

Isso vale automaticamente para **todas** as telas SDUI.

---

### 📊 Tabela de extensibilidade

| Cenário | Trabalho no front |
|---|---|
| BFF muda dados de um componente existente | ❌ Nenhum |
| BFF adiciona novo tipo de componente (ex: `BAR_CHART`) | ✅ Registrar 1x em `ComponentRegistry.tsx` |
| BFF libera nova tela SDUI | ✅ Wrapper de ~5 linhas + registrar rota em `RootTabs.tsx` |
| BFF adiciona nova ação de navegação | ✅ 1 `case` em `useSDUIActions.ts` |

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

**Equipe Fiscaliza AI**
- Email: contato@fiscaliza.ai
- Website: https://fiscaliza.ai
- LinkedIn: [Fiscaliza AI](https://linkedin.com/company/fiscaliza-ai)

---

**Desenvolvido com ❤️ para transparência na política brasileira**
