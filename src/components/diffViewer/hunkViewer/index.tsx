import { Box, TableRow, Typography } from "@mui/material";
import { diffWordsWithSpace, type Hunk } from "diff";

import { alignHunkLines } from "../../../utils/helpers";
import MinimalTableCell from "../../styled/minimalTableCell";

interface HunkViewerProps {
  hunk: Hunk;
}

export default function HunkViewer({ hunk }: HunkViewerProps) {
  const alignedLines = alignHunkLines(hunk);

  return alignedLines.map((line, idx) => {
    const isAdded = line.oldLine === undefined && line.newLine !== undefined;
    const isRemoved = line.newLine === undefined && line.oldLine !== undefined;
    const isModified = line.oldLine && line.newLine && line.oldLine !== line.newLine;

    const leftBg = isAdded ? "grey.200" : isRemoved || isModified ? "red.50" : "white";
    const rightBg = isRemoved ? "grey.200" : isAdded || isModified ? "green.50" : "white";

    let oldLineContent: React.ReactNode = line.oldLine ?? "";
    let newLineContent: React.ReactNode = line.newLine ?? "";

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
        <MinimalTableCell sx={{ bgcolor: leftBg }}>
          <Typography variant="body1" sx={{ color: "grey.500", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {line.oldLineNumber ?? ""}
          </Typography>
        </MinimalTableCell>
        <MinimalTableCell sx={{ bgcolor: leftBg }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {oldLineContent}
          </Typography>
        </MinimalTableCell>
        <MinimalTableCell sx={{ bgcolor: rightBg }}>
          <Typography variant="body1" sx={{ color: "grey.500", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {line.newLineNumber ?? ""}
          </Typography>
        </MinimalTableCell>
        <MinimalTableCell sx={{ bgcolor: rightBg }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {newLineContent}
          </Typography>
        </MinimalTableCell>
      </TableRow>
    );
  });
}
