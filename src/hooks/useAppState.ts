import { useContext } from "react";

import { AppStateContext } from "@/contexts/appStateProvider";

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return context;
}
