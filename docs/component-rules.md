# Regras de Criação de Componentes SDUI

## Visão Geral

Este documento estabelece as regras e padrões para criação de componentes Server-Driven UI (SDUI) no projeto Fiscaliza AI. Seguir essas regras garante consistência, manutenibilidade e performance do sistema.

## Estrutura Base de um Componente SDUI

### 1. Interface TypeScript

Todo componente deve ter sua própria interface que estende `BaseComponent`:

```typescript
export interface MyComponent extends BaseComponent {
  type: 'MyComponent';
  // Props específicas do componente
  myProp: string;
  optionalProp?: number;
}
```

**Regras para interfaces:**
- Sempre definir `type` como string literal
- Usar `extends BaseComponent` para herdar props base
- Props obrigatórias primeiro, opcionais depois
- Documentar cada prop com comentários JSDoc

### 2. Implementação do Componente

```typescript
import React from 'react';
import { MyComponent as MyComponentType } from '@/types/sdui';
import { BaseComponent } from './BaseComponent';

export const MyComponent: React.FC<MyComponentType> = ({
  // Props do BaseComponent
  id,
  style,
  children: componentChildren,
  // Props específicas
  myProp,
  optionalProp = 'default',
  ...props
}) => {
  // Lógica do componente
  const handleAction = () => {
    // Implementação
  };

  return (
    <BaseComponent style={style} {...props}>
      {/* JSX do componente */}
    </BaseComponent>
  );
};
```

**Regras para implementação:**
- Usar `React.FC<Type>` para tipagem
- Desestruturar props claramente
- Fornecer valores padrão para props opcionais
- Usar `BaseComponent` como wrapper quando apropriado
- Não usar hooks ou efeitos colaterais (exceto para interações do usuário)

### 3. Registro no ComponentRegistry

```typescript
// No ComponentRegistry.tsx
import { MyComponent } from './components/MyComponent';

// Adicionar ao registry
export const componentRegistry: Record<string, React.ComponentType<SDUIComponent>> = {
  // ... outros componentes
  MyComponent,
};
```

**Regras para registro:**
- Importar o componente
- Adicionar ao `componentRegistry`
- Manter ordem alfabética
- Nunca modificar o registry em runtime (apenas em build time)

## Categorias de Componentes

### 1. Componentes de Layout

**Propósito**: Controlar posicionamento e distribuição de outros componentes.

**Exemplos**: Container, Spacer, Card

**Regras específicas:**
- Sempre aceitar `children` como array de `SDUIComponent[]`
- Implementar `renderChildren()` para filhos
- Suportar propriedades de layout (flex, direction, spacing)

### 2. Componentes de Conteúdo

**Propósito**: Exibir informações textuais ou visuais.

**Exemplos**: TextBlock, Image, Icon

**Regras específicas:**
- Focar apenas em apresentação
- Suportar variantes (size, color, weight)
- Implementar acessibilidade (accessibilityLabel, etc.)

### 3. Componentes de Interação

**Propósito**: Permitir interação do usuário.

**Exemplos**: Button, Input, Switch

**Regras específicas:**
- Suportar estados (disabled, loading, pressed)
- Implementar feedback visual adequado
- Validar entrada quando apropriado
- Usar ações tipadas (não strings arbitrárias)

### 4. Componentes de Navegação

**Propósito**: Controlar navegação entre telas.

**Exemplos**: Link, TabBar, NavigationHeader

**Regras específicas:**
- Integrar com React Navigation
- Suportar deep linking
- Manter estado de navegação consistente

## Princípios de Design

### 1. Imutabilidade

```typescript
// ✅ Correto
const newComponent = { ...component, text: 'Novo texto' };

// ❌ Incorreto
component.text = 'Novo texto';
```

**Razão**: Dados SDUI vêm do servidor e não devem ser modificados localmente.

### 2. Pure Functions

```typescript
// ✅ Correto
export const TextBlock: React.FC<TextBlockProps> = React.memo(({ text, variant }) => {
  return <Text style={getVariantStyle(variant)}>{text}</Text>;
});

// ❌ Incorreto
export const TextBlock: React.FC<TextBlockProps> = ({ text, variant }) => {
  const [count, setCount] = useState(0); // Estado local não permitido
  return <Text>{text}</Text>;
};
```

**Razão**: Componentes devem ser previsíveis e testáveis.

### 3. Separação de Responsabilidades

```typescript
// ✅ Correto
const TextBlock = ({ text, variant }) => (
  <Text style={getVariantStyle(variant)}>{text}</Text>
);

const getVariantStyle = (variant: TextVariant) => {
  // Lógica de styling separada
};

// ❌ Incorreto
const TextBlock = ({ text, variant }) => {
  const style = variant === 'title'
    ? { fontSize: 24, fontWeight: 'bold' }
    : { fontSize: 16 };
  return <Text style={style}>{text}</Text>;
};
```

**Razão**: Facilita testes e manutenção.

## Estilos e Theming

### 1. Sistema de Espaçamento

```typescript
// Usar múltiplos de 4px
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### 2. Paleta de Cores

```typescript
const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  text: '#000000',
  textSecondary: '#8E8E93',
  background: '#FFFFFF',
  surface: '#F2F2F7',
};
```

### 3. Aplicação de Estilos

```typescript
// ✅ Correto - Usar convertStyleToRN
const rnStyle = convertStyleToRN(style);

// ❌ Incorreto - Estilos inline
<View style={{ margin: 16, backgroundColor: 'blue' }}>
```

## Validação e Error Handling

### 1. Validação de Props

```typescript
export const TextBlock: React.FC<TextBlockProps> = ({ text, variant = 'body' }) => {
  // Validação em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    if (!text) {
      console.warn('TextBlock: text prop is required');
    }
    if (!['title', 'subtitle', 'body', 'caption'].includes(variant)) {
      console.warn(`TextBlock: invalid variant "${variant}"`);
    }
  }

  return <Text style={getVariantStyle(variant)}>{text}</Text>;
};
```

### 2. Fallbacks

```typescript
// Sempre fornecer fallbacks para conteúdo crítico
<Text>{text || 'Conteúdo não disponível'}</Text>
```

## Performance

### 1. Memoização

```typescript
export const ExpensiveComponent = React.memo<ExpensiveComponentProps>(({
  data,
  onAction
}) => {
  // Componente complexo
  return <View>{/* JSX */}</View>;
});
```

### 2. Lazy Loading

```typescript
// Para componentes pesados
const LazyImage = React.lazy(() => import('./LazyImage'));

// Uso
<Suspense fallback={<Skeleton />}>
  <LazyImage />
</Suspense>
```

## Testes

### 1. Testes Unitários

```typescript
import { render } from '@testing-library/react-native';
import { TextBlock } from './TextBlock';

describe('TextBlock', () => {
  it('renders text correctly', () => {
    const { getByText } = render(
      <TextBlock id="test" type="TextBlock" text="Hello World" />
    );
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('applies correct variant styles', () => {
    const { getByText } = render(
      <TextBlock
        id="test"
        type="TextBlock"
        text="Title"
        variant="title"
      />
    );
    const text = getByText('Title');
    expect(text.props.style.fontSize).toBe(24);
  });
});
```

### 2. Testes de Snapshot

```typescript
it('matches snapshot', () => {
  const tree = renderer.create(<TextBlock {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

## Documentação

### 1. README do Componente

Cada componente deve ter documentação:

```typescript
/**
 * TextBlock Component
 *
 * Displays text with predefined variants and styling options.
 *
 * @param text - The text content to display
 * @param variant - Text style variant (title, subtitle, body, caption)
 * @param color - Text color (optional, defaults to theme text color)
 * @param fontSize - Custom font size (optional, overrides variant)
 * @param fontWeight - Font weight (optional, overrides variant)
 * @param textAlign - Text alignment (left, center, right)
 * @param style - Additional React Native styles
 *
 * @example
 * ```tsx
 * <TextBlock
 *   id="welcome"
 *   type="TextBlock"
 *   text="Welcome to the app"
 *   variant="title"
 * />
 * ```
 */
export const TextBlock: React.FC<TextBlockProps> = (props) => { ... };
```

### 2. Exemplos de Uso

```typescript
// examples/TextBlockExamples.tsx
export const TextBlockExamples = () => (
  <Container direction="column" spacing={16}>
    <TextBlock
      id="example-1"
      type="TextBlock"
      text="This is a title"
      variant="title"
    />
    <TextBlock
      id="example-2"
      type="TextBlock"
      text="This is body text"
      variant="body"
    />
  </Container>
);
```

## Migração e Versionamento

### 1. Versionamento de Componentes

```typescript
// Versão 1
export interface TextBlockV1 extends BaseComponent {
  type: 'TextBlock';
  text: string;
  variant?: 'title' | 'subtitle' | 'body';
}

// Versão 2 (adição não-breaking)
export interface TextBlockV2 extends TextBlockV1 {
  color?: string;
}
```

### 2. Depreciação

```typescript
/**
 * @deprecated Use TextBlock with variant="title" instead
 */
export const TitleText = (props) => (
  <TextBlock {...props} variant="title" />
);
```

## Checklist de Criação

Antes de finalizar um componente SDUI, verificar:

- [ ] Interface TypeScript definida e documentada
- [ ] Componente implementado com tipagem correta
- [ ] Registrado no ComponentRegistry
- [ ] Estilos aplicados consistentemente
- [ ] Acessibilidade implementada
- [ ] Testes unitários criados
- [ ] Documentação completa
- [ ] Exemplos de uso fornecidos
- [ ] Linting passando
- [ ] Performance otimizada (memoização quando apropriado)

## Conclusão

Seguir essas regras garante que o sistema SDUI seja:

- **Consistente**: Todos os componentes seguem os mesmos padrões
- **Manutenível**: Código organizado e bem documentado
- **Performático**: Otimizações aplicadas onde necessário
- **Testável**: Estrutura facilita testes abrangentes
- **Extensível**: Fácil adicionar novos componentes

Para dúvidas ou sugestões de melhoria, consulte o memory bank do projeto ou abra uma discussão técnica.
