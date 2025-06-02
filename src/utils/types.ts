export type AlignedHunkLine = {
  oldLineNumber?: number;
  oldLine?: string;
  newLineNumber?: number;
  newLine?: string;
};

export type FileChangeType = 'added' | 'deleted' | 'modified' | 'renamed';

export interface FormattedPathResult {
  fileChangeType: FileChangeType;
  formattedPath: string;
}
