import type { StructuredPatchHunk } from "diff";

import type { AlignedHunkLine } from "./types";

export function collectContiguousChanges(lines: string[], startIndex: number): [string[], string[]] {
  const removals: string[] = [];
  const additions: string[] = [];

  let i = startIndex;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("-")) {
      removals.push(line.slice(1));
    } else if (line.startsWith("+")) {
      additions.push(line.slice(1));
    } else {
      break;
    }
    i++;
  }

  return [removals, additions];
}

export function alignHunkLines(hunk: StructuredPatchHunk): AlignedHunkLine[] {
  const { lines, oldStart, newStart } = hunk;

  let oldLine = oldStart;
  let newLine = newStart;
  const result: AlignedHunkLine[] = [];

  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith(" ")) {
      const text = line.slice(1);
      result.push({
        oldLineNumber: oldLine++,
        oldLine: text,
        newLineNumber: newLine++,
        newLine: text,
      });
      i++;
      continue;
    }

    const [removals, additions] = collectContiguousChanges(lines, i);
    i += removals.length + additions.length;

    const maxLen = Math.max(removals.length, additions.length);
    for (let j = 0; j < maxLen; j++) {
      result.push({
        oldLineNumber: removals[j] !== undefined ? oldLine++ : undefined,
        oldLine: removals[j],
        newLineNumber: additions[j] !== undefined ? newLine++ : undefined,
        newLine: additions[j],
      });
    }
  }

  return result;
}

export function getSplitLineMetadata(line: AlignedHunkLine, isLeft: boolean) {
  const isAdded = line.oldLine === undefined && line.newLine !== undefined;
  const isRemoved = line.newLine === undefined && line.oldLine !== undefined;
  const isModified = line.oldLine && line.newLine && line.oldLine !== line.newLine;

  const lineNumber = isLeft ? line.oldLineNumber : line.newLineNumber;
  const lineContent = isLeft ? line.oldLine : line.newLine;

  let bgColor: string;
  if (isLeft) {
    if (isAdded) {
      bgColor = "grey.200";
    } else if (isRemoved || isModified) {
      bgColor = "red.50";
    } else {
      bgColor = "white";
    }
  } else {
    if (isRemoved) {
      bgColor = "grey.200";
    } else if (isAdded || isModified) {
      bgColor = "green.50";
    } else {
      bgColor = "white";
    }
  }

  let symbol: string;
  if (isLeft) {
    symbol = isRemoved || isModified ? "-" : "";
  } else {
    symbol = isAdded || isModified ? "+" : "";
  }

  return {
    isAdded,
    isRemoved,
    isModified,
    lineNumber,
    lineContent,
    bgColor,
    symbol,
  };
}
