export interface UnifiedDiffLine {
  type: 'context' | 'removal' | 'addition';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}
