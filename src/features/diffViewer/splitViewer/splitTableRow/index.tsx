import { Box, TableRow, Typography, useTheme } from "@mui/material";
import { diffWordsWithSpace } from "diff";
import { useCallback, useMemo } from "react";

import MinimalTableCell from "../../../../components/styled/minimalTableCell";
import type { AlignedHunkLine } from "../types";
import { getSplitLineMetadata } from "../helpers";

interface SplitTableRowProps {
  side: "left" | "right";
  line: AlignedHunkLine;
}

export default function SplitTableRow({ side, line }: SplitTableRowProps) {
  const { spacing } = useTheme();

  const isLeft = useMemo(() => side === "left", [side]);
  const isRight = useMemo(() => !isLeft, [isLeft]);
  const {
    isModified,
    lineNumber,
    lineContent,
    bgColor,
    symbol,
  } = useMemo(() => getSplitLineMetadata(line, isLeft), [isLeft, line]);

  const getRenderedContent = useCallback(() => {
    if (!isModified) {
      return lineContent ?? " ";
    }

    const diff = diffWordsWithSpace(line.oldLine!, line.newLine!);
    return diff
      .filter(part => (isLeft ? !part.added : !part.removed))
      .map((part, i) =>
        (isLeft && part.removed) || (isRight && part.added) ? (
          <Box
            key={i}
            component={isLeft ? "del" : "ins"}
            sx={{
              textDecoration: "unset",
              borderRadius: spacing(0.25),
              px: spacing(0.25),
              backgroundColor: isLeft ? "red.200" : "green.200",
              display: "inline",
            }}
          >
            {part.value}
          </Box>
        ) : (
          <Box key={i} component="span" sx={{ display: "inline" }}>
            {part.value}
          </Box>
        )
      );
  }, [isLeft, isModified, isRight, line.newLine, line.oldLine, lineContent, spacing]);

  return (
    <TableRow>
      <MinimalTableCell
        sx={{
          bgcolor: bgColor,
          minWidth: spacing(7),
          position: "sticky",
          left: 0,
          textAlign: "right",
          userSelect: "none",
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
          {lineNumber ?? ""}
        </Typography>
      </MinimalTableCell>
      <MinimalTableCell
        sx={{
          bgcolor: bgColor,
          minWidth: spacing(3),
          textAlign: "center",
          userSelect: "none",
        }}
      >
        <Typography variant="body1" component="span">
          {symbol}
        </Typography>
      </MinimalTableCell>
      <MinimalTableCell sx={{ bgcolor: bgColor, width: "100%" }}>
        <Typography
          variant="body1"
          component="span"
          sx={{ whiteSpace: "pre", userSelect: "text", px: 1 }}
        >
          {getRenderedContent()}
        </Typography>
      </MinimalTableCell>
    </TableRow>
  );
}
