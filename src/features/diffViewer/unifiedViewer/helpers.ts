import type { StructuredPatchHunk } from "diff";

import type { UnifiedDiffLine } from "./types";

export function processUnifiedHunkLines(hunk: StructuredPatchHunk): UnifiedDiffLine[] {
  const { lines, oldStart, newStart } = hunk;
  
  let oldLine = oldStart;
  let newLine = newStart;
  const result: UnifiedDiffLine[] = [];

  for (const line of lines) {
    if (line.startsWith(' ')) {
      // Context line - appears in both old and new
      const content = line.slice(1);
      result.push({
        type: 'context',
        content,
        oldLineNumber: oldLine++,
        newLineNumber: newLine++,
      });
    } else if (line.startsWith('-')) {
      // Removal line - only in old version
      const content = line.slice(1);
      result.push({
        type: 'removal',
        content,
        oldLineNumber: oldLine++,
        newLineNumber: undefined,
      });
    } else if (line.startsWith('+')) {
      // Addition line - only in new version
      const content = line.slice(1);
      result.push({
        type: 'addition',
        content,
        oldLineNumber: undefined,
        newLineNumber: newLine++,
      });
    }
  }

  return result;
}

export function getUnifiedLineMetadata(line: UnifiedDiffLine) {
  switch (line.type) {
    case 'context':
      return {
        symbol: ' ',
        bgColor: 'transparent',
        textColor: 'text.primary',
        oldLineNumber: line.oldLineNumber,
        newLineNumber: line.newLineNumber,
      };
    case 'removal':
      return {
        symbol: '-',
        bgColor: 'red.50', // or whatever your theme uses for removals
        textColor: 'text.primary',
        oldLineNumber: line.oldLineNumber,
        newLineNumber: undefined,
      };
    case 'addition':
      return {
        symbol: '+',
        bgColor: 'green.50', // or whatever your theme uses for additions
        textColor: 'text.primary',
        oldLineNumber: undefined,
        newLineNumber: line.newLineNumber,
      };
    default:
      return {
        symbol: ' ',
        bgColor: 'transparent',
        textColor: 'text.primary',
        oldLineNumber: undefined,
        newLineNumber: undefined,
      };
  }
}

// Optional: Enhanced version with word-level diffing for modified lines
export function processUnifiedHunkLinesWithWordDiff(hunk: StructuredPatchHunk): UnifiedDiffLine[] {
  const { lines, oldStart, newStart } = hunk;
  
  let oldLine = oldStart;
  let newLine = newStart;
  const result: UnifiedDiffLine[] = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    if (line.startsWith(' ')) {
      // Context line
      const content = line.slice(1);
      result.push({
        type: 'context',
        content,
        oldLineNumber: oldLine++,
        newLineNumber: newLine++,
      });
      i++;
    } else if (line.startsWith('-') || line.startsWith('+')) {
      // Look ahead to see if we have a pair of - and + lines
      const removals: string[] = [];
      const additions: string[] = [];
      
      // Collect consecutive removals
      let j = i;
      while (j < lines.length && lines[j].startsWith('-')) {
        removals.push(lines[j].slice(1));
        j++;
      }
      
      // Collect consecutive additions
      while (j < lines.length && lines[j].startsWith('+')) {
        additions.push(lines[j].slice(1));
        j++;
      }
      
      // Add removals
      for (const removal of removals) {
        result.push({
          type: 'removal',
          content: removal,
          oldLineNumber: oldLine++,
          newLineNumber: undefined,
        });
      }
      
      // Add additions
      for (const addition of additions) {
        result.push({
          type: 'addition',
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
