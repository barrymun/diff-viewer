import { Box, Divider, Table, TableBody } from "@mui/material";
import { type ParsedDiff } from "diff";

import DiffSide from "./diffSide";

interface SideBySideViewerProps {
  parsedDiff: ParsedDiff;
}

export default function SideBySideViewer({ parsedDiff }: SideBySideViewerProps) {

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>
      <Box sx={{ minWidth: 0, overflowX: "auto" }}>
        <Table>
          <TableBody>
            {parsedDiff.hunks.map((hunk, hunkIndex) => <DiffSide key={hunkIndex} side="left" hunk={hunk} />)}
          </TableBody>
        </Table>
      </Box>

      <Divider orientation="vertical" />

      <Box sx={{ minWidth: 0, overflowX: "auto" }}>
        <Table>
          <TableBody>
            {parsedDiff.hunks.map((hunk, hunkIndex) => <DiffSide key={hunkIndex} side="right" hunk={hunk} />)}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
