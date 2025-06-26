import { Box, Table, TableBody } from "@mui/material";
import type { StructuredPatch } from "diff";
import React from "react";

import DiffTableHeader from "@/features/diffViewer/common/diffTableHeader";
import DiffSideHunk from "@/features/diffViewer/splitViewer/splitTableHunk";

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
              {side === "left" ? <DiffTableHeader hunk={hunk} /> : <DiffTableHeader />}
              <DiffSideHunk side={side} hunk={hunk} />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
