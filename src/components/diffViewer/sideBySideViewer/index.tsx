import { Box, Divider, Table, TableBody } from "@mui/material";
import { type StructuredPatch } from "diff";
import React from "react";

import DiffSide from "./diffSide";
import DiffHeader from "./diffHeader";

interface SideBySideViewerProps {
  structuredPatch: StructuredPatch;
}

export default function SideBySideViewer({ structuredPatch }: SideBySideViewerProps) {

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>
      <Box sx={{ minWidth: 0, overflowX: "auto" }}>
        <Table>
          <TableBody>
            {structuredPatch.hunks.map((hunk, hunkIndex) => (
              <React.Fragment key={hunkIndex}>
                <DiffHeader hunk={hunk} />
                <DiffSide side="left" hunk={hunk} />
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Divider orientation="vertical" />

      <Box sx={{ minWidth: 0, overflowX: "auto" }}>
        <Table>
          <TableBody>
            {structuredPatch.hunks.map((hunk, hunkIndex) => (
              <React.Fragment key={hunkIndex}>
                <DiffHeader />
                <DiffSide side="right" hunk={hunk} />
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
