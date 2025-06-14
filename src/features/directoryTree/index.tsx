import { Box, Button, Stack } from "@mui/material";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useCallback, useState } from "react";

import { getAllItemsWithChildrenItemIds } from "./helpers";
import { useAppState } from "../../hooks/useAppState";

export default function DirectoryTree() {
  const { directoryData } = useAppState();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleExpandedItemsChange = (_event: React.SyntheticEvent | null, itemIds: string[]) => {
    setExpandedItems(itemIds);
  };

  const handleExpandClick = useCallback(
    () => {
      setExpandedItems((oldExpanded) =>
        oldExpanded.length === 0 ? getAllItemsWithChildrenItemIds(directoryData) : [],
      );
    },
    [directoryData]
  );

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleExpandClick}>
          {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
      </div>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={directoryData}
          expandedItems={expandedItems}
          onExpandedItemsChange={handleExpandedItemsChange}
        />
      </Box>
    </Stack>
  );
}
