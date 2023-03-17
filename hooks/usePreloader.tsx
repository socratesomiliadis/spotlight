import { useState } from 'react';
import { createContext, useContext } from 'react';

interface PreloaderContextType {
  isPreloading: boolean;
  setIsPreloading: (value: boolean) => void;
  isInApp: boolean;
  setIsInApp: (value: boolean) => void;
}

export const PreloaderContext = createContext<PreloaderContextType>({
  isPreloading: true,
  setIsPreloading: () => {},
  isInApp: false,
  setIsInApp: () => {}
});

export function usePreloader() {
  return useContext(PreloaderContext);
}

export default function PreloaderProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isPreloading, setIsPreloading] = useState(true);
  const [isInApp, setIsInApp] = useState(false);

  return (
    <PreloaderContext.Provider
      value={{ isPreloading, setIsPreloading, isInApp, setIsInApp }}
    >
      {children}
    </PreloaderContext.Provider>
  );
}
