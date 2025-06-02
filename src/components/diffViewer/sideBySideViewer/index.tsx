import { Box, Divider, Table, TableBody } from "@mui/material";
import { type ParsedDiff } from "diff";
import React from "react";

import DiffSide from "./diffSide";
import DiffHeader from "./diffHeader";

interface SideBySideViewerProps {
  parsedDiff: ParsedDiff;
}

export default function SideBySideViewer({ parsedDiff }: SideBySideViewerProps) {

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>
      <Box sx={{ minWidth: 0, overflowX: "auto" }}>
        <Table>
          <TableBody>
            {parsedDiff.hunks.map((hunk, hunkIndex) => (
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
            {parsedDiff.hunks.map((hunk, hunkIndex) => (
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
