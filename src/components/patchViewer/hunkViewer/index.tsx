import { TableRow, Typography } from "@mui/material";
import type { Hunk } from "diff";

import { getAlignedLinesWithNumbers } from "../../../utils/helpers";
import MinimalTableCell from "../../styled/minimalTableCell";

interface HunkViewerProps {
  hunk: Hunk;
  lineVersion: "old" | "new";
}

export default function HunkViewer({ hunk, lineVersion }: HunkViewerProps) {
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
      <MinimalTableCell sx={{ userSelect: "none" }}>
        <Typography variant="body1">
          {line[`${lineVersion}LineNumber`] ?? ''}
        </Typography>
      </MinimalTableCell>
      <MinimalTableCell sx={{ userSelect: "none" }}>
        <Typography variant="body1">
          {line[`${lineVersion}LineType`] ?? ''}
        </Typography>
      </MinimalTableCell>
      <MinimalTableCell>
        <Typography variant="body1" sx={{ whiteSpace: "pre" }}>
          {line[`${lineVersion}Line`] ?? ' '}
        </Typography>
      </MinimalTableCell>
    </TableRow>
  ))
}
