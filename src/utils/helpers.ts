import { diffWordsWithSpace, type Hunk } from "diff";
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
        const removal = pendingRemovals[j];
        const addition = pendingAdditions[j];
      
        const oldLineContent = removal?.line ?? null;
        const newLineContent = addition?.line ?? null;
      
        let oldLineHtml = oldLineContent;
        let newLineHtml = newLineContent;
      
        // If both sides exist, diff them
        if (removal?.line && addition?.line) {
          const changes = diffWordsWithSpace(removal.line, addition.line);
      
          oldLineHtml = '';
          newLineHtml = '';
      
          for (const part of changes) {
            if (part.added) {
              newLineHtml += `<span style="background-color: #a6f3a6;">${part.value}</span>`;
            } else if (part.removed) {
              oldLineHtml += `<span style="background-color: #f7a6a6;">${part.value}</span>`;
            } else {
              oldLineHtml += part.value;
              newLineHtml += part.value;
            }
          }
        }
      
        result.push({
          oldLineType: removal?.diffLineType,
          oldLineNumber: removal?.lineNumber,
          oldLine: oldLineHtml,
          newLineType: addition?.diffLineType,
          newLineNumber: addition?.lineNumber,
          newLine: newLineHtml,
        });
      }
    }
  }

  return result;
}
