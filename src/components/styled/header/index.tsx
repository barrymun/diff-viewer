import { AppBar, styled, type AppBarProps } from "@mui/material";

import { drawerWidth } from "@/utils/constants";

interface HeaderProps extends AppBarProps {
  open?: boolean;
}

export const Header = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<HeaderProps>(({ theme }) => ({
  width: "100%",
  marginLeft: 0,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        [theme.breakpoints.up("sm")]: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
        },
      },
    },
  ],
}));
