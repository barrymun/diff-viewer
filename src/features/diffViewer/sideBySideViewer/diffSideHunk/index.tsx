import type { StructuredPatchHunk } from "diff";

import { alignHunkLines } from "../../../../utils/helpers";
import DiffSideRow from "../diffSideRow";
import { useMemo } from "react";

interface DiffSideHunkProps {
  side: "left" | "right";
  hunk: StructuredPatchHunk;
}

export default function DiffSideHunk({ side, hunk }: DiffSideHunkProps) {
  const alignedLines = useMemo(() => alignHunkLines(hunk), [hunk]);

  return alignedLines.map((line, idx) => (
    <DiffSideRow key={idx} side={side} line={line} />
  ));
}
