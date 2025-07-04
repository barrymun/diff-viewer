import { TableRow, Typography, useTheme } from "@mui/material";
import type { StructuredPatchHunk } from "diff";

import MinimalTableCell from "@/components/styled/minimalTableCell";

import { generateHunkHeader } from "./helpers";

interface DiffTableHeaderProps {
  hunk?: StructuredPatchHunk;
  isUnifiedView?: boolean;
}

export default function DiffTableHeader({ hunk, isUnifiedView = false }: DiffTableHeaderProps) {
  const { spacing } = useTheme();
  const text = hunk ? generateHunkHeader(hunk) : "";

  return (
    <TableRow sx={{ bgcolor: "grey.50", userSelect: "none" }}>
      <MinimalTableCell
        sx={{
          minWidth: {
            xs: spacing(6),
            sm: spacing(7),
          },
          position: "sticky",
          left: 0,
          textAlign: "right",
          bgcolor: "grey.50",
        }}
      >
        {"\u00a0"}
      </MinimalTableCell>
      {isUnifiedView && (
        <MinimalTableCell
          sx={{
            minWidth: {
              xs: spacing(6),
              sm: spacing(7),
            },
            position: "sticky",
            left: 0,
            textAlign: "right",
            bgcolor: "grey.50",
          }}
        >
          {"\u00a0"}
        </MinimalTableCell>
      )}
      <MinimalTableCell sx={{ minWidth: spacing(3) }} />
      <MinimalTableCell sx={{ width: "100%" }}>
        <Typography variant="body1" component="span" sx={{ color: "grey.500", px: 1 }}>
          {text || "\u00a0"}
        </Typography>
      </MinimalTableCell>
    </TableRow>
  );
}
