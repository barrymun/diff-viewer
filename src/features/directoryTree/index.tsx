import { Box, Button, Stack } from "@mui/material";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useCallback, useEffect, useMemo, useState } from "react";

import { extractFileInfoFromPatches, getAllItemsWithChildrenItemIds } from "./helpers";
import { useAppState } from "../../hooks/useAppState";

export default function DirectoryTree() {
  const { directoryData, parsedDiffs, setSelectedParsedDiffs } = useAppState();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filePatchInfos = useMemo(() => extractFileInfoFromPatches(parsedDiffs ?? []), [parsedDiffs]);
  const validFilePathsSet = useMemo(() => 
    new Set(filePatchInfos.map((item) => item.actualFilePath)), 
    [filePatchInfos]
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

  const handleSelectedItemsChange = (_event: React.SyntheticEvent | null, itemIds: string[]) => {
    const validIds = itemIds.filter((itemId) => validFilePathsSet.has(itemId));
    if (validIds.length > 0) {
      setSelectedItems(validIds);
    }
  };

  /**
   * Update the visible patch files based on the selected items.
   */
  useEffect(() => {
    const selectedItemsSet = new Set(selectedItems);
    const matchingPatches = filePatchInfos
      .filter(obj => selectedItemsSet.has(obj.actualFilePath))
      .map(obj => obj.patch);

    setSelectedParsedDiffs(matchingPatches);
  }, [filePatchInfos, selectedItems, setSelectedParsedDiffs]);

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleExpandClick}>
          {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
      </div>
      <Box sx={{ minHeight: 350, minWidth: 250 }}>
        <RichTreeView
          items={directoryData}
          expandedItems={expandedItems}
          onExpandedItemsChange={handleExpandedItemsChange}
          multiSelect
          selectedItems={selectedItems}
          onSelectedItemsChange={handleSelectedItemsChange}
        />
      </Box>
    </Stack>
  );
}
