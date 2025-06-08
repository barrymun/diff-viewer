import { Box, Divider } from "@mui/material";
import { type StructuredPatch } from "diff";

import SplitTableHunk from "./splitTable";

interface SideBySideViewerProps {
  structuredPatch: StructuredPatch;
}

export default function SplitViewer({ structuredPatch }: SideBySideViewerProps) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>
      <SplitTableHunk side="left" structuredPatch={structuredPatch} />
      <Divider orientation="vertical" />
      <SplitTableHunk side="right" structuredPatch={structuredPatch} />
    </Box>
  );
}
