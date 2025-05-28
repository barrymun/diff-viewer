import { Box, TableRow, Typography, useTheme } from "@mui/material";
import type { Hunk } from "diff";
import { Interweave } from "interweave";

import { getAlignedLinesWithNumbers } from "../../../utils/helpers";
import MinimalTableCell from "../../styled/minimalTableCell";

interface HunkViewerProps {
  hunk: Hunk;
  lineVersion: "old" | "new";
}

export default function HunkViewer({ hunk, lineVersion }: HunkViewerProps) {
  const { spacing } = useTheme();
  const aligned = getAlignedLinesWithNumbers(hunk);

  return aligned.map((line, lineIndex) => (
    <TableRow
      key={lineIndex}
      sx={{
        ...(!line[`${lineVersion}Line`] && { bgcolor: "grey.200" }),
        ...(line[`${lineVersion}LineType`] === "-" && { bgcolor: "#ffecec" }),
        ...(line[`${lineVersion}LineType`] === "+" && { bgcolor: "#eaffea" }),
      }}
    >
      <MinimalTableCell sx={{ userSelect: "none", minWidth: spacing(7) }}>
        <Typography variant="body1" sx={{ color: "grey.500", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          {line[`${lineVersion}LineNumber`] ?? ''}
        </Typography>
      </MinimalTableCell>
      <MinimalTableCell sx={{ userSelect: "none", minWidth: spacing(3) }}>
        <Typography variant="body1" sx={{ color: "grey.900", textAlign: "center" }}>
          {line[`${lineVersion}LineType`] ?? ''}
        </Typography>
      </MinimalTableCell>
      <MinimalTableCell sx={{ width: "100%" }}>
        <Box sx={{ minWidth: "max-content" }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            <Interweave content={line[`${lineVersion}Line`] ?? ' '} />
          </Typography>
        </Box>
      </MinimalTableCell>
    </TableRow>
  ))
}
