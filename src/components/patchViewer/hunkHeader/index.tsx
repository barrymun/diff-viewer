import { TableRow, Typography } from "@mui/material";

import MinimalTableCell from "../../styled/minimalTableCell";

interface HunkHeaderProps {
  children?: React.ReactNode;
}

export default function HunkHeader({ children }: HunkHeaderProps) {
  return (
    <TableRow sx={{ bgcolor: "grey.50" }}>
      <MinimalTableCell />
      <MinimalTableCell />
      <MinimalTableCell>
        <Typography variant="body1" sx={{ color: "grey.500" }}>{children ?? "\u00a0"}</Typography>
      </MinimalTableCell>
    </TableRow>
  );
}
