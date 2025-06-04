import { styled } from "@mui/material";

import { drawerWidth } from "../../../utils/constants";

export const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('transform', {
    easing: open
      ? theme.transitions.easing.easeOut
      : theme.transitions.easing.sharp,
    duration: open
      ? theme.transitions.duration.enteringScreen
      : theme.transitions.duration.leavingScreen,
  }),
  transform: open ? `translateX(${drawerWidth}px)` : 'translateX(0)',
  width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
}));
