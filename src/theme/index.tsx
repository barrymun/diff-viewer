import { createTheme, responsiveFontSizes } from "@mui/material/styles";

import { customBlue, customGreen, customRed, customYellow } from "./customColors";

// https://mui.com/material-ui/customization/typography/
let theme = createTheme({});

theme = createTheme({
  typography: {
    fontFamily: [
      '"Source Code Pro"',
      // "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  palette: {
    green: customGreen,
    red: customRed,
    blue: customBlue,
    yellow: customYellow,
  },
  components: {
    // Add global font size scaling for mobile
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: 16, // Desktop
          [theme.breakpoints.down("sm")]: {
            fontSize: 13, // Mobile
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          width: "unset",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
