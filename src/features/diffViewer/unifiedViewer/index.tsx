import { Box } from "@mui/material";
import type { StructuredPatch } from "diff";

import { UnifiedTable } from "./unifiedTable";

export interface UnifiedViewerProps {
  structuredPatch: StructuredPatch;
}

export function UnifiedViewer({ structuredPatch }: UnifiedViewerProps) {
  return (
    <Box sx={{ minWidth: 0, overflowX: "auto" }}>
      <UnifiedTable structuredPatch={structuredPatch} />
    </Box>
  );
}
