import { AppBar, styled, type AppBarProps } from "@mui/material";
import { drawerWidth } from "../../../utils/constants";

interface HeaderProps extends AppBarProps {
  open?: boolean;
}

export const Header = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<HeaderProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));