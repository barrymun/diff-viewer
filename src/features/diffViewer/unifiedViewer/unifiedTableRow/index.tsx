import { TableRow, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";

import type { UnifiedDiffLine } from "../types";
import { getUnifiedLineMetadata } from "../helpers";
import MinimalTableCell from "../../../../components/styled/minimalTableCell";

export interface UnifiedTableRowProps {
  line: UnifiedDiffLine;
}

export function UnifiedTableRow({ line }: UnifiedTableRowProps) {
  const { spacing } = useTheme();
  const {
    symbol,
    bgColor,
    textColor,
    oldLineNumber,
    newLineNumber,
  } = useMemo(() => getUnifiedLineMetadata(line), [line]);

  return (
    <TableRow>
      {/* Old line number column */}
      <MinimalTableCell
        sx={{
          bgcolor: bgColor,
          minWidth: spacing(7),
          position: "sticky",
          left: 0,
          textAlign: "right",
          userSelect: "none",
          borderRight: 1,
          borderColor: "grey.300",
        }}
      >
        <Typography
          variant="body1"
          component="span"
          sx={{
            color: "grey.500",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {oldLineNumber ?? ""}
        </Typography>
      </MinimalTableCell>
      
      {/* New line number column */}
      <MinimalTableCell
        sx={{
          bgcolor: bgColor,
          minWidth: spacing(7),
          position: "sticky",
          left: spacing(7),
          textAlign: "right",
          userSelect: "none",
          borderRight: 1,
          borderColor: "grey.300",
        }}
      >
        <Typography
          variant="body1"
          component="span"
          sx={{
            color: "grey.500",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {newLineNumber ?? ""}
        </Typography>
      </MinimalTableCell>
      
      {/* Symbol column */}
      <MinimalTableCell
        sx={{
          bgcolor: bgColor,
          minWidth: spacing(3),
          textAlign: "center",
          userSelect: "none",
          borderRight: 1,
          borderColor: "grey.300",
        }}
      >
        <Typography
          variant="body1"
          component="span"
          sx={{ 
            color: line.type === 'removal' ? 'red.600' : line.type === 'addition' ? 'green.600' : 'grey.500',
            fontWeight: line.type !== 'context' ? 'bold' : 'normal'
          }}
        >
          {symbol}
        </Typography>
      </MinimalTableCell>
      
      {/* Content column */}
      <MinimalTableCell sx={{ bgcolor: bgColor, width: "100%" }}>
        <Typography
          variant="body1"
          component="span"
          sx={{ 
            whiteSpace: "pre", 
            userSelect: "text",
            color: textColor,
          }}
        >
          {line.content || " "}
        </Typography>
      </MinimalTableCell>
    </TableRow>
  );
}
