import { type StructuredPatchHunk } from "diff";
import type { AlignedHunkLine, FormattedPathResult } from "./types";

export function generateHunkHeader(hunk: StructuredPatchHunk) {
  return `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`;
}

export function collectContiguousChanges(lines: string[], startIndex: number): [string[], string[]] {
  const removals: string[] = [];
  const additions: string[] = [];

  let i = startIndex;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('-')) {
      removals.push(line.slice(1));
    } else if (line.startsWith('+')) {
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

    if (line.startsWith(' ')) {
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
