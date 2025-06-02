import { Box, TableRow, Typography, useTheme } from "@mui/material";
import { diffWordsWithSpace, type Hunk } from "diff";

import MinimalTableCell from "../../../styled/minimalTableCell";
import { alignHunkLines } from "../../../../utils/helpers";

interface LeftSideProps {
  hunk: Hunk;
}

export default function LeftSide({ hunk }: LeftSideProps) {
  const { spacing } = useTheme();
  const alignedLines = alignHunkLines(hunk);

  return alignedLines.map((line, idx) => {
    const isAdded = line.oldLine === undefined && line.newLine !== undefined;
    const isRemoved = line.newLine === undefined && line.oldLine !== undefined;
    const isModified = line.oldLine && line.newLine && line.oldLine !== line.newLine;
    const leftBg = isAdded ? "grey.200" : isRemoved || isModified ? "red.50" : "white";

    let oldLineContent: React.ReactNode = line.oldLine ?? " ";

    if (isModified) {
      const diff = diffWordsWithSpace(line.oldLine!, line.newLine!);
    
      oldLineContent = diff
        .filter(part => !part.added) // skip added parts in old column
        .map((part, i) =>
          part.removed ? (
            <Box key={i} component="del" sx={{ backgroundColor: "red.200" }}>
              {part.value}
            </Box>
          ) : (
            <Box key={i} component="span">{part.value}</Box>
          )
        );
    }

    return (
      <TableRow key={idx}>
        <MinimalTableCell sx={{ bgcolor: leftBg, minWidth: spacing(6), position: "sticky", left: 0 }}>
          <Typography variant="body1" sx={{ color: "grey.500", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {line.oldLineNumber ?? ""}
          </Typography>
        </MinimalTableCell>
        <MinimalTableCell sx={{ bgcolor: leftBg, width: "100%" }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre" }}>
            {oldLineContent}
          </Typography>
        </MinimalTableCell>
      </TableRow>
    );
  });
}
