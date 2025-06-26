import type { TreeViewBaseItem } from "@mui/x-tree-view";
import type { StructuredPatch } from "diff";

import type { FileChangeType } from "@/utils/types";

export interface DirectoryTreeItem extends TreeViewBaseItem {
  id: string;
  label: string;
  children?: DirectoryTreeItem[];
  // Custom properties for patch information
  type?: "file" | "directory";
  changeType?: FileChangeType;
  fullPath?: string;
  additions?: number;
  deletions?: number;
  hunks?: number;
}

export interface PatchFileInfo {
  originalPath: string;
  newPath: string;
  changeType: FileChangeType;
  actualFilePath: string;
  patch: StructuredPatch;
}
