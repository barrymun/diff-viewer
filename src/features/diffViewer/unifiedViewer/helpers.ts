import type { StructuredPatchHunk } from "diff";

import type { UnifiedDiffLine, UnifiedDiffLineWithDiff } from "./types";

export function processUnifiedHunkLinesWithPairing(hunk: StructuredPatchHunk): UnifiedDiffLineWithDiff[] {
  const { lines, oldStart, newStart } = hunk;

  let oldLine = oldStart;
  let newLine = newStart;
  const result: UnifiedDiffLineWithDiff[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith(" ")) {
      // Context line
      const content = line.slice(1);
      result.push({
        type: "context",
        content,
        oldLineNumber: oldLine++,
        newLineNumber: newLine++,
      });
      i++;
    } else if (line.startsWith("-") || line.startsWith("+")) {
      // Collect consecutive removals and additions
      const removals: string[] = [];
      const additions: string[] = [];

      let j = i;
      while (j < lines.length && lines[j].startsWith("-")) {
        removals.push(lines[j].slice(1));
        j++;
      }

      while (j < lines.length && lines[j].startsWith("+")) {
        additions.push(lines[j].slice(1));
        j++;
      }

      // Create paired lines for word-level diffing
      const maxLen = Math.max(removals.length, additions.length);
      for (let k = 0; k < maxLen; k++) {
        const removal = removals[k];
        const addition = additions[k];

        if (removal !== undefined) {
          const removalLine: UnifiedDiffLineWithDiff = {
            type: "removal",
            content: removal,
            oldLineNumber: oldLine++,
            newLineNumber: undefined,
            pairedLine:
              addition !== undefined
                ? {
                    type: "addition",
                    content: addition,
                    oldLineNumber: undefined,
                    newLineNumber: newLine + k,
                  }
                : undefined,
          };
          result.push(removalLine);
        }

        if (addition !== undefined) {
          const additionLine: UnifiedDiffLineWithDiff = {
            type: "addition",
            content: addition,
            oldLineNumber: undefined,
            newLineNumber: newLine++,
            pairedLine:
              removal !== undefined
                ? {
                    type: "removal",
                    content: removal,
                    oldLineNumber: oldLine - 1,
                    newLineNumber: undefined,
                  }
                : undefined,
          };
          result.push(additionLine);
        }
      }

      i = j;
    } else {
      i++;
    }
  }

  return result;
}

export function getUnifiedLineMetadata(line: UnifiedDiffLine) {
  switch (line.type) {
    case "context":
      return {
        symbol: " ",
        bgColor: "white",
        textColor: "text.primary",
        oldLineNumber: line.oldLineNumber,
        newLineNumber: line.newLineNumber,
      };
    case "removal":
      return {
        symbol: "-",
        bgColor: "red.50",
        textColor: "text.primary",
        oldLineNumber: line.oldLineNumber,
        newLineNumber: undefined,
      };
    case "addition":
      return {
        symbol: "+",
        bgColor: "green.50",
        textColor: "text.primary",
        oldLineNumber: undefined,
        newLineNumber: line.newLineNumber,
      };
    default:
      return {
        symbol: " ",
        bgColor: "white",
        textColor: "text.primary",
        oldLineNumber: undefined,
        newLineNumber: undefined,
      };
  }
}

export function processUnifiedHunkLinesWithWordDiff(hunk: StructuredPatchHunk): UnifiedDiffLine[] {
  const { lines, oldStart, newStart } = hunk;

  let oldLine = oldStart;
  let newLine = newStart;
  const result: UnifiedDiffLine[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith(" ")) {
      // Context line
      const content = line.slice(1);
      result.push({
        type: "context",
        content,
        oldLineNumber: oldLine++,
        newLineNumber: newLine++,
      });
      i++;
    } else if (line.startsWith("-") || line.startsWith("+")) {
      // Look ahead to see if we have a pair of - and + lines
      const removals: string[] = [];
      const additions: string[] = [];

      // Collect consecutive removals
      let j = i;
      while (j < lines.length && lines[j].startsWith("-")) {
        removals.push(lines[j].slice(1));
        j++;
      }

      // Collect consecutive additions
      while (j < lines.length && lines[j].startsWith("+")) {
        additions.push(lines[j].slice(1));
        j++;
      }

      // Add removals
      for (const removal of removals) {
        result.push({
          type: "removal",
          content: removal,
          oldLineNumber: oldLine++,
          newLineNumber: undefined,
        });
      }

      // Add additions
      for (const addition of additions) {
        result.push({
          type: "addition",
          content: addition,
          oldLineNumber: undefined,
          newLineNumber: newLine++,
        });
      }

      i = j;
    } else {
      // Skip any other lines
      i++;
    }
  }

  return result;
}
