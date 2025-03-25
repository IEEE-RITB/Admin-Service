import * as React from "react"

export interface ProviderProps {
  children: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export { Provider }