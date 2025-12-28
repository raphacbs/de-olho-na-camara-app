# Memory Bank - Fiscaliza AI Câmara Federal SDUI App

## Visão Geral do Projeto

Este é um aplicativo React Native + Expo que utiliza Server-Driven UI (SDUI) para renderizar interfaces dinâmicas baseadas em dados recebidos de um servidor. O projeto visa fornecer informações sobre deputados federais brasileiros de forma flexível e atualizável.

## Arquitetura

### Estrutura de Diretórios

```
src/
├── components/          # Componentes compartilhados (futuro)
├── navigation/          # Configuração de navegação
├── sdui/               # Sistema Server-Driven UI
│   ├── components/     # Componentes SDUI base
│   ├── ComponentRegistry.tsx
│   └── ScreenRenderer.tsx
├── screens/            # Telas do aplicativo
├── types/              # Definições TypeScript
│   ├── navigation.ts
│   └── sdui.ts
└── utils/              # Utilitários (futuro)
```

### Tecnologias Principais

- **React Native 0.73.6** - Framework mobile
- **Expo ~50.0.0** - Plataforma de desenvolvimento
- **TypeScript 5.3.3** - Tipagem estática
- **React Navigation 6.x** - Navegação
- **Server-Driven UI** - Arquitetura de UI dinâmica

### Dependências de Desenvolvimento

- **ESLint** - Linting e qualidade de código
- **Prettier** - Formatação de código
- **Husky** - Git hooks
- **lint-staged** - Linting em staged files

## Decisões Arquiteturais

### 1. Server-Driven UI (SDUI)

**Decisão**: Implementar SDUI para permitir atualizações dinâmicas da interface sem necessidade de deploy.

**Justificativa**:
- Flexibilidade para mudanças rápidas na UI
- Separação entre lógica de negócio e apresentação
- Capacidade de A/B testing
- Redução de tempo entre iteração e deploy

**Consequências**:
- Complexidade adicional na implementação inicial
- Necessidade de tipagem rigorosa para garantir segurança
- Curva de aprendizado para equipe

### 2. TypeScript Estrito

**Decisão**: Usar TypeScript com configurações estritas (`"strict": true`).

**Justificativa**:
- Prevenção de bugs em tempo de desenvolvimento
- Melhor experiência de desenvolvimento com autocomplete
- Documentação viva através de tipos
- Refatoração segura

### 3. Aliases de Path

**Decisão**: Implementar aliases de path (`@/*`, `@/components/*`, etc.).

**Justificativa**:
- Imports mais limpos e legíveis
- Melhor organização de código
- Facilita refatoração de estrutura
- Padrão comum em projetos React/React Native

### 4. Component Registry Pattern

**Decisão**: Usar registro de componentes para mapeamento dinâmico de tipos SDUI.

**Justificativa**:
- Extensibilidade: novos componentes podem ser adicionados sem modificar código existente
- Type safety: registro tipado previne erros
- Performance: mapeamento em tempo de build

### 5. Composição sobre Herança

**Decisão**: Componentes base compostos ao invés de herança complexa.

**Justificativa**:
- Maior flexibilidade na composição
- Menor acoplamento entre componentes
- Fácil testabilidade
- Padrão React moderno

## Convenções de Código

### Nomenclatura

- **Componentes**: PascalCase (ex: `TextBlock`, `ScreenRenderer`)
- **Funções**: camelCase (ex: `convertStyleToRN`, `renderChildren`)
- **Tipos/Interfaces**: PascalCase com sufixo (ex: `SDUIScreen`, `TextBlockComponent`)
- **Arquivos**: PascalCase para componentes, camelCase para utilitários

### Estrutura de Componentes SDUI

Cada componente SDUI deve:

1. **Estender BaseComponent**: Para consistência de props base
2. **Ser registrado**: No `ComponentRegistry`
3. **Ter tipagem própria**: Interface específica no `src/types/sdui.ts`
4. **Ser puro**: Sem efeitos colaterais, apenas apresentação

### Imports

- **Aliases preferidos**: `@/types/sdui` ao invés de `../../types/sdui`
- **Imports absolutos**: Para dependências do projeto
- **Imports relativos**: Apenas para arquivos muito próximos

## Padrões de UI/UX

### Design System

- **Espaçamento**: Baseado em múltiplos de 4px (4, 8, 16, 24, 32)
- **Cores**: Sistema de cores consistente (futuro)
- **Tipografia**: Escala tipográfica definida por variants
- **Componentes**: Biblioteca consistente de componentes base

### Acessibilidade

- **Textos alternativos**: Para imagens (futuro)
- **Contraste**: Mínimo WCAG AA
- **Navegação por teclado**: Suporte completo
- **Screen readers**: Compatibilidade total

## Estratégia de Testes

### Testes Unitários

- **Componentes SDUI**: Testar renderização correta
- **Utilitários**: Testar lógica pura
- **Tipos**: Garantir type safety

### Testes de Integração

- **Fluxos completos**: Navegação e renderização SDUI
- **API Integration**: Mock das respostas do servidor

### Testes E2E

- **Cenários críticos**: Funcionalidades principais
- **Cross-platform**: iOS e Android

## Performance

### Otimizações Implementadas

- **Memoização**: Componentes React.memo onde apropriado
- **Lazy loading**: Componentes carregados sob demanda
- **Bundle splitting**: Separação de código por rotas

### Métricas de Performance

- **Bundle size**: < 5MB inicial
- **Time to interactive**: < 3s
- **Memory usage**: Monitorado e otimizado

## Segurança

### Validação de Dados

- **Schema validation**: Para dados SDUI recebidos
- **Sanitização**: Prevenção de XSS em conteúdo dinâmico
- **Type guards**: Validação em tempo de execução

### Autenticação/Autorização

- **JWT tokens**: Para comunicação com APIs
- **Refresh tokens**: Renovação automática
- **Secure storage**: Para dados sensíveis

## Deployment e CI/CD

### Build

- **Expo Application Services (EAS)**: Build e deploy
- **Code signing**: Assinatura automática
- **Environment variables**: Configuração por ambiente

### Versionamento

- **Semantic versioning**: Major.Minor.Patch
- **Changelog**: Documentação de mudanças
- **Release notes**: Comunicação com usuários

## Monitoramento

### Analytics

- **User behavior**: Tracking de interações
- **Performance metrics**: Core Web Vitals adaptados
- **Error tracking**: Relatórios de crashes

### Logging

- **Structured logging**: Logs parseáveis
- **Log levels**: Debug, Info, Warn, Error
- **Remote logging**: Centralização de logs

## Roadmap

### Próximas Implementações

1. **API Integration**: Conexão com backend real
2. **Offline Support**: Cache e sincronização
3. **Push Notifications**: Alertas importantes
4. **Biometria**: Autenticação por biometria
5. **Deep Linking**: Navegação direta para conteúdo

### Melhorias Técnicas

1. **Component Library**: Expansão da biblioteca SDUI
2. **State Management**: Gerenciamento de estado global
3. **Testing Suite**: Cobertura completa de testes
4. **Performance**: Otimizações avançadas
5. **Accessibility**: Conformidade WCAG AAA

## Equipe e Responsabilidades

### Desenvolvimento

- **Frontend**: React Native + SDUI
- **Backend Integration**: APIs REST/GraphQL
- **DevOps**: CI/CD e infraestrutura
- **QA**: Testes e qualidade

### Design

- **UI/UX**: Interface e experiência
- **Design System**: Componentes e padrões
- **Acessibilidade**: Conformidade e usabilidade

### Produto

- **Product Owner**: Visão e roadmap
- **Analytics**: Métricas e insights
- **User Research**: Pesquisa e validação

## Riscos e Mitigações

### Riscos Técnicos

1. **Complexidade SDUI**: Mitigação através de documentação e tipagem rigorosa
2. **Performance**: Monitoramento contínuo e otimizações
3. **Compatibilidade**: Testes em múltiplas versões de iOS/Android

### Riscos de Produto

1. **Adoção SDUI**: Treinamento da equipe e documentação
2. **Manutenibilidade**: Code review rigoroso e padrões estabelecidos
3. **Escalabilidade**: Arquitetura preparada para crescimento

## Conclusão

Este memory bank serve como guia vivo para decisões tomadas e padrões estabelecidos. Deve ser atualizado conforme o projeto evolui e novas decisões são tomadas. A arquitetura SDUI escolhida proporciona flexibilidade e velocidade de iteração, fundamentais para um aplicativo de informações políticas que precisa se adaptar rapidamente às mudanças no cenário legislativo brasileiro.
