import type { StructuredPatchHunk } from "diff";
import { useMemo } from "react";

import { processUnifiedHunkLinesWithPairing } from "../helpers";
import { UnifiedTableRow } from "../unifiedTableRow";

export interface UnifiedTableHunkProps {
  hunk: StructuredPatchHunk;
}

export function UnifiedTableHunk({ hunk }: UnifiedTableHunkProps) {
  const unifiedLines = useMemo(() => processUnifiedHunkLinesWithPairing(hunk), [hunk]);

  return unifiedLines.map((line, idx) => (
    <UnifiedTableRow key={idx} line={line} />
  ));
}
