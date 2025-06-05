import { Box, Table, TableBody } from "@mui/material";
import type { StructuredPatch } from "diff";
import React from "react";

import DiffHeader from "../diffHeader";
import DiffSideHunk from "../diffSideHunk";

interface DiffSideTableProps {
  side: "left" | "right";
  structuredPatch: StructuredPatch;
}

export default function DiffSideTable({ side, structuredPatch }: DiffSideTableProps) {
  return (
    <Box sx={{ minWidth: 0, overflowX: "auto" }}>
      <Table>
        <TableBody>
          {structuredPatch.hunks.map((hunk, hunkIndex) => (
            <React.Fragment key={hunkIndex}>
              {side === "left" ? <DiffHeader hunk={hunk} /> : <DiffHeader />}
              <DiffSideHunk side={side} hunk={hunk} />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
