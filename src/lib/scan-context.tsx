import { createContext, useContext, useState, ReactNode } from "react";
import { IdentifyResult } from "@/api-client";

interface ScanContextType {
  lastResult: IdentifyResult | null;
  setLastResult: (result: IdentifyResult | null) => void;
  clearResult: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [lastResult, setLastResult] = useState<IdentifyResult | null>(null);

  const clearResult = () => setLastResult(null);

  return (
    <ScanContext.Provider value={{ lastResult, setLastResult, clearResult }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScanResult() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error("useScanResult must be used within a ScanProvider");
  }
  return context;
}
