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
const items = [{
  label: "Strategy_1_Settings",
  content: "user inputs of the thing",
  key: "Strategy_1_Settings",
  icon: "faStop",
  children: [
    {
      label: "Evaluator 1",
      content: "user inputs of the sub thing",
      key: "Evaluator 1",
      icon: "faStop",
      children: [{
        label: "Evaluator 1",
        content: "user inputs of the sub thing",
        key: "Evaluator 1",
        icon: "faStop",
      },
      {
        label: "Evaluator 1",
        content: "user inputs of the sub thing",
        key: "Evaluator 1",
        icon: "faStop",
      }
      ]
    }]
}]

// getItem({ label: label, content: content, key: key, icon: icon })

// function getItem({ label, key }) {

// }

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
