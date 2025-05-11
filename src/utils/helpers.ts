import type { LinePair } from "./types";

export function getAlignedLinesWithNumbers(lines: string[], oldStart: number, newStart: number) {
  const result: {
    oldLineNumber?: number;
    oldLine?: string | null;
    newLineNumber?: number;
    newLine?: string | null;
  }[] = [];

  let i = 0;
  let oldLine = oldStart;
  let newLine = newStart;

  const pendingRemovals: { line: string; lineNumber: number }[] = [];
  const pendingAdditions: { line: string; lineNumber: number }[] = [];

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith(' ')) {
      result.push({
        oldLineNumber: oldLine,
        oldLine: line,
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
          pendingRemovals.push({ line: lines[i], lineNumber: oldLine++ });
        } else {
          pendingAdditions.push({ line: lines[i], lineNumber: newLine++ });
        }
        i++;
      }

      const maxLen = Math.max(pendingRemovals.length, pendingAdditions.length);
      for (let j = 0; j < maxLen; j++) {
        result.push({
          oldLineNumber: pendingRemovals[j]?.lineNumber,
          oldLine: pendingRemovals[j]?.line ?? null,
          newLineNumber: pendingAdditions[j]?.lineNumber,
          newLine: pendingAdditions[j]?.line ?? null,
        });
      }
    }
  }

  return result;
}


export function normalizeLinePairs(pairs: LinePair[]): LinePair[] {
  // Just ensure left/right are same length in terms of non-null lines
  return pairs.map(p => ({
    leftLine: p.leftLine ?? null,
    rightLine: p.rightLine ?? null,
  }));
}
