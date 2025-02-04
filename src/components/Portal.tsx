import React, { useContext, useEffect } from 'react';
import PortalContext from './PortalContext';

interface PortalProps {
  children: React.ReactNode;
  name: string;
}
const Portal: React.FC<PortalProps> = ({ children, name }) => {
  const { addComponent, removeComponent } = useContext(PortalContext);
  useEffect(() => {
    addComponent({ name, component: children });
    return () => {
      removeComponent(name);
    };
  }, [addComponent, children, name, removeComponent]);

  return null;
};
export default Portal;
