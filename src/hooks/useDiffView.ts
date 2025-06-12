import { useContext } from "react";

import { DiffViewContext } from "../contexts/diffViewProvider";

export function useDiffView() {
  const context = useContext(DiffViewContext);
  if (!context) {
    throw new Error("useDiffView must be used within a DiffViewProvider");
  }
  return context;
}
