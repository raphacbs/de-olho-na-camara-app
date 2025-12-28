import React from 'react';
import { SDUIComponent } from '@/types/sdui';
import { TextBlock } from './components/TextBlock';
import { Container } from './components/Container';
import { Spacer } from './components/Spacer';
import { Card } from './components/Card';
import { Image } from './components/Image';
import { Button } from './components/Button';

// Registry de componentes SDUI
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  TextBlock,
  Container,
  Spacer,
  Card,
  Image,
  Button,
  // Adicionar novos componentes aqui conforme necessário
};

// Função auxiliar para renderizar componentes filhos
export const renderChildren = (children?: SDUIComponent[]): React.ReactNode => {
  if (!children) return null;

  return children.map((child, index) => {
    const componentType = child.type;

    const Component = componentRegistry[componentType];
    if (!Component) {
      console.warn(`Component type "${componentType}" not found in registry. Available types:`, Object.keys(componentRegistry));
      return null;
    }

    // Passar todas as props do componente
    const componentProps = { ...child };
    delete componentProps.children;

    return (
      <Component
        key={child.id || index}
        {...componentProps}
      >
        {renderChildren(child.children)}
      </Component>
    );
  });
};

// Função para registrar novos componentes dinamicamente
export const registerComponent = (
  type: string,
  component: React.ComponentType<any>
) => {
  componentRegistry[type] = component;
};

// Função para verificar se um tipo de componente está registrado
export const isComponentRegistered = (type: string): boolean => {
  return type in componentRegistry;
};
