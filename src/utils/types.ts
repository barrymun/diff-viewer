export type FileChangeType = 'added' | 'deleted' | 'modified' | 'renamed';

export interface FormattedPathResult {
  fileChangeType: FileChangeType;
  formattedPath: string;
}
