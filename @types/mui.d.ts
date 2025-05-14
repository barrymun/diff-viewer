import "@mui/material/styles";
import { Color } from "@mui/material/styles";

type CustomColor = Omit<Color, "A100" | "A200" | "A400" | "A700">

declare module '@mui/material/styles' {
  interface Palette {
    green: CustomColor;
    red: CustomColor;
    blue: CustomColor;
    yellow: CustomColor;
  }

  interface PaletteOptions {
    green?: CustomColor;
    red?: CustomColor;
    blue?: CustomColor;
    yellow?: CustomColor;
  }
}
