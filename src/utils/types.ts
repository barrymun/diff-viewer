export type DiffLineType = '+' | '-' | null;

export interface LineType {
  diffLineType: DiffLineType;
  line: string;
  lineNumber: number;
};
