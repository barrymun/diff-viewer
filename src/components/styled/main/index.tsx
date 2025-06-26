import { styled } from "@mui/material";

import { drawerWidth } from "@/utils/constants";

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: open ? `${drawerWidth}px` : 0,
  width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
  height: "100%",
  overflowY: "auto",
}));
