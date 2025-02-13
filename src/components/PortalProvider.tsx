import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';

export const PortalProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  return (
    <GestureHandlerRootView>
      <Host>{children}</Host>
    </GestureHandlerRootView>
  );
};
