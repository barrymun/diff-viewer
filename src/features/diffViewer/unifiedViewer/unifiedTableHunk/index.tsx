import type { StructuredPatchHunk } from "diff";
import { useMemo } from "react";

import { processUnifiedHunkLinesWithPairing } from "@/features/diffViewer/unifiedViewer/helpers";
import UnifiedTableRow from "@/features/diffViewer/unifiedViewer/unifiedTableRow";

export interface UnifiedTableHunkProps {
  hunk: StructuredPatchHunk;
}

export default function UnifiedTableHunk({ hunk }: UnifiedTableHunkProps) {
  const unifiedLines = useMemo(() => processUnifiedHunkLinesWithPairing(hunk), [hunk]);

  return unifiedLines.map((line, idx) => <UnifiedTableRow key={idx} line={line} />);
}
