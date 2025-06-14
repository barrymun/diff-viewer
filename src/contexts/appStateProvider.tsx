import { createContext, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";

import type { DiffViewType } from "../utils/types";
import type { StructuredPatch } from "diff";
import { convertPatchesToTreeItems } from "../features/directoryTree/helpers";

interface AppStateContextProps {
  diffViewType: DiffViewType;
  setDiffViewType: Dispatch<SetStateAction<DiffViewType>>;
  parsedDiffs: StructuredPatch[] | null;
  setParsedDiffs: Dispatch<SetStateAction<StructuredPatch[] | null>>;
  selectedParsedDiffs: StructuredPatch[] | null;
  setSelectedParsedDiffs: Dispatch<SetStateAction<StructuredPatch[] | null>>;
  directoryData: ReturnType<typeof convertPatchesToTreeItems>;
  setDirectoryData: Dispatch<SetStateAction<ReturnType<typeof convertPatchesToTreeItems>>>;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

interface AppStateProviderProps {
  children: React.ReactNode;
}

function AppStateProvider({ children }: AppStateProviderProps) {
  const [diffViewType, setDiffViewType] = useState<DiffViewType>("unified");
  const [parsedDiffs, setParsedDiffs] = useState<StructuredPatch[] | null>(null);
  const [selectedParsedDiffs, setSelectedParsedDiffs] = useState<StructuredPatch[] | null>(null);
  const [directoryData, setDirectoryData] = useState<ReturnType<typeof convertPatchesToTreeItems>>([]);

  const value = useMemo(() => ({
    diffViewType,
    setDiffViewType,
    parsedDiffs,
    setParsedDiffs,
    selectedParsedDiffs,
    setSelectedParsedDiffs,
    directoryData,
    setDirectoryData,
  }), [diffViewType, directoryData, parsedDiffs, selectedParsedDiffs]);

  /**
   * Reset the selected parsed diffs when the parsed diffs change.
   */
  useEffect(() => {
    if (parsedDiffs) {
      setSelectedParsedDiffs(parsedDiffs);
    }
  }, [parsedDiffs]);

  /**
   * Derive the directory structure when the parsed diffs change.
   */
  useEffect(() => {
    if (parsedDiffs) {
      const data = convertPatchesToTreeItems(parsedDiffs);
      setDirectoryData(data);
    }
  }, [parsedDiffs]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export { AppStateContext, AppStateProvider };
