import { Box, TableRow, Typography, useTheme } from "@mui/material";
import { useCallback, useMemo } from "react";

import type { UnifiedDiffLine, UnifiedDiffLineWithDiff } from "../types";
import { getUnifiedLineMetadata } from "../helpers";
import MinimalTableCell from "../../../../components/styled/minimalTableCell";
import { diffWordsWithSpace } from "diff";

export interface UnifiedTableRowProps {
  line: UnifiedDiffLine;
}

export default function UnifiedTableRow({ line }: UnifiedTableRowProps) {
  const { spacing } = useTheme();
  const {
    symbol,
    bgColor,
    textColor,
    oldLineNumber,
    newLineNumber,
  } = useMemo(() => getUnifiedLineMetadata(line), [line]);

  const getRenderedContent = useCallback(() => {
    // For context lines, just return the content
    if (line.type === 'context') {
      return line.content || " ";
    }

    // For lines with paired content (removal/addition), show word-level diff
    const typedLine = line as UnifiedDiffLineWithDiff;
    if (typedLine.pairedLine) {
      const isRemoval = line.type === 'removal';
      const oldContent = isRemoval ? line.content : typedLine.pairedLine.content;
      const newContent = isRemoval ? typedLine.pairedLine.content : line.content;
      
      const diff = diffWordsWithSpace(oldContent || '', newContent || '');
      
      return diff
        .filter(part => isRemoval ? !part.added : !part.removed)
        .map((part, i) => {
          const shouldHighlight = (isRemoval && part.removed) || (!isRemoval && part.added);
          
          return shouldHighlight ? (
            <Box
              key={i}
              component={isRemoval ? "del" : "ins"}
              sx={{
                textDecoration: "unset",
                borderRadius: spacing(0.25),
                px: spacing(0.25),
                backgroundColor: isRemoval ? "red.200" : "green.200",
                display: "inline",
              }}
            >
              {part.value}
            </Box>
          ) : (
            <Box key={i} component="span" sx={{ display: "inline" }}>
              {part.value}
            </Box>
          );
        });
    }

    // For standalone additions/removals, just return the content
    return line.content || " ";
  }, [line, spacing]);

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
          minWidth: spacing(4),
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
            px: 1,
          }}
        >
          {getRenderedContent()}
        </Typography>
      </MinimalTableCell>
    </TableRow>
  );
}
