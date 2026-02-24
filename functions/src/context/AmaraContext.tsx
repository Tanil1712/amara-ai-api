import React, { createContext, useContext, useState } from "react";
type AmaraContextType = {
  visible: boolean;
  contextText?: string;
  openAmara: (context?: string) => void;
  closeAmara: () => void;
};
const AmaraContext = createContext<AmaraContextType>(null as any);
export function AmaraProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [contextText, setContextText] = useState<string | undefined>();
  const openAmara = (context?: string) => {
    setContextText(context);
    setVisible(true);
  };
  const closeAmara = () => {
    setVisible(false);
    setContextText(undefined);
  };
  return (
    <AmaraContext.Provider
      value={{ visible, contextText, openAmara, closeAmara }}
    >
      {children}
    </AmaraContext.Provider>
  );
}
export function useAmara() {
  return useContext(AmaraContext);
}