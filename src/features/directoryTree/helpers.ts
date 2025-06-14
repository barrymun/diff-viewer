import type { TreeViewBaseItem, TreeViewItemId } from "@mui/x-tree-view";
import type { StructuredPatch } from "diff";

import type { FileChangeType } from "../../utils/types";

import type { DirectoryTreeItem, PatchFileInfo } from "./types";

export function getAllItemsWithChildrenItemIds(items: TreeViewBaseItem[]) {
  const itemIds: TreeViewItemId[] = [];
  const registerItemId = (item: TreeViewBaseItem) => {
    if (item.children?.length) {
      itemIds.push(item.id);
      item.children.forEach(registerItemId);
    }
  };

  items.forEach(registerItemId);
  return itemIds;
}

/**
 * Extract file information from StructuredPatch array
 */
export function extractFileInfoFromPatches(patches: StructuredPatch[]): PatchFileInfo[] {
  if (!Array.isArray(patches)) return [];
  
  const fileInfos: PatchFileInfo[] = [];
  
  for (const patch of patches) {
    if (!patch) continue;
    
    const oldFileName = patch.oldFileName;
    const newFileName = patch.newFileName;
    
    // Determine change type based on file names
    let changeType: FileChangeType;
    let actualFilePath: string;
    
    if (!oldFileName || oldFileName === '/dev/null') {
      // File was added
      changeType = 'added';
      actualFilePath = newFileName || '';
    } else if (!newFileName || newFileName === '/dev/null') {
      // File was deleted
      changeType = 'deleted';
      actualFilePath = ''; // Don't include deleted files in directory structure
    } else if (oldFileName === newFileName) {
      // File was modified
      changeType = 'modified';
      actualFilePath = newFileName;
    } else {
      // File was renamed/moved
      changeType = 'renamed';
      actualFilePath = newFileName;
    }
    
    // Clean up git prefixes (a/ and b/)
    actualFilePath = actualFilePath.replace(/^[ab]\//, '');
    
    fileInfos.push({
      originalPath: oldFileName || '',
      newPath: newFileName || '',
      changeType,
      actualFilePath,
      patch
    });
  }
  
  return fileInfos;
}

/**
 * Build directory tree structure from file paths
 */
export function buildDirectoryTree(fileInfos: PatchFileInfo[]): DirectoryTreeItem[] {
  if (!Array.isArray(fileInfos)) return [];
  
  // Create a map to store all nodes
  const nodeMap = new Map<string, DirectoryTreeItem>();
  const rootChildren: DirectoryTreeItem[] = [];
  
  // Process each file
  for (const fileInfo of fileInfos) {
    if (!fileInfo.actualFilePath || fileInfo.changeType === 'deleted') {
      continue; // Skip deleted files and empty paths
    }
    
    const pathParts = fileInfo.actualFilePath.split('/').filter(Boolean);
    let currentPath = '';
    
    // Create directory nodes for each part of the path
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      const isFile = i === pathParts.length - 1;
      // const nodeId = currentPath.replace(/[^a-zA-Z0-9/]/g, '_');
      const nodeId = currentPath; // TODO: check validity
      
      // Check if node already exists
      if (!nodeMap.has(currentPath)) {
        const node: DirectoryTreeItem = {
          id: nodeId,
          label: part,
          type: isFile ? 'file' : 'directory',
          fullPath: currentPath,
          children: isFile ? undefined : []
        };
        
        // Add file-specific information
        if (isFile) {
          node.changeType = fileInfo.changeType;
          node.hunks = fileInfo.patch?.hunks?.length || 0;
          
          // Calculate additions and deletions
          if (fileInfo.patch?.hunks) {
            let additions = 0;
            let deletions = 0;
            
            for (const hunk of fileInfo.patch.hunks) {
              for (const line of hunk.lines) {
                if (line.startsWith('+') && !line.startsWith('+++')) {
                  additions++;
                } else if (line.startsWith('-') && !line.startsWith('---')) {
                  deletions++;
                }
              }
            }
            
            node.additions = additions;
            node.deletions = deletions;
          }
        }
        
        nodeMap.set(currentPath, node);
        
        // Add to parent or root
        if (parentPath) {
          const parent = nodeMap.get(parentPath);
          if (parent && parent.children) {
            parent.children.push(node);
          }
        } else {
          rootChildren.push(node);
        }
      }
    }
  }
  
  // Sort children in each directory (directories first, then files, alphabetically)
  const sortChildren = (items: DirectoryTreeItem[]) => {
    items.sort((a, b) => {
      // Directories first
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      // Then alphabetically
      return a.label.localeCompare(b.label);
    });
    
    // Recursively sort children
    items.forEach(item => {
      if (item.children) {
        sortChildren(item.children);
      }
    });
  };
  
  sortChildren(rootChildren);
  return rootChildren;
}

/**
 * Main function to convert StructuredPatch[] to TreeViewBaseItem[]
 */
export function convertPatchesToTreeItems(patches: StructuredPatch[]): DirectoryTreeItem[] {
  try {
    const fileInfos = extractFileInfoFromPatches(patches);
    const treeItems = buildDirectoryTree(fileInfos);
    return treeItems;
  } catch (error) {
    console.error('Error converting patches to tree items:', error);
    return [];
  }
}

/**
 * Get statistics from the tree items
 */
export function getTreeStatistics(items: DirectoryTreeItem[]) {
  let totalFiles = 0;
  let added = 0;
  let modified = 0;
  let deleted = 0;
  let renamed = 0;
  let totalAdditions = 0;
  let totalDeletions = 0;
  
  const traverse = (node: DirectoryTreeItem) => {
    if (node.type === 'file') {
      totalFiles++;
      totalAdditions += node.additions || 0;
      totalDeletions += node.deletions || 0;
      
      switch (node.changeType) {
        case 'added': added++; break;
        case 'modified': modified++; break;
        case 'deleted': deleted++; break;
        case 'renamed': renamed++; break;
      }
    }
    
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  
  items.forEach(traverse);
  
  return {
    totalFiles,
    added,
    modified,
    deleted,
    renamed,
    totalAdditions,
    totalDeletions
  };
}
