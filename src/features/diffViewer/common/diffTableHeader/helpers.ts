import type { StructuredPatchHunk } from "diff";

export function generateHunkHeader(hunk: StructuredPatchHunk) {
  return `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`;
}
