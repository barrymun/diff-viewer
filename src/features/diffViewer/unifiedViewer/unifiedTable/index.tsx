import { Table, TableBody } from "@mui/material";
import type { StructuredPatch } from "diff";
import React from "react";

import DiffTableHeader from "@/features/diffViewer/common/diffTableHeader";
import UnifiedTableHunk from "@/features/diffViewer/unifiedViewer/unifiedTableHunk";

export interface UnifiedDiffTableProps {
  structuredPatch: StructuredPatch;
}

export default function UnifiedTable({ structuredPatch }: UnifiedDiffTableProps) {
  return (
    <Table sx={{ borderCollapse: "separate" }}>
      <TableBody>
        {structuredPatch.hunks.map((hunk, hunkIndex) => (
          <React.Fragment key={hunkIndex}>
            <DiffTableHeader hunk={hunk} isUnifiedView />
            <UnifiedTableHunk hunk={hunk} />
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
