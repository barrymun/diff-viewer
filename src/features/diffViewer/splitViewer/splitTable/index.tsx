import { Box, Table, TableBody } from "@mui/material";
import type { StructuredPatch } from "diff";
import React from "react";

import SplitTableHeaderHeader from "../splitTableHeader";
import DiffSideHunk from "../splitTableHunk";

interface SplitTableHunkProps {
  side: "left" | "right";
  structuredPatch: StructuredPatch;
}

export default function SplitTableHunk({ side, structuredPatch }: SplitTableHunkProps) {
  return (
    <Box sx={{ minWidth: 0, overflowX: "auto" }}>
      <Table>
        <TableBody>
          {structuredPatch.hunks.map((hunk, hunkIndex) => (
            <React.Fragment key={hunkIndex}>
              {side === "left" ? <SplitTableHeaderHeader hunk={hunk} /> : <SplitTableHeaderHeader />}
              <DiffSideHunk side={side} hunk={hunk} />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
