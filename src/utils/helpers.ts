import type { Hunk } from "diff";
import type { LineType } from "./types";

export function generateHunkHeader(hunk: Hunk) {
  return `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`;
}

export function getAlignedLinesWithNumbers(hunk: Hunk) {
  const { lines, oldStart, newStart } = hunk;

  const result: {
    oldLineType: LineType["diffLineType"];
    oldLineNumber?: number;
    oldLine?: string | null;
    newLineType: LineType["diffLineType"];
    newLineNumber?: number;
    newLine?: string | null;
  }[] = [];

  let i = 0;
  let oldLine = oldStart;
  let newLine = newStart;

  const pendingRemovals: LineType[] = [];
  const pendingAdditions: LineType[] = [];

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith(' ')) {
      result.push({
        oldLineType: null,
        oldLineNumber: oldLine,
        oldLine: line,
        newLineType: null,
        newLineNumber: newLine,
        newLine: line,
      });
      oldLine++;
      newLine++;
      i++;
    } else {
      // Start collecting a contiguous diff block
      pendingRemovals.length = 0;
      pendingAdditions.length = 0;

      while (i < lines.length && (lines[i].startsWith('-') || lines[i].startsWith('+'))) {
        if (lines[i].startsWith('-')) {
          pendingRemovals.push({ diffLineType: "-", line: lines[i].replace("-", " "), lineNumber: oldLine++ });
        } else {
          pendingAdditions.push({ diffLineType: "+", line: lines[i].replace("+", " "), lineNumber: newLine++ });
        }
        i++;
      }

      const maxLen = Math.max(pendingRemovals.length, pendingAdditions.length);
      for (let j = 0; j < maxLen; j++) {
        result.push({
          oldLineType: pendingRemovals[j]?.diffLineType,
          oldLineNumber: pendingRemovals[j]?.lineNumber,
          oldLine: pendingRemovals[j]?.line ?? null,
          newLineType: pendingAdditions[j]?.diffLineType,
          newLineNumber: pendingAdditions[j]?.lineNumber,
          newLine: pendingAdditions[j]?.line ?? null,
        });
      }
    }
  }

  return result;
}
