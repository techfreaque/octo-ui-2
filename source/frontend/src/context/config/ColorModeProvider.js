import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { createContext, useContext, useMemo, useState } from "react";

const ToggleColorModeContext = createContext({ toggleColorMode: () => { } });
const ColorModeContext = createContext();

export const useToggleColorModeContext = () => {
  return useContext(ToggleColorModeContext);
};

export const useColorModeContext = () => {
  return useContext(ColorModeContext);
};

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    },
  }), []);
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  return (
    <ToggleColorModeContext.Provider value={colorMode}>
      <ColorModeContext.Provider value={mode}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ColorModeContext.Provider>
    </ToggleColorModeContext.Provider>
  );
}
