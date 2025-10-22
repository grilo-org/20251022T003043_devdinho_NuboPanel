import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderContextType {
  showHeader: boolean;
  setShowHeader: (show: boolean) => void;
  toggleHeader: () => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showHeader, setShowHeader] = useState(false);

  const toggleHeader = () => {
    setShowHeader(prev => !prev);
  };

  return (
    <HeaderContext.Provider value={{ showHeader, setShowHeader, toggleHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};