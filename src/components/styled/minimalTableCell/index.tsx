import { TableCell, type TableCellProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const MinimalTableCell = styled((props: TableCellProps) => <TableCell {...props} />)(() => ({
  border: "none",
  padding: 0,
  margin: 0,
  lineHeight: 1,
  "&:last-child": {
    paddingRight: 0,
  },
  "&:first-of-type": {
    paddingLeft: 0,
  },
}));

export default MinimalTableCell;
