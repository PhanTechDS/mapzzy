import "../styles/globals.css";
import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

function MyApp({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: "#009473",
          },
          secondary: {
            main: "#00BFA6",
          },
        },
        typography: {
          fontFamily: "'Nunito', sans-serif",
        },
      }),
    [prefersDarkMode]
  );
  return (
    <>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
