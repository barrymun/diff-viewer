import { type StructuredPatchHunk } from "diff";
import type { FormattedPathResult } from "./types";

import type { AlignedHunkLine } from "../features/diffViewer/splitViewer/types";

export function generateHunkHeader(hunk: StructuredPatchHunk) {
  return `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`;
}

export function stripGitPrefix(path: string | null | undefined): string {
  if (!path) return '';
  return path.replace(/^[ab]\//, '');
}

export function isDevNull(path: string | null | undefined): boolean {
  return !path || path === '/dev/null';
}

export function formatFileChangePath(
  from: string | null | undefined,
  to: string | null | undefined
): FormattedPathResult {
  if (isDevNull(from) && !isDevNull(to)) {
    return { fileChangeType: 'added', formattedPath: stripGitPrefix(to) };
  }

  if (!isDevNull(from) && isDevNull(to)) {
    return { fileChangeType: 'deleted', formattedPath: stripGitPrefix(from) };
  }

  const fromStripped = stripGitPrefix(from);
  const toStripped = stripGitPrefix(to);

  if (fromStripped === toStripped) {
    return { fileChangeType: 'modified', formattedPath: toStripped };
  }

  // Renamed — try brace formatting
  const fromParts = fromStripped.split('/');
  const toParts = toStripped.split('/');

  const len = Math.min(fromParts.length, toParts.length);

  // Find common prefix
  let divergeIndex = -1;
  for (let i = 0; i < len; i++) {
    if (fromParts[i] !== toParts[i]) {
      divergeIndex = i;
      break;
    }
  }

  if (divergeIndex === -1) {
    // No common path; fallback
    return { fileChangeType: 'renamed', formattedPath: `${fromStripped} → ${toStripped}` };
  }

  // Find common suffix
  let suffixIndex = 0;
  while (
    suffixIndex < fromParts.length - divergeIndex &&
    fromParts[fromParts.length - 1 - suffixIndex] === toParts[toParts.length - 1 - suffixIndex]
  ) {
    suffixIndex++;
  }

  const prefix = fromParts.slice(0, divergeIndex).join('/');
  const suffix = fromParts.slice(fromParts.length - suffixIndex).join('/');

  const oldMiddle = fromParts.slice(divergeIndex, fromParts.length - suffixIndex).join('/');
  const newMiddle = toParts.slice(divergeIndex, toParts.length - suffixIndex).join('/');

  const formattedPath = [
    prefix,
    `{${oldMiddle} → ${newMiddle}}`,
    suffix,
  ]
    .filter(Boolean)
    .join('/')
    .replace(/\/\/+/g, '/');

  return { fileChangeType: 'renamed', formattedPath };
}

export function getLineMetadata(line: AlignedHunkLine, isLeft: boolean) {
  const isAdded = line.oldLine === undefined && line.newLine !== undefined;
  const isRemoved = line.newLine === undefined && line.oldLine !== undefined;
  const isModified = line.oldLine && line.newLine && line.oldLine !== line.newLine;

  const lineNumber = isLeft ? line.oldLineNumber : line.newLineNumber;
  const lineContent = isLeft ? line.oldLine : line.newLine;

  const bgColor = isLeft
    ? isAdded
      ? "grey.200"
      : isRemoved || isModified
      ? "red.50"
      : "white"
    : isRemoved
    ? "grey.200"
    : isAdded || isModified
    ? "green.50"
    : "white";

  const symbol = isLeft
    ? (isRemoved || isModified ? "-" : "")
    : (isAdded || isModified ? "+" : "");
  
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
