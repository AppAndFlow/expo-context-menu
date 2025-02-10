import React, { useState } from 'react';
import PortalContext from './PortalContext';
import { View } from 'react-native';
interface PortalProviderProps {
  children: React.ReactNode;
}
interface Element {
  name: string;
  component: React.ReactNode;
}
const PortalProvider: React.FC<PortalProviderProps> = ({ children }) => {
  const [components, setComponents] = useState<Record<string, React.ReactNode>>(
    {}
  );
  const addComponent = ({ name, component }: Element) => {
    setComponents((prevComponents) => ({
      ...prevComponents,
      [name]: component,
    }));
  };
  const removeComponent = (name: string) => {
    setComponents((prevComponents) => {
      const newComponents = { ...prevComponents };
      delete newComponents[name];
      return newComponents;
    });
  };
  return (
    <PortalContext.Provider value={{ addComponent, removeComponent }}>
      <View style={{ flex: 1 }}>
        <React.Fragment>{children}</React.Fragment>
        <View
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
            pointerEvents: 'box-none',
          }}
        >
          {Object.entries(components).map(([_name, Component]) => Component)}
        </View>
      </View>
    </PortalContext.Provider>
  );
};
export default PortalProvider;
