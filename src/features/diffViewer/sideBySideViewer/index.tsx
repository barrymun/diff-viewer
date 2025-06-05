import { Box, Divider } from "@mui/material";
import { type StructuredPatch } from "diff";

import DiffSideTable from "./diffSideTable";

interface SideBySideViewerProps {
  structuredPatch: StructuredPatch;
}

export default function SideBySideViewer({ structuredPatch }: SideBySideViewerProps) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>
      <DiffSideTable side="left" structuredPatch={structuredPatch} />
      <Divider orientation="vertical" />
      <DiffSideTable side="right" structuredPatch={structuredPatch} />
    </Box>
  );
}
