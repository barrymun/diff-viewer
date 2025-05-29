import { Box, Divider, Table, TableBody } from "@mui/material";
import { type ParsedDiff } from "diff";

import LeftSide from "./leftSide";
import RightSide from "./rightSide";

interface SideBySideViewerProps {
  parsedDiff: ParsedDiff;
}

export default function SideBySideViewer({ parsedDiff }: SideBySideViewerProps) {

  return (
    <>
      <Box sx={{ flex: 1, overflowX: "auto" }}>
        <Table>
          <TableBody>
            {parsedDiff.hunks.map((hunk, hunkIndex) => <LeftSide key={hunkIndex} hunk={hunk} />)}
          </TableBody>
        </Table>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowX: "auto" }}>
        <Table>
          <TableBody>
            {parsedDiff.hunks.map((hunk, hunkIndex) => <RightSide key={hunkIndex} hunk={hunk} />)}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
