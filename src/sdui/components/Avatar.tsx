import React from 'react';
import { Avatar as RNPAvatar } from 'react-native-paper';
import { ImageSourcePropType } from 'react-native';
import { AvatarComponent } from '@/types/sdui';
import { convertStyleToRN } from './BaseComponent';

interface AvatarProps extends AvatarComponent {}

export function Avatar({
  source,
  size = 40,
  placeholder,
  style,
  id: _id,
}: AvatarProps) {
  // Use nullish coalescing and cast style to any before accessing .size to avoid TypeScript error
  const avatarSize: number = size ?? ((style as any)?.size as number) ?? 40;
  const rnStyle = convertStyleToRN(style);
  

  // Se não tem source, usa Avatar.Text com placeholder ou iniciais
  if (!source) {
    const displayText = placeholder || '?';
    return (
      <RNPAvatar.Text
        size={avatarSize}
        label={displayText}
        style={rnStyle}
      />
    );
  }

  // Normalize source: if string => { uri: string }, otherwise pass through (local numeric asset or image source)
  const imageSource: ImageSourcePropType = typeof source === 'string' ? { uri: source } : (source as ImageSourcePropType);

  // Se tem source (URL ou asset), usa Avatar.Image
  return (
    <RNPAvatar.Image
      size={avatarSize}
      source={imageSource as any}
      style={rnStyle}
    />
  );
}