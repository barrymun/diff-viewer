import { createContext, useMemo, useState, type Dispatch, type SetStateAction } from "react";

import type { DiffViewType } from "../utils/types";

interface DiffViewContextProps {
  diffViewType: DiffViewType;
  setDiffViewType: Dispatch<SetStateAction<DiffViewType>>
}

const DiffViewContext = createContext<DiffViewContextProps | undefined>(undefined);

interface DiffViewProviderProps {
  children: React.ReactNode;
}

function DiffViewProvider({ children }: DiffViewProviderProps) {
  const [diffViewType, setDiffViewType] = useState<DiffViewType>("unified")

  const value = useMemo(() => ({ diffViewType, setDiffViewType }), [diffViewType, setDiffViewType]);

  return <DiffViewContext.Provider value={value}>{children}</DiffViewContext.Provider>;
}

export { DiffViewContext, DiffViewProvider };
