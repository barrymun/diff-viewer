import type { StructuredPatchHunk } from "diff";

import SplitTableRow from "../splitTableRow";
import { memo, useMemo } from "react";
import { alignHunkLines } from "../helpers";

interface DiffSideHunkProps {
  side: "left" | "right";
  hunk: StructuredPatchHunk;
}

const MemoizedDiffSideRow = memo(SplitTableRow);

export default function DiffSideHunk({ side, hunk }: DiffSideHunkProps) {
  const alignedLines = useMemo(() => alignHunkLines(hunk), [hunk]);

  return alignedLines.map((line, idx) => (
    <MemoizedDiffSideRow key={idx} side={side} line={line} />
  ));
}
