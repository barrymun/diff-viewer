import { Box, TableRow, Typography, useTheme } from "@mui/material";
import { diffWordsWithSpace, type Hunk } from "diff";

import MinimalTableCell from "../../../styled/minimalTableCell";
import { alignHunkLines } from "../../../../utils/helpers";

interface DiffSideProps {
  side: "left" | "right";
  hunk: Hunk;
}

export default function DiffSide({ side, hunk }: DiffSideProps) {
  const { spacing } = useTheme();
  const alignedLines = alignHunkLines(hunk);

  return alignedLines.map((line, idx) => {
    const isAdded = line.oldLine === undefined && line.newLine !== undefined;
    const isRemoved = line.newLine === undefined && line.oldLine !== undefined;
    const isModified = line.oldLine && line.newLine && line.oldLine !== line.newLine;

    const isLeft = side === "left";
    const isRight = !isLeft;

    const lineNumber = isLeft ? line.oldLineNumber : line.newLineNumber;
    const lineContent = isLeft ? line.oldLine : line.newLine;

    const bgColor = isLeft
      ? isAdded
        ? "grey.200"
        : isRemoved || isModified
        ? "red.50"
        : "white"
      : isRemoved
      ? "grey.200"
      : isAdded || isModified
      ? "green.50"
      : "white";

    const symbol = isLeft
      ? (isRemoved || isModified ? "-" : "")
      : (isAdded || isModified ? "+" : "");

    let renderedContent: React.ReactNode = lineContent ?? " ";

    if (isModified) {
      const diff = diffWordsWithSpace(line.oldLine!, line.newLine!);
      renderedContent = diff
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
    }

    return (
      <TableRow key={idx}>
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
            sx={{ whiteSpace: "pre", userSelect: "text" }}
          >
            {renderedContent}
          </Typography>
        </MinimalTableCell>
      </TableRow>
    );
  });
}
