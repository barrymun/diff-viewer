import { diffWordsWithSpace, type Hunk } from "diff";
import type { FormattedPathResult, LineType } from "./types";

export function generateHunkHeader(hunk: Hunk) {
  return `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;');
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
      
        if (removal?.line && addition?.line) {
          const changes = diffWordsWithSpace(removal.line, addition.line);
      
          oldLineHtml = '';
          newLineHtml = '';
      
          for (const part of changes) {
            const escapedPart = escapeHtml(part.value);
            if (part.added) {
              newLineHtml += `<ins>${escapedPart}</ins>`;
            } else if (part.removed) {
              oldLineHtml += `<del>${escapedPart}</del>`;
            } else {
              oldLineHtml += escapedPart;
              newLineHtml += escapedPart;
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
