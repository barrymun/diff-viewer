import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, Button, Stack } from "@mui/material";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useCallback, useEffect, useMemo, useState } from "react";

import { extractFileInfoFromPatches, getAllItemsWithChildrenItemIds } from "./helpers";
import { useAppState } from "../../hooks/useAppState";
import { CustomTreeItem } from "../../components/styled/customTreeItem";

export default function DirectoryTree() {
  const { directoryData, parsedDiffs, setSelectedParsedDiffs } = useAppState();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const patchFileInfos = useMemo(() => extractFileInfoFromPatches(parsedDiffs ?? []), [parsedDiffs]);
  const validFilePathsSet = useMemo(() => 
    new Set(patchFileInfos.map((item) => item.actualFilePath)), 
    [patchFileInfos]
  );

  const handleExpandClick = useCallback(
    () => {
      setExpandedItems((oldExpanded) =>
        oldExpanded.length === 0 ? getAllItemsWithChildrenItemIds(directoryData) : [],
      );
    },
    [directoryData]
  );

  const handleExpandedItemsChange = (_event: React.SyntheticEvent | null, itemIds: string[]) => {
    setExpandedItems(itemIds);
  };

  const handleSelectedItemsChange = useCallback(
    (_event: React.SyntheticEvent | null, itemIds: string[]) => {
      const validIds = itemIds.filter((itemId) => validFilePathsSet.has(itemId));
      // Don't set the selected items if the user clicks on a directory to be expanded/collapsed.
      if (validIds.length > 0) {
        setSelectedItems(validIds);
      }
    },
    [validFilePathsSet]
  );

  /**
   * Update the visible patch files based on the selected items.
   */
  useEffect(() => {
    const selectedItemsSet = new Set(selectedItems);
    const matchingPatches = patchFileInfos
      .filter(obj => selectedItemsSet.has(obj.actualFilePath))
      .map(obj => obj.patch);

    setSelectedParsedDiffs(matchingPatches);
  }, [patchFileInfos, selectedItems, setSelectedParsedDiffs]);

  /*
   * Auto-expand when the directory structure changes.
   */
  useEffect(() => {
    setExpandedItems(getAllItemsWithChildrenItemIds(directoryData));
  }, [directoryData]);

  return (
    <Stack spacing={1}>
      <Box>
        <Button fullWidth variant="outlined" size="small" onClick={handleExpandClick}>
          {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
      </Box>
      <Box sx={{ width: "fit-content", minWidth: "100%", overflowX: "auto" }}>
        <RichTreeView
          items={directoryData}
          expandedItems={expandedItems}
          onExpandedItemsChange={handleExpandedItemsChange}
          multiSelect
          selectedItems={selectedItems}
          onSelectedItemsChange={handleSelectedItemsChange}
          slots={{
            item: CustomTreeItem,
            collapseIcon: FolderOpenIcon,
            expandIcon: FolderIcon,
          }}
        />
      </Box>
    </Stack>
  );
}
