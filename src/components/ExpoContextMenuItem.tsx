import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';

interface ContextMenuItemProps {
  onPress: () => void;
  title: string;
  icon?: React.ReactElement;
  destructive?: boolean;
}

export const ExpoContextMenuItem: React.FC<ContextMenuItemProps> = ({
  onPress,
  title,
  destructive = false,
  icon,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Text style={[styles.text, destructive && styles.destructiveText]}>
        {title}
      </Text>

      {icon && <View style={styles.iconContainer}>{icon}</View>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
