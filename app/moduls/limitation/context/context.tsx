import { createContext, useContext, useState } from "react";
import type * as LimitationTypes from "app/moduls/limitation/types";

interface LimitationsContextType {
  limitations: LimitationTypes.IApi.ILimitation[];
  setLimitations: React.Dispatch<React.SetStateAction<LimitationTypes.IApi.ILimitation[]>>;
}

const LimitationsContext = createContext<LimitationsContextType | undefined>(undefined);

export function LimitationsProvider({ children }: { children: React.ReactNode }) {
  const [limitations, setLimitations] = useState<LimitationTypes.IApi.ILimitation[]>([]);

  return (
    <LimitationsContext.Provider value={{ limitations, setLimitations }}>
      {children}
    </LimitationsContext.Provider>
  );
}

export function useLimitationsContext() {
  const context = useContext(LimitationsContext);
  if (context === undefined) {
    throw new Error("useLimitationsContext must be used within a LimitationsProvider");
  }
  return context;
}