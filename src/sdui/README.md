# Server-Driven UI (SDUI) - Sistema de Navegação com Parâmetros

Este documento explica como usar o sistema SDUI para implementar navegação dinâmica com parâmetros/contextos entre telas.

## 🎯 Funcionalidades

- **Navegação Básica**: Navegar entre abas sem parâmetros
- **Navegação com Dados**: Passar dados específicos para telas de destino
- **Armazenamento de Contexto**: Dados persistentes entre navegações
- **Ações Customizáveis**: Sistema expansível para novas ações

## 📝 Como Usar no JSON

### Navegação Básica

```json
{
  "type": "Button",
  "title": "Ver Proposições",
  "onPress": "navigate_propositions"
}
```

### Navegação com Parâmetros

```json
{
  "type": "Card",
  "title": "RIC 7828/2025",
  "onPress": "open_proposition_detail",
  "actionParams": {
    "propositionId": "7828",
    "propositionType": "RIC",
    "year": "2025",
    "title": "Sobre apoio do BNDES...",
    "status": "active",
    "apiEndpoint": "/api/propositions/7828",
    "customData": {
      "qualquerCampo": "qualquerValor"
    }
  }
}
```

## 🔧 Ações Disponíveis

### Navegação Básica
- `"navigate_propositions"` - Aba Proposições
- `"navigate_home"` - Aba Home
- `"navigate_deputados"` - Aba Deputados
- `"navigate_votacoes"` - Aba Votações
- `"navigate_configuracoes"` - Aba Configurações

### Navegação com Dados
- `"open_proposition_detail"` - Detalhes de proposição (requer `propositionId`)
- `"open_deputy_detail"` - Detalhes de deputado (requer `deputyId`)
- `"navigate_with_params"` - Navegação genérica com parâmetros customizados
- `"custom_action"` - Ação customizada (expansível no código)

## 📱 Como Implementar em uma Tela de Destino

### Usando `useNavigationData`

```typescript
import React from 'react';
import { useNavigationData } from '@/sdui/hooks/useNavigationData';
import { useSDUIActions } from '@/sdui/hooks/useSDUIActions';

export function ProposalsScreen() {
  const { params, getParam } = useNavigationData();
  const { getNavigationData } = useSDUIActions();

  // Dados diretos dos parâmetros
  const propositionId = getParam<string>('propositionId');

  // Dados armazenados no contexto
  const propositionData = propositionId ?
    getNavigationData(`proposition_${propositionId}`) : null;

  // Usar dados para API
  React.useEffect(() => {
    if (propositionId) {
      fetchPropositionDetails(propositionId);
    }
  }, [propositionId]);

  return (
    // Renderizar tela com dados da proposição
  );
}
```

## 🏗️ Arquitetura

### Componentes Principais

1. **`useSDUIActions`** - Hook principal que gerencia ações
2. **`SDUIActionsContext`** - Contexto React para componentes
3. **`useNavigationData`** - Hook auxiliar para telas de destino
4. **Armazenamento de Dados** - Sistema temporário para contexto entre telas

### Fluxo de Dados

1. **BFF envia JSON** com `onPress` e `actionParams`
2. **Componente** chama `handleAction(actionId, params)`
3. **Hook** processa ação e navega com dados
4. **Tela de destino** acessa dados via hooks

## 🚀 Expandindo o Sistema

### Adicionando Nova Ação

```typescript
// Em useSDUIActions.ts
case 'minha_nova_acao':
  // Lógica da nova ação
  navigation.navigate('NovaTela', params);
  break;
```

### Usando na Tela de Destino

```typescript
// Em NovaTela.tsx
const { getParam } = useNavigationData();
const meuDado = getParam('meuParametro');
```

## 📋 Exemplos Práticos

### Card de Proposição
```json
{
  "type": "Card",
  "onPress": "open_proposition_detail",
  "actionParams": {
    "propositionId": "123",
    "apiEndpoint": "/api/propositions/123"
  }
}
```

### Botão de Deputado
```json
{
  "type": "Button",
  "onPress": "open_deputy_detail",
  "actionParams": {
    "deputyId": "456",
    "party": "PT",
    "state": "SP"
  }
}
```

### Ação Customizada
```json
{
  "type": "Button",
  "onPress": "custom_action",
  "actionParams": {
    "action": "send_email",
    "recipient": "user@example.com",
    "subject": "Olá!"
  }
}
```

## ⚠️ Notas Importantes

- Os dados são temporários e são limpos após serem acessados
- Use `getNavigationData()` para dados complexos que excedam os parâmetros de navegação
- O sistema é totalmente tipado com TypeScript
- Ações podem ser facilmente expandidas sem modificar componentes existentes
