import { createTheme } from "@mui/material/styles";
import colorVariables from "../../styles/variables.module.scss";

export const appTheme = createTheme({
  palette: {
    primary: {
      main: colorVariables.primaryDarkColor,
      contrastText: colorVariables.mainBackground,
    },
    secondary: { main: colorVariables.primaryLightColor },
  },
});
