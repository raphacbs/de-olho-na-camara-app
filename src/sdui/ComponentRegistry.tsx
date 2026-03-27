import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SDUIComponent } from '@/types/sdui';
import { TextBlock } from './components/TextBlock';
import { Container } from './components/Container';
import { Spacer } from './components/Spacer';
import { Card } from './components/Card';
import { Image } from './components/Image';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Avatar } from './components/Avatar';
import { AdvancedFilter } from './components/AdvancedFilter';
// BFF SDUI components
import { YearSelectorBanner } from './components/YearSelectorBanner';
import { GreetingHeader } from './components/GreetingHeader';
import { StatsGrid } from './components/StatsGrid';
import { QuickAccessGrid } from './components/QuickAccessGrid';
import { SectionHeaderWithBadge } from './components/SectionHeaderWithBadge';


// Registry de componentes SDUI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  // Generic components
  TextBlock,
  Container,
  Spacer,
  Card,
  Image,
  Button,
  Input,
  Avatar,
  AdvancedFilter,
  // BFF SDUI home-screen components
  YEAR_SELECTOR_BANNER: YearSelectorBanner,
  GREETING_HEADER: GreetingHeader,
  STATS_GRID: StatsGrid,
  QUICK_ACCESS_GRID: QuickAccessGrid,
  SECTION_HEADER_WITH_BADGE: SectionHeaderWithBadge,
  // Adicionar novos componentes aqui conforme necessário
};

/**
 * Fallback shown when the BFF sends a component type not yet in the registry.
 * Renders a visible placeholder in __DEV__ mode so developers notice it quickly,
 * and renders nothing in production (avoids showing broken UI to users).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UnknownComponentFallback({ type }: { type?: string }) {
  if (!__DEV__) return null;
  return (
    <View style={unknownStyles.container}>
      <Text style={unknownStyles.text}>
        ⚠️ Componente desconhecido: "{type ?? '?'}"{'\n'}
        Registre-o em ComponentRegistry.tsx
      </Text>
    </View>
  );
}

const unknownStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#FFFBEB',
  },
  text: {
    fontSize: 12,
    color: '#92400E',
  },
});

// Função auxiliar para renderizar componentes filhos com chaves determinísticas
export const renderChildren = (
  children?: SDUIComponent[],
  parentPath: string = 'root'
): React.ReactNode => {
  if (!children) return null;

  return children.map((child, index) => {
    const componentType = child.type;

    // Verificar se o componente existe no registry
    const Component = componentRegistry[componentType];
    if (!Component) {
      console.warn(`Component type "${componentType}" not found in registry. Available types:`, Object.keys(componentRegistry));
      const fallbackPath = `${parentPath}-unknown-${componentType}-${index}`;
      return <UnknownComponentFallback key={fallbackPath} type={componentType} />;
    }

    // Passar todas as props do componente
    const componentProps = { ...child };
    delete componentProps.children;

    // Gerar chave determinística baseada no caminho na árvore
    // Isso garante unicidade mesmo com IDs duplicados
    const componentPath = `${parentPath}-${child.type}-${child.id || 'no-id'}-${index}`;

    // Verificar se o componente tem filhos para evitar renderização desnecessária
    const hasChildren = child.children && child.children.length > 0;

    return (
      <Component
        key={componentPath}
        {...componentProps}
      >
        {hasChildren ? renderChildren(child.children, componentPath) : null}
      </Component>
    );
  });
};

// Função para registrar novos componentes dinamicamente
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerComponent = (
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
) => {
  componentRegistry[type] = component;
};

// Função para verificar se um tipo de componente está registrado
export const isComponentRegistered = (type: string): boolean => {
  return type in componentRegistry;
};
