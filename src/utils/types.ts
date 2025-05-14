export type DiffLineType = '+' | '-' | null;

export interface LineType {
  diffLineType: DiffLineType;
  line: string;
  lineNumber: number;
};

export type FileChangeType = 'added' | 'deleted' | 'modified' | 'renamed';

export interface FormattedPathResult {
  fileChangeType: FileChangeType;
  formattedPath: string;
}
