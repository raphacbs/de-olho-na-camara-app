# Arquitetura da API BFF - Backend For Frontend

Esta pasta contém a implementação da arquitetura para comunicação com a API BFF (Backend For Frontend) do aplicativo Fiscaliza AI Câmara Federal.

## 📁 Estrutura dos Arquivos

```
src/
├── services/
│   ├── apiClient.ts          # Cliente HTTP principal
│   └── README.md            # Esta documentação
├── sdui/
│   ├── hooks/
│   │   └── useSDUIScreen.ts # Hook para telas SDUI
│   └── components/
│       └── LoadingScreen.tsx # Componentes de loading/erro
├── config/
│   └── api.ts               # Configurações da API
└── screens/
    └── HomeScreen.tsx       # Exemplo de uso
```

## 🏗️ Arquitetura Implementada

### 1. API Client (`apiClient.ts`)

Cliente HTTP robusto baseado em `fetch` nativo com:

- **Configuração centralizada**: URLs, timeouts e headers via `config/api.ts`
- **Tratamento de erros**: Tipos específicos de erro com códigos e retry
- **Retry automático**: Backoff exponencial para erros de rede/servidor
- **Timeout configurável**: Controle de timeout por requisição
- **Headers padrão**: Configurados automaticamente por ambiente

### 2. Hook useSDUIScreen (`useSDUIScreen.ts`)

Hook personalizado para gerenciamento de telas SDUI:

- **Estados de loading**: Loading inicial, refresh e estados de erro
- **Cache inteligente**: Cache em memória com TTL configurável
- **Retry automático**: Tentativas automáticas em caso de erro
- **Auto-refresh**: Atualização periódica opcional
- **Controle de ciclo de vida**: Cleanup automático de timers

### 3. Componentes de UI (`LoadingScreen.tsx`)

Componentes reutilizáveis para estados de loading e erro:

- **LoadingScreen**: Indicador de carregamento com mensagem customizável
- **ErrorScreen**: Tela de erro com botão de retry
- **Estados visuais consistentes**: Design system brasileiro

### 4. Configuração Centralizada (`config/api.ts`)

Configurações organizadas por ambiente:

- **URLs por ambiente**: Desenvolvimento, staging e produção
- **Timeouts otimizados**: Mais rápidos em produção
- **Cache configurável**: TTL e limites por endpoint
- **Retry policies**: Diferentes estratégias por tipo de erro

## 🚀 Como Usar

### Exemplo Básico - HomeScreen

```typescript
import { useSDUIScreen } from '@/sdui/hooks/useSDUIScreen';
import { API_ENDPOINTS, DEFAULT_SDUI_CONFIG } from '@/config/api';
import { LoadingScreen, ErrorScreen } from '@/sdui/components/LoadingScreen';

export function HomeScreen() {
  const { screen, loading, error, retry } = useSDUIScreen({
    endpoint: API_ENDPOINTS.SCREENS.HOME,
    ...DEFAULT_SDUI_CONFIG,
  });

  if (loading && !screen) {
    return <LoadingScreen message="Carregando..." />;
  }

  if (error && !screen) {
    return <ErrorScreen error={error} onRetry={() => retry()} />;
  }

  return <ScreenRenderer screen={screen} onAction={handleAction} />;
}
```

### Exemplo Avançado com Configurações Customizadas

```typescript
const { screen, loading, error, retry, refresh } = useSDUIScreen({
  endpoint: '/screens/custom',
  cache: true,
  cacheTTL: 10 * 60 * 1000, // 10 minutos
  autoRefresh: true,
  refreshInterval: 60 * 1000, // 1 minuto
  retryOnError: true,
  maxRetries: 5,
});
```

## ⚙️ Configurações Disponíveis

### Hook useSDUIScreen

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `endpoint` | `string` | - | Endpoint da API BFF |
| `cache` | `boolean` | `true` | Habilitar cache |
| `cacheTTL` | `number` | `300000` | TTL do cache em ms |
| `autoRefresh` | `boolean` | `false` | Auto-refresh automático |
| `refreshInterval` | `number` | `30000` | Intervalo de refresh em ms |
| `retryOnError` | `boolean` | `true` | Retry automático em erro |
| `maxRetries` | `number` | `3` | Máximo de tentativas |

### API Client

| Propriedade | Desenvolvimento | Produção |
|-------------|----------------|----------|
| `baseURL` | `localhost:3000/api` | `api.fiscaliza.ai/api` |
| `timeout` | `30000ms` | `15000ms` |
| `retries` | `3` | `2` |
| `cacheTTL` | `5min` | `10min` |

## 🔄 Estados da Aplicação

### Estados do Hook useSDUIScreen

```typescript
interface SDUIScreenState {
  screen: SDUIScreen | null;     // Tela carregada da API
  loading: boolean;              // Carregamento inicial
  error: SDUIError | null;       // Erro ocorrido
  isRefreshing: boolean;         // Refresh em andamento
}
```

### Estados de Erro

```typescript
interface SDUIError {
  code: string;         // Código do erro
  message: string;      // Mensagem amigável
  retry?: boolean;      // Se permite retry
}
```

## 🎯 Melhores Práticas

### 1. Cache Estratégico
- Use cache para telas que não mudam frequentemente
- Configure TTL apropriado por tipo de conteúdo
- Invalide cache quando necessário

### 2. Tratamento de Erro
- Sempre mostre estados de erro ao usuário
- Ofereça retry para operações importantes
- Log erros para monitoramento

### 3. Performance
- Configure timeouts apropriados
- Use retry com backoff exponencial
- Minimize chamadas desnecessárias

### 4. UX
- Mostre loading states consistentes
- Forneça feedback visual para ações
- Mantenha interface responsiva

## 🔧 Manutenção

### Adicionando Novos Endpoints

1. Adicione ao `API_ENDPOINTS` em `config/api.ts`
2. Configure cache se necessário em `CACHE_CONFIG`
3. Use o hook `useSDUIScreen` na tela correspondente

### Modificando Configurações

1. Atualize `config/api.ts` com novas configurações
2. Teste em todos os ambientes
3. Atualize documentação se necessário

### Debug e Monitoramento

- Logs detalhados em desenvolvimento
- Métricas de performance em produção
- Monitoramento de erros e retries

## 📋 Checklist de Implementação

- [x] API Client com fetch nativo
- [x] Hook useSDUIScreen com estados
- [x] Componentes Loading/Error
- [x] Configuração por ambiente
- [x] Cache inteligente
- [x] Retry automático
- [x] Tratamento de erros
- [x] Documentação completa
- [x] Exemplo de uso no HomeScreen

## 🧪 Testes

Para testar a implementação:

1. **Desenvolvimento**: Use servidor mock ou API local
2. **Erro de rede**: Desconecte internet durante carregamento
3. **Timeout**: Configure timeout curto para forçar erro
4. **Retry**: Verifique tentativas automáticas
5. **Cache**: Teste carregamento offline após primeira carga

## 📚 Referências

- [Regras da API BFF](../docs/bff-api-rules.md)
- [Tipos SDUI](../types/sdui.ts)
- [Documentação do React Native](https://reactnative.dev/docs/network)
