import { createContext, useMemo, useState, type Dispatch, type SetStateAction } from "react";

import type { DiffViewType } from "../utils/types";
import type { StructuredPatch } from "diff";

interface AppStateContextProps {
  diffViewType: DiffViewType;
  setDiffViewType: Dispatch<SetStateAction<DiffViewType>>;
  parsedDiffs: StructuredPatch[] | null;
  setParsedDiffs: Dispatch<SetStateAction<StructuredPatch[] | null>>;
  selectedParsedDiffs: StructuredPatch[] | null;
  setSelectedParsedDiffs: Dispatch<SetStateAction<StructuredPatch[] | null>>;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

interface AppStateProviderProps {
  children: React.ReactNode;
}

function AppStateProvider({ children }: AppStateProviderProps) {
  const [diffViewType, setDiffViewType] = useState<DiffViewType>("unified");
  const [parsedDiffs, setParsedDiffs] = useState<StructuredPatch[] | null>(null);
  const [selectedParsedDiffs, setSelectedParsedDiffs] = useState<StructuredPatch[] | null>(null);

  const value = useMemo(() => ({
    diffViewType,
    setDiffViewType,
    parsedDiffs,
    setParsedDiffs,
    selectedParsedDiffs,
    setSelectedParsedDiffs,
  }), [diffViewType, parsedDiffs, selectedParsedDiffs]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export { AppStateContext, AppStateProvider };
