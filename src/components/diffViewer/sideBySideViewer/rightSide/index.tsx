import { Box, TableRow, Typography, useTheme } from "@mui/material";
import { diffWordsWithSpace, type Hunk } from "diff";

import MinimalTableCell from "../../../styled/minimalTableCell";
import { alignHunkLines } from "../../../../utils/helpers";

interface RightSideProps {
  hunk: Hunk;
}

export default function RightSide({ hunk }: RightSideProps) {
  const { spacing } = useTheme();
  const alignedLines = alignHunkLines(hunk);

  return alignedLines.map((line, idx) => {
    const isAdded = line.oldLine === undefined && line.newLine !== undefined;
    const isRemoved = line.newLine === undefined && line.oldLine !== undefined;
    const isModified = line.oldLine && line.newLine && line.oldLine !== line.newLine;
    const rightBg = isRemoved ? "grey.200" : isAdded || isModified ? "green.50" : "white";

    let newLineContent: React.ReactNode = line.newLine ?? " ";

    if (isModified) {
      const diff = diffWordsWithSpace(line.oldLine!, line.newLine!);
    
      newLineContent = diff
        .filter(part => !part.removed) // skip removed parts in new column
        .map((part, i) =>
          part.added ? (
            <Box key={i} component="ins" sx={{ backgroundColor: "green.200" }}>
              {part.value}
            </Box>
          ) : (
            <Box key={i} component="span">{part.value}</Box>
          )
        );
    }

    return (
      <TableRow key={idx}>
        <MinimalTableCell sx={{ bgcolor: rightBg, minWidth: spacing(6), position: "sticky", left: 0 }}>
          <Typography variant="body1" sx={{ color: "grey.500", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {line.newLineNumber ?? ""}
          </Typography>
        </MinimalTableCell>
        <MinimalTableCell sx={{ bgcolor: rightBg, width: "100%" }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre" }}>
            {newLineContent}
          </Typography>
        </MinimalTableCell>
      </TableRow>
    );
  });
}
