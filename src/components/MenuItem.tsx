import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';

interface MenuItemProps {
  onPress: () => void;
  title: string;
  icon?: string;
  destructive?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  onPress,
  title,
  destructive = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Text style={[styles.text, destructive && styles.destructiveText]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'transparent',
  },
  pressed: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  text: {
    fontSize: 17,
    color: '#000',
    fontWeight: '400',
  },
  destructiveText: {
    color: '#FF3B30',
  },
});
